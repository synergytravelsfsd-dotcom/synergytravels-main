/**
 * Travel provider configuration — secrets stay server-side.
 * Frontend only reads public flags / affiliate IDs intended for deeplinks.
 */
export type TravelProviderId = 'synergy' | 'kayak' | 'skyscanner' | 'demo';

export function isTravelDemoMode(): boolean {
  return String(import.meta.env.VITE_TRAVEL_DEMO_MODE || '').toLowerCase() === 'true';
}

export function getTravelProvider(): TravelProviderId {
  const raw = String(import.meta.env.VITE_TRAVEL_PROVIDER || 'synergy').toLowerCase();
  if (raw === 'kayak' || raw === 'skyscanner' || raw === 'demo' || raw === 'synergy') {
    return raw;
  }
  return 'synergy';
}

/** Public affiliate / partner IDs only — never API secrets */
export function getKayakAffiliateId(): string {
  return String(import.meta.env.VITE_KAYAK_AFFILIATE_ID || '').trim();
}

export function getSkyscannerAffiliateId(): string {
  return String(import.meta.env.VITE_SKYSCANNER_AFFILIATE_ID || '').trim();
}

export function isProviderApiConfigured(): boolean {
  // Real inventory APIs are not connected yet. Deeplinks may still be used.
  return String(import.meta.env.VITE_TRAVEL_PROVIDER_LIVE || '').toLowerCase() === 'true';
}

export const TRAVEL_LOCATION = {
  town: 'Dubai',
  region: 'Dubai',
  country: 'United Arab Emirates',
  label: 'Dubai, United Arab Emirates',
} as const;
