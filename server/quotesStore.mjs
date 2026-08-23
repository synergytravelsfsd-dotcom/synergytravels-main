/**
 * Quotes / sales store — Postgres preferred; JSON file fallback for local without DB.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { ensureSchema, getSql, hasDatabase } from './db.mjs';
import { getLead, updateLead } from './leadsStore.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const onVercel = Boolean(process.env.VERCEL);
const dataDir = onVercel ? '/tmp/synergy-leads' : path.join(__dirname, 'data');
const quotesFile = path.join(dataDir, 'quotes.json');
const customersFile = path.join(dataDir, 'customers.json');

export const QUOTE_STATUSES = [
  'DRAFT',
  'SENT',
  'VIEWED',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
  'PAYMENT_PENDING',
  'PAID',
  'SUPERSEDED',
];

function sanitizeString(value, max = 500) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function money(n) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v * 100) / 100 : 0;
}

function ensureFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(quotesFile)) fs.writeFileSync(quotesFile, '[]', 'utf8');
  if (!fs.existsSync(customersFile)) fs.writeFileSync(customersFile, '[]', 'utf8');
}

function readJson(file) {
  ensureFiles();
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson(file, rows) {
  ensureFiles();
  fs.writeFileSync(file, JSON.stringify(rows, null, 2), 'utf8');
}

function mapQuote(row) {
  return {
    id: row.id,
    leadId: row.lead_id ?? row.leadId ?? null,
    customerId: row.customer_id ?? row.customerId ?? null,
    publicToken: row.public_token ?? row.publicToken,
    status: row.status,
    currency: row.currency || 'GBP',
    sellTotal: money(row.sell_total ?? row.sellTotal),
    costTotal: money(row.cost_total ?? row.costTotal),
    profit: money(row.profit ?? (money(row.sell_total ?? row.sellTotal) - money(row.cost_total ?? row.costTotal))),
    depositAmount: money(row.deposit_amount ?? row.depositAmount),
    validUntil: row.valid_until ?? row.validUntil ?? null,
    title: row.title || '',
    summary: row.summary || '',
    lineItems: row.line_items ?? row.lineItems ?? [],
    assignedAgent: row.assigned_agent ?? row.assignedAgent ?? null,
    followUpAt: row.follow_up_at ?? row.followUpAt ?? null,
    followUpNote: row.follow_up_note ?? row.followUpNote ?? '',
    paymentReference: row.payment_reference ?? row.paymentReference ?? null,
    viewedAt: row.viewed_at ?? row.viewedAt ?? null,
    acceptedAt: row.accepted_at ?? row.acceptedAt ?? null,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

function publicQuoteView(quote) {
  const q = mapQuote(quote);
  return {
    id: q.id,
    publicToken: q.publicToken,
    status: q.status,
    currency: q.currency,
    sellTotal: q.sellTotal,
    depositAmount: q.depositAmount,
    validUntil: q.validUntil,
    title: q.title,
    summary: q.summary,
    lineItems: (q.lineItems || []).map((li) => ({
      label: li.label,
      quantity: li.quantity,
      unitSell: money(li.unitSell),
      // never expose cost to customer
    })),
    viewedAt: q.viewedAt,
    acceptedAt: q.acceptedAt,
    createdAt: q.createdAt,
  };
}

function normalizeLineItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 40).map((li) => ({
    label: sanitizeString(li.label || li.description, 200),
    quantity: Math.max(1, Number(li.quantity) || 1),
    unitSell: money(li.unitSell ?? li.sell ?? li.price),
    unitCost: money(li.unitCost ?? li.cost),
  }));
}

function totalsFromItems(items, sellTotal, costTotal) {
  if (items.length) {
    const sell = items.reduce((s, li) => s + li.unitSell * li.quantity, 0);
    const cost = items.reduce((s, li) => s + li.unitCost * li.quantity, 0);
    return { sellTotal: money(sell), costTotal: money(cost), profit: money(sell - cost) };
  }
  const sell = money(sellTotal);
  const cost = money(costTotal);
  return { sellTotal: sell, costTotal: cost, profit: money(sell - cost) };
}

export async function createQuote(body) {
  const lineItems = normalizeLineItems(body.lineItems);
  const totals = totalsFromItems(lineItems, body.sellTotal, body.costTotal);
  const now = new Date().toISOString();
  const leadId = sanitizeString(body.leadId, 40) || null;
  let customerId = sanitizeString(body.customerId, 40) || null;
  let assignedAgent = sanitizeString(body.assignedAgent, 80) || null;

  if (leadId) {
    const lead = await getLead(leadId);
    if (lead) {
      customerId = customerId || lead.customerId || null;
      assignedAgent = assignedAgent || lead.assignedAgent || null;
    }
  }

  const quote = {
    id: `QT-${randomUUID().slice(0, 8).toUpperCase()}`,
    leadId,
    customerId,
    publicToken: randomUUID().replace(/-/g, ''),
    status: 'DRAFT',
    currency: sanitizeString(body.currency || process.env.PAYMENT_CURRENCY || 'GBP', 8).toUpperCase(),
    ...totals,
    depositAmount: money(body.depositAmount || totals.sellTotal * 0.3),
    validUntil: body.validUntil || new Date(Date.now() + 7 * 86400000).toISOString(),
    title: sanitizeString(body.title || 'Travel quotation', 160),
    summary: sanitizeString(body.summary, 4000),
    lineItems,
    assignedAgent,
    followUpAt: body.followUpAt || new Date(Date.now() + 2 * 86400000).toISOString(),
    followUpNote: sanitizeString(body.followUpNote || 'Follow up on quote', 500),
    paymentReference: null,
    viewedAt: null,
    acceptedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    await db`
      INSERT INTO quotes (
        id, lead_id, customer_id, public_token, status, currency,
        sell_total, cost_total, profit, deposit_amount, valid_until,
        title, summary, line_items, assigned_agent, follow_up_at, follow_up_note,
        payment_reference, viewed_at, accepted_at, created_at, updated_at
      ) VALUES (
        ${quote.id}, ${quote.leadId}, ${quote.customerId}, ${quote.publicToken}, ${quote.status},
        ${quote.currency}, ${quote.sellTotal}, ${quote.costTotal}, ${quote.profit},
        ${quote.depositAmount}, ${quote.validUntil}, ${quote.title}, ${quote.summary},
        ${JSON.stringify(quote.lineItems)}, ${quote.assignedAgent}, ${quote.followUpAt},
        ${quote.followUpNote}, ${quote.paymentReference}, ${quote.viewedAt}, ${quote.acceptedAt},
        ${quote.createdAt}, ${quote.updatedAt}
      )
    `;
  } else {
    const all = readJson(quotesFile);
    all.unshift(quote);
    writeJson(quotesFile, all.slice(0, 2000));
  }

  return quote;
}

export async function listQuotes({ status, leadId, q, limit = 100 } = {}) {
  let quotes;
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT * FROM quotes ORDER BY created_at DESC LIMIT 500`;
    quotes = rows.map(mapQuote);
  } else {
    quotes = readJson(quotesFile).map(mapQuote);
  }

  if (status && QUOTE_STATUSES.includes(status)) {
    quotes = quotes.filter((x) => x.status === status);
  }
  if (leadId) quotes = quotes.filter((x) => x.leadId === leadId);
  if (q) {
    const needle = String(q).toLowerCase();
    quotes = quotes.filter(
      (x) =>
        x.id.toLowerCase().includes(needle) ||
        x.title.toLowerCase().includes(needle) ||
        (x.assignedAgent || '').toLowerCase().includes(needle) ||
        (x.leadId || '').toLowerCase().includes(needle)
    );
  }
  return quotes.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function getQuote(id) {
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT * FROM quotes WHERE id = ${id} LIMIT 1`;
    return rows[0] ? mapQuote(rows[0]) : null;
  }
  return readJson(quotesFile).map(mapQuote).find((q) => q.id === id) || null;
}

export async function getQuoteByToken(token) {
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT * FROM quotes WHERE public_token = ${token} LIMIT 1`;
    return rows[0] ? mapQuote(rows[0]) : null;
  }
  return readJson(quotesFile).map(mapQuote).find((q) => q.publicToken === token) || null;
}

async function persistQuote(quote) {
  if (hasDatabase()) {
    const db = getSql();
    await db`
      UPDATE quotes SET
        lead_id = ${quote.leadId},
        customer_id = ${quote.customerId},
        status = ${quote.status},
        currency = ${quote.currency},
        sell_total = ${quote.sellTotal},
        cost_total = ${quote.costTotal},
        profit = ${quote.profit},
        deposit_amount = ${quote.depositAmount},
        valid_until = ${quote.validUntil},
        title = ${quote.title},
        summary = ${quote.summary},
        line_items = ${JSON.stringify(quote.lineItems)},
        assigned_agent = ${quote.assignedAgent},
        follow_up_at = ${quote.followUpAt},
        follow_up_note = ${quote.followUpNote},
        payment_reference = ${quote.paymentReference},
        viewed_at = ${quote.viewedAt},
        accepted_at = ${quote.acceptedAt},
        updated_at = ${quote.updatedAt}
      WHERE id = ${quote.id}
    `;
    return;
  }
  const all = readJson(quotesFile);
  const idx = all.findIndex((q) => q.id === quote.id);
  if (idx >= 0) all[idx] = quote;
  else all.unshift(quote);
  writeJson(quotesFile, all);
}

export async function updateQuote(id, patch) {
  const existing = await getQuote(id);
  if (!existing) {
    const err = new Error('Quote not found');
    err.status = 404;
    throw err;
  }
  if (patch.status && !QUOTE_STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid quote status. Allowed: ${QUOTE_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const lineItems =
    patch.lineItems != null ? normalizeLineItems(patch.lineItems) : existing.lineItems;
  const totals =
    patch.lineItems != null || patch.sellTotal != null || patch.costTotal != null
      ? totalsFromItems(lineItems, patch.sellTotal ?? existing.sellTotal, patch.costTotal ?? existing.costTotal)
      : {
          sellTotal: existing.sellTotal,
          costTotal: existing.costTotal,
          profit: existing.profit,
        };

  const next = {
    ...existing,
    ...totals,
    lineItems,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.title != null ? { title: sanitizeString(patch.title, 160) } : {}),
    ...(patch.summary != null ? { summary: sanitizeString(patch.summary, 4000) } : {}),
    ...(patch.currency ? { currency: sanitizeString(patch.currency, 8).toUpperCase() } : {}),
    ...(patch.depositAmount != null ? { depositAmount: money(patch.depositAmount) } : {}),
    ...(patch.validUntil != null ? { validUntil: patch.validUntil } : {}),
    ...(patch.assignedAgent != null
      ? { assignedAgent: sanitizeString(patch.assignedAgent, 80) }
      : {}),
    ...(patch.followUpAt != null ? { followUpAt: patch.followUpAt } : {}),
    ...(patch.followUpNote != null
      ? { followUpNote: sanitizeString(patch.followUpNote, 500) }
      : {}),
    ...(patch.paymentReference != null
      ? { paymentReference: sanitizeString(patch.paymentReference, 80) }
      : {}),
    updatedAt: new Date().toISOString(),
  };

  await persistQuote(next);

  if (next.status === 'SENT' && next.leadId) {
    try {
      await updateLead(next.leadId, { status: 'QUOTE_SENT' });
    } catch {
      /* ignore */
    }
  }
  if ((next.status === 'ACCEPTED' || next.status === 'PAYMENT_PENDING') && next.leadId) {
    try {
      await updateLead(next.leadId, { status: 'PAYMENT_PENDING' });
    } catch {
      /* ignore */
    }
  }
  if (next.status === 'PAID' && next.leadId) {
    try {
      await updateLead(next.leadId, { status: 'BOOKED' });
    } catch {
      /* ignore */
    }
  }

  return next;
}

