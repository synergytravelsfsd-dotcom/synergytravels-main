import { TRIP_IMAGES } from './tripImages';

export type TripItineraryDay = {
  day: number;
  title: string;
  activities: string[];
};

export type TripFaq = {
  question: string;
  answer: string;
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  image: string;
  gallery?: string[];
  price: number;
  duration: string;
  days: number;
  nights: number;
  rating: number;
  location: string;
  category: 'package' | 'umrah' | 'tour' | 'adventure';
  description: string;
  highlights: string[];
  includes: string[];
  excludes?: string[];
  itinerary: TripItineraryDay[];
  faqs: TripFaq[];
  tripCode: string;
};

const defaultFaqs = (title: string): TripFaq[] => [
  {
    question: 'What is included in the package?',
    answer: `Inclusions for ${title} are listed on the Cost tab. Exact hotels and flights are confirmed at booking based on availability.`,
  },
  {
    question: 'Are visas included?',
    answer: 'Visa support is available on request. Some packages include visa processing — we will confirm this when you enquire or checkout.',
  },
  {
    question: 'Can I customise dates or hotels?',
    answer: 'Yes. Share your preferred travel dates and hotel tier on the enquiry form or at checkout and our team will tailor the itinerary.',
  },
  {
    question: 'How do I confirm booking?',
    answer: 'Add the trip to your cart, complete checkout details, then confirm via WhatsApp or Email. Our consultants finalise live fares and issue vouchers.',
  },
];

function parseDuration(duration: string): { days: number; nights: number } {
  const dayMatch = duration.match(/(\d+)\s*Days?/i);
  const nightMatch = duration.match(/(\d+)\s*Nights?/i);
  const days = dayMatch ? Number(dayMatch[1]) : 7;
  const nights = nightMatch ? Number(nightMatch[1]) : Math.max(days - 1, 0);
  return { days, nights };
}

function buildItinerary(days: number, location: string, highlights: string[]): TripItineraryDay[] {
  const items: TripItineraryDay[] = [];
  for (let d = 1; d <= days; d += 1) {
    if (d === 1) {
      items.push({
        day: d,
        title: `Arrival in ${location.split(/[·,-]/)[0].trim()}`,
        activities: [
          'Airport welcome & private transfer',
          'Hotel check-in and rest',
          'Orientation briefing with local coordinator',
          'Overnight at hotel',
        ],
      });
    } else if (d === days) {
      items.push({
        day: d,
        title: 'Departure',
        activities: [
          'Breakfast at hotel',
          'Check-out and transfer to airport',
          'Departure flight — end of tour',
        ],
      });
    } else {
      const highlight = highlights[(d - 2) % highlights.length] || 'Guided sightseeing';
      items.push({
        day: d,
        title: `Explore · ${highlight}`,
        activities: [
          'Breakfast at hotel',
          `${highlight} experience`,
          'Free time for local shopping / leisure',
          'Overnight at hotel',
        ],
      });
    }
  }
  return items;
}

type TripSeed = {
  id: string;
  title: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  location: string;
  category: Trip['category'];
  description: string;
  highlights: string[];
  includes?: string[];
  excludes?: string[];
  tripCode: string;
};

function toTrip(seed: TripSeed): Trip {
  const { days, nights } = parseDuration(seed.duration);
  const includes =
    seed.includes ||
    [
      'Accommodation as per itinerary',
      'Daily breakfast',
      'Airport transfers',
      'Sightseeing as listed in highlights',
      'English-speaking assistance',
      ...seed.highlights.slice(0, 2),
    ];

  return {
    id: seed.id,
    slug: seed.id,
    title: seed.title,
    image: seed.image,
    gallery: [seed.image],
    price: seed.price,
    duration: seed.duration,
    days,
    nights,
    rating: seed.rating,
    location: seed.location,
    category: seed.category,
    description: seed.description,
    highlights: seed.highlights,
    includes,
    excludes: seed.excludes || [
      'International flights (unless stated)',
      'Personal expenses & tips',
      'Travel insurance',
      'Meals not mentioned',
    ],
    itinerary: buildItinerary(days, seed.location, seed.highlights),
    faqs: defaultFaqs(seed.title),
    tripCode: seed.tripCode,
  };
}

