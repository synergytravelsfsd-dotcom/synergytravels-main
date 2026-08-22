import React, { useState } from 'react';
import { ExternalLink, MessageCircle, Search } from 'lucide-react';
import BookingEnquiryForm from './BookingEnquiryForm';
import { searchHotels } from '../travel/TravelSearchService';
import type { TravelSearchResult } from '../travel/types';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';

const HotelsEnquiryPage: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [result, setResult] = useState<TravelSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    if (!destination.trim() || !checkIn || !checkOut) {
      alert('Please enter destination, check-in and check-out.');
      return;
    }
    setLoading(true);
    trackEvent('hotel_enquiry', { destination });
    try {
      setResult(
        await searchHotels({ destination, checkIn, checkOut, guests, rooms })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Hotels &amp; Stays</h1>
          <p className="mt-3 text-slate-300 max-w-3xl">
            Request hotel arrangements through Synergy Travels. Live availability appears only when an
            authorised hotel API or affiliate feed is connected.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Destination</span>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Check-in</span>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Check-out</span>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Guests</span>
                <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Rooms</span>
                <input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button type="button" disabled={loading} onClick={onSearch} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 font-semibold tap-target">
              <Search className="h-5 w-5" /> Search hotels
            </button>
            <a href={getWhatsAppLink('Hi Synergy, I need hotel options.')} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { context: 'hotels' })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold tap-target">
              <MessageCircle className="h-5 w-5" /> WhatsApp hotel request
            </a>
          </div>
          {result && (
            <div className="mt-4 rounded-xl bg-sky-50 border border-sky-100 p-4 text-sm text-sky-900">
              <p>{result.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.deeplinks.map((d) => (
                  <a key={d.id} href={d.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('affiliate_click', { provider: d.id })} className="inline-flex items-center gap-1 rounded-lg bg-white border border-sky-200 px-3 py-2 text-xs font-semibold">
                    {d.label} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          <BookingEnquiryForm service="hotels" heading="Request hotel arrangement" showHotelFields analyticsEvent="hotel_enquiry" />
        </div>
      </div>
    </div>
  );
};

export default HotelsEnquiryPage;
