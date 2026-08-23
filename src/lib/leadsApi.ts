/** Client helpers for Synergy lead capture + Phase 2 sales CRM */

export type LeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  channel?: string;
  source?: string;
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  adults?: string;
  children?: string;
  infants?: string;
  cabin?: string;
  budget?: string;
  country?: string;
  message?: string;
  tripType?: string;
  multiCitySummary?: string;
  campaign?: string;
  page?: string;
};

export type LeadCreateResult = {
  ok: boolean;
  lead?: { id: string; status: string; leadScore: number; leadBand: string; createdAt: string };
  error?: string;
  offline?: boolean;
};

export type QuoteInput = {
  leadId?: string;
  customerId?: string;
  title?: string;
  summary?: string;
  currency?: string;
  sellTotal?: number;
  costTotal?: number;
  depositAmount?: number;
  validUntil?: string;
  assignedAgent?: string;
  followUpAt?: string;
  followUpNote?: string;
  lineItems?: Array<{ label: string; quantity?: number; unitSell?: number; unitCost?: number }>;
  status?: string;
};

function apiBase(): string {
  const fromEnv = (import.meta.env.VITE_LEADS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const payments = (import.meta.env.VITE_PAYMENTS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (payments) return payments;
  return '';
}

function adminHeaders(token: string) {
  return { 'Content-Type': 'application/json', 'X-CRM-Token': token };
}

export async function submitLead(payload: LeadPayload): Promise<LeadCreateResult> {
  const base = apiBase();
  const url = `${base}/api/v1/leads`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data.error || `Lead API error ${res.status}` };
    }
    return { ok: true, lead: data.lead };
  } catch {
    try {
      const lead = {
        id: `LOCAL-${Date.now()}`,
        ...payload,
        status: 'NEW',
        receivedAt: new Date().toISOString(),
      };
      const key = 'synergy_enquiries_v1';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([lead, ...(Array.isArray(prev) ? prev : [])].slice(0, 100)));
      return {
        ok: true,
        offline: true,
        lead: {
          id: lead.id,
          status: 'NEW',
          leadScore: 0,
          leadBand: 'Cold',
          createdAt: lead.receivedAt,
        },
      };
    } catch {
      return { ok: false, error: 'Unable to save enquiry' };
    }
  }
}

export async function fetchAdminLeads(token: string, params?: { status?: string; q?: string }) {
  const base = apiBase();
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.q) qs.set('q', params.q);
  const res = await fetch(`${base}/api/v1/leads?${qs.toString()}`, {
    headers: { 'X-CRM-Token': token },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load leads');
  return data as { ok: boolean; leads: Record<string, unknown>[]; statuses: string[] };
}

export async function patchAdminLead(
  token: string,
  id: string,
  patch: { status?: string; notes?: string; assignedAgent?: string }
) {
  const base = apiBase();
  const res = await fetch(`${base}/api/v1/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(token),
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update lead');
  return data;
}

export async function fetchLeadStats(token: string) {
  const base = apiBase();
  const res = await fetch(`${base}/api/v1/leads-stats`, {
    headers: { 'X-CRM-Token': token },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load stats');
  return data;
}

export async function fetchSalesStats(token: string) {
  const res = await fetch(`${apiBase()}/api/v1/sales-stats`, {
    headers: { 'X-CRM-Token': token },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load sales stats');
  return data;
}

export async function fetchQuotes(token: string, params?: { status?: string; leadId?: string; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.leadId) qs.set('leadId', params.leadId);
  if (params?.q) qs.set('q', params.q);
  const res = await fetch(`${apiBase()}/api/v1/quotes?${qs}`, {
    headers: { 'X-CRM-Token': token },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load quotes');
  return data as { ok: boolean; quotes: Record<string, unknown>[]; statuses: string[] };
}

export async function createQuote(token: string, body: QuoteInput) {
  const res = await fetch(`${apiBase()}/api/v1/quotes`, {
    method: 'POST',
    headers: adminHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create quote');
  return data;
}

export async function patchQuote(token: string, id: string, patch: QuoteInput & { status?: string }) {
  const res = await fetch(`${apiBase()}/api/v1/quotes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(token),
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update quote');
  return data;
}

export async function fetchCustomers(token: string, q?: string) {
  const qs = new URLSearchParams();
  if (q) qs.set('q', q);
  const res = await fetch(`${apiBase()}/api/v1/customers?${qs}`, {
    headers: { 'X-CRM-Token': token },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load customers');
  return data;
}

export async function fetchFollowUps(token: string) {
  const res = await fetch(`${apiBase()}/api/v1/follow-ups`, {
    headers: { 'X-CRM-Token': token },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load follow-ups');
  return data;
}

export async function fetchPublicQuote(token: string) {
  const res = await fetch(`${apiBase()}/api/v1/public/quotes/${encodeURIComponent(token)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load quote');
  return data;
}

export async function acceptPublicQuote(token: string) {
  const res = await fetch(`${apiBase()}/api/v1/public/quotes/${encodeURIComponent(token)}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to accept quote');
  return data;
}

export async function createQuoteBankIntent(token: string, full = false) {
  const res = await fetch(`${apiBase()}/api/payments/quote/bank-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, full }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create payment reference');
  return data;
}

export function quotePublicUrl(publicToken: string) {
  if (typeof window === 'undefined') return `#/quote/${publicToken}`;
  return `${window.location.origin}${window.location.pathname}#/quote/${publicToken}`;
}
