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
  const passengers =
    input.adults + (input.children || 0) + (input.infants || 0);
  if (input.tripType === 'multicity' && input.segments?.length) {
    return {
      from: input.segments[0]?.from || input.origin,
      to: input.segments[input.segments.length - 1]?.to || input.destination,
      departure: input.segments[0]?.date || input.departDate,
      passengers,
      tripType: 'multicity',
      segments: input.segments,
    };
  }
  return {
    from: input.origin,
    to: input.destination,
    departure: input.departDate,
    returnDate: input.returnDate,
    passengers,
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
    const pax = [
      `${input.adults} adult${input.adults === 1 ? '' : 's'}`,
      input.children ? `${input.children} child${input.children === 1 ? '' : 'ren'}` : null,
      input.infants ? `${input.infants} infant${input.infants === 1 ? '' : 's'}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    return {
      mode: 'enquiry',
      offers: [],
      deeplinks,
      message: `No live flight inventory is connected yet. Request a quote for ${pax} from Synergy Travels, or open a partner comparison site via the links below.`,
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
