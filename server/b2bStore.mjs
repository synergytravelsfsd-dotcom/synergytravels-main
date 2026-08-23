/**
 * Phase 7 B2B — corporate accounts, staff, credit, commissions, travel requests + approvals.
 */
import fs from 'fs';
import path from 'path';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { ensureSchema, getSql, hasDatabase } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const onVercel = Boolean(process.env.VERCEL);
const dataDir = onVercel ? '/tmp/synergy-leads' : path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'b2b.json');

export const ACCOUNT_STATUSES = ['PROSPECT', 'ACTIVE', 'SUSPENDED', 'CLOSED'];
export const REQUEST_STATUSES = ['DRAFT', 'SUBMITTED', 'MANAGER_REVIEW', 'APPROVED', 'REJECTED', 'BOOKING', 'COMPLETED', 'CANCELLED'];

function sanitize(value, max = 500) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function money(n) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v * 100) / 100 : 0;
}

function hashToken(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ accounts: [], staff: [], tokens: [], requests: [], commissions: [] }, null, 2),
      'utf8'
    );
  }
}

function readStore() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return { accounts: [], staff: [], tokens: [], requests: [], commissions: [] };
  }
}

function writeStore(data) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function ensureB2bSchema() {
  if (!hasDatabase()) return false;
  await ensureSchema();
  const db = getSql();
  await db`
    CREATE TABLE IF NOT EXISTS b2b_accounts (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      contact_name TEXT DEFAULT '',
      contact_email TEXT DEFAULT '',
      contact_phone TEXT DEFAULT '',
      status TEXT DEFAULT 'PROSPECT',
      credit_limit NUMERIC(12,2) DEFAULT 0,
      credit_used NUMERIC(12,2) DEFAULT 0,
      currency TEXT DEFAULT 'GBP',
      commission_rate NUMERIC(5,2) DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS b2b_staff (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'BOOKER',
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS b2b_portal_tokens (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      staff_id TEXT,
      token_hash TEXT UNIQUE NOT NULL,
      label TEXT DEFAULT '',
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      last_used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS b2b_requests (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      staff_id TEXT,
      title TEXT DEFAULT '',
      travellers TEXT DEFAULT '',
      origin TEXT DEFAULT '',
      destination TEXT DEFAULT '',
      depart_date TEXT DEFAULT '',
      return_date TEXT DEFAULT '',
      budget NUMERIC(12,2) DEFAULT 0,
      currency TEXT DEFAULT 'GBP',
      status TEXT DEFAULT 'SUBMITTED',
      manager_note TEXT DEFAULT '',
      synergy_note TEXT DEFAULT '',
      estimated_cost NUMERIC(12,2) DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS b2b_commissions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      request_id TEXT,
      booking_ref TEXT DEFAULT '',
      sell_amount NUMERIC(12,2) DEFAULT 0,
      commission_amount NUMERIC(12,2) DEFAULT 0,
      currency TEXT DEFAULT 'GBP',
      status TEXT DEFAULT 'ACCRUED',
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS b2b_accounts_status_idx ON b2b_accounts (status)`;
  await db`CREATE INDEX IF NOT EXISTS b2b_requests_account_idx ON b2b_requests (account_id)`;
  await db`CREATE INDEX IF NOT EXISTS b2b_requests_status_idx ON b2b_requests (status)`;
  return true;
}

function mapAccount(r) {
  return {
    id: r.id,
    companyName: r.company_name ?? r.companyName,
    contactName: r.contact_name ?? r.contactName ?? '',
    contactEmail: r.contact_email ?? r.contactEmail ?? '',
    contactPhone: r.contact_phone ?? r.contactPhone ?? '',
    status: r.status,
    creditLimit: money(r.credit_limit ?? r.creditLimit),
    creditUsed: money(r.credit_used ?? r.creditUsed),
    creditAvailable: money(
      money(r.credit_limit ?? r.creditLimit) - money(r.credit_used ?? r.creditUsed)
    ),
    currency: r.currency || 'GBP',
    commissionRate: money(r.commission_rate ?? r.commissionRate),
    notes: r.notes || '',
    createdAt: r.created_at ?? r.createdAt,
    updatedAt: r.updated_at ?? r.updatedAt,
  };
}

