/**
 * Phase 4 stores — visa cases, documents, portal tokens, payments, notifications.
 * Postgres when available; JSON file fallback for local without DB.
 */
import fs from 'fs';
import path from 'path';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { ensureSchema, getSql, hasDatabase } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const onVercel = Boolean(process.env.VERCEL);
const dataDir = onVercel ? '/tmp/synergy-leads' : path.join(__dirname, 'data');
const storeFile = path.join(dataDir, 'phase4.json');

export const VISA_STATUSES = [
  'INTAKE',
  'DOCUMENTS_REQUESTED',
  'DOCUMENTS_RECEIVED',
  'UNDER_REVIEW',
  'READY_TO_SUBMIT',
  'SUBMITTED',
  'ADDITIONAL_INFO',
  'CLOSED',
];

export const DOC_STATUSES = ['REQUESTED', 'RECEIVED', 'REJECTED_NEEDS_RESUBMIT', 'ARCHIVED'];
export const PAYMENT_STATUSES = ['PENDING', 'AWAITING_PROOF', 'CONFIRMED', 'FAILED', 'REFUNDED'];

const MAX_DOC_BASE64 = 900_000; // ~675KB binary — keep serverless payloads safe

function sanitize(value, max = 500) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function money(n) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v * 100) / 100 : 0;
}

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(
      storeFile,
      JSON.stringify({ visaCases: [], documents: [], portalTokens: [], payments: [], notifications: [] }, null, 2),
      'utf8'
    );
  }
}

function readFileStore() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(storeFile, 'utf8'));
  } catch {
    return { visaCases: [], documents: [], portalTokens: [], payments: [], notifications: [] };
  }
}

function writeFileStore(data) {
  ensureFile();
  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2), 'utf8');
}

