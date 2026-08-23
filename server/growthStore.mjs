/**
 * Phase 6 growth — referrals (durable when Postgres available).
 */
import fs from 'fs';
import path from 'path';
import { randomUUID, createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { ensureSchema, getSql, hasDatabase } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const onVercel = Boolean(process.env.VERCEL);
const dataDir = onVercel ? '/tmp/synergy-leads' : path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'referrals.json');

function sanitize(value, max = 200) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf8');
}

function readAll() {
  ensureFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(rows) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf8');
}

export async function ensureGrowthSchema() {
  if (!hasDatabase()) return false;
  await ensureSchema();
  const db = getSql();
  await db`
    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      referrer_name TEXT DEFAULT '',
      referrer_email TEXT DEFAULT '',
      referrer_phone TEXT DEFAULT '',
      note TEXT DEFAULT '',
      status TEXT DEFAULT 'ACTIVE',
      clicks INT DEFAULT 0,
      conversions INT DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS referrals_code_idx ON referrals (code)`;
  return true;
}

function makeCode(seed) {
  const base = createHash('sha1')
    .update(`${seed}-${Date.now()}-${randomUUID()}`)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();
  return `SY-${base}`;
}

export async function createReferral(body = {}) {
  await ensureGrowthSchema();
  const now = new Date().toISOString();
  const row = {
    id: `RF-${randomUUID().slice(0, 8).toUpperCase()}`,
    code: makeCode(body.referrerEmail || body.referrerPhone || 'anon'),
    referrerName: sanitize(body.referrerName || body.name, 120),
    referrerEmail: sanitize(body.referrerEmail || body.email, 160).toLowerCase(),
    referrerPhone: sanitize(body.referrerPhone || body.phone, 40),
    note: sanitize(body.note, 500),
    status: 'ACTIVE',
    clicks: 0,
    conversions: 0,
    createdAt: now,
    updatedAt: now,
  };
  if (!row.referrerName || (!row.referrerEmail && !row.referrerPhone)) {
    const err = new Error('Name and email or phone are required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    const db = getSql();
    await db`
      INSERT INTO referrals (
        id, code, referrer_name, referrer_email, referrer_phone, note, status, clicks, conversions, created_at, updated_at
      ) VALUES (
        ${row.id}, ${row.code}, ${row.referrerName}, ${row.referrerEmail}, ${row.referrerPhone},
        ${row.note}, ${row.status}, ${row.clicks}, ${row.conversions}, ${row.createdAt}, ${row.updatedAt}
      )
    `;
  } else {
    const all = readAll();
    all.unshift(row);
    writeAll(all.slice(0, 2000));
  }
  return row;
}

export async function listReferrals({ limit = 100 } = {}) {
  await ensureGrowthSchema();
  if (hasDatabase()) {
    const db = getSql();
    const rows = await db`SELECT * FROM referrals ORDER BY created_at DESC LIMIT 500`;
    return rows.slice(0, Math.min(Number(limit) || 100, 500)).map((r) => ({
      id: r.id,
      code: r.code,
      referrerName: r.referrer_name,
      referrerEmail: r.referrer_email,
      referrerPhone: r.referrer_phone,
      note: r.note,
      status: r.status,
      clicks: Number(r.clicks) || 0,
      conversions: Number(r.conversions) || 0,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }
  return readAll().slice(0, Math.min(Number(limit) || 100, 500));
}

export async function trackReferralClick(code) {
  await ensureGrowthSchema();
  const normalized = sanitize(code, 32).toUpperCase();
  if (!normalized) {
    const err = new Error('code required');
    err.status = 400;
    throw err;
  }
  if (hasDatabase()) {
    const db = getSql();
    const rows = await db`SELECT * FROM referrals WHERE code = ${normalized} LIMIT 1`;
    if (!rows[0]) {
      const err = new Error('Referral code not found');
      err.status = 404;
      throw err;
    }
    await db`
      UPDATE referrals SET clicks = clicks + 1, updated_at = ${new Date().toISOString()}
      WHERE code = ${normalized}
    `;
    return { ok: true, code: normalized };
  }
  const all = readAll();
  const idx = all.findIndex((r) => r.code === normalized);
  if (idx < 0) {
    const err = new Error('Referral code not found');
    err.status = 404;
    throw err;
  }
  all[idx].clicks = (all[idx].clicks || 0) + 1;
  all[idx].updatedAt = new Date().toISOString();
  writeAll(all);
  return { ok: true, code: normalized };
}

export async function growthStats() {
  const referrals = await listReferrals({ limit: 500 });
  return {
    referralsTotal: referrals.length,
    referralClicks: referrals.reduce((s, r) => s + (r.clicks || 0), 0),
    referralConversions: referrals.reduce((s, r) => s + (r.conversions || 0), 0),
    storage: hasDatabase() ? 'postgres' : 'file',
  };
}
