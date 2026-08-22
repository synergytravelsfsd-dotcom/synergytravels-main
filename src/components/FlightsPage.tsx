import React, { useMemo, useState } from 'react';
import { ExternalLink, MessageCircle, Plus, Search, Trash2 } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';
import BookingEnquiryForm from './BookingEnquiryForm';
import { searchFlights } from '../travel/TravelSearchService';
import type {
  CabinClass,
  FlightSegmentInput,
  TripType,
  TravelSearchResult,
} from '../travel/types';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';

const emptySegment = (): FlightSegmentInput => ({ from: '', to: '', date: '' });

const TRIP_TYPES: { id: TripType; label: string }[] = [
  { id: 'roundtrip', label: 'Round-trip' },
  { id: 'oneway', label: 'One-way' },
  { id: 'multicity', label: 'Multi-city' },
];

const FlightsPage: React.FC = () => {
  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [segments, setSegments] = useState<FlightSegmentInput[]>([
    emptySegment(),
    emptySegment(),
  ]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState<CabinClass>('economy');
  const [result, setResult] = useState<TravelSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const isMulti = tripType === 'multicity';

  const cabinLabel =
    cabin === 'premium'
      ? 'Premium Economy'
      : cabin.charAt(0).toUpperCase() + cabin.slice(1);

  const enquiryDefaults = useMemo(() => {
    if (isMulti) {
      const legs = segments
        .filter((s) => s.from.trim() && s.to.trim() && s.date)
        .map((s, i) => `Leg ${i + 1}: ${s.from} → ${s.to} on ${s.date}`)
        .join('\n');
      return {
        tripType: 'multicity' as const,
        origin: segments[0]?.from || '',
        destination: segments[segments.length - 1]?.to || '',
        departDate: segments[0]?.date || '',
        returnDate: '',
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        cabin: cabinLabel,
        multiCitySummary: legs,
        message: legs
          ? `Please quote multi-city flights:\n${legs}\nAdults: ${adults}, Children: ${children}, Infants: ${infants}, Cabin: ${cabinLabel}.`
          : '',
      };
    }
    return {
      tripType,
      origin,
      destination,
      departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : '',
      adults: String(adults),
      children: String(children),
      infants: String(infants),
      cabin: cabinLabel,
      multiCitySummary: '',
      message:
        origin || destination
          ? `Please quote flights ${origin || '…'} → ${destination || '…'}${departDate ? ` on ${departDate}` : ''}${
              tripType === 'roundtrip' && returnDate ? `, return ${returnDate}` : ''
            }. Adults: ${adults}, Children: ${children}, Infants: ${infants}, Cabin: ${cabinLabel}.`
          : '',
    };
  }, [
    isMulti,
    segments,
    tripType,
    origin,
    destination,
    departDate,
    returnDate,
    adults,
    children,
    infants,
    cabinLabel,
  ]);

  const updateSegment = (index: number, patch: Partial<FlightSegmentInput>) => {
    setSegments((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addSegment = () => {
    if (segments.length >= 6) return;
    const lastTo = segments[segments.length - 1]?.to || '';
    setSegments((prev) => [...prev, { from: lastTo, to: '', date: '' }]);
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 2) return;
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSearch = async () => {
    if (isMulti) {
      const valid = segments.filter((s) => s.from.trim() && s.to.trim() && s.date);
      if (valid.length < 2) {
        alert('Please complete at least two multi-city legs (from, to and date).');
        return;
      }
    } else if (!origin.trim() || !destination.trim() || !departDate) {
      alert('Please enter origin, destination and departure date.');
      return;
    }
    if (adults < 1) {
      alert('At least one adult is required.');
      return;
    }
    if (infants > adults) {
      alert('Infants cannot exceed the number of adults.');
      return;
    }

    setLoading(true);
    trackEvent('flight_search', {
      origin: isMulti ? segments[0]?.from : origin,
      destination: isMulti ? segments[segments.length - 1]?.to : destination,
      tripType,
      page: 'flights',
    });
    try {
      const res = await searchFlights({
        origin: isMulti ? segments[0]?.from || '' : origin,
        destination: isMulti ? segments[segments.length - 1]?.to || '' : destination,
        departDate: isMulti ? segments[0]?.date || '' : departDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        adults,
        children,
        infants,
        cabin,
        tripType,
        segments: isMulti ? segments : undefined,
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const quoteWhatsApp = () => {
    const body =
      enquiryDefaults.message ||
      'Hi Synergy, I need a flight quote.';
    trackEvent('whatsapp_click', { context: 'flights' });
    window.open(getWhatsAppLink(body), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-orange-300 text-sm font-semibold uppercase tracking-wide">Flights</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
            Compare Flights &amp; Book With Synergy Travels
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Search your route, then request a quote from Synergy or open partner comparison sites.
            Live in-page fares appear only when an authorised provider API is connected.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            {TRIP_TYPES.map((tt) => (
              <button
                key={tt.id}
                type="button"
                onClick={() => setTripType(tt.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  tripType === tt.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tt.label}
              </button>
            ))}
          </div>

          {!isMulti ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <LocationAutocomplete label="Origin" value={origin} onChange={setOrigin} />
              <LocationAutocomplete label="Destination" value={destination} onChange={setDestination} />
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Departure</span>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                />
              </label>
              {tripType === 'roundtrip' && (
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Return</span>
                  <input
                    type="date"
                    value={returnDate}
                    min={departDate || undefined}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Flight legs</p>
                <span className="text-xs text-slate-500">{segments.length}/6 legs</span>
              </div>
              {segments.map((segment, index) => (
                <div
                  key={`leg-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3"
                >
                  <div className="lg:col-span-2">
                    <LocationAutocomplete
                      label={`Leg ${index + 1} from`}
                      value={segment.from}
                      onChange={(v) => updateSegment(index, { from: v })}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <LocationAutocomplete
                      label="To"
                      value={segment.to}
                      onChange={(v) => updateSegment(index, { to: v })}
                    />
                  </div>
                  <label className="block text-sm lg:col-span-2">
                    <span className="font-medium text-slate-700">Date</span>
                    <input
                      type="date"
                      value={segment.date}
                      min={index > 0 && segments[index - 1].date ? segments[index - 1].date : undefined}
                      onChange={(e) => updateSegment(index, { date: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
                    />
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={segments.length <= 2}
                      onClick={() => removeSegment(index)}
                      className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40 tap-target"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                disabled={segments.length >= 6}
                onClick={addSegment}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-orange-300 text-orange-700 px-4 py-2.5 text-sm font-semibold hover:bg-orange-50 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add another city
              </button>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Adults (12+)</span>
              <input
                type="number"
                min={1}
                max={9}
                value={adults}
                onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Children (2–11)</span>
              <input
                type="number"
                min={0}
                max={9}
                value={children}
                onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Infants (under 2)</span>
              <input
                type="number"
                min={0}
                max={adults}
                value={infants}
                onChange={(e) => setInfants(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Cabin</span>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value as CabinClass)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Infants travel on an adult’s lap (one infant per adult). Child and infant tickets are
            included in your Synergy quote request.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onSearch}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 font-semibold tap-target"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
            <button
              type="button"
              onClick={quoteWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold tap-target"
            >
              <MessageCircle className="h-5 w-5" />
              Request Flight Quote
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <h2 className="font-bold text-lg">Booking with Synergy</h2>
            <p className="mt-2 text-sm">{result.message}</p>
            {result.deeplinks.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-2">
                  Partner comparison links (opens external sites)
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.deeplinks.map((d) => (
                    <a
                      key={d.id}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('affiliate_click', { provider: d.id })}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm font-semibold hover:bg-amber-100"
                    >
                      {d.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 max-w-3xl">
          <BookingEnquiryForm
            key={JSON.stringify(enquiryDefaults)}
            service="flights"
            heading="Book with Synergy — flight enquiry"
            showFlightFields
            analyticsEvent="booking_request"
            initialValues={enquiryDefaults}
            defaultMessage={enquiryDefaults.message}
          />
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;