export async function markQuoteViewed(token) {
  const quote = await getQuoteByToken(token);
  if (!quote) {
    const err = new Error('Quote not found');
    err.status = 404;
    throw err;
  }
  if (quote.validUntil && new Date(quote.validUntil).getTime() < Date.now() && quote.status !== 'PAID') {
    if (quote.status !== 'EXPIRED') {
      quote.status = 'EXPIRED';
      quote.updatedAt = new Date().toISOString();
      await persistQuote(quote);
    }
  } else if (quote.status === 'SENT') {
    quote.status = 'VIEWED';
    quote.viewedAt = new Date().toISOString();
    quote.updatedAt = quote.viewedAt;
    await persistQuote(quote);
  }
  return publicQuoteView(quote);
}

export async function acceptQuoteByToken(token) {
  const quote = await getQuoteByToken(token);
  if (!quote) {
    const err = new Error('Quote not found');
    err.status = 404;
    throw err;
  }
  if (quote.status === 'EXPIRED' || (quote.validUntil && new Date(quote.validUntil).getTime() < Date.now())) {
    const err = new Error('This quote has expired. Please contact Synergy for a new quotation.');
    err.status = 410;
    throw err;
  }
  quote.status = 'PAYMENT_PENDING';
  quote.acceptedAt = new Date().toISOString();
  quote.updatedAt = quote.acceptedAt;
  if (!quote.paymentReference) {
    quote.paymentReference = `${process.env.PAYMENT_REFERENCE_PREFIX || 'STT'}-${quote.id.replace('QT-', '')}`;
  }
  await persistQuote(quote);
  if (quote.leadId) {
    try {
      await updateLead(quote.leadId, { status: 'PAYMENT_PENDING' });
    } catch {
      /* ignore */
    }
  }
  return publicQuoteView(quote);
}

