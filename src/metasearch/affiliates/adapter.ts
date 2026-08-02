import type { AffiliateOffer, MetaSearchQuery, SearchVertical } from '../types';

/**
 * AffiliateAdapter — production-ready contract.
 * Swap mock implementations for Booking/Expedia/Amadeus/etc. without UI changes.
 */
export interface AffiliateAdapter {
  id: string;
  name: string;
  verticals: SearchVertical[];
  priority: number;
  /** When false, adapter is skipped (missing API keys, geo blocks, etc.) */
  enabled: boolean;
  search(query: MetaSearchQuery): Promise<AffiliateOffer[]>;
}

export type AffiliateClickEvent = {
  providerId: string;
  offerId: string;
  vertical: SearchVertical;
  price: number;
  deepLink: string;
  timestamp: string;
};

const clickLog: AffiliateClickEvent[] = [];

export function trackAffiliateClick(event: Omit<AffiliateClickEvent, 'timestamp'>) {
  const full: AffiliateClickEvent = { ...event, timestamp: new Date().toISOString() };
  clickLog.push(full);
  // Extension point: GA4 / Meta Pixel / affiliate postback
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('affiliateClick', { detail: full }));
  }
  return full;
}

export function getAffiliateClickLog() {
  return [...clickLog];
}
