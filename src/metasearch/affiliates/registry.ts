import type { AffiliateAdapter } from './adapter';
import { createMockAdapter } from './mockFactory';
import type { MetaSearchQuery, SearchVertical } from '../types';
import { isTravelDemoMode } from '../../travel/config';

/**
 * Affiliate registry — real adapters plug in here later.
 * Mock adapters only run when VITE_TRAVEL_DEMO_MODE=true.
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
    id: 'synergy',
    name: 'Synergy Travels & Tour',
    verticals: ['packages', 'visa', 'umrah', 'hajj', 'corporate', 'insurance', 'cruises'],
    priority: 1,
    priceBias: 1.0,
  }),
];

export function adaptersFor(vertical: SearchVertical): AffiliateAdapter[] {
  return affiliateRegistry
    .filter((a) => a.verticals.includes(vertical))
    .sort((a, b) => a.priority - b.priority);
}

export async function searchAllAffiliates(query: MetaSearchQuery) {
  if (!isTravelDemoMode()) {
    // Production: never emit mock priced inventory
    return [];
  }
  const adapters = adaptersFor(query.vertical);
  const batches = await Promise.all(adapters.map((a) => a.search(query)));
  return batches.flat();
}
