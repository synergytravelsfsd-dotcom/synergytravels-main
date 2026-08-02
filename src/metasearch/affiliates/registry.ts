import type { AffiliateAdapter } from './adapter';
import { createMockAdapter } from './mockFactory';
import type { MetaSearchQuery, SearchVertical } from '../types';

/**
 * Affiliate registry — add real adapters here later:
 * BookingAffiliateAdapter, ExpediaRapidAdapter, AmadeusAdapter, etc.
 */
export const affiliateRegistry: AffiliateAdapter[] = [
  createMockAdapter({
    id: 'booking',
    name: 'Booking.com',
    verticals: ['hotels', 'umrah', 'hajj', 'packages'],
    priority: 10,
    priceBias: 1.02,
  }),
  createMockAdapter({
    id: 'expedia',
    name: 'Expedia',
    verticals: ['hotels', 'flights', 'packages', 'cars', 'activities'],
    priority: 20,
    priceBias: 1.05,
  }),
  createMockAdapter({
    id: 'trip',
    name: 'Trip.com',
    verticals: ['hotels', 'flights', 'packages', 'activities'],
    priority: 25,
    priceBias: 0.98,
  }),
  createMockAdapter({
    id: 'agoda',
    name: 'Agoda',
    verticals: ['hotels', 'umrah'],
    priority: 30,
    priceBias: 0.96,
  }),
  createMockAdapter({
    id: 'hotelscom',
    name: 'Hotels.com',
    verticals: ['hotels'],
    priority: 35,
    priceBias: 1.01,
  }),
  createMockAdapter({
    id: 'airbnb',
    name: 'Airbnb',
    verticals: ['hotels'],
    priority: 40,
    priceBias: 0.94,
  }),
  createMockAdapter({
    id: 'skyscanner',
    name: 'Skyscanner',
    verticals: ['flights'],
    priority: 10,
    priceBias: 0.97,
  }),
  createMockAdapter({
    id: 'kayak',
    name: 'Kayak',
    verticals: ['flights', 'hotels', 'cars'],
    priority: 15,
    priceBias: 1.0,
  }),
  createMockAdapter({
    id: 'google-flights',
    name: 'Google Flights',
    verticals: ['flights'],
    priority: 5,
    priceBias: 0.99,
  }),
  createMockAdapter({
    id: 'kiwi',
    name: 'Kiwi.com',
    verticals: ['flights'],
    priority: 28,
    priceBias: 0.93,
  }),
  createMockAdapter({
    id: 'viator',
    name: 'Viator',
    verticals: ['activities'],
    priority: 10,
    priceBias: 1.04,
  }),
  createMockAdapter({
    id: 'klook',
    name: 'Klook',
    verticals: ['activities'],
    priority: 15,
    priceBias: 1.0,
  }),
  createMockAdapter({
    id: 'getyourguide',
    name: 'GetYourGuide',
    verticals: ['activities'],
    priority: 20,
    priceBias: 1.03,
  }),
  createMockAdapter({
    id: 'hertz',
    name: 'Hertz',
    verticals: ['cars'],
    priority: 10,
    priceBias: 1.08,
  }),
  createMockAdapter({
    id: 'avis',
    name: 'Avis',
    verticals: ['cars'],
    priority: 15,
    priceBias: 1.06,
  }),
  createMockAdapter({
    id: 'synergy',
    name: 'Synergy Travels & Tour',
    verticals: ['packages', 'visa', 'umrah', 'hajj', 'corporate', 'insurance', 'cruises'],
    priority: 1,
    priceBias: 0.95,
  }),
];

export function getAdaptersForVertical(vertical: SearchVertical): AffiliateAdapter[] {
  return affiliateRegistry
    .filter((a) => a.enabled && a.verticals.includes(vertical))
    .sort((a, b) => a.priority - b.priority);
}

export async function searchAllAffiliates(query: MetaSearchQuery) {
  const adapters = getAdaptersForVertical(query.vertical);
  const settled = await Promise.allSettled(adapters.map((a) => a.search(query)));
  return settled.flatMap((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    console.warn(`Adapter failed: ${adapters[index].id}`, result.reason);
    return [];
  });
}
