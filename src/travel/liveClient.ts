/** Client for server travel proxy — never trusts invented live prices */

import type { FlightSearchInput, HotelSearchInput, TravelSearchResult } from './types';

function apiBase(): string {
  const fromEnv = (import.meta.env.VITE_LEADS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const payments = (import.meta.env.VITE_PAYMENTS_API_URL as string | undefined)?.replace(/\/$/, '');
  if (payments) return payments;
  return '';
}

export type TravelProviderStatus = {
  ok: boolean;
  configured: boolean;
  provider: string | null;
  credentialsPresent: boolean;
  liveFlag: boolean;
  message: string;
  adapters?: { flights: boolean; hotels: boolean; packages: boolean };
};

export async function fetchTravelProviderStatus(): Promise<TravelProviderStatus> {
  try {
    const res = await fetch(`${apiBase()}/api/v1/travel/status`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        configured: false,
        provider: null,
        credentialsPresent: false,
        liveFlag: false,
        message: data.error || 'Travel status unavailable',
      };
    }
    return data as TravelProviderStatus;
  } catch {
    return {
      ok: false,
      configured: false,
      provider: null,
      credentialsPresent: false,
      liveFlag: false,
      message: 'Travel API unreachable — using Synergy enquiry path.',
    };
  }
}

export async function searchFlightsLiveApi(input: FlightSearchInput): Promise<TravelSearchResult | null> {
  try {
    const res = await fetch(`${apiBase()}/api/v1/travel/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return {
      mode: data.mode || 'enquiry',
      offers: Array.isArray(data.offers) ? data.offers : [],
      deeplinks: Array.isArray(data.deeplinks) ? data.deeplinks : [],
      message: data.message || '',
    };
  } catch {
    return null;
  }
}

export async function searchHotelsLiveApi(input: HotelSearchInput): Promise<TravelSearchResult | null> {
  try {
    const res = await fetch(`${apiBase()}/api/v1/travel/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return {
      mode: data.mode || 'enquiry',
      offers: Array.isArray(data.offers) ? data.offers : [],
      deeplinks: Array.isArray(data.deeplinks) ? data.deeplinks : [],
      message: data.message || '',
    };
  } catch {
    return null;
  }
}

export type HolidayDraftInput = {
  destination: string;
  nights?: number;
  adults?: number;
  children?: number;
  origin?: string;
  departDate?: string;
  budget?: string;
  style?: string;
};

export async function createHolidayDraft(input: HolidayDraftInput) {
  const res = await fetch(`${apiBase()}/api/v1/travel/holiday-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Unable to create holiday draft');
  return data.draft as {
    id: string;
    destination: string;
    nights: number;
    enquiryPayload: Record<string, string>;
    message: string;
    pricedTotal: null;
    components: Record<string, { status: string; summary: string }>;
  };
}
