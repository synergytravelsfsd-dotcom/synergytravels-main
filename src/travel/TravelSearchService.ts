import { getTravelProvider, isTravelDemoMode } from './config';
import type {
  CarSearchInput,
  FlightSearchInput,
  HotelSearchInput,
  TravelProvider,
  TravelSearchResult,
} from './types';
import { synergyProvider } from './providers/synergy';
import { kayakProvider } from './providers/kayak';
import { skyscannerProvider } from './providers/skyscanner';
import { searchFlightsLiveApi, searchHotelsLiveApi } from './liveClient';

const providers: Record<string, TravelProvider> = {
  synergy: synergyProvider,
  kayak: kayakProvider,
  skyscanner: skyscannerProvider,
};

export function getActiveTravelProvider(): TravelProvider {
  const id = getTravelProvider();
  return providers[id] || synergyProvider;
}

export function listTravelProviders(): TravelProvider[] {
  return [synergyProvider, kayakProvider, skyscannerProvider];
}

function wantsLiveAttempt(): boolean {
  return String(import.meta.env.VITE_TRAVEL_PROVIDER_LIVE || '').toLowerCase() === 'true';
}

function mergeEnquiry(
  live: TravelSearchResult | null,
  fallback: TravelSearchResult
): TravelSearchResult {
  if (!live) return fallback;
  // Only treat as live inventory when offers are marked live and mode is live
  const liveOffers = (live.offers || []).filter((o) => o.isLiveInventory);
  if (live.mode === 'live' && liveOffers.length > 0) {
    return {
      mode: 'live',
      offers: liveOffers,
      deeplinks: [...(live.deeplinks || []), ...fallback.deeplinks],
      message: live.message,
    };
  }
  return {
    ...fallback,
    message: [live.message, fallback.message].filter(Boolean).join(' '),
    deeplinks: fallback.deeplinks.length ? fallback.deeplinks : live.deeplinks || [],
  };
}

/**
 * Unified travel search entry point.
 * Production default: enquiry + optional partner deeplinks.
 * Live path only surfaces offers when the server returns authorised inventory.
 */
export async function searchFlights(input: FlightSearchInput): Promise<TravelSearchResult> {
  const fallback = await synergyProvider.searchFlights(input);

  if (wantsLiveAttempt()) {
    const live = await searchFlightsLiveApi(input);
    return mergeEnquiry(live, fallback);
  }

  if (isTravelDemoMode()) {
    return {
      ...fallback,
      mode: 'demo',
      message:
        'DEMO MODE: mock inventory is for development only and must never be shown as live prices to customers. ' +
        fallback.message,
    };
  }

  const active = getActiveTravelProvider();
  if (active.id !== 'synergy') {
    const partner = await active.searchFlights(input);
    return {
      mode: partner.mode || 'deeplink',
      offers: [],
      deeplinks: [...fallback.deeplinks, ...(partner.deeplinks || [])],
      message: partner.message || fallback.message,
    };
  }

  return fallback;
}

export async function searchHotels(input: HotelSearchInput): Promise<TravelSearchResult> {
  const fallback = await synergyProvider.searchHotels(input);
  if (wantsLiveAttempt()) {
    const live = await searchHotelsLiveApi(input);
    return mergeEnquiry(live, fallback);
  }
  const active = getActiveTravelProvider();
  if (active.id !== 'synergy') {
    const partner = await active.searchHotels(input);
    return {
      mode: partner.mode || 'deeplink',
      offers: [],
      deeplinks: [...fallback.deeplinks, ...(partner.deeplinks || [])],
      message: partner.message || fallback.message,
    };
  }
  return fallback;
}

export async function searchCars(input: CarSearchInput): Promise<TravelSearchResult> {
  if (getActiveTravelProvider().searchCars) {
    return getActiveTravelProvider().searchCars!(input);
  }
  return synergyProvider.searchCars!(input);
}

export { synergyProvider, kayakProvider, skyscannerProvider };