const seeds: TripSeed[] = [
  {
    id: 'pkg-maldives',
    title: 'Tropical Paradise - Maldives',
    image: TRIP_IMAGES.maldives,
    price: 2499,
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    location: 'Maldives',
    category: 'package',
    description: 'Luxury overwater bungalows with pristine beaches and crystal-clear waters.',
    highlights: ['Overwater Villa', 'All Meals Included', 'Spa & Wellness', 'Water Sports'],
    includes: ['Overwater villa stay', 'All meals', 'Airport speedboat transfers', 'Spa credit', 'Snorkelling session'],
    tripCode: 'STT-MLD-01',
  },
  {
    id: 'pkg-europe',
    title: 'European Grand Tour',
    image: TRIP_IMAGES.europe,
    price: 3299,
    duration: '14 Days / 13 Nights',
    rating: 4.8,
    location: 'Europe',
    category: 'package',
    description: 'Explore iconic cities across Europe including Paris, Rome, and Barcelona.',
    highlights: ['Multi-City Tour', 'Cultural Experiences', 'Historic Sites', 'Local Cuisine'],
    tripCode: 'STT-EUR-01',
  },
  {
    id: 'pkg-himalayas',
    title: 'Adventure in Himalayas',
    image: TRIP_IMAGES.himalayas,
    price: 1899,
    duration: '10 Days / 9 Nights',
    rating: 4.7,
    location: 'Nepal',
    category: 'package',
    description: 'Trekking adventure through the majestic Himalayan mountains.',
    highlights: ['Mountain Trekking', 'Base Camp Visit', 'Local Culture', 'Adventure Sports'],
    tripCode: 'STT-NPL-01',
  },
  {
    id: 'pkg-kenya',
    title: 'Safari Adventure Kenya',
    image: TRIP_IMAGES.kenya,
    price: 2799,
    duration: '8 Days / 7 Nights',
    rating: 4.9,
    location: 'Kenya',
    category: 'package',
    description: 'Experience the wild beauty of African safari with luxury accommodations.',
    highlights: ['Game Drives', 'Luxury Lodges', 'Wildlife Photography', 'Cultural Tours'],
    tripCode: 'STT-KEN-01',
  },
  {
    id: 'pkg-paris',
    title: 'Romantic Paris Getaway',
    image: TRIP_IMAGES.paris,
    price: 1999,
    duration: '5 Days / 4 Nights',
    rating: 4.8,
    location: 'France',
    category: 'package',
    description: 'Perfect honeymoon package with romantic experiences in the City of Love.',
    highlights: ['Eiffel Tower', 'Seine River Cruise', 'Fine Dining', 'Couples Spa'],
    tripCode: 'STT-PAR-01',
  },
  {
    id: 'pkg-india-spiritual',
    title: 'Spiritual India Journey',
    image: TRIP_IMAGES.india,
    price: 1299,
    duration: '12 Days / 11 Nights',
    rating: 4.6,
    location: 'India',
    category: 'package',
    description: 'Discover spiritual India with visits to sacred temples and holy cities.',
    highlights: ['Temple Visits', 'Yoga & Meditation', 'Cultural Immersion', 'Spiritual Guides'],
    tripCode: 'STT-IND-01',
  },
  {
    id: 'umrah-premium',
    title: 'Premium Umrah Package - Makkah & Madina',
    image: TRIP_IMAGES.makkah,
    price: 2299,
    duration: '14 Days / 13 Nights',
    rating: 4.9,
    location: 'Saudi Arabia',
    category: 'umrah',
    description: 'Complete Umrah pilgrimage with premium accommodations near Haram Sharif and Masjid Nabawi.',
    highlights: ['5-Star Hotels', 'Haram View Rooms', 'Guided Tours', 'VIP Transport'],
    includes: ['5★ hotels near Haram & Masjid Nabawi', 'Guided Umrah rituals', 'VIP transport', 'Ziyarat tours', 'Visa assistance'],
    tripCode: 'STT-UMR-01',
  },
  {
    id: 'umrah-economy',
    title: 'Economy Umrah Package - Makkah & Madina',
    image: TRIP_IMAGES.madinah,
    price: 1599,
    duration: '10 Days / 9 Nights',
    rating: 4.7,
    location: 'Saudi Arabia',
    category: 'umrah',
    description: 'Affordable Umrah package with comfortable accommodations and all essential services.',
    highlights: ['3-Star Hotels', 'Group Transport', 'Religious Guidance', 'Ziyarat Tours'],
    tripCode: 'STT-UMR-02',
  },
  {
    id: 'umrah-luxury',
    title: 'Luxury Umrah Package - Extended Stay',
    image: TRIP_IMAGES.umrahLuxury,
    price: 3499,
    duration: '21 Days / 20 Nights',
    rating: 5.0,
    location: 'Saudi Arabia',
    category: 'umrah',
    description: 'Extended luxury Umrah experience with premium services and comprehensive spiritual guidance.',
    highlights: ['Luxury Hotels', 'Private Transport', 'Personal Guide', 'Extended Ziyarat'],
    tripCode: 'STT-UMR-03',
  },
  {
    id: 'umrah-family',
    title: 'Family Umrah Package - Special Rates',
    image: TRIP_IMAGES.umrahFamily,
    price: 1899,
    duration: '12 Days / 11 Nights',
    rating: 4.8,
    location: 'Saudi Arabia',
    category: 'umrah',
    description: 'Family-friendly Umrah package with special arrangements for children and elderly pilgrims.',
    highlights: ['Family Rooms', 'Child Care', 'Wheelchair Access', 'Family Transport'],
    tripCode: 'STT-UMR-04',
  },
  {
    id: 'tour-golden-triangle',
    title: 'Golden Triangle Experience',
    image: TRIP_IMAGES.india,
    price: 599,
    duration: '6 Days / 5 Nights',
    rating: 4.8,
    location: 'Delhi - Agra - Jaipur',
    category: 'tour',
    description: 'Classic India circuit covering Delhi, Agra and Jaipur with guided sightseeing and comfort stays.',
    highlights: ['Taj Mahal sunrise', 'Amber Fort', 'Old Delhi walk', 'Private AC car'],
    includes: ['5 nights 3–4★ hotels', 'Breakfast daily', 'English-speaking guides', 'Monument entries', 'Private AC car'],
    tripCode: 'STT-GT-01',
  },
  {
    id: 'tour-kerala',
    title: 'Kerala Backwaters Escape',
    image: TRIP_IMAGES.kerala,
    price: 999,
    duration: '8 Days / 7 Nights',
    rating: 4.9,
    location: 'Kochi · Munnar · Thekkady · Alleppey',
    category: 'tour',
    description: 'Tea hills, wildlife and an overnight houseboat through Kerala’s serene backwaters.',
    highlights: ['Overnight houseboat', 'Tea plantations', 'Periyar wildlife', 'Kovalam beach time'],
    tripCode: 'STT-KER-01',
  },
  {
    id: 'tour-himachal',
    title: 'Himachal Himalayan Adventure',
    image: TRIP_IMAGES.himalayas,
    price: 749,
    duration: '10 Days / 9 Nights',
    rating: 4.7,
    location: 'Shimla · Manali · Dharamshala',
    category: 'tour',
    description: 'Hill-station circuit through Shimla, Manali and Dharamshala with mountain viewpoints.',
    highlights: ['Hill-station stays', 'Mountain viewpoints', 'Local markets', 'Optional adventure add-ons'],
    tripCode: 'STT-HIM-01',
  },
  {
    id: 'tour-se-asia',
    title: 'Southeast Asia Explorer',
    image: TRIP_IMAGES.bangkok,
    price: 1899,
    duration: '14 Days / 13 Nights',
    rating: 4.8,
    location: 'Thailand · Cambodia · Vietnam',
    category: 'tour',
    description:
      'Explore Bangkok temples, Angkor Wat, and Vietnam’s bays in one multi-country tour with hotels, guides, and selected regional flights.',
    highlights: ['Angkor Wat', 'Bangkok temples', 'Ha Long / Lan Ha Bay', 'Street-food experiences'],
    includes: [
      '13 nights hotels/cruise nights',
      'Selected regional flights',
      'Guides & monument entries',
      'Airport transfers',
      'Daily breakfast',
    ],
    tripCode: 'STT-SEA-01',
  },
  {
    id: 'tour-europe-capitals',
    title: 'European Capitals',
    image: TRIP_IMAGES.europe,
    price: 2699,
    duration: '12 Days / 11 Nights',
    rating: 4.9,
    location: 'London · Paris · Rome',
    category: 'tour',
    description:
      'Iconic Europe circuit covering London, Paris and Rome with comfort hotels, intercity transfers, and guided landmark visits.',
    highlights: [
      'Iconic city highlights',
      'Eurostar / rail & short-haul links',
      'Guided landmark visits',
      'Free exploration time',
    ],
    includes: [
      '11 nights 3–4★ hotels',
      'Daily breakfast',
      'Intercity transfers',
      'Selected guided tours',
    ],
    tripCode: 'STT-EUR-02',
  },
  {
    id: 'tour-australia-outback',
    title: 'Australian Outback Safari',
    image: TRIP_IMAGES.australia,
    price: 4299,
    duration: '11 Days / 10 Nights',
    rating: 4.7,
    location: 'Uluru · Alice Springs · Kakadu · Darwin',
    category: 'tour',
    description:
      'Small-group outback safari featuring Uluru, Kata Tjuta, Kings Canyon and Kakadu wetlands with expert drive-guides.',
    highlights: ['Uluru & Kata Tjuta', 'Kings Canyon', 'Kakadu wetlands cruise', 'Small-group touring'],
    includes: [
      '10 nights hotels',
      'Selected dinners',
      'National park entries',
      'Expert drive-guide',
    ],
    tripCode: 'STT-AUS-01',
  },
];

