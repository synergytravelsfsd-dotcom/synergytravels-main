import type { FlightSearchInput, HotelSearchInput, TravelProvider, TravelSearchResult } from '../types';
import { getKayakAffiliateId } from '../config';
import { getKayakFlightsUrl, getBookingHotelsUrl } from '../../constants/integrations';

/**
 * KAYAK adapter — deeplinks only until Affiliate Network credentials are approved.
 * Never fabricates prices.
 */
export const kayakProvider: TravelProvider = {
  id: 'kayak',
  name: 'KAYAK',
  async searchFlights(input: FlightSearchInput): Promise<TravelSearchResult> {
    const affiliate = getKayakAffiliateId();
    let href = getKayakFlightsUrl({
      from: input.origin,
      to: input.destination,
      departure: input.departDate,
      returnDate: input.returnDate,
      passengers: input.adults + (input.children || 0) + (input.infants || 0),
      tripType:
        input.tripType === 'multicity'
          ? 'multicity'
          : input.tripType === 'roundtrip'
            ? 'roundtrip'
            : 'oneway',
      segments: input.segments,
    });
    if (affiliate) {
      href += (href.includes('?') ? '&' : '?') + `a=${encodeURIComponent(affiliate)}`;
    }
    return {
      mode: 'deeplink',
      offers: [],
      deeplinks: [{ id: 'kayak', label: 'Open on KAYAK', href }],
      message:
        'KAYAK inventory opens on KAYAK. Synergy can still book for you if you prefer personal assistance.',
    };
  },
  async searchHotels(input: HotelSearchInput): Promise<TravelSearchResult> {
    // Until KAYAK hotels affiliate deeplink docs are wired, fall back to Booking browse link
    const href = getBookingHotelsUrl(
      input.destination,
      input.checkIn,
      input.checkOut,
      String(input.guests)
    );
    return {
      mode: 'deeplink',
      offers: [],
      deeplinks: [{ id: 'hotels-browse', label: 'Browse hotels', href }],
      message: 'Hotel partner browse link ready. Or request Synergy to arrange your stay.',
    };
  },
};
