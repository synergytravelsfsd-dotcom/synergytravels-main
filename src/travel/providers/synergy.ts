import type {
  FlightSearchInput,
  HotelSearchInput,
  CarSearchInput,
  TravelProvider,
  TravelSearchResult,
} from '../types';
import {
  getFlightCompareLinks,
  getHotelCompareLinks,
  type FlightSearchParams,
} from '../../constants/integrations';

function toFlightParams(input: FlightSearchInput): FlightSearchParams {
  return {
    from: input.origin,
    to: input.destination,
    departure: input.departDate,
    returnDate: input.returnDate,
    passengers: input.adults + (input.children || 0),
    tripType: input.tripType === 'roundtrip' ? 'roundtrip' : 'oneway',
  };
}

/** Synergy direct booking — enquiry-led, no fake inventory */
export const synergyProvider: TravelProvider = {
  id: 'synergy',
  name: 'Synergy Travels & Tour',
  async searchFlights(input) {
    const deeplinks = getFlightCompareLinks(toFlightParams(input)).map((l) => ({
      id: l.id,
      label: `Compare on ${l.label}`,
      href: l.href,
    }));
    return {
      mode: 'enquiry',
      offers: [],
      deeplinks,
      message:
        'No live flight inventory is connected yet. Request a quote from Synergy Travels, or open a partner comparison site via the links below.',
    } satisfies TravelSearchResult;
  },
  async searchHotels(input) {
    const deeplinks = getHotelCompareLinks(
      input.destination,
      input.checkIn,
      input.checkOut,
      String(input.guests)
    ).map((l) => ({
      id: l.id,
      label: `Browse on ${l.label}`,
      href: l.href,
    }));
    return {
      mode: 'enquiry',
      offers: [],
      deeplinks,
      message:
        'Hotel availability APIs are not connected. Send Synergy a hotel request, or browse partner sites via the links below.',
    };
  },
  async searchCars(input: CarSearchInput) {
    return {
      mode: 'enquiry',
      offers: [],
      deeplinks: [],
      message: `Car hire request ready for ${input.pickup}. Our team will arrange options after your enquiry.`,
    };
  },
};
