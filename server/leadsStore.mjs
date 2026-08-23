/**
 * Lead store — Postgres when DATABASE_URL is set, otherwise JSON file (local/dev).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { ensureSchema, getSql, hasDatabase } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const onVercel = Boolean(process.env.VERCEL);
const dataDir = process.env.LEADS_DB_PATH
  ? path.dirname(process.env.LEADS_DB_PATH)
  : onVercel
    ? '/tmp/synergy-leads'
    : path.join(__dirname, 'data');
const dbFile = process.env.LEADS_DB_PATH || path.join(dataDir, 'leads.json');

export const STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'QUOTE_SENT',
  'NEGOTIATION',
  'PAYMENT_PENDING',
  'BOOKED',
  'TRAVEL_COMPLETED',
  'REPEAT_CUSTOMER',
  'LOST',
];

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '[]', 'utf8');
}

function readAll() {
  ensureStore();
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(leads) {
  ensureStore();
  fs.writeFileSync(dbFile, JSON.stringify(leads, null, 2), 'utf8');
}

function sanitizeString(value, max = 500) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function scoreLead(input) {
  let score = 10;
  if (input.budget) score += 10;
  if (input.departDate || input.dates) score += 10;
  if (input.origin && input.destination) score += 10;
  if (input.phone || input.whatsapp) score += 10;
  if (input.email) score += 5;
  if (input.service === 'flights' || input.service === 'visa') score += 5;
  const d = input.departDate || input.dates;
  if (d) {
    const when = new Date(d);
    if (!Number.isNaN(when.getTime())) {
      const days = (when.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (days >= 0 && days <= 14) score += 20;
    }
  }
  return Math.min(100, score);
}

function band(score) {
  if (score >= 90) return 'Very Hot';
  if (score >= 70) return 'Hot';
  if (score >= 40) return 'Warm';
  return 'Cold';
}

function buildLeadFromBody(body) {
  const name = sanitizeString(body.name || body.fullName, 120);
  const email = sanitizeString(body.email, 160).toLowerCase();
  const phone = sanitizeString(body.phone || body.whatsapp, 40);
  const service = sanitizeString(body.service || 'general', 40).toLowerCase();
  const channel = sanitizeString(body.channel || 'website', 40).toLowerCase();

  if (!name || (!email && !phone)) {
    const err = new Error('Name and at least one of email or phone are required');
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const payload = {
    origin: sanitizeString(body.origin, 120),
    destination: sanitizeString(body.destination, 120),
    departDate: sanitizeString(body.departDate || body.dates, 40),
    returnDate: sanitizeString(body.returnDate, 40),
    adults: sanitizeString(body.adults, 10),
    children: sanitizeString(body.children, 10),
    infants: sanitizeString(body.infants, 10),
    cabin: sanitizeString(body.cabin, 40),
    budget: sanitizeString(body.budget, 40),
    country: sanitizeString(body.country, 80),
    message: sanitizeString(body.message || body.details, 4000),
    tripType: sanitizeString(body.tripType, 40),
    multiCitySummary: sanitizeString(body.multiCitySummary, 2000),
    campaign: sanitizeString(body.campaign, 80),
    page: sanitizeString(body.page, 80),
  };

  const score = scoreLead({ ...payload, email, phone, service });
  return {
    id: `ST-${randomUUID().slice(0, 8).toUpperCase()}`,
    name,
    email,
    phone,
    whatsapp: phone,
    service,
    source: sanitizeString(body.source || 'website_form', 60),
    channel,
    status: 'NEW',
    leadScore: score,
    leadBand: band(score),
    assignedAgent: null,
    notes: '',
    payload,
    customerId: null,
    createdAt: now,
    updatedAt: now,
  };
}

function mapPgLead(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    name: row.name,
    email: row.email || '',
    phone: row.phone || '',
    whatsapp: row.whatsapp || row.phone || '',
    service: row.service,
    source: row.source,
    channel: row.channel,
    status: row.status,
    leadScore: Number(row.lead_score) || 0,
    leadBand: row.lead_band,
    assignedAgent: row.assigned_agent,
    notes: row.notes || '',
    payload: row.payload || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findOrCreateCustomer(db, { name, email, phone, country }) {
  if (email) {
    const existing = await db`
      SELECT * FROM customers WHERE lower(email) = ${email.toLowerCase()} LIMIT 1
    `;
    if (existing[0]) return existing[0].id;
  }
  if (phone) {
    const existing = await db`
      SELECT * FROM customers WHERE phone = ${phone} LIMIT 1
    `;
    if (existing[0]) return existing[0].id;
  }
  const id = `CU-${randomUUID().slice(0, 8).toUpperCase()}`;
  const now = new Date().toISOString();
  await db`
    INSERT INTO customers (id, name, email, phone, country, notes, created_at, updated_at)
    VALUES (${id}, ${name}, ${email || ''}, ${phone || ''}, ${country || ''}, ${''}, ${now}, ${now})
  `;
  return id;
}

export async function createLead(body) {
  const lead = buildLeadFromBody(body);

  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const customerId = await findOrCreateCustomer(db, {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      country: lead.payload.country,
    });
    lead.customerId = customerId;
    await db`
      INSERT INTO leads (
        id, customer_id, name, email, phone, whatsapp, service, source, channel,
        status, lead_score, lead_band, assigned_agent, notes, payload, created_at, updated_at
      ) VALUES (
        ${lead.id}, ${customerId}, ${lead.name}, ${lead.email}, ${lead.phone}, ${lead.whatsapp},
        ${lead.service}, ${lead.source}, ${lead.channel}, ${lead.status}, ${lead.leadScore},
        ${lead.leadBand}, ${lead.assignedAgent}, ${lead.notes}, ${JSON.stringify(lead.payload)},
        ${lead.createdAt}, ${lead.updatedAt}
      )
    `;
    return lead;
  }

  const leads = readAll();
  leads.unshift(lead);
  writeAll(leads.slice(0, 5000));
  return lead;
}

export async function listLeads({ status, q, limit = 100 } = {}) {
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`
      SELECT * FROM leads
      ORDER BY created_at DESC
      LIMIT 500
    `;
    let leads = rows.map(mapPgLead);
    if (status && STATUSES.includes(status)) {
      leads = leads.filter((l) => l.status === status);
    }
    if (q) {
      const needle = String(q).toLowerCase();
      leads = leads.filter(
        (l) =>
          l.id.toLowerCase().includes(needle) ||
          l.name.toLowerCase().includes(needle) ||
          l.email.toLowerCase().includes(needle) ||
          l.phone.includes(needle) ||
          l.service.includes(needle)
      );
    }
    return leads.slice(0, Math.min(Number(limit) || 100, 500));
  }

  let leads = readAll();
  if (status && STATUSES.includes(status)) {
    leads = leads.filter((l) => l.status === status);
  }
  if (q) {
    const needle = String(q).toLowerCase();
    leads = leads.filter(
      (l) =>
        l.id.toLowerCase().includes(needle) ||
        l.name.toLowerCase().includes(needle) ||
        l.email.toLowerCase().includes(needle) ||
        l.phone.includes(needle) ||
        l.service.includes(needle)
    );
  }
  return leads.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function getLead(id) {
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
    return rows[0] ? mapPgLead(rows[0]) : null;
  }
  return readAll().find((l) => l.id === id) || null;
}

export async function updateLead(id, patch) {
  if (patch.status && !STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid status. Allowed: ${STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const existing = await db`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
    if (!existing[0]) {
      const err = new Error('Lead not found');
      err.status = 404;
      throw err;
    }
    const cur = mapPgLead(existing[0]);
    const next = {
      ...cur,
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.notes != null ? { notes: sanitizeString(patch.notes, 2000) } : {}),
      ...(patch.assignedAgent != null
        ? { assignedAgent: sanitizeString(patch.assignedAgent, 80) }
        : {}),
      updatedAt: new Date().toISOString(),
    };
    await db`
      UPDATE leads SET
        status = ${next.status},
        notes = ${next.notes},
        assigned_agent = ${next.assignedAgent},
        updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
    return next;
  }

  const leads = readAll();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx < 0) {
    const err = new Error('Lead not found');
    err.status = 404;
    throw err;
  }
  const next = {
    ...leads[idx],
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.notes != null ? { notes: sanitizeString(patch.notes, 2000) } : {}),
    ...(patch.assignedAgent != null
      ? { assignedAgent: sanitizeString(patch.assignedAgent, 80) }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  leads[idx] = next;
  writeAll(leads);
  return next;
}

export async function leadStats() {
  const leads = await listLeads({ limit: 500 });
  const byStatus = {};
  for (const s of STATUSES) byStatus[s] = 0;
  for (const l of leads) byStatus[l.status] = (byStatus[l.status] || 0) + 1;
  return {
    total: leads.length,
    byStatus,
    hot: leads.filter((l) => l.leadScore >= 70).length,
    storage: hasDatabase() ? 'postgres' : 'file',
  };
}

export { hasDatabase };
