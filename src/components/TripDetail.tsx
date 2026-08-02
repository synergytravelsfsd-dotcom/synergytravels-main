import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react';
import { getTripById } from '../data/trips';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import TripInquiryForm from './TripInquiryForm';
import CompareLinks from './CompareLinks';
import { getTourCompareLinks } from '../constants/integrations';

type TripDetailProps = {
  tripId: string;
  onBack: () => void;
  onCheckout: () => void;
};

type TabId = 'overview' | 'itinerary' | 'cost' | 'faqs' | 'enquiry';

const TripDetail: React.FC<TripDetailProps> = ({ tripId, onBack, onCheckout }) => {
  const trip = getTripById(tripId);
  const { formatPrice } = useCurrency();
  const { addTrip } = useCart();
  const [tab, setTab] = useState<TabId>('enquiry');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [startDate, setStartDate] = useState('');

  const goToEnquiry = () => {
    setTab('enquiry');
    setTimeout(() => {
      document.getElementById('trip-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const compareLinks = useMemo(
    () => (trip ? getTourCompareLinks(trip.location, trip.title) : []),
    [trip]
  );

  if (!trip) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Trip not found</h1>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-orange-600 font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to packages
        </button>
      </section>
    );
  }

  const guideTotal = adults * trip.price + children * Math.round(trip.price * 0.7);

  const handleAddToCart = () => {
    if (!startDate) {
      alert('Please select a start date before adding to cart.');
      return;
    }
    addTrip(trip, { adults, children, startDate });
  };

  const handleBookNow = () => {
    handleAddToCart();
    onCheckout();
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'enquiry', label: 'Enquiry' },
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'cost', label: 'Cost' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <section className="bg-slate-50 min-h-screen pb-16">
      <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-2 text-white/90 text-sm hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-orange-300 text-xs font-semibold tracking-wide uppercase mb-1">
            Trip Details · {trip.tripCode}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-3xl">
            {trip.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/90">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {trip.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {trip.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {trip.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-slate-200">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 sm:px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    tab === t.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {tab === 'enquiry' && (
                <TripInquiryForm
                  trip={trip}
                  heading="You can send your enquiry via the form below"
                  className="border-0 shadow-none p-0"
                />
              )}

              {tab === 'overview' && (
                <div className="space-y-5">
                  <p className="text-gray-700 leading-relaxed">{trip.description}</p>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Highlights</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {trip.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <CompareLinks title="Compare similar trips on" links={compareLinks} />
                  <button
                    type="button"
                    onClick={goToEnquiry}
                    className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 text-sm font-semibold"
                  >
                    Go to Enquiry Form
                  </button>
                </div>
              )}

              {tab === 'itinerary' && (
                <div className="space-y-4">
                  {trip.itinerary.map((day) => (
                    <div key={day.day} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Day {day.day}: {day.title}
                      </h4>
                      <ul className="space-y-1.5">
                        {day.activities.map((a) => (
                          <li key={a} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-orange-500">•</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'cost' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">The cost includes</h3>
                    <ul className="space-y-2">
                      {trip.includes.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Not included</h3>
                    <ul className="space-y-2">
                      {(trip.excludes || []).map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-red-400 mt-0.5">–</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'faqs' && (
                <div className="space-y-3">
                  {trip.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-xl border border-slate-200 bg-white open:bg-orange-50/40"
                    >
                      <summary className="cursor-pointer list-none px-4 py-3 font-medium text-gray-900 flex items-center justify-between">
                        {faq.question}
                        <span className="text-orange-500 group-open:rotate-45 transition-transform text-xl leading-none">
                          +
                        </span>
                      </summary>
                      <p className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>

          {tab !== 'enquiry' && <TripInquiryForm trip={trip} />}
        </div>

        {/* Booking card */}
        <aside className="lg:sticky lg:top-32 h-fit">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-5 sm:p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">From / per adult</p>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(trip.price)}</p>
              <p className="text-xs text-gray-500 mt-1">Guide price · live fare confirmed at booking</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start date *
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="inline h-4 w-4 mr-1" />
                  Adults
                </label>
                <input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-sm flex justify-between">
              <span className="text-gray-600">Estimated total</span>
              <span className="font-semibold text-gray-900">{formatPrice(guideTotal)}</span>
            </div>

            <button
              type="button"
              onClick={goToEnquiry}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold transition-colors"
            >
              Send Enquiry Form
            </button>
            <button
              type="button"
              onClick={handleBookNow}
              className="w-full rounded-lg bg-orange-600 hover:bg-orange-700 text-white py-3 font-semibold transition-colors"
            >
              Book Now · Checkout
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-lg border-2 border-orange-200 text-orange-700 hover:bg-orange-50 py-3 font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            <p className="text-xs text-center text-gray-500">
              No online card charge yet — confirm booking with our team via WhatsApp or Email at checkout.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default TripDetail;
