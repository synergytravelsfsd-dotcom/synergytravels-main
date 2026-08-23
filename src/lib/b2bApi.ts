/** Phase 7 B2B client helpers */

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

async function adminGet(token: string, path: string) {
  const res = await fetch(`${apiBase()}${path}`, { headers: { 'X-CRM-Token': token } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed ${res.status}`);
  return data;
}

async function adminSend(token: string, path: string, method: string, body?: unknown) {
  const res = await fetch(`${apiBase()}${path}`, {
    method,
    headers: adminHeaders(token),
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed ${res.status}`);
  return data;
}

export const fetchB2bStats = (token: string) => adminGet(token, '/api/v1/b2b-stats');
export const fetchB2bAccounts = (token: string, q?: string) => {
  const qs = new URLSearchParams();
  if (q) qs.set('q', q);
  return adminGet(token, `/api/v1/b2b/accounts?${qs}`);
};
export const createB2bAccount = (token: string, body: Record<string, unknown>) =>
  adminSend(token, '/api/v1/b2b/accounts', 'POST', body);
export const patchB2bAccount = (token: string, id: string, body: Record<string, unknown>) =>
  adminSend(token, `/api/v1/b2b/accounts/${encodeURIComponent(id)}`, 'PATCH', body);
export const createB2bStaff = (token: string, body: Record<string, unknown>) =>
  adminSend(token, '/api/v1/b2b/staff', 'POST', body);
export const createB2bPortalLink = (
  token: string,
  body: { accountId: string; staffId?: string; daysValid?: number; label?: string }
) => adminSend(token, '/api/v1/b2b/portal-links', 'POST', body);
export const fetchB2bRequests = (token: string) => adminGet(token, '/api/v1/b2b/requests');
export const patchB2bRequest = (token: string, id: string, body: Record<string, unknown>) =>
  adminSend(token, `/api/v1/b2b/requests/${encodeURIComponent(id)}`, 'PATCH', body);
export const createB2bCommission = (token: string, body: Record<string, unknown>) =>
  adminSend(token, '/api/v1/b2b/commissions', 'POST', body);
export const fetchB2bCommissions = (token: string) => adminGet(token, '/api/v1/b2b/commissions');

export async function fetchAgentPortal(rawToken: string) {
  const res = await fetch(`${apiBase()}/api/v1/public/b2b/${encodeURIComponent(rawToken)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Portal unavailable');
  return data;
}

export async function submitAgentRequest(rawToken: string, body: Record<string, unknown>) {
  const res = await fetch(`${apiBase()}/api/v1/public/b2b/${encodeURIComponent(rawToken)}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Unable to submit request');
  return data;
}

export async function patchAgentRequest(rawToken: string, id: string, body: Record<string, unknown>) {
  const res = await fetch(
    `${apiBase()}/api/v1/public/b2b/${encodeURIComponent(rawToken)}/requests/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Unable to update request');
  return data;
}

export function agentPortalUrl(rawToken: string) {
  if (typeof window === 'undefined') return `#/agent/${rawToken}`;
  return `${window.location.origin}${window.location.pathname}#/agent/${rawToken}`;
}
