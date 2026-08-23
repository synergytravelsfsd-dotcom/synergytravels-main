import React, { useState } from 'react';
import {
  Plane,
  Hotel,
  Map,
  CreditCard,
  Shield,
  Car,
  MessageCircle,
  Search,
  ExternalLink,
} from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';
import BookingEnquiryForm from './BookingEnquiryForm';
import { searchFlights, searchHotels } from '../travel/TravelSearchService';
import type { CabinClass, TripType, TravelSearchResult } from '../travel/types';
import { navigateToAppPage } from '../constants/pages';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';
import { TRAVEL_LOCATION } from '../travel/config';

type TabId = 'flights' | 'hotels' | 'tours' | 'visa' | 'transfers' | 'insurance';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'flights', label: 'Flights', icon: <Plane className="h-4 w-4" /> },
  { id: 'hotels', label: 'Hotels', icon: <Hotel className="h-4 w-4" /> },
  { id: 'tours', label: 'Tours', icon: <Map className="h-4 w-4" /> },
  { id: 'visa', label: 'Visa Services', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'transfers', label: 'Transfers', icon: <Car className="h-4 w-4" /> },
  { id: 'insurance', label: 'Travel Insurance', icon: <Shield className="h-4 w-4" /> },
];

const ConversionHome: React.FC = () => {
  const [tab, setTab] = useState<TabId>('flights');
  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>('economy');
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [result, setResult] = useState<TravelSearchResult | null>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSearchFlights = async () => {
    if (!origin.trim() || !destination.trim() || !departDate) {
      alert('Please enter from, to and departure date.');
      return;
    }
    setLoading(true);
    trackEvent('flight_search', { origin, destination });
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
      setShowEnquiry(true);
    } finally {
      setLoading(false);
    }
  };

  const onSearchHotels = async () => {
    if (!destination.trim() || !hotelCheckIn || !hotelCheckOut) {
      alert('Please enter destination, check-in and check-out.');
      return;
    }
    setLoading(true);
    trackEvent('hotel_enquiry', { destination });
    try {
      const res = await searchHotels({
        destination,
        checkIn: hotelCheckIn,
        checkOut: hotelCheckOut,
        guests,
        rooms,
      });
      setResult(res);
      setShowEnquiry(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePrimary = () => {
    if (tab === 'flights') return onSearchFlights();
    if (tab === 'hotels') return onSearchHotels();
    if (tab === 'tours') {
      trackEvent('tour_enquiry');
      navigateToAppPage('tours');
      return;
    }
    if (tab === 'visa') {
      trackEvent('visa_enquiry');
      navigateToAppPage('visa');
      return;
    }
    if (tab === 'transfers') {
      trackEvent('booking_request', { source: 'home_transfers' });
      setShowEnquiry(true);
      return;
    }
    trackEvent('insurance_enquiry');
    navigateToAppPage('insurance');
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.28),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(14,165,233,0.18),_transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <p className="text-orange-300 font-semibold tracking-wide text-sm sm:text-base">
              SYNERGY TRAVELS &amp; TOURS
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Where do you want to go?
            </h1>
            <p className="mt-4 text-base sm:text-xl text-slate-300">
              Flights, hotels, holidays, visas and travel support — search, enquire, and book with Synergy.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex gap-1 overflow-x-auto p-2 border-b border-white/10 scrollbar-none">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setResult(null);
                    setShowEnquiry(false);
                  }}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold tap-target ${
                    tab === t.id ? 'bg-orange-500 text-white' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6 bg-white text-slate-900">
              {tab === 'flights' && (
                <>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {(['roundtrip', 'oneway'] as TripType[]).map((tt) => (
                      <button
                        key={tt}
                        type="button"
                        onClick={() => setTripType(tt)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                          tripType === tt
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tt === 'roundtrip' ? 'Round-trip' : 'One-way'}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    <LocationAutocomplete label="From" value={origin} onChange={setOrigin} placeholder="City or airport" />
                    <LocationAutocomplete label="To" value={destination} onChange={setDestination} placeholder="City or airport" />
                    <label className="block text-sm">
                      <span className="font-medium text-slate-700">Departure date</span>
                      <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                    </label>
                    {tripType === 'roundtrip' && (
                      <label className="block text-sm">
                        <span className="font-medium text-slate-700">Return date</span>
                        <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                      </label>
                    )}
                    <label className="block text-sm">
                      <span className="font-medium text-slate-700">Travellers</span>
                      <input type="number" min={1} value={travellers} onChange={(e) => setTravellers(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                    </label>
                    <label className="block text-sm">
                      <span className="font-medium text-slate-700">Cabin class</span>
                      <select value={cabin} onChange={(e) => setCabin(e.target.value as CabinClass)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5">
                        <option value="economy">Economy</option>
                        <option value="premium">Premium Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {tab === 'hotels' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium text-slate-700">Destination</span>
                    <input value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" placeholder="City or hotel area" />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Check-in</span>
                    <input type="date" value={hotelCheckIn} onChange={(e) => setHotelCheckIn(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Check-out</span>
                    <input type="date" value={hotelCheckOut} onChange={(e) => setHotelCheckOut(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm">
                      <span className="font-medium text-slate-700">Guests</span>
                      <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                    </label>
                    <label className="block text-sm">
                      <span className="font-medium text-slate-700">Rooms</span>
                      <input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value) || 1)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 sm:py-2.5" />
                    </label>
                  </div>
                </div>
              )}

              {(tab === 'tours' || tab === 'visa' || tab === 'transfers' || tab === 'insurance') && (
                <p className="text-slate-600 text-sm sm:text-base mb-2">
                  {tab === 'tours' && 'Explore holiday packages and request a tailored itinerary from Synergy.'}
                  {tab === 'visa' && 'Get document preparation support and application guidance — no immigration guarantees.'}
                  {tab === 'transfers' && 'Request airport transfers and ground transport — our team will confirm options and pricing.'}
                  {tab === 'insurance' && 'Request travel insurance options through Synergy. Prices shown only when an authorised provider is connected.'}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePrimary}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-3.5 font-semibold disabled:opacity-60 tap-target"
                >
                  <Search className="h-5 w-5" />
                  {tab === 'flights' && 'Search Flights'}
                  {tab === 'hotels' && 'Search Hotels'}
                  {tab === 'tours' && 'Explore Tours'}
                  {tab === 'visa' && 'Visa Assistance'}
                  {tab === 'transfers' && 'Request Transfer'}
                  {tab === 'insurance' && 'Request Insurance'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEnquiry(true);
                    trackEvent('booking_request', { source: 'home_secondary' });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-200 text-orange-700 hover:bg-orange-50 px-5 py-3.5 font-semibold tap-target"
                >
                  Request Booking Assistance
                </button>
                <a
                  href={getWhatsAppLink('Hi Synergy Travels, I would like help planning my trip.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { context: 'home_hero' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 font-semibold tap-target"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </div>

              {result && (
                <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                  <p>{result.message}</p>
                  {result.deeplinks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.deeplinks.map((d) => (
                        <a
                          key={d.id}
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent('affiliate_click', { provider: d.id })}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100"
                        >
                          {d.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showEnquiry && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10 pb-8">
          <BookingEnquiryForm
            service={
              tab === 'visa'
                ? 'visa'
                : tab === 'insurance'
                  ? 'insurance'
                  : tab === 'hotels'
                    ? 'hotels'
                    : tab === 'tours'
                      ? 'tours'
                      : tab === 'transfers'
                        ? 'transfers'
                        : 'flights'
            }
            showFlightFields={tab === 'flights'}
            showHotelFields={tab === 'hotels'}
            analyticsEvent={
              tab === 'visa'
                ? 'visa_enquiry'
                : tab === 'hotels'
                  ? 'hotel_enquiry'
                  : tab === 'tours'
                    ? 'tour_enquiry'
                    : tab === 'insurance'
                      ? 'insurance_enquiry'
                      : 'booking_request'
            }
          />
        </section>
      )}

      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What can we help you with?</h2>
            <p className="mt-3 text-slate-600">
              Synergy Travels &amp; Tour — based in {TRAVEL_LOCATION.label}. Request a quote; we follow up on
              WhatsApp, phone or email.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Flights', text: 'Search routes and request a Synergy flight quote.', page: 'flights', cta: 'Search Flights' },
              { title: 'Hotels', text: 'Tell us dates and city — we arrange stays.', page: 'hotels', cta: 'Find Hotels' },
              { title: 'Holiday Packages', text: 'Curated tours and tailor-made itineraries.', page: 'packages', cta: 'Plan My Trip' },
              { title: 'Visa Assistance', text: 'Document preparation and application guidance.', page: 'visa', cta: 'Apply for Visa' },
              { title: 'Airport Transfers', text: 'Request transfers and ground support.', page: 'cars', cta: 'Get a Quote' },
              { title: 'Travel Insurance', text: 'Ask for cover options for your trip.', page: 'insurance', cta: 'Get a Quote' },
              { title: 'Corporate Travel', text: 'Business travel support for teams.', page: 'corporate', cta: 'Get a Quote' },
              { title: 'Umrah / Religious Travel', text: 'Umrah and Hajj package assistance.', page: 'umrah', cta: 'Get a Quote' },
              { title: 'Car Rental', text: 'Request car hire for your destination.', page: 'cars', cta: 'Get a Quote' },
              { title: 'Cruises', text: 'Enquire about cruise holidays.', page: 'cruises', cta: 'Get a Quote' },
              { title: 'Family Holidays', text: 'Family-friendly packages and planning.', page: 'tours', cta: 'Plan My Trip' },
              { title: 'WhatsApp Us', text: 'Chat with our team for fast answers.', page: 'contact', cta: 'WhatsApp Us' },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigateToAppPage(item.page)}
                className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-orange-600">{item.cta} →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Why Synergy?</h2>
          <p className="mt-3 text-slate-600 max-w-3xl">
            Professional travel assistance for flights, hotels, packages and visa guidance — with human
            support on WhatsApp. We do not invent awards, certifications or live fares; quotes are
            confirmed by our team.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-6 text-sm text-slate-700">
            <div>
              <h3 className="font-bold text-slate-900">Trusted support</h3>
              <p className="mt-1">Speak with Synergy consultants before you pay.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Clear next steps</h3>
              <p className="mt-1">Search → enquire → quote → book with guidance.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Based in {TRAVEL_LOCATION.town}</h3>
              <p className="mt-1">{TRAVEL_LOCATION.label}</p>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={getWhatsAppLink('Hi Synergy, I would like a quote.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { context: 'home_why' })}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
            <button
              type="button"
              onClick={() => navigateToAppPage('contact')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConversionHome;
