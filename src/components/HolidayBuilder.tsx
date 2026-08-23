import React, { useState } from 'react';
import { Map, Send } from 'lucide-react';
import { buildHolidayPackage, type HolidayPackageDraft } from '../travel/holidayBuilder';
import BookingEnquiryForm from './BookingEnquiryForm';
import { trackEvent } from '../lib/analytics';

const HolidayBuilder: React.FC = () => {
  const [form, setForm] = useState({
    destination: '',
    origin: '',
    departDate: '',
    nights: '7',
    adults: '2',
    children: '0',
    budget: '',
    style: 'balanced',
  });
  const [draft, setDraft] = useState<HolidayPackageDraft | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const onBuild = async () => {
    if (!form.destination.trim()) {
      alert('Please enter a destination');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await buildHolidayPackage({
        destination: form.destination.trim(),
        origin: form.origin.trim() || undefined,
        departDate: form.departDate || undefined,
        nights: Number(form.nights) || 7,
        adults: Number(form.adults) || 2,
        children: Number(form.children) || 0,
        budget: form.budget.trim() || undefined,
        style: form.style,
      });
      setDraft(result);
      setShowEnquiry(true);
      trackEvent('tour_enquiry', { source: 'holiday_builder', destination: form.destination });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to build holiday draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
          <Map className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Holiday builder</h2>
          <p className="mt-1 text-sm text-slate-600">
            Draft a flight + hotel package for Synergy to quote. Live package prices appear only when
            authorised inventory APIs are connected — we never invent totals.
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
            placeholder="e.g. Dubai"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Flying from</span>
          <input
            value={form.origin}
            onChange={(e) => setForm((p) => ({ ...p, origin: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="e.g. London"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Depart date</span>
          <input
            type="date"
            value={form.departDate}
            onChange={(e) => setForm((p) => ({ ...p, departDate: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Nights</span>
          <input
            type="number"
            min={1}
            max={30}
            value={form.nights}
            onChange={(e) => setForm((p) => ({ ...p, nights: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Adults</span>
          <input
            type="number"
            min={1}
            value={form.adults}
            onChange={(e) => setForm((p) => ({ ...p, adults: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Children</span>
          <input
            type="number"
            min={0}
            value={form.children}
            onChange={(e) => setForm((p) => ({ ...p, children: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Budget guidance</span>
          <input
            value={form.budget}
            onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="Optional"
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
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => void onBuild()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-5 py-3 font-semibold"
      >
        <Send className="h-4 w-4" />
        {loading ? 'Building…' : 'Build holiday draft'}
      </button>

      {error && (
        <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
      )}

      {draft && (
        <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <p className="font-semibold">Draft {draft.id}</p>
          <p className="mt-1">{draft.message}</p>
          <ul className="mt-2 space-y-1">
            {Object.entries(draft.components).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold capitalize">{key}:</span> {value.summary} ({value.status})
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-sky-800">Package total: not priced online (quote required).</p>
        </div>
      )}

      {showEnquiry && draft && (
        <div className="mt-5">
          <BookingEnquiryForm
            service="packages"
            heading="Request this holiday quote"
            analyticsEvent="tour_enquiry"
            defaultMessage={draft.enquiryPayload.message}
            initialValues={{
              origin: form.origin,
              destination: form.destination,
              departDate: form.departDate,
              adults: form.adults,
              children: form.children,
              message: draft.enquiryPayload.message,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HolidayBuilder;
