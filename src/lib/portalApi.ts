/** Phase 4 client helpers — visa, portal, payments, reminders */

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

export const fetchPhase4Stats = (token: string) => adminGet(token, '/api/v1/phase4-stats');
export const fetchVisaCases = (token: string, params?: { status?: string; q?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.q) qs.set('q', params.q);
  return adminGet(token, `/api/v1/visa-cases?${qs}`);
};
export const createVisaCase = (token: string, body: Record<string, unknown>) =>
  adminSend(token, '/api/v1/visa-cases', 'POST', body);
export const patchVisaCase = (token: string, id: string, body: Record<string, unknown>) =>
  adminSend(token, `/api/v1/visa-cases/${encodeURIComponent(id)}`, 'PATCH', body);

export const fetchDocuments = (token: string, params?: { visaCaseId?: string; customerId?: string }) => {
  const qs = new URLSearchParams();
  if (params?.visaCaseId) qs.set('visaCaseId', params.visaCaseId);
  if (params?.customerId) qs.set('customerId', params.customerId);
  return adminGet(token, `/api/v1/documents?${qs}`);
};
export const createDocument = (token: string, body: Record<string, unknown>) =>
  adminSend(token, '/api/v1/documents', 'POST', body);
export const patchDocument = (token: string, id: string, body: Record<string, unknown>) =>
  adminSend(token, `/api/v1/documents/${encodeURIComponent(id)}`, 'PATCH', body);

export const createPortalLink = (token: string, body: { customerId: string; label?: string; daysValid?: number }) =>
  adminSend(token, '/api/v1/portal-links', 'POST', body);

export const fetchPayments = (token: string, params?: { status?: string; q?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.q) qs.set('q', params.q);
  return adminGet(token, `/api/v1/payments?${qs}`);
};
export const createPayment = (token: string, body: Record<string, unknown>) =>
  adminSend(token, '/api/v1/payments', 'POST', body);
export const patchPayment = (token: string, id: string, body: Record<string, unknown>) =>
  adminSend(token, `/api/v1/payments/${encodeURIComponent(id)}`, 'PATCH', body);

export const patchCustomerPassport = (
  token: string,
  customerId: string,
  body: { passportExpiry?: string; passportCountry?: string }
) => adminSend(token, `/api/v1/customers/${encodeURIComponent(customerId)}/passport`, 'PATCH', body);

export const fetchPassportReminders = (token: string) => adminGet(token, '/api/v1/passport-reminders');
export const markPassportReminderSent = (token: string, customerId: string) =>
  adminSend(token, `/api/v1/passport-reminders/${encodeURIComponent(customerId)}/sent`, 'POST', {});

export const fetchNotifications = (token: string) => adminGet(token, '/api/v1/notifications');

export async function fetchPortalSession(rawToken: string) {
  const res = await fetch(`${apiBase()}/api/v1/public/portal/${encodeURIComponent(rawToken)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Portal unavailable');
  return data;
}

export async function portalUploadDocument(rawToken: string, body: Record<string, unknown>) {
  const res = await fetch(`${apiBase()}/api/v1/public/portal/${encodeURIComponent(rawToken)}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export function portalPublicUrl(rawToken: string) {
  if (typeof window === 'undefined') return `#/portal/${rawToken}`;
  return `${window.location.origin}${window.location.pathname}#/portal/${rawToken}`;
}
