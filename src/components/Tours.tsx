import React from 'react';
import { MapPin, Clock, Users, Star, Camera, Mountain, Waves, MessageCircle, ExternalLink, BadgePercent, Info } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import { getTourCompareLinks } from '../constants/integrations';
import { CONTACT, getWhatsAppLink } from '../constants/contact';
import { findTripByTitle, navigateToTrip } from '../data/trips';
import { TRIP_IMAGES } from '../data/tripImages';
import TripInquiryForm from './TripInquiryForm';

type TourReference = {
  label: string;
  url: string;
};

type Tour = {
  id: number;
  title: string;
  image: string;
  price: number;
  wasPrice?: number;
  marketRange: string;
  priceNote: string;
  duration: string;
  rating: number;
  location: string;
  type: string;
  icon: React.ReactNode;
  highlights: string[];
  includes: string[];
  references: TourReference[];
};

const Tours: React.FC = () => {
  const { formatPrice } = useCurrency();
  const whatsappLink = getWhatsAppLink('Hi! I want to see all tour options. Can you help?');

  // Prices in USD (site base currency). Updated against 2026 public market listings.
  const domesticTours: Tour[] = [
    {
      id: 1,
      title: 'Golden Triangle Experience',
      image: TRIP_IMAGES.india,
      price: 599,
      wasPrice: 899,
      marketRange: 'Market guide 2026: ~$210–$900 pp depending on hotel tier',
      priceNote: 'From / land only · twin share',
      duration: '6 Days / 5 Nights',
      rating: 4.8,
      location: 'Delhi - Agra - Jaipur',
      type: 'Cultural',
      icon: <Camera className="h-5 w-5" />,
      highlights: ['Taj Mahal sunrise', 'Amber Fort', 'Old Delhi walk', 'Private AC car'],
      includes: ['5 nights 3–4★ hotels', 'Breakfast daily', 'English-speaking guides', 'Monument entries'],
      references: [
        { label: 'Great Tour India cost guide 2026', url: 'https://greattourindia.com/how-much-does-a-golden-triangle-tour-cost-complete-budget-guide-2026/' },
        { label: 'Junegiri Yatra 5N/6D from ₹18,500', url: 'https://junegiriyatra.com/packages/golden-triangle-tour-5n-6d/' },
        { label: 'Explore Golden Triangle from ₹17,477', url: 'https://exploregoldentriangle.com/golden-triangle-india-tour-6-days/' },
      ],
    },
    {
      id: 2,
      title: 'Kerala Backwaters Escape',
      image: TRIP_IMAGES.kerala,
      price: 999,
      wasPrice: 1299,
      marketRange: 'Market guide 2026: ~$750–$1,200 pp for mid-range 8-day packages',
      priceNote: 'From / land only · twin share',
      duration: '8 Days / 7 Nights',
      rating: 4.9,
      location: 'Kochi · Munnar · Thekkady · Alleppey',
      type: 'Nature',
      icon: <Waves className="h-5 w-5" />,
      highlights: ['Overnight houseboat', 'Tea plantations', 'Periyar wildlife', 'Kovalam beach time'],
      includes: ['7 nights stay + houseboat night', 'Daily breakfast', 'Private transfers', 'Sightseeing as itinerary'],
      references: [
        { label: 'TourRadar Kerala 8 Days from $748', url: 'https://www.tourradar.com/t/186599' },
        { label: 'On The Go Tours Captivating Kerala from $1,176', url: 'https://tourhub.co/tour/on-the-go-tours/captivating-kerala-8-days/693-cke' },
        { label: 'Pelago Best of Kerala 8 Days (GBP tiers)', url: 'https://www.pelago.com/en-GB/activity/p4aav5wz5-kerala-package-for-8-days-includes-all-transfer-sightseeing-and-accommodation-kochi/' },
      ],
    },
    {
      id: 3,
      title: 'Himachal Himalayan Adventure',
      image: TRIP_IMAGES.himalayas,
      price: 749,
      wasPrice: 1599,
      marketRange: 'Market guide 2026: ~$400–$850 pp for 10–11 day private circuits',
      priceNote: 'From / land only · twin share',
      duration: '10 Days / 9 Nights',
      rating: 4.7,
      location: 'Shimla · Manali · Dharamshala',
      type: 'Adventure',
      icon: <Mountain className="h-5 w-5" />,
      highlights: ['Hill-station stays', 'Mountain viewpoints', 'Local markets', 'Optional adventure add-ons'],
      includes: ['9 nights hotels', 'Private vehicle', 'Daily breakfast', 'Sightseeing stops'],
      references: [
        { label: 'Pelago Himachal 10 Days ~$752', url: 'https://www.pelago.com/en/activity/pl4rs6v5s-2-days-private-tour-to-shimla-shimla/' },
        { label: 'Pelago Shimla–Manali–Dharamshala ~$661', url: 'https://www.pelago.com/en-US/activity/pe0ekf2q3-complete-himachal-tour-with-atari-border-and-golden-temple-from-chandigarh-chandigarh/' },
        { label: 'UncleSam Himachal Holidays from $670', url: 'https://tourhub.co/tour/unclesam-holidays/himachal-holidays/hh10' },
      ],
    },
  ];

  const internationalTours: Tour[] = [
    {
      id: 4,
      title: 'Southeast Asia Explorer',
      image: TRIP_IMAGES.bangkok,
      price: 1899,
      wasPrice: 2199,
      marketRange: 'Market guide 2026: ~$1,470–$2,300 pp for 14-day Thailand–Cambodia–Vietnam',
      priceNote: 'From / land + regional flights · twin share',
      duration: '14 Days / 13 Nights',
      rating: 4.8,
      location: 'Thailand · Cambodia · Vietnam',
      type: 'Cultural',
      icon: <Camera className="h-5 w-5" />,
      highlights: ['Angkor Wat', 'Bangkok temples', 'Ha Long / Lan Ha Bay', 'Street-food experiences'],
      includes: ['13 nights hotels/cruise nights', 'Selected regional flights', 'Guides & entries', 'Airport transfers'],
      references: [
        { label: 'Vietnam Allure 14 Days from $1,999', url: 'https://vietnamalluretravel.com/tour/thailand-cambodia-vietnam-14-days/' },
        { label: 'TourRadar 14 Days from $2,050', url: 'https://www.tourradar.com/t/299924' },
        { label: 'BestPrice Travel Explorer from $2,069', url: 'https://www.bestpricetravel.com/indochina-tours/vietnam-cambodia-thailand-tours' },
      ],
    },
    {
      id: 5,
      title: 'European Capitals',
      image: TRIP_IMAGES.europe,
      price: 2699,
      wasPrice: 3299,
      marketRange: 'Market guide 2026: ~$1,770–$4,800 pp land-only for London–Paris–Rome style trips',
      priceNote: 'From / land only · twin share · intl flights extra',
      duration: '12 Days / 11 Nights',
      rating: 4.9,
      location: 'London · Paris · Rome',
      type: 'Cultural',
      icon: <Camera className="h-5 w-5" />,
      highlights: ['Iconic city highlights', 'Eurostar / rail & short-haul links', 'Guided landmark visits', 'Free exploration time'],
      includes: ['11 nights 3–4★ hotels', 'Daily breakfast', 'Intercity transfers', 'Selected guided tours'],
      references: [
        { label: 'Indus Travels London–Paris–Rome from $1,769', url: 'https://tourhub.co/tour/indus-travels/london-paris-and-rome-city-package/indtur1333?forceCurr=USD' },
        { label: 'TripCorner 10-Day city package from $2,235', url: 'https://www.tripcorner.com/en_us/idea/54278981/classic-united-kingdom-france-italy' },
        { label: 'Global Holidays mid-range Europe $2,800–$4,800', url: 'https://globalholidays.us/10-days-europe-trip-cost-from-usa/' },
      ],
    },
    {
      id: 6,
      title: 'Australian Outback Safari',
      image: TRIP_IMAGES.australia,
      price: 4299,
      wasPrice: 5200,
      marketRange: 'Market guide 2026: ~£4,100–£7,000+ / ~$4,500–$7,000 pp for 11-day outback safaris',
      priceNote: 'From / land only · twin share · intl flights extra',
      duration: '11 Days / 10 Nights',
      rating: 4.7,
      location: 'Uluru · Alice Springs · Kakadu · Darwin',
      type: 'Adventure',
      icon: <Mountain className="h-5 w-5" />,
      highlights: ['Uluru & Kata Tjuta', 'Kings Canyon', 'Kakadu wetlands cruise', 'Small-group touring'],
      includes: ['10 nights hotels', 'Selected dinners', 'National park entries', 'Expert drive-guide'],
      references: [
        { label: 'Trafalgar Outback Safari from £4,109', url: 'https://www.trafalgar.com/en-gb/tours/outback-safari' },
        { label: 'Freedom Destinations from £4,110', url: 'https://freedomdestinations.co.uk/australia/escorted-tours' },
        { label: 'Kimberley Tours Outback Safari from A$6,998', url: 'https://kimberleystours.com.au/tour/outback-safari/' },
      ],
    },
  ];

  const openTourEnquiry = (tour: Tour) => {
    const trip = findTripByTitle(tour.title);
    if (trip) {
      navigateToTrip(trip.id);
      return;
    }
    document.getElementById('tours-enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const TourCard = ({ tour }: { tour: Tour }) => {
    const saveAmount = tour.wasPrice && tour.wasPrice > tour.price ? tour.wasPrice - tour.price : 0;

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-gray-100 flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <button
            type="button"
            onClick={() => openTourEnquiry(tour)}
            className="absolute inset-0 z-[1]"
            aria-label={`Enquire about ${tour.title}`}
          />
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== TRIP_IMAGES.travel) img.src = TRIP_IMAGES.travel;
            }}
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{tour.rating}</span>
            </div>
          </div>
          {saveAmount > 0 && (
            <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <BadgePercent className="h-3.5 w-3.5" />
              Save {formatPrice(saveAmount)}
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-lg">
            {tour.icon}
            <span className="text-sm">{tour.type}</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-orange-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
            2026 rates
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{tour.location}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">{tour.title}</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {tour.highlights.slice(0, 3).map((item) => (
              <span key={item} className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium">
                {item}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{tour.duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-sm">2–12 people</span>
            </div>
          </div>

          <ul className="text-xs text-gray-600 space-y-1 mb-4">
            {tour.includes.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-end justify-between gap-3 mb-1">
              <div>
                {tour.wasPrice && (
                  <div className="text-sm text-gray-400 line-through">{formatPrice(tour.wasPrice)}</div>
                )}
                <div className="text-2xl font-bold text-gray-900">{formatPrice(tour.price)}</div>
                <div className="text-xs text-gray-500">{tour.priceNote}</div>
              </div>
              <ContactChoice
                variant="orange"
                label="Book Tour"
                subject={`Tour Booking - ${tour.title}`}
                message={`Hi! I'm interested in the ${tour.title} tour (${tour.duration}) from ${formatPrice(tour.price)} per person. Can you confirm availability and inclusions?`}
              />
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openTourEnquiry(tour)}
                className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-sm font-semibold"
              >
                Enquire
              </button>
              <button
                type="button"
                onClick={() => openTourEnquiry(tour)}
                className="w-full rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 py-2.5 text-sm font-semibold"
              >
                View Details / Cart
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 flex items-start gap-1">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>{tour.marketRange}</span>
            </p>
          </div>

          <div className="mt-auto space-y-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Price references</p>
              <div className="flex flex-col gap-1">
                {tour.references.map((ref) => (
                  <a
                    key={ref.url}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    <span className="underline-offset-2 hover:underline">{ref.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <ContactLinksRow
              subject={`Tour Enquiry - ${tour.title}`}
              message={`Hi! I'm interested in the ${tour.title} tour. Can you provide more details?`}
            />
            <CompareLinks
              compact
              title="Compare similar trips"
              links={getTourCompareLinks(tour.location, tour.title)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            2026 market-checked prices · land packages
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Updated India and worldwide tour prices aligned with current public market rates —
            competitive “from” pricing, clear inclusions, and open references so visitors can verify value.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 mb-8">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Tour Enquiry"
              message="Hi! I would like personalized tour recommendations based on your 2026 packages. Can you help?"
            />
            <div className="text-gray-600 text-sm">
              WhatsApp {CONTACT.phone} or email for a live quote
            </div>
          </div>
        </div>

        {/* India / Regional Tours */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">India Tours</h3>
              <p className="text-sm text-gray-500 mt-1">
                Popular heritage & nature circuits — priced below previous list rates using 2026 mid-range benchmarks.
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:text-orange-700 flex items-center space-x-1"
            >
              <span>Ask about all India tours</span>
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domesticTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>

        {/* International Tours */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">International Tours</h3>
              <p className="text-sm text-gray-500 mt-1">
                Southeast Asia, Europe & Australia — Australia raised to realistic safari market levels; Europe & Asia sharpened for value.
              </p>
            </div>
            <a
              href={`${whatsappLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:text-orange-700 flex items-center space-x-1"
            >
              <span>Ask about worldwide tours</span>
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internationalTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>

        {/* Enquiry form for all tours */}
        <div id="tours-enquiry" className="mt-14 scroll-mt-32">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Tour Enquiry</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ask about Southeast Asia, Europe, Australia, or India tours — we reply on WhatsApp or Email.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <TripInquiryForm
              defaultTripName="International tour enquiry"
              heading="You can send your enquiry via the form below"
            />
          </div>
        </div>

        {/* Pricing transparency */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">How these prices were set</h3>
          <p className="text-sm text-gray-600 mb-4">
            Guide “from” prices are land packages (unless noted), per person, twin share, in USD before currency conversion.
            They sit in the competitive mid-range of publicly listed 2026 operator rates — attractive for conversion, but not unrealistically low.
            Final quotes vary by season, hotel category, group size, and flights.
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              <strong>India:</strong> Golden Triangle mid-range commonly ~₹18k–₹35k locally; Kerala mid-range ~$750–$1,200; Himachal private circuits ~$400–$850.
            </li>
            <li>
              <strong>Southeast Asia:</strong> 14-day Thailand–Cambodia–Vietnam packages commonly ~$1,470–$2,300.
            </li>
            <li>
              <strong>Europe:</strong> London–Paris–Rome land packages commonly ~$1,770–$4,800 depending on inclusions.
            </li>
            <li>
              <strong>Australia Outback:</strong> 11-day safaris commonly from ~£4,100 / A$6,998 land-only — our previous $2,899 listing was too low to be credible, so it was corrected upward.
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Want a custom quote against live market rates?</h3>
            <p className="text-orange-100 mb-6">
              Tell us your dates and hotel preference — we’ll match or beat comparable public packages where possible.
            </p>
            <div className="flex justify-center">
              <ContactChoice
                variant="green"
                label="Request Custom Tour"
                subject="Custom Tour Package"
                message="Hi! I need a custom tour package with a competitive 2026 quote. Can you help me plan my trip?"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tours;