export async function listCustomers({ q, limit = 100 } = {}) {
  if (hasDatabase()) {
    await ensureSchema();
    const db = getSql();
    const rows = await db`SELECT * FROM customers ORDER BY updated_at DESC LIMIT 500`;
    let customers = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      country: r.country,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    if (q) {
      const needle = String(q).toLowerCase();
      customers = customers.filter(
        (c) =>
          c.id.toLowerCase().includes(needle) ||
          c.name.toLowerCase().includes(needle) ||
          (c.email || '').includes(needle) ||
          (c.phone || '').includes(needle)
      );
    }
    return customers.slice(0, Math.min(Number(limit) || 100, 500));
  }

  // derive from leads file
  const leads = readJson(path.join(dataDir, 'leads.json'));
  const map = new Map();
  for (const l of leads) {
    const key = (l.email || l.phone || l.id).toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        id: l.customerId || `CU-${l.id}`,
        name: l.name,
        email: l.email,
        phone: l.phone,
        country: l.payload?.country || '',
        notes: '',
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      });
    }
  }
  let customers = [...map.values()];
  if (q) {
    const needle = String(q).toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        (c.email || '').includes(needle) ||
        (c.phone || '').includes(needle)
    );
  }
  return customers.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function listFollowUps({ limit = 50 } = {}) {
  const quotes = await listQuotes({ limit: 500 });
  const now = Date.now();
  return quotes
    .filter((q) => q.followUpAt && ['DRAFT', 'SENT', 'VIEWED', 'PAYMENT_PENDING'].includes(q.status))
    .map((q) => ({
      ...q,
      overdue: new Date(q.followUpAt).getTime() < now,
    }))
    .sort((a, b) => new Date(a.followUpAt) - new Date(b.followUpAt))
    .slice(0, Math.min(Number(limit) || 50, 200));
}

export async function salesStats() {
  const quotes = await listQuotes({ limit: 500 });
  const open = quotes.filter((q) => !['DECLINED', 'EXPIRED', 'PAID', 'SUPERSEDED'].includes(q.status));
  const paid = quotes.filter((q) => q.status === 'PAID');
  const pipelineSell = open.reduce((s, q) => s + q.sellTotal, 0);
  const realizedProfit = paid.reduce((s, q) => s + q.profit, 0);
  const followUps = await listFollowUps({ limit: 500 });
  return {
    quotesTotal: quotes.length,
    quotesOpen: open.length,
    quotesPaid: paid.length,
    pipelineSell: money(pipelineSell),
    realizedProfit: money(realizedProfit),
    followUpsDue: followUps.filter((f) => f.overdue).length,
    storage: hasDatabase() ? 'postgres' : 'file',
  };
}

export { publicQuoteView };
