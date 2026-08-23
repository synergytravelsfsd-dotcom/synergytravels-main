import React, { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, MessageCircle } from 'lucide-react';
import {
  acceptPublicQuote,
  createQuoteBankIntent,
  fetchPublicQuote,
} from '../lib/leadsApi';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';

type QuotePublicProps = {
  token: string;
};

type PublicQuote = {
  id: string;
  publicToken: string;
  status: string;
  currency: string;
  sellTotal: number;
  depositAmount: number;
  validUntil?: string | null;
  title: string;
  summary: string;
  lineItems: Array<{ label: string; quantity?: number; unitSell?: number }>;
  paymentReference?: string | null;
};

const QuotePublic: React.FC<QuotePublicProps> = ({ token }) => {
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [payRef, setPayRef] = useState<{
    reference: string;
    amount: string;
    currency: string;
    instructions: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchPublicQuote(token);
        if (!cancelled) {
          setQuote(data.quote as PublicQuote);
          trackEvent('page_view', { page: 'quote', quote_id: data.quote?.id });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Quote unavailable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onAccept = async () => {
    setBusy(true);
    try {
      const data = await acceptPublicQuote(token);
      setQuote(data.quote as PublicQuote);
      if (data.payment) {
        setPayRef({
          reference: data.payment.reference,
          amount: String(data.payment.amount),
          currency: data.payment.currency,
          instructions: data.payment.instructions,
        });
      }
      trackEvent('booking_request', { source: 'quote_accept', quote_id: data.quote?.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not accept quote');
    } finally {
      setBusy(false);
    }
  };

  const onPayDeposit = async () => {
    setBusy(true);
    try {
      const data = await createQuoteBankIntent(token, false);
      setPayRef({
        reference: data.reference,
        amount: data.amount,
        currency: data.currency,
        instructions: data.instructions,
      });
      trackEvent('booking_request', { source: 'quote_pay', quote_id: quote?.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not create payment reference');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-600">Loading quote…</div>
    );
  }

  if (error || !quote) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Quote unavailable</h1>
        <p className="mt-2 text-slate-600">{error || 'This link may be invalid or expired.'}</p>
      </div>
    );
  }

  const money = (n: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: quote.currency || 'GBP',
    }).format(n);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-orange-300 text-sm font-semibold tracking-wide">SYNERGY TRAVELS &amp; TOUR</p>
          <h1 className="mt-2 text-3xl font-bold">{quote.title}</h1>
          <p className="mt-2 text-slate-300 text-sm">
            Quote {quote.id} · Status {quote.status}
            {quote.validUntil ? ` · Valid until ${new Date(quote.validUntil).toLocaleDateString()}` : ''}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          {quote.summary && <p className="text-slate-700 whitespace-pre-wrap">{quote.summary}</p>}
          <div className="mt-4 divide-y divide-slate-100">
            {(quote.lineItems || []).map((li, i) => (
              <div key={i} className="py-3 flex justify-between gap-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-900">{li.label}</div>
                  <div className="text-slate-500">Qty {li.quantity || 1}</div>
                </div>
                <div className="font-semibold">{money((li.unitSell || 0) * (li.quantity || 1))}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4 flex flex-wrap justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-2xl font-bold text-slate-900">{money(quote.sellTotal)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Suggested deposit</div>
              <div className="text-xl font-bold text-orange-600">{money(quote.depositAmount)}</div>
            </div>
          </div>
        </div>

        {payRef && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h2 className="font-bold text-emerald-900">Payment reference ready</h2>
                <p className="text-sm text-emerald-800 mt-1">{payRef.instructions}</p>
                <p className="mt-3 font-mono text-lg font-bold text-emerald-950">{payRef.reference}</p>
                <p className="text-sm text-emerald-800">
                  Amount: {payRef.amount} {payRef.currency}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {['SENT', 'VIEWED', 'DRAFT'].includes(quote.status) && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onAccept()}
              className="flex-1 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white py-3 font-semibold"
            >
              Accept quote
            </button>
          )}
          {['ACCEPTED', 'PAYMENT_PENDING', 'VIEWED', 'SENT'].includes(quote.status) && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onPayDeposit()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-3 font-semibold disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" /> Pay deposit (bank)
            </button>
          )}
          <a
            href={getWhatsAppLink(
              `Hi Synergy, regarding quote ${quote.id} (${quote.title}) — I have a question.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white py-3 font-semibold"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuotePublic;
