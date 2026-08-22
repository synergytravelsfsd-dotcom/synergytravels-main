import type { FlightSearchInput, HotelSearchInput, TravelProvider, TravelSearchResult } from '../types';
import { getSkyscannerAffiliateId } from '../config';
import { getSkyscannerFlightsUrl, getGoogleHotelsUrl } from '../../constants/integrations';

/**
 * Skyscanner adapter — deeplinks only. No scraping. No fake API calls.
 */
export const skyscannerProvider: TravelProvider = {
  id: 'skyscanner',
  name: 'Skyscanner',
  async searchFlights(input: FlightSearchInput): Promise<TravelSearchResult> {
    const affiliate = getSkyscannerAffiliateId();
    let href = getSkyscannerFlightsUrl({
      from: input.origin,
      to: input.destination,
      departure: input.departDate,
      returnDate: input.returnDate,
      passengers: input.adults,
      tripType: input.tripType === 'roundtrip' ? 'roundtrip' : 'oneway',
    });
    if (affiliate) {
      href += (href.includes('?') ? '&' : '?') + `associateid=${encodeURIComponent(affiliate)}`;
    }
    return {
      mode: 'deeplink',
      offers: [],
      deeplinks: [{ id: 'skyscanner', label: 'Open on Skyscanner', href }],
      message:
        'Skyscanner comparison opens on Skyscanner. Request Synergy assistance to book through our team.',
    };
  },
  async searchHotels(input: HotelSearchInput): Promise<TravelSearchResult> {
    const href = getGoogleHotelsUrl(input.destination, input.checkIn, input.checkOut);
    return {
      mode: 'deeplink',
      offers: [],
      deeplinks: [{ id: 'hotels', label: 'Browse hotels', href }],
      message: 'Browse hotels externally, or ask Synergy to arrange accommodation.',
    };
  },
};
