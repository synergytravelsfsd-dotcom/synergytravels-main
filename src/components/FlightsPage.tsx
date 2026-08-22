import React, { useState } from 'react';
import { ExternalLink, MessageCircle, Search } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';
import BookingEnquiryForm from './BookingEnquiryForm';
import { searchFlights } from '../travel/TravelSearchService';
import type { CabinClass, TripType, TravelSearchResult } from '../travel/types';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';

const FlightsPage: React.FC = () => {
  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>('economy');
  const [result, setResult] = useState<TravelSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    if (!origin.trim() || !destination.trim() || !departDate) {
      alert('Please enter origin, destination and departure date.');
      return;
    }
    setLoading(true);
    trackEvent('flight_search', { origin, destination, page: 'flights' });
    try {
      const res = await searchFlights({
        origin,
        destination,
        departDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        adults: travellers,
        cabin,
        tripType,
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
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
            {(['roundtrip', 'oneway'] as TripType[]).map((tt) => (
              <button
                key={tt}
                type="button"
                onClick={() => setTripType(tt)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  tripType === tt ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tt === 'roundtrip' ? 'Round-trip' : 'One-way'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <LocationAutocomplete label="Origin" value={origin} onChange={setOrigin} />
            <LocationAutocomplete label="Destination" value={destination} onChange={setDestination} />
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Departure</span>
              <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            {tripType === 'roundtrip' && (
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Return</span>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
              </label>
            )}
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Travellers</span>
              <input type="number" min={1} value={travellers} onChange={(e) => setTravellers(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Cabin</span>
              <select value={cabin} onChange={(e) => setCabin(e.target.value as CabinClass)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </label>
          </div>
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
            <a
              href={getWhatsAppLink('Hi Synergy, I need a flight quote.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { context: 'flights' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold tap-target"
            >
              <MessageCircle className="h-5 w-5" />
              Request Flight Quote
            </a>
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
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white border border-amber-200 px-3 py-1 font-semibold">Book With Synergy</span>
              <span className="rounded-full bg-white border border-amber-200 px-3 py-1 font-semibold">Request Assistance</span>
              <span className="rounded-full bg-white border border-amber-200 px-3 py-1 font-semibold">View Deal → partner site</span>
            </div>
          </div>
        )}

        <div className="mt-8 max-w-3xl">
          <BookingEnquiryForm
            service="flights"
            heading="Book with Synergy — flight enquiry"
            showFlightFields
            analyticsEvent="booking_request"
            defaultMessage={
              origin || destination
                ? `Please quote flights ${origin || '…'} → ${destination || '…'}${departDate ? ` on ${departDate}` : ''}.`
                : ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;
