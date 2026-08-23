/**
 * Neon / Postgres connection + schema bootstrap for Synergy CRM / sales.
 * Falls back to null when DATABASE_URL / POSTGRES_URL is unset (local file store).
 */
import { neon } from '@neondatabase/serverless';

let sql = null;
let schemaReady = null;

export function databaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ''
  ).trim();
}

export function hasDatabase() {
  return Boolean(databaseUrl());
}

export function getSql() {
  if (!hasDatabase()) return null;
  if (!sql) sql = neon(databaseUrl());
  return sql;
}

export async function ensureSchema() {
  const db = getSql();
  if (!db) return false;
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    await db`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        country TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await db`CREATE INDEX IF NOT EXISTS customers_email_idx ON customers (lower(email))`;
    await db`CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone)`;

    await db`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        customer_id TEXT REFERENCES customers(id),
        name TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        whatsapp TEXT DEFAULT '',
        service TEXT DEFAULT 'general',
        source TEXT DEFAULT 'website_form',
        channel TEXT DEFAULT 'website',
        status TEXT DEFAULT 'NEW',
        lead_score INT DEFAULT 0,
        lead_band TEXT DEFAULT 'Cold',
        assigned_agent TEXT,
        notes TEXT DEFAULT '',
        payload JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await db`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status)`;
    await db`CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC)`;

    await db`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        lead_id TEXT,
        customer_id TEXT REFERENCES customers(id),
        public_token TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'DRAFT',
        currency TEXT DEFAULT 'GBP',
        sell_total NUMERIC(12,2) DEFAULT 0,
        cost_total NUMERIC(12,2) DEFAULT 0,
        profit NUMERIC(12,2) DEFAULT 0,
        deposit_amount NUMERIC(12,2) DEFAULT 0,
        valid_until TIMESTAMPTZ,
        title TEXT DEFAULT '',
        summary TEXT DEFAULT '',
        line_items JSONB DEFAULT '[]'::jsonb,
        assigned_agent TEXT,
        follow_up_at TIMESTAMPTZ,
        follow_up_note TEXT DEFAULT '',
        payment_reference TEXT,
        viewed_at TIMESTAMPTZ,
        accepted_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await db`CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes (status)`;
    await db`CREATE INDEX IF NOT EXISTS quotes_lead_idx ON quotes (lead_id)`;
    await db`CREATE INDEX IF NOT EXISTS quotes_follow_up_idx ON quotes (follow_up_at)`;
    return true;
  })();

  return schemaReady;
}
