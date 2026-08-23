/**
 * Holiday / package builder scaffold (Phase 3).
 * Composes enquiry payloads — does not invent package prices.
 */
import { createHolidayDraft, type HolidayDraftInput } from './liveClient';
import { synergyProvider } from './providers/synergy';
import type { TravelSearchResult } from './types';

export type HolidayPackageDraft = {
  id: string;
  destination: string;
  nights: number;
  enquiryPayload: Record<string, string>;
  message: string;
  pricedTotal: number | null;
  components: Record<string, { status: string; summary: string }>;
  partnerHints?: TravelSearchResult;
};

export async function buildHolidayPackage(input: HolidayDraftInput): Promise<HolidayPackageDraft> {
  const draft = await createHolidayDraft(input);

  // Partner deeplinks for context only — not live package inventory
  let partnerHints: TravelSearchResult | undefined;
  try {
    if (input.origin && input.departDate) {
      partnerHints = await synergyProvider.searchFlights({
        origin: input.origin,
        destination: input.destination,
        departDate: input.departDate,
        returnDate: undefined,
        adults: input.adults || 2,
        children: input.children || 0,
        cabin: 'economy',
        tripType: 'roundtrip',
      });
    }
  } catch {
    /* ignore */
  }

  return {
    ...draft,
    pricedTotal: null,
    partnerHints,
  };
}