export const TRIPS: Trip[] = seeds.map(toTrip);

export function getTripById(id: string): Trip | undefined {
  return TRIPS.find((t) => t.id === id || t.slug === id);
}

export function findTripByTitle(title: string): Trip | undefined {
  const normalized = title.trim().toLowerCase();
  return (
    TRIPS.find((t) => t.title.toLowerCase() === normalized) ||
    TRIPS.find(
      (t) =>
        normalized.includes(t.title.toLowerCase()) ||
        t.title.toLowerCase().includes(normalized)
    )
  );
}

export function getTripsByCategory(category: Trip['category']): Trip[] {
  return TRIPS.filter((t) => t.category === category);
}

/** Map legacy numeric package ids used in older cards */
export const LEGACY_PACKAGE_ID_MAP: Record<number, string> = {
  1: 'pkg-maldives',
  2: 'pkg-europe',
  3: 'pkg-himalayas',
  4: 'pkg-kenya',
  5: 'pkg-paris',
  6: 'pkg-india-spiritual',
  7: 'umrah-premium',
  8: 'umrah-economy',
  9: 'umrah-luxury',
  10: 'umrah-family',
};

export function navigateToTrip(tripId: string) {
  window.dispatchEvent(
    new CustomEvent('navigateToPage', {
      detail: { page: 'trip-detail', tripId },
    })
  );
}

export function navigateToCheckout() {
  window.dispatchEvent(
    new CustomEvent('navigateToPage', {
      detail: { page: 'checkout' },
    })
  );
}
