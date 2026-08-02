import type { AffiliateAdapter } from './adapter';
import type {
  AffiliateOffer,
  FlightOffer,
  HotelOffer,
  SearchVertical,
} from '../types';
import { getAffiliateDeepLink } from './deepLinks';

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function jitter(seed: number, min: number, max: number) {
  const r = (Math.sin(seed) + 1) / 2;
  return Math.round(min + r * (max - min));
}

const AIRLINES = [
  'Emirates',
  'Qatar Airways',
  'Turkish Airlines',
  'Etihad',
  'PIA',
  'FlyDubai',
  'Air Arabia',
  'Pegasus',
];

export function createMockAdapter(config: {
  id: string;
  name: string;
  verticals: SearchVertical[];
  priority: number;
  priceBias?: number;
}): AffiliateAdapter {
  const bias = config.priceBias ?? 1;

  return {
    id: config.id,
    name: config.name,
    verticals: config.verticals,
    priority: config.priority,
    enabled: true,
    async search(query) {
      // Simulate network latency of a real affiliate API
      await new Promise((r) => setTimeout(r, 180 + (hashSeed(config.id) % 220)));

      if (!config.verticals.includes(query.vertical)) return [];

      const seed = hashSeed(`${config.id}:${query.destination}:${query.departDate}:${query.vertical}`);

      if (query.vertical === 'flights') {
        return Array.from({ length: 3 }).map((_, i) => {
          const base = jitter(seed + i * 17, 280, 980) * bias;
          const stops = (seed + i) % 3 === 0 ? 0 : (seed + i) % 2;
          const airline = AIRLINES[(seed + i) % AIRLINES.length];
          const offer: FlightOffer = {
            id: `${config.id}-f-${i}`,
            providerId: config.id,
            providerName: config.name,
            title: `${query.origin || 'Your city'} → ${query.destination}`,
            subtitle: `${airline} · ${stops === 0 ? 'Direct' : `${stops} stop`}`,
            price: Math.round(base * (query.adults + query.children * 0.7)),
            currency: 'USD',
            taxesIncluded: true,
            cancellation: i % 2 === 0 ? 'Flexible fare available' : 'Standard fare',
            rating: 4 + ((seed + i) % 10) / 20,
            dealBadge: i === 0 ? 'Best deal' : undefined,
            deepLink: getAffiliateDeepLink(config.id, query, `${config.id}-f-${i}`),
            airline,
            duration: `${5 + ((seed + i) % 10)}h ${((seed + i * 3) % 50)}m`,
            stops,
            departTime: `${6 + ((seed + i) % 12)}:${String((seed + i * 7) % 60).padStart(2, '0')}`,
            arriveTime: `${12 + ((seed + i) % 10)}:${String((seed + i * 5) % 60).padStart(2, '0')}`,
            refundable: i % 2 === 0,
            carbonKg: 120 + ((seed + i) % 180),
            direct: stops === 0,
            meta: { cabin: query.cabin || 'economy' },
          };
          return offer;
        });
      }

      if (query.vertical === 'hotels' || query.vertical === 'umrah' || query.vertical === 'hajj') {
        return Array.from({ length: 3 }).map((_, i) => {
          const base = jitter(seed + i * 11, 55, 320) * bias;
          const offer: HotelOffer = {
            id: `${config.id}-h-${i}`,
            providerId: config.id,
            providerName: config.name,
            title: `${query.destination} ${['Central', 'Boutique', 'Resort', 'Business'][i % 4]} Stay`,
            subtitle: `${3 + (i % 3)}★ · ${query.destination}`,
            price: Math.round(base),
            currency: 'USD',
            taxesIncluded: i % 2 === 0,
            cancellation: i === 0 ? 'Free cancellation' : 'Non-refundable deal',
            breakfast: i % 2 === 0,
            rating: 3.8 + ((seed + i) % 12) / 10,
            reviews: 200 + ((seed + i * 13) % 4000),
            distance: `${0.3 + i * 0.7} km from centre`,
            dealBadge: i === 1 ? 'Member price' : undefined,
            coupon: i === 0 ? 'SAVE8' : undefined,
            deepLink: getAffiliateDeepLink(config.id, query, `${config.id}-h-${i}`),
            stars: 3 + (i % 3),
            amenities: ['WiFi', 'Breakfast', 'Pool', 'Parking'].slice(0, 2 + (i % 3)),
            neighborhood: ['Downtown', 'Old Town', 'Airport', 'Beach'][i % 4],
            freeCancellation: i === 0,
          };
          return offer;
        });
      }

      // Generic offers for packages, activities, cars, insurance, visa, corporate, cruises
      return Array.from({ length: 2 }).map((_, i) => {
        const base = jitter(seed + i * 9, 40, 900) * bias;
        const offer: AffiliateOffer = {
          id: `${config.id}-g-${i}`,
          providerId: config.id,
          providerName: config.name,
          title: `${query.destination} · ${query.vertical} option ${i + 1}`,
          subtitle: config.name,
          price: Math.round(base),
          currency: 'USD',
          taxesIncluded: true,
          rating: 4 + ((seed + i) % 10) / 20,
          reviews: 120 + ((seed + i) % 900),
          dealBadge: i === 0 ? 'Top pick' : undefined,
          deepLink: getAffiliateDeepLink(config.id, query, `${config.id}-g-${i}`),
          cancellation: 'Free cancellation within 24h on selected options',
        };
        return offer;
      });
    },
  };
}
