/** Phase 5 AI client helpers */

function apiBase(): string {
  const fromEnv = (import.meta.env.VITE_LEADS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const payments = (import.meta.env.VITE_PAYMENTS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (payments) return payments;
  return '';
}

async function post(path: string, body: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['X-CRM-Token'] = token;
  const res = await fetch(`${apiBase()}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `AI request failed ${res.status}`);
  return data;
}

export const fetchAiStatus = async () => {
  const res = await fetch(`${apiBase()}/api/v1/ai/status`);
  return res.json();
};

export const aiConsult = (body: Record<string, unknown>) => post('/api/v1/ai/consult', body);
export const aiQualifyLead = (token: string, body: Record<string, unknown>) =>
  post('/api/v1/ai/qualify-lead', body, token);
export const aiAssistQuote = (token: string, body: Record<string, unknown>) =>
  post('/api/v1/ai/assist-quote', body, token);
export const aiFollowUps = (token: string, body: Record<string, unknown>) =>
  post('/api/v1/ai/follow-ups', body, token);
export const aiInsights = (token: string, body: Record<string, unknown>) =>
  post('/api/v1/ai/insights', body, token);