function hashToken(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

function mapVisa(row) {
  return {
    id: row.id,
    leadId: row.lead_id ?? row.leadId ?? null,
    customerId: row.customer_id ?? row.customerId ?? null,
    destination: row.destination || '',
    nationality: row.nationality || '',
    visaType: row.visa_type ?? row.visaType ?? '',
    status: row.status,
    assignedAgent: row.assigned_agent ?? row.assignedAgent ?? null,
    notes: row.notes || '',
    checklist: row.checklist || [],
    portalVisible: row.portal_visible ?? row.portalVisible ?? true,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

function mapDoc(row) {
  return {
    id: row.id,
    customerId: row.customer_id ?? row.customerId ?? null,
    visaCaseId: row.visa_case_id ?? row.visaCaseId ?? null,
    docType: row.doc_type ?? row.docType ?? 'other',
    fileName: row.file_name ?? row.fileName ?? '',
    mimeType: row.mime_type ?? row.mimeType ?? '',
    sizeBytes: Number(row.size_bytes ?? row.sizeBytes ?? 0),
    status: row.status,
    notes: row.notes || '',
    storage: row.storage || 'metadata',
    hasContent: Boolean(row.content_base64 || row.contentBase64),
    uploadedBy: row.uploaded_by ?? row.uploadedBy ?? 'staff',
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

function mapPayment(row) {
  return {
    id: row.id,
    quoteId: row.quote_id ?? row.quoteId ?? null,
    customerId: row.customer_id ?? row.customerId ?? null,
    leadId: row.lead_id ?? row.leadId ?? null,
    method: row.method || 'bank',
    status: row.status,
    amount: money(row.amount),
    currency: row.currency || 'GBP',
    reference: row.reference || '',
    notes: row.notes || '',
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

function mapNotification(row) {
  return {
    id: row.id,
    customerId: row.customer_id ?? row.customerId ?? null,
    channel: row.channel || 'log',
    type: row.type || 'info',
    title: row.title || '',
    body: row.body || '',
    meta: row.meta || {},
    createdAt: row.created_at ?? row.createdAt,
  };
}

async function logNotification({ customerId, type, title, body, channel = 'log', meta = {} }) {
  const row = {
    id: `NT-${randomUUID().slice(0, 8).toUpperCase()}`,
    customerId: customerId || null,
    channel,
    type,
    title: sanitize(title, 160),
    body: sanitize(body, 2000),
    meta,
    createdAt: new Date().toISOString(),
  };
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      INSERT INTO notifications (id, customer_id, channel, type, title, body, meta, created_at)
      VALUES (${row.id}, ${row.customerId}, ${row.channel}, ${row.type}, ${row.title}, ${row.body}, ${JSON.stringify(row.meta)}, ${row.createdAt})
    `;
  } else {
    const data = readFileStore();
    data.notifications.unshift(row);
    data.notifications = data.notifications.slice(0, 500);
    writeFileStore(data);
  }
  return mapNotification(row);
}

export async function createVisaCase(body) {
  const now = new Date().toISOString();
  const checklist = Array.isArray(body.checklist)
    ? body.checklist.slice(0, 30).map((c) => sanitize(c, 80))
    : ['Passport bio page', 'Photograph', 'Application form support'];
  const visa = {
    id: `VS-${randomUUID().slice(0, 8).toUpperCase()}`,
    leadId: sanitize(body.leadId, 40) || null,
    customerId: sanitize(body.customerId, 40) || null,
    destination: sanitize(body.destination, 80),
    nationality: sanitize(body.nationality, 80),
    visaType: sanitize(body.visaType, 80),
    status: 'INTAKE',
    assignedAgent: sanitize(body.assignedAgent, 80) || null,
    notes: sanitize(body.notes, 4000),
    checklist,
    portalVisible: body.portalVisible !== false,
    createdAt: now,
    updatedAt: now,
  };
  if (!visa.destination) {
    const err = new Error('destination is required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      INSERT INTO visa_cases (
        id, lead_id, customer_id, destination, nationality, visa_type, status,
        assigned_agent, notes, checklist, portal_visible, created_at, updated_at
      ) VALUES (
        ${visa.id}, ${visa.leadId}, ${visa.customerId}, ${visa.destination}, ${visa.nationality},
        ${visa.visaType}, ${visa.status}, ${visa.assignedAgent}, ${visa.notes},
        ${JSON.stringify(visa.checklist)}, ${visa.portalVisible}, ${visa.createdAt}, ${visa.updatedAt}
      )
    `;
  } else {
    const data = readFileStore();
    data.visaCases.unshift(visa);
    writeFileStore(data);
  }
  await logNotification({
    customerId: visa.customerId,
    type: 'visa_case_created',
    title: `Visa case ${visa.id} created`,
    body: `Assistance case opened for ${visa.destination}. Synergy does not guarantee visa approval.`,
    meta: { visaCaseId: visa.id },
  });
  return visa;
}

export async function listVisaCases({ status, q, limit = 100 } = {}) {
  let rows;
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    rows = (await db`SELECT * FROM visa_cases ORDER BY created_at DESC LIMIT 500`).map(mapVisa);
  } else {
    rows = readFileStore().visaCases.map(mapVisa);
  }
  if (status && VISA_STATUSES.includes(status)) rows = rows.filter((r) => r.status === status);
  if (q) {
    const needle = String(q).toLowerCase();
    rows = rows.filter(
      (r) =>
        r.id.toLowerCase().includes(needle) ||
        r.destination.toLowerCase().includes(needle) ||
        (r.customerId || '').toLowerCase().includes(needle) ||
        (r.leadId || '').toLowerCase().includes(needle)
    );
  }
  return rows.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function updateVisaCase(id, patch) {
  const list = await listVisaCases({ limit: 500 });
  const existing = list.find((v) => v.id === id);
  if (!existing) {
    const err = new Error('Visa case not found');
    err.status = 404;
    throw err;
  }
  if (patch.status && !VISA_STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid status. Allowed: ${VISA_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }
  // Never allow immigration outcome labels like APPROVED
  if (patch.status && /approv|refus|reject/i.test(patch.status)) {
    const err = new Error('Visa case status cannot claim immigration outcomes');
    err.status = 400;
    throw err;
  }
  const next = {
    ...existing,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.notes != null ? { notes: sanitize(patch.notes, 4000) } : {}),
    ...(patch.assignedAgent != null ? { assignedAgent: sanitize(patch.assignedAgent, 80) } : {}),
    ...(patch.checklist ? { checklist: patch.checklist.slice(0, 30).map((c) => sanitize(c, 80)) } : {}),
    ...(patch.destination != null ? { destination: sanitize(patch.destination, 80) } : {}),
    ...(patch.visaType != null ? { visaType: sanitize(patch.visaType, 80) } : {}),
    updatedAt: new Date().toISOString(),
  };
  if (hasDatabase()) {
    const db = getSql();
    await db`
      UPDATE visa_cases SET
        status = ${next.status},
        notes = ${next.notes},
        assigned_agent = ${next.assignedAgent},
        checklist = ${JSON.stringify(next.checklist)},
        destination = ${next.destination},
        visa_type = ${next.visaType},
        updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
  } else {
    const data = readFileStore();
    const idx = data.visaCases.findIndex((v) => v.id === id);
    if (idx >= 0) data.visaCases[idx] = next;
    writeFileStore(data);
  }
  await logNotification({
    customerId: next.customerId,
    type: 'visa_status_updated',
    title: `Visa case ${next.id} → ${next.status}`,
    body: 'Status reflects Synergy assistance progress only — not an immigration decision.',
    meta: { visaCaseId: next.id, status: next.status },
  });
  return next;
}

export async function upsertDocument(body) {
  const now = new Date().toISOString();
  const content = body.contentBase64 ? String(body.contentBase64) : '';
  if (content && content.length > MAX_DOC_BASE64) {
    const err = new Error('Document too large. Max ~675KB. Prefer staff note + offline vault for bigger files.');
    err.status = 413;
    throw err;
  }
  const allowedMime = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', ''];
  const mime = sanitize(body.mimeType, 80);
  if (content && mime && !allowedMime.includes(mime)) {
    const err = new Error('Only PDF/JPEG/PNG/WebP uploads are allowed');
    err.status = 400;
    throw err;
  }
  const doc = {
    id: `DOC-${randomUUID().slice(0, 8).toUpperCase()}`,
    customerId: sanitize(body.customerId, 40) || null,
    visaCaseId: sanitize(body.visaCaseId, 40) || null,
    docType: sanitize(body.docType || 'other', 40),
    fileName: sanitize(body.fileName, 160),
    mimeType: mime,
    sizeBytes: Number(body.sizeBytes) || (content ? Math.floor((content.length * 3) / 4) : 0),
    status: DOC_STATUSES.includes(body.status) ? body.status : content ? 'RECEIVED' : 'REQUESTED',
    notes: sanitize(body.notes, 1000),
    storage: content ? 'inline_base64' : 'metadata',
    contentBase64: content || null,
    uploadedBy: sanitize(body.uploadedBy || 'staff', 40),
    createdAt: now,
    updatedAt: now,
  };
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      INSERT INTO documents (
        id, customer_id, visa_case_id, doc_type, file_name, mime_type, size_bytes,
        status, notes, storage, content_base64, uploaded_by, created_at, updated_at
      ) VALUES (
        ${doc.id}, ${doc.customerId}, ${doc.visaCaseId}, ${doc.docType}, ${doc.fileName},
        ${doc.mimeType}, ${doc.sizeBytes}, ${doc.status}, ${doc.notes}, ${doc.storage},
        ${doc.contentBase64}, ${doc.uploadedBy}, ${doc.createdAt}, ${doc.updatedAt}
      )
    `;
  } else {
    const data = readFileStore();
    data.documents.unshift(doc);
    writeFileStore(data);
  }
  return mapDoc(doc);
}

export async function listDocuments({ visaCaseId, customerId, limit = 100 } = {}) {
  let rows;
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    rows = (await db`SELECT * FROM documents ORDER BY created_at DESC LIMIT 500`).map(mapDoc);
  } else {
    rows = readFileStore().documents.map(mapDoc);
  }
  if (visaCaseId) rows = rows.filter((d) => d.visaCaseId === visaCaseId);
  if (customerId) rows = rows.filter((d) => d.customerId === customerId);
  return rows.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function updateDocument(id, patch) {
  const docs = await listDocuments({ limit: 500 });
  const existing = docs.find((d) => d.id === id);
  if (!existing) {
    const err = new Error('Document not found');
    err.status = 404;
    throw err;
  }
  if (patch.status && !DOC_STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid document status`);
    err.status = 400;
    throw err;
  }
  const next = {
    ...existing,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.notes != null ? { notes: sanitize(patch.notes, 1000) } : {}),
    updatedAt: new Date().toISOString(),
  };
  if (hasDatabase()) {
    const db = getSql();
    await db`
      UPDATE documents SET status = ${next.status}, notes = ${next.notes}, updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
  } else {
    const data = readFileStore();
    const idx = data.documents.findIndex((d) => d.id === id);
    if (idx >= 0) {
      data.documents[idx] = { ...data.documents[idx], ...next };
      writeFileStore(data);
    }
  }
  return next;
}

export async function createPortalLink({ customerId, label, daysValid = 14 }) {
  if (!customerId) {
    const err = new Error('customerId is required');
    err.status = 400;
    throw err;
  }
  const raw = randomBytes(24).toString('hex');
  const tokenHash = hashToken(raw);
  const now = new Date();
  const expires = new Date(now.getTime() + Math.max(1, Math.min(90, Number(daysValid) || 14)) * 86400000);
  const row = {
    id: `PT-${randomUUID().slice(0, 8).toUpperCase()}`,
    customerId,
    tokenHash,
    label: sanitize(label || 'Customer portal', 80),
    expiresAt: expires.toISOString(),
    revokedAt: null,
    lastUsedAt: null,
    createdAt: now.toISOString(),
  };
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      INSERT INTO portal_tokens (id, customer_id, token_hash, label, expires_at, created_at)
      VALUES (${row.id}, ${row.customerId}, ${row.tokenHash}, ${row.label}, ${row.expiresAt}, ${row.createdAt})
    `;
  } else {
    const data = readFileStore();
    data.portalTokens.unshift(row);
    writeFileStore(data);
  }
  await logNotification({
    customerId,
    type: 'portal_link_created',
    title: 'Customer portal link created',
    body: `Portal access expires ${expires.toISOString().slice(0, 10)}.`,
    meta: { portalTokenId: row.id },
  });
  return { id: row.id, customerId, expiresAt: row.expiresAt, token: raw, label: row.label };
}

async function findPortalByRawToken(raw) {
  const tokenHash = hashToken(raw);
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT * FROM portal_tokens WHERE token_hash = ${tokenHash} LIMIT 1`;
    return rows[0] || null;
  }
  return readFileStore().portalTokens.find((t) => t.tokenHash === tokenHash) || null;
}

export async function resolvePortalSession(rawToken) {
  const row = await findPortalByRawToken(rawToken);
  if (!row) {
    const err = new Error('Invalid portal link');
    err.status = 401;
    throw err;
  }
  if (row.revoked_at || row.revokedAt) {
    const err = new Error('Portal link revoked');
    err.status = 401;
    throw err;
  }
  const expiresAt = row.expires_at || row.expiresAt;
  if (new Date(expiresAt).getTime() < Date.now()) {
    const err = new Error('Portal link expired');
    err.status = 401;
    throw err;
  }
  const customerId = row.customer_id || row.customerId;
  const now = new Date().toISOString();
  if (hasDatabase()) {
    const db = getSql();
    await db`UPDATE portal_tokens SET last_used_at = ${now} WHERE id = ${row.id}`;
    const customers = await db`SELECT * FROM customers WHERE id = ${customerId} LIMIT 1`;
    const customer = customers[0]
      ? {
          id: customers[0].id,
          name: customers[0].name,
          email: customers[0].email,
          phone: customers[0].phone,
          country: customers[0].country,
          passportExpiry: customers[0].passport_expiry,
          passportCountry: customers[0].passport_country,
        }
      : { id: customerId, name: 'Customer' };
    const cases = (await db`SELECT * FROM visa_cases WHERE customer_id = ${customerId} AND portal_visible = TRUE ORDER BY created_at DESC`).map(mapVisa);
    const docs = (await db`SELECT id, customer_id, visa_case_id, doc_type, file_name, mime_type, size_bytes, status, notes, storage, uploaded_by, created_at, updated_at FROM documents WHERE customer_id = ${customerId} ORDER BY created_at DESC`).map(mapDoc);
    const payments = (await db`SELECT * FROM payments WHERE customer_id = ${customerId} ORDER BY created_at DESC LIMIT 50`).map(mapPayment);
    const notifications = (await db`SELECT * FROM notifications WHERE customer_id = ${customerId} ORDER BY created_at DESC LIMIT 30`).map(mapNotification);
    return { customer, cases, documents: docs, payments, notifications, disclaimer: PORTAL_DISCLAIMER };
  }
  const data = readFileStore();
  // Enrich customer from leads file if needed
  let customer = { id: customerId, name: 'Customer' };
  try {
    const leads = JSON.parse(fs.readFileSync(path.join(dataDir, 'leads.json'), 'utf8'));
    const lead = (leads || []).find((l) => l.customerId === customerId);
    if (lead) customer = { id: customerId, name: lead.name, email: lead.email, phone: lead.phone };
  } catch {
    /* ignore */
  }
  return {
    customer,
    cases: data.visaCases.filter((c) => c.customerId === customerId && c.portalVisible !== false).map(mapVisa),
    documents: data.documents.filter((d) => d.customerId === customerId).map(mapDoc),
    payments: data.payments.filter((p) => p.customerId === customerId).map(mapPayment),
    notifications: data.notifications.filter((n) => n.customerId === customerId).map(mapNotification).slice(0, 30),
    disclaimer: PORTAL_DISCLAIMER,
  };
}

const PORTAL_DISCLAIMER =
  'Synergy Travels provides visa application assistance and document guidance only. We do not grant visas and cannot guarantee immigration outcomes.';

export async function recordPayment(body) {
  const now = new Date().toISOString();
  const payment = {
    id: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
    quoteId: sanitize(body.quoteId, 40) || null,
    customerId: sanitize(body.customerId, 40) || null,
    leadId: sanitize(body.leadId, 40) || null,
    method: sanitize(body.method || 'bank', 40),
    status: PAYMENT_STATUSES.includes(body.status) ? body.status : 'PENDING',
    amount: money(body.amount),
    currency: sanitize(body.currency || 'GBP', 8).toUpperCase(),
    reference: sanitize(body.reference, 80),
    notes: sanitize(body.notes, 1000),
    createdAt: now,
    updatedAt: now,
  };
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      INSERT INTO payments (
        id, quote_id, customer_id, lead_id, method, status, amount, currency, reference, notes, created_at, updated_at
      ) VALUES (
        ${payment.id}, ${payment.quoteId}, ${payment.customerId}, ${payment.leadId}, ${payment.method},
        ${payment.status}, ${payment.amount}, ${payment.currency}, ${payment.reference}, ${payment.notes},
        ${payment.createdAt}, ${payment.updatedAt}
      )
    `;
  } else {
    const data = readFileStore();
    data.payments.unshift(payment);
    writeFileStore(data);
  }
  await logNotification({
    customerId: payment.customerId,
    type: 'payment_recorded',
    title: `Payment ${payment.reference || payment.id}`,
    body: `${payment.currency} ${payment.amount} via ${payment.method} · ${payment.status}`,
    meta: { paymentId: payment.id, quoteId: payment.quoteId },
  });
  return payment;
}

export async function listPayments({ status, q, limit = 100 } = {}) {
  let rows;
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    rows = (await db`SELECT * FROM payments ORDER BY created_at DESC LIMIT 500`).map(mapPayment);
  } else {
    rows = readFileStore().payments.map(mapPayment);
  }
  if (status && PAYMENT_STATUSES.includes(status)) rows = rows.filter((p) => p.status === status);
  if (q) {
    const needle = String(q).toLowerCase();
    rows = rows.filter(
      (p) =>
        p.id.toLowerCase().includes(needle) ||
        (p.reference || '').toLowerCase().includes(needle) ||
        (p.quoteId || '').toLowerCase().includes(needle)
    );
  }
  return rows.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function updatePayment(id, patch) {
  const all = await listPayments({ limit: 500 });
  const existing = all.find((p) => p.id === id);
  if (!existing) {
    const err = new Error('Payment not found');
    err.status = 404;
    throw err;
  }
  if (patch.status && !PAYMENT_STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid payment status`);
    err.status = 400;
    throw err;
  }
  const next = {
    ...existing,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.notes != null ? { notes: sanitize(patch.notes, 1000) } : {}),
    updatedAt: new Date().toISOString(),
  };
  if (hasDatabase()) {
    const db = getSql();
    await db`
      UPDATE payments SET status = ${next.status}, notes = ${next.notes}, updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
  } else {
    const data = readFileStore();
    const idx = data.payments.findIndex((p) => p.id === id);
    if (idx >= 0) data.payments[idx] = next;
    writeFileStore(data);
  }
  return next;
}

export async function updateCustomerPassport(customerId, { passportExpiry, passportCountry }) {
  if (!customerId) {
    const err = new Error('customerId required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      UPDATE customers SET
        passport_expiry = ${passportExpiry || null},
        passport_country = ${sanitize(passportCountry, 80)},
        updated_at = ${new Date().toISOString()}
      WHERE id = ${customerId}
    `;
  }
  return { customerId, passportExpiry: passportExpiry || null, passportCountry: sanitize(passportCountry, 80) };
}

export async function listPassportReminders({ withinDays = 180 } = {}) {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const db = getSql();
  const rows = await db`
    SELECT id, name, email, phone, passport_expiry, passport_country, passport_reminder_sent_at
    FROM customers
    WHERE passport_expiry IS NOT NULL
    ORDER BY passport_expiry ASC
    LIMIT 200
  `;
  const horizon = Date.now() + Math.max(1, Number(withinDays) || 180) * 86400000;
  return rows
    .filter((r) => r.passport_expiry && new Date(r.passport_expiry).getTime() <= horizon)
    .map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      passportExpiry: r.passport_expiry,
      passportCountry: r.passport_country,
      reminderSentAt: r.passport_reminder_sent_at,
      overdue: r.passport_expiry && new Date(r.passport_expiry) < new Date(),
    }));
}

