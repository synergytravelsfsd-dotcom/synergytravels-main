import React, { useEffect, useState } from 'react';
import { Building2, ShieldAlert } from 'lucide-react';
import { fetchAgentPortal, patchAgentRequest, submitAgentRequest } from '../lib/b2bApi';
import { getWhatsAppLink } from '../constants/contact';

type Props = { token: string };

const AgentPortal: React.FC<Props> = ({ token }) => {
  const [data, setData] = useState<{
    account?: {
      id: string;
      companyName: string;
      creditLimit: number;
      creditUsed: number;
      creditAvailable: number;
      currency: string;
      commissionRate: number;
      status: string;
    };
    requests?: Array<Record<string, unknown>>;
    commissions?: Array<Record<string, unknown>>;
    disclaimer?: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    travellers: '',
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    budget: '',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetchAgentPortal(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Portal unavailable');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const money = (n: number, c = 'GBP') =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: c }).format(n || 0);

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-slate-600">Loading B2B portal…</div>;
  }
  if (error || !data?.account) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Agent portal unavailable</h1>
        <p className="mt-2 text-slate-600">{error}</p>
      </div>
    );
  }

  const account = data.account;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-orange-300 text-sm font-semibold">
            <Building2 className="h-4 w-4" /> B2B / Corporate portal
          </div>
          <h1 className="mt-2 text-3xl font-bold">{account.companyName}</h1>
          <p className="mt-2 text-slate-300 text-sm">
            Account {account.id} · {account.status} · Credit available{' '}
            {money(account.creditAvailable, account.currency)} of {money(account.creditLimit, account.currency)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3 text-sm text-amber-950">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <p>{data.disclaimer}</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Submit travel request</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {(
              [
                ['title', 'Title'],
                ['travellers', 'Travellers'],
                ['origin', 'From'],
                ['destination', 'To *'],
                ['departDate', 'Depart'],
                ['returnDate', 'Return'],
                ['budget', 'Budget guidance'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <input
                  type={key.includes('Date') ? 'date' : 'text'}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 rounded-xl bg-orange-600 text-white px-5 py-3 font-semibold"
            onClick={() =>
              void submitAgentRequest(token, {
                ...form,
                budget: Number(form.budget) || 0,
              })
                .then(load)
                .catch((err) => alert(err instanceof Error ? err.message : 'Failed'))
            }
          >
            Submit for review
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Requests</h2>
          <div className="mt-3 space-y-3">
            {(data.requests || []).map((r) => (
              <article key={String(r.id)} className="rounded-xl border border-slate-100 p-3">
                <div className="font-mono text-xs text-orange-600">{String(r.id)}</div>
                <div className="font-semibold">
                  {String(r.title)} · {String(r.origin || '…')} → {String(r.destination)}
                </div>
                <div className="text-sm text-slate-600">Status: {String(r.status)}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold"
                    onClick={() =>
                      void patchAgentRequest(token, String(r.id), { status: 'MANAGER_REVIEW' }).then(load)
                    }
                  >
                    Send to manager
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                    onClick={() =>
                      void patchAgentRequest(token, String(r.id), { status: 'CANCELLED' }).then(load)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </article>
            ))}
            {(data.requests || []).length === 0 && <p className="text-sm text-slate-500">No requests yet.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Commissions</h2>
          <p className="text-sm text-slate-600 mt-1">Rate on file: {account.commissionRate}%</p>
          <div className="mt-3 space-y-2">
            {(data.commissions || []).map((c) => (
              <div key={String(c.id)} className="text-sm flex justify-between border-b border-slate-100 py-2">
                <span>
                  {String(c.bookingRef || c.id)} · {money(Number(c.sellAmount), String(c.currency || 'GBP'))}
                </span>
                <span className="font-semibold">
                  {money(Number(c.commissionAmount), String(c.currency || 'GBP'))} · {String(c.status)}
                </span>
              </div>
            ))}
            {(data.commissions || []).length === 0 && (
              <p className="text-sm text-slate-500">No commission rows yet.</p>
            )}
          </div>
        </section>

        <a
          href={getWhatsAppLink(`Hi Synergy, B2B account ${account.id} (${account.companyName}) needs support.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold"
        >
          WhatsApp Synergy
        </a>
      </div>
    </div>
  );
};

export default AgentPortal;
