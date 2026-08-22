import { getTravelProvider, isTravelDemoMode, isProviderApiConfigured } from './config';
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

/**
 * Unified travel search entry point.
 * Production default: enquiry + optional partner deeplinks.
 * Demo mode may surface mock offers only when VITE_TRAVEL_DEMO_MODE=true.
 */
export async function searchFlights(input: FlightSearchInput): Promise<TravelSearchResult> {
  if (isProviderApiConfigured()) {
    // Placeholder for future authorised live API wiring
    return getActiveTravelProvider().searchFlights(input);
  }
  if (isTravelDemoMode()) {
    const result = await synergyProvider.searchFlights(input);
    return {
      ...result,
      mode: 'demo',
      message:
        'DEMO MODE: mock inventory is for development only and must never be shown as live prices to customers.',
    };
  }
  // Always include Synergy enquiry path; merge partner deeplinks from synergy adapter
  return synergyProvider.searchFlights(input);
}

export async function searchHotels(input: HotelSearchInput): Promise<TravelSearchResult> {
  if (isProviderApiConfigured()) {
    return getActiveTravelProvider().searchHotels(input);
  }
  return synergyProvider.searchHotels(input);
}

export async function searchCars(input: CarSearchInput): Promise<TravelSearchResult> {
  if (getActiveTravelProvider().searchCars) {
    return getActiveTravelProvider().searchCars!(input);
  }
  return synergyProvider.searchCars!(input);
}

export { synergyProvider, kayakProvider, skyscannerProvider };