function mapRequest(r) {
  return {
    id: r.id,
    accountId: r.account_id ?? r.accountId,
    staffId: r.staff_id ?? r.staffId ?? null,
    title: r.title || '',
    travellers: r.travellers || '',
    origin: r.origin || '',
    destination: r.destination || '',
    departDate: r.depart_date ?? r.departDate ?? '',
    returnDate: r.return_date ?? r.returnDate ?? '',
    budget: money(r.budget),
    currency: r.currency || 'GBP',
    status: r.status,
    managerNote: r.manager_note ?? r.managerNote ?? '',
    synergyNote: r.synergy_note ?? r.synergyNote ?? '',
    estimatedCost: money(r.estimated_cost ?? r.estimatedCost),
    createdAt: r.created_at ?? r.createdAt,
    updatedAt: r.updated_at ?? r.updatedAt,
  };
}

function mapCommission(r) {
  return {
    id: r.id,
    accountId: r.account_id ?? r.accountId,
    requestId: r.request_id ?? r.requestId ?? null,
    bookingRef: r.booking_ref ?? r.bookingRef ?? '',
    sellAmount: money(r.sell_amount ?? r.sellAmount),
    commissionAmount: money(r.commission_amount ?? r.commissionAmount),
    currency: r.currency || 'GBP',
    status: r.status || 'ACCRUED',
    notes: r.notes || '',
    createdAt: r.created_at ?? r.createdAt,
    updatedAt: r.updated_at ?? r.updatedAt,
  };
}