export async function markPassportReminderSent(customerId) {
  if (!hasDatabase()) return;
  const db = getSql();
  const now = new Date().toISOString();
  await db`UPDATE customers SET passport_reminder_sent_at = ${now}, updated_at = ${now} WHERE id = ${customerId}`;
  await logNotification({
    customerId,
    type: 'passport_reminder',
    title: 'Passport expiry reminder logged',
    body: 'Staff marked a passport reminder as sent. Delivery is manual (WhatsApp/email).',
  });
}

export async function listNotifications({ limit = 50 } = {}) {
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    return (await db`SELECT * FROM notifications ORDER BY created_at DESC LIMIT ${Math.min(Number(limit) || 50, 200)}`).map(
      mapNotification
    );
  }
  return readFileStore().notifications.map(mapNotification).slice(0, Math.min(Number(limit) || 50, 200));
}

export async function phase4Stats() {
  const [cases, payments, reminders, notifications] = await Promise.all([
    listVisaCases({ limit: 500 }),
    listPayments({ limit: 500 }),
    listPassportReminders({ withinDays: 180 }),
    listNotifications({ limit: 20 }),
  ]);
  return {
    visaOpen: cases.filter((c) => c.status !== 'CLOSED').length,
    visaTotal: cases.length,
    paymentsPending: payments.filter((p) => p.status === 'PENDING' || p.status === 'AWAITING_PROOF').length,
    paymentsConfirmed: payments.filter((p) => p.status === 'CONFIRMED').length,
    passportRemindersDue: reminders.length,
    recentNotifications: notifications.length,
    storage: hasDatabase() ? 'postgres' : 'file',
  };
}
