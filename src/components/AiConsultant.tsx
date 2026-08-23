import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { aiConsult } from '../lib/aiApi';
import { trackEvent } from '../lib/analytics';
import BookingEnquiryForm from './BookingEnquiryForm';

const AiConsultant: React.FC = () => {
  const [form, setForm] = useState({
    destination: '',
    origin: '',
    nights: '5',
    style: 'balanced',
    notes: '',
  });
  const [result, setResult] = useState<{
    outline?: string[];
    questionsForQuote?: string[];
    warnings?: string[];
    suggestedEnquiry?: string;
    llmSuggestion?: string | null;
    disclaimer?: string;
    mode?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEnquiry, setShowEnquiry] = useState(false);

  const onAsk = async () => {
    if (!form.destination.trim()) {
      alert('Enter a destination');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await aiConsult({
        destination: form.destination,
        origin: form.origin,
        nights: Number(form.nights) || 5,
        style: form.style,
        notes: form.notes,
      });
      setResult(data);
      setShowEnquiry(true);
      trackEvent('tour_enquiry', { source: 'ai_consultant', destination: form.destination });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI consultant unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-sky-50 p-2 text-sky-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI travel consultant</h2>
          <p className="mt-1 text-sm text-slate-600">
            Planning ideas and quote questions — Synergy humans confirm every itinerary and price. No live fares
            invented.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <label className="text-sm">
          <span className="font-medium text-slate-700">Destination *</span>
          <input
            value={form.destination}
            onChange={(e) => setForm((p) => ({ ...p, destination: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="e.g. Istanbul"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">From</span>
          <input
            value={form.origin}
            onChange={(e) => setForm((p) => ({ ...p, origin: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="e.g. Dubai"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Nights</span>
          <input
            type="number"
            min={1}
            max={21}
            value={form.nights}
            onChange={(e) => setForm((p) => ({ ...p, nights: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Style</span>
          <select
            value={form.style}
            onChange={(e) => setForm((p) => ({ ...p, style: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
          >
            <option value="balanced">Balanced</option>
            <option value="budget">Budget</option>
            <option value="comfort">Comfort</option>
            <option value="luxury">Luxury</option>
            <option value="family">Family</option>
            <option value="adventure">Adventure</option>
          </select>
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Notes</span>
          <input
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="Interests, constraints…"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => void onAsk()}
        className="mt-4 rounded-xl bg-sky-700 hover:bg-sky-800 disabled:opacity-60 text-white px-5 py-3 font-semibold"
      >
        {loading ? 'Thinking…' : 'Get AI planning help'}
      </button>

      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

      {result && (
        <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-950 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide">Mode: {result.mode || 'heuristics'}</p>
          {result.llmSuggestion && (
            <div>
              <div className="font-semibold">AI note</div>
              <p className="whitespace-pre-wrap mt-1">{result.llmSuggestion}</p>
            </div>
          )}
          <div>
            <div className="font-semibold">Outline</div>
            <ul className="list-disc pl-5 mt-1">
              {(result.outline || []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold">Questions before we quote</div>
            <ul className="list-disc pl-5 mt-1">
              {(result.questionsForQuote || []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <ul className="text-xs text-sky-900 space-y-1">
            {(result.warnings || []).map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
          {result.disclaimer && <p className="text-xs">{result.disclaimer}</p>}
        </div>
      )}

      {showEnquiry && result && (
        <div className="mt-5">
          <BookingEnquiryForm
            service="packages"
            heading="Send this plan to Synergy"
            analyticsEvent="tour_enquiry"
            defaultMessage={result.suggestedEnquiry}
            initialValues={{
              origin: form.origin,
              destination: form.destination,
              message: result.suggestedEnquiry,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AiConsultant;