export async function createAccount(body = {}) {
  await ensureB2bSchema();
  const now = new Date().toISOString();
  const row = {
    id: `BA-${randomUUID().slice(0, 8).toUpperCase()}`,
    companyName: sanitize(body.companyName, 160),
    contactName: sanitize(body.contactName, 120),
    contactEmail: sanitize(body.contactEmail, 160).toLowerCase(),
    contactPhone: sanitize(body.contactPhone, 40),
    status: ACCOUNT_STATUSES.includes(body.status) ? body.status : 'PROSPECT',
    creditLimit: money(body.creditLimit),
    creditUsed: 0,
    currency: sanitize(body.currency || 'GBP', 8).toUpperCase(),
    commissionRate: money(body.commissionRate),
    notes: sanitize(body.notes, 2000),
    createdAt: now,
    updatedAt: now,
  };
  if (!row.companyName) {
    const err = new Error('companyName is required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    const db = getSql();
    await db`
      INSERT INTO b2b_accounts (
        id, company_name, contact_name, contact_email, contact_phone, status,
        credit_limit, credit_used, currency, commission_rate, notes, created_at, updated_at
      ) VALUES (
        ${row.id}, ${row.companyName}, ${row.contactName}, ${row.contactEmail}, ${row.contactPhone},
        ${row.status}, ${row.creditLimit}, ${row.creditUsed}, ${row.currency}, ${row.commissionRate},
        ${row.notes}, ${row.createdAt}, ${row.updatedAt}
      )
    `;
  } else {
    const data = readStore();
    data.accounts.unshift(row);
    writeStore(data);
  }
  return mapAccount(row);
}

export async function listAccounts({ status, q, limit = 100 } = {}) {
  await ensureB2bSchema();
  let rows;
  if (hasDatabase()) {
    const db = getSql();
    rows = (await db`SELECT * FROM b2b_accounts ORDER BY created_at DESC LIMIT 500`).map(mapAccount);
  } else {
    rows = readStore().accounts.map(mapAccount);
  }
  if (status && ACCOUNT_STATUSES.includes(status)) rows = rows.filter((a) => a.status === status);
  if (q) {
    const needle = String(q).toLowerCase();
    rows = rows.filter(
      (a) =>
        a.id.toLowerCase().includes(needle) ||
        a.companyName.toLowerCase().includes(needle) ||
        a.contactEmail.includes(needle)
    );
  }
  return rows.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function updateAccount(id, patch) {
  const accounts = await listAccounts({ limit: 500 });
  const existing = accounts.find((a) => a.id === id);
  if (!existing) {
    const err = new Error('Account not found');
    err.status = 404;
    throw err;
  }
  if (patch.status && !ACCOUNT_STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid status`);
    err.status = 400;
    throw err;
  }
  const next = {
    ...existing,
    ...(patch.companyName != null ? { companyName: sanitize(patch.companyName, 160) } : {}),
    ...(patch.contactName != null ? { contactName: sanitize(patch.contactName, 120) } : {}),
    ...(patch.contactEmail != null ? { contactEmail: sanitize(patch.contactEmail, 160).toLowerCase() } : {}),
    ...(patch.contactPhone != null ? { contactPhone: sanitize(patch.contactPhone, 40) } : {}),
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.creditLimit != null ? { creditLimit: money(patch.creditLimit) } : {}),
    ...(patch.creditUsed != null ? { creditUsed: money(patch.creditUsed) } : {}),
    ...(patch.commissionRate != null ? { commissionRate: money(patch.commissionRate) } : {}),
    ...(patch.notes != null ? { notes: sanitize(patch.notes, 2000) } : {}),
    updatedAt: new Date().toISOString(),
  };
  next.creditAvailable = money(next.creditLimit - next.creditUsed);
  if (hasDatabase()) {
    const db = getSql();
    await db`
      UPDATE b2b_accounts SET
        company_name = ${next.companyName},
        contact_name = ${next.contactName},
        contact_email = ${next.contactEmail},
        contact_phone = ${next.contactPhone},
        status = ${next.status},
        credit_limit = ${next.creditLimit},
        credit_used = ${next.creditUsed},
        commission_rate = ${next.commissionRate},
        notes = ${next.notes},
        updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
  } else {
    const data = readStore();
    const idx = data.accounts.findIndex((a) => a.id === id);
    if (idx >= 0) data.accounts[idx] = next;
    writeStore(data);
  }
  return next;
}

export async function createStaff(body = {}) {
  await ensureB2bSchema();
  const now = new Date().toISOString();
  const row = {
    id: `BS-${randomUUID().slice(0, 8).toUpperCase()}`,
    accountId: sanitize(body.accountId, 40),
    name: sanitize(body.name, 120),
    email: sanitize(body.email, 160).toLowerCase(),
    phone: sanitize(body.phone, 40),
    role: sanitize(body.role || 'BOOKER', 40).toUpperCase(),
    active: body.active !== false,
    createdAt: now,
    updatedAt: now,
  };
  if (!row.accountId || !row.name) {
    const err = new Error('accountId and name are required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    const db = getSql();
    await db`
      INSERT INTO b2b_staff (id, account_id, name, email, phone, role, active, created_at, updated_at)
      VALUES (${row.id}, ${row.accountId}, ${row.name}, ${row.email}, ${row.phone}, ${row.role}, ${row.active}, ${row.createdAt}, ${row.updatedAt})
    `;
  } else {
    const data = readStore();
    data.staff.unshift(row);
    writeStore(data);
  }
  return row;
}

export async function listStaff(accountId) {
  await ensureB2bSchema();
  if (hasDatabase()) {
    const db = getSql();
    const rows = accountId
      ? await db`SELECT * FROM b2b_staff WHERE account_id = ${accountId} ORDER BY created_at DESC`
      : await db`SELECT * FROM b2b_staff ORDER BY created_at DESC LIMIT 500`;
    return rows.map((r) => ({
      id: r.id,
      accountId: r.account_id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      role: r.role,
      active: r.active,
      createdAt: r.created_at,
    }));
  }
  const staff = readStore().staff;
  return accountId ? staff.filter((s) => s.accountId === accountId) : staff;
}

export async function createAgentPortalLink({ accountId, staffId, label, daysValid = 30 }) {
  await ensureB2bSchema();
  if (!accountId) {
    const err = new Error('accountId required');
    err.status = 400;
    throw err;
  }
  const raw = randomBytes(24).toString('hex');
  const tokenHash = hashToken(raw);
  const now = new Date();
  const expires = new Date(now.getTime() + Math.max(1, Math.min(90, Number(daysValid) || 30)) * 86400000);
  const row = {
    id: `BT-${randomUUID().slice(0, 8).toUpperCase()}`,
    accountId,
    staffId: staffId || null,
    tokenHash,
    label: sanitize(label || 'B2B portal', 80),
    expiresAt: expires.toISOString(),
    revokedAt: null,
    lastUsedAt: null,
    createdAt: now.toISOString(),
  };
  if (hasDatabase()) {
    const db = getSql();
    await db`
      INSERT INTO b2b_portal_tokens (id, account_id, staff_id, token_hash, label, expires_at, created_at)
      VALUES (${row.id}, ${row.accountId}, ${row.staffId}, ${row.tokenHash}, ${row.label}, ${row.expiresAt}, ${row.createdAt})
    `;
  } else {
    const data = readStore();
    data.tokens.unshift(row);
    writeStore(data);
  }
  return { id: row.id, accountId, staffId: row.staffId, expiresAt: row.expiresAt, token: raw, label: row.label };
}

async function findToken(raw) {
  const tokenHash = hashToken(raw);
  if (hasDatabase()) {
    const db = getSql();
    const rows = await db`SELECT * FROM b2b_portal_tokens WHERE token_hash = ${tokenHash} LIMIT 1`;
    return rows[0] || null;
  }
  return readStore().tokens.find((t) => t.tokenHash === tokenHash) || null;
}

export async function resolveAgentPortal(rawToken) {
  await ensureB2bSchema();
  const row = await findToken(rawToken);
  if (!row) {
    const err = new Error('Invalid agent portal link');
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
  const accountId = row.account_id || row.accountId;
  const now = new Date().toISOString();
  if (hasDatabase()) {
    const db = getSql();
    await db`UPDATE b2b_portal_tokens SET last_used_at = ${now} WHERE id = ${row.id}`;
  }
  const accounts = await listAccounts({ limit: 500 });
  const account = accounts.find((a) => a.id === accountId);
  if (!account || account.status === 'SUSPENDED' || account.status === 'CLOSED') {
    const err = new Error('Account is not active for portal access');
    err.status = 403;
    throw err;
  }
  const staff = await listStaff(accountId);
  const requests = await listRequests({ accountId, limit: 100 });
  const commissions = await listCommissions({ accountId, limit: 100 });
  return {
    account,
    staff,
    requests,
    commissions,
    disclaimer:
      'B2B portal is for corporate / travel-agent partners of Synergy. Credit and commissions are internal records pending Synergy confirmation. No live inventory fares are shown here.',
  };
}

export async function createTravelRequest(body = {}) {
  await ensureB2bSchema();
  const now = new Date().toISOString();
  const row = {
    id: `BR-${randomUUID().slice(0, 8).toUpperCase()}`,
    accountId: sanitize(body.accountId, 40),
    staffId: sanitize(body.staffId, 40) || null,
    title: sanitize(body.title || 'Corporate travel request', 160),
    travellers: sanitize(body.travellers, 500),
    origin: sanitize(body.origin, 120),
    destination: sanitize(body.destination, 120),
    departDate: sanitize(body.departDate, 40),
    returnDate: sanitize(body.returnDate, 40),
    budget: money(body.budget),
    currency: sanitize(body.currency || 'GBP', 8).toUpperCase(),
    status: 'SUBMITTED',
    managerNote: '',
    synergyNote: '',
    estimatedCost: 0,
    createdAt: now,
    updatedAt: now,
  };
  if (!row.accountId || !row.destination) {
    const err = new Error('accountId and destination are required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    const db = getSql();
    await db`
      INSERT INTO b2b_requests (
        id, account_id, staff_id, title, travellers, origin, destination, depart_date, return_date,
        budget, currency, status, manager_note, synergy_note, estimated_cost, created_at, updated_at
      ) VALUES (
        ${row.id}, ${row.accountId}, ${row.staffId}, ${row.title}, ${row.travellers}, ${row.origin},
        ${row.destination}, ${row.departDate}, ${row.returnDate}, ${row.budget}, ${row.currency},
        ${row.status}, ${row.managerNote}, ${row.synergyNote}, ${row.estimatedCost}, ${row.createdAt}, ${row.updatedAt}
      )
    `;
  } else {
    const data = readStore();
    data.requests.unshift(row);
    writeStore(data);
  }
  return mapRequest(row);
}

export async function listRequests({ accountId, status, limit = 100 } = {}) {
  await ensureB2bSchema();
  let rows;
  if (hasDatabase()) {
    const db = getSql();
    rows = (await db`SELECT * FROM b2b_requests ORDER BY created_at DESC LIMIT 500`).map(mapRequest);
  } else {
    rows = readStore().requests.map(mapRequest);
  }
  if (accountId) rows = rows.filter((r) => r.accountId === accountId);
  if (status && REQUEST_STATUSES.includes(status)) rows = rows.filter((r) => r.status === status);
  return rows.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function updateTravelRequest(id, patch) {
  const all = await listRequests({ limit: 500 });
  const existing = all.find((r) => r.id === id);
  if (!existing) {
    const err = new Error('Request not found');
    err.status = 404;
    throw err;
  }
  if (patch.status && !REQUEST_STATUSES.includes(patch.status)) {
    const err = new Error(`Invalid request status`);
    err.status = 400;
    throw err;
  }
  const next = {
    ...existing,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.managerNote != null ? { managerNote: sanitize(patch.managerNote, 1000) } : {}),
    ...(patch.synergyNote != null ? { synergyNote: sanitize(patch.synergyNote, 1000) } : {}),
    ...(patch.estimatedCost != null ? { estimatedCost: money(patch.estimatedCost) } : {}),
    updatedAt: new Date().toISOString(),
  };

  // Credit hold when approved with estimated cost
  if (patch.status === 'APPROVED' && next.estimatedCost > 0) {
    const accounts = await listAccounts({ limit: 500 });
    const account = accounts.find((a) => a.id === next.accountId);
    if (account) {
      const available = account.creditLimit - account.creditUsed;
      if (next.estimatedCost > available && account.creditLimit > 0) {
        const err = new Error(
          `Insufficient credit. Available ${account.currency} ${money(available)}, need ${next.estimatedCost}`
        );
        err.status = 400;
        throw err;
      }
      if (account.creditLimit > 0) {
        await updateAccount(account.id, { creditUsed: money(account.creditUsed + next.estimatedCost) });
      }
    }
  }

  if (hasDatabase()) {
    const db = getSql();
    await db`
      UPDATE b2b_requests SET
        status = ${next.status},
        manager_note = ${next.managerNote},
        synergy_note = ${next.synergyNote},
        estimated_cost = ${next.estimatedCost},
        updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
  } else {
    const data = readStore();
    const idx = data.requests.findIndex((r) => r.id === id);
    if (idx >= 0) data.requests[idx] = next;
    writeStore(data);
  }
  return next;
}

export async function createCommission(body = {}) {
  await ensureB2bSchema();
  const now = new Date().toISOString();
  const sell = money(body.sellAmount);
  let commissionAmount = money(body.commissionAmount);
  if (!commissionAmount && body.accountId) {
    const accounts = await listAccounts({ limit: 500 });
    const account = accounts.find((a) => a.id === body.accountId);
    if (account?.commissionRate) {
      commissionAmount = money((sell * account.commissionRate) / 100);
    }
  }
  const row = {
    id: `BC-${randomUUID().slice(0, 8).toUpperCase()}`,
    accountId: sanitize(body.accountId, 40),
    requestId: sanitize(body.requestId, 40) || null,
    bookingRef: sanitize(body.bookingRef, 80),
    sellAmount: sell,
    commissionAmount,
    currency: sanitize(body.currency || 'GBP', 8).toUpperCase(),
    status: sanitize(body.status || 'ACCRUED', 40).toUpperCase(),
    notes: sanitize(body.notes, 1000),
    createdAt: now,
    updatedAt: now,
  };
  if (!row.accountId) {
    const err = new Error('accountId required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    const db = getSql();
    await db`
      INSERT INTO b2b_commissions (
        id, account_id, request_id, booking_ref, sell_amount, commission_amount, currency, status, notes, created_at, updated_at
      ) VALUES (
        ${row.id}, ${row.accountId}, ${row.requestId}, ${row.bookingRef}, ${row.sellAmount},
        ${row.commissionAmount}, ${row.currency}, ${row.status}, ${row.notes}, ${row.createdAt}, ${row.updatedAt}
      )
    `;
  } else {
    const data = readStore();
    data.commissions.unshift(row);
    writeStore(data);
  }
  return mapCommission(row);
}

export async function listCommissions({ accountId, limit = 100 } = {}) {
  await ensureB2bSchema();
  let rows;
  if (hasDatabase()) {
    const db = getSql();
    rows = (await db`SELECT * FROM b2b_commissions ORDER BY created_at DESC LIMIT 500`).map(mapCommission);
  } else {
    rows = readStore().commissions.map(mapCommission);
  }
  if (accountId) rows = rows.filter((c) => c.accountId === accountId);
  return rows.slice(0, Math.min(Number(limit) || 100, 500));
}

export async function b2bStats() {
  const [accounts, requests, commissions] = await Promise.all([
    listAccounts({ limit: 500 }),
    listRequests({ limit: 500 }),
    listCommissions({ limit: 500 }),
  ]);
  return {
    accountsTotal: accounts.length,
    accountsActive: accounts.filter((a) => a.status === 'ACTIVE').length,
    requestsOpen: requests.filter((r) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(r.status)).length,
    creditExtended: money(accounts.reduce((s, a) => s + a.creditLimit, 0)),
    creditUsed: money(accounts.reduce((s, a) => s + a.creditUsed, 0)),
    commissionsAccrued: money(
      commissions.filter((c) => c.status === 'ACCRUED').reduce((s, c) => s + c.commissionAmount, 0)
    ),
    storage: hasDatabase() ? 'postgres' : 'file',
  };
}
