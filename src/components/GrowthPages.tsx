import React, { useEffect, useState } from 'react';
import { Tag, Gift, Award } from 'lucide-react';
import { DEALS, LOYALTY_PROGRAM } from '../data/deals';
import { navigateToAppPage } from '../constants/pages';
import { SITE_NAME } from '../constants/site';
import { trackEvent } from '../lib/analytics';

function apiBase(): string {
  const fromEnv = (import.meta.env.VITE_LEADS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const payments = (import.meta.env.VITE_PAYMENTS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (payments) return payments;
  return '';
}

export const DealsPage: React.FC = () => {
  useEffect(() => {
    document.title = `Travel deals & offers | ${SITE_NAME}`;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Deals & featured offers</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Featured assistance themes for popular trips. Every price is confirmed by quotation — nothing here is a live
            inventory fare.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid md:grid-cols-2 gap-4">
        {DEALS.map((deal) => (
          <article key={deal.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold">
              <Tag className="h-4 w-4" /> {deal.badge || 'Offer'}
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{deal.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{deal.summary}</p>
            <p className="mt-2 text-xs text-slate-500">{deal.validLabel}</p>
            <ul className="mt-3 text-xs text-slate-600 list-disc pl-5 space-y-1">
              {deal.terms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                trackEvent('booking_request', { source: 'deals', deal_id: deal.id });
                navigateToAppPage(deal.ctaPage);
              }}
              className="mt-4 rounded-xl bg-orange-600 text-white px-4 py-2.5 text-sm font-semibold"
            >
              Enquire now
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export const ReferralsPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [result, setResult] = useState<{ code: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Refer a friend | ${SITE_NAME}`;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || window.location.hash.match(/ref=([^&]+)/)?.[1];
    if (ref) {
      void fetch(`${apiBase()}/api/v1/referrals/${encodeURIComponent(ref)}/click`, { method: 'POST' }).catch(
        () => undefined
      );
    }
  }, []);

  const onCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase()}/api/v1/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerName: form.name,
          referrerEmail: form.email,
          referrerPhone: form.phone,
          note: form.note,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to create referral');
      setResult({ code: data.referral.code });
      trackEvent('booking_request', { source: 'referral_create' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = result
    ? `${window.location.origin}${window.location.pathname}#/referrals?ref=${result.code}`
    : '';

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-2 text-orange-300 text-sm font-semibold">
            <Gift className="h-4 w-4" /> Referrals
          </div>
          <h1 className="mt-2 text-3xl font-bold">Refer travellers to Synergy</h1>
          <p className="mt-3 text-slate-300">
            Create a personal referral code to share. Rewards policy will follow Synergy Rewards launch — tracking starts
            now.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Your name *"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5"
          />
          <input
            placeholder="Phone / WhatsApp"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5"
          />
          <input
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void onCreate()}
            className="sm:col-span-2 rounded-xl bg-orange-600 text-white py-3 font-semibold disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create referral code'}
          </button>
        </div>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        {result && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
            <div className="font-bold">Your code: {result.code}</div>
            <p className="mt-2 break-all">{shareUrl}</p>
            <button
              type="button"
              className="mt-3 rounded-xl bg-emerald-700 text-white px-4 py-2 font-semibold"
              onClick={() => void navigator.clipboard?.writeText(shareUrl)}
            >
              Copy share link
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Award className="h-5 w-5 text-orange-600" /> {LOYALTY_PROGRAM.name}
          </div>
          <p className="mt-2 text-sm text-slate-600">{LOYALTY_PROGRAM.note}</p>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase">Earn (planned)</p>
          <ul className="mt-1 text-sm list-disc pl-5 text-slate-700">
            {LOYALTY_PROGRAM.earnHints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
