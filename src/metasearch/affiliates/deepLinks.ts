import {
  getBookingHotelsUrl,
  getExpediaUrl,
  getGetYourGuideUrl,
  getGoogleFlightsSearchUrl,
  getGoogleHotelsUrl,
  getGoogleTravelUrl,
  getKayakFlightsUrl,
  getSkyscannerFlightsUrl,
  getTripadvisorUrl,
  getVisaResourceUrl,
} from '../../constants/integrations';
import { SYNERGY_BOOK_PAGE } from '../../constants/pages';
import type { MetaSearchQuery } from '../types';

/** Internal book links handled by the SPA (not external) */
export function isInternalDeepLink(url: string): boolean {
  return url.startsWith('internal:');
}

export function parseInternalDeepLink(url: string): string | null {
  if (!isInternalDeepLink(url)) return null;
  return url.slice('internal:'.length) || 'packages';
}

function flightParams(query: MetaSearchQuery) {
  return {
    from: query.origin || 'London',
    to: query.destination || 'Dubai',
    departure: query.departDate || new Date().toISOString().slice(0, 10),
    returnDate: query.returnDate,
    passengers: query.adults + query.children,
    tripType: query.returnDate ? 'roundtrip' : 'oneway',
  };
}

/**
 * Production-safe partner URLs. Mocks reuse these so Book never hits a dead link.
 */
export function getAffiliateDeepLink(
  providerId: string,
  query: MetaSearchQuery,
  _offerId: string
): string {
  const dest = query.destination || 'Dubai';
  const guests = String(Math.max(1, query.adults + query.children));
  const flight = flightParams(query);

  if (providerId === 'synergy') {
    const page = SYNERGY_BOOK_PAGE[query.vertical] || 'packages';
    return `internal:${page}`;
  }

  switch (providerId) {
    case 'google-flights':
      return getGoogleFlightsSearchUrl(flight);
    case 'skyscanner':
      return getSkyscannerFlightsUrl(flight);
    case 'kayak':
      if (query.vertical === 'cars') {
        return `https://www.kayak.com/cars/${encodeURIComponent(dest)}/${query.departDate || ''}`;
      }
      if (query.vertical === 'hotels') {
        return `https://www.kayak.com/hotels/${encodeURIComponent(dest)}/${query.departDate || ''}/${query.returnDate || ''}`;
      }
      return getKayakFlightsUrl(flight);
    case 'booking':
      return getBookingHotelsUrl(dest, query.departDate, query.returnDate, guests);
    case 'expedia':
      if (query.vertical === 'flights') {
        return `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(
          query.origin || 'LON'
        )},to:${encodeURIComponent(dest)}&passengers=adults:${query.adults}`;
      }
      if (query.vertical === 'cars') {
        return `https://www.expedia.com/Cars?locn=${encodeURIComponent(dest)}`;
      }
      if (query.vertical === 'activities') {
        return `https://www.expedia.com/things-to-do/?destination=${encodeURIComponent(dest)}`;
      }
      return getExpediaUrl(dest);
    case 'trip':
      return `https://www.trip.com/hotels/list?city=${encodeURIComponent(dest)}`;
    case 'agoda':
      return `https://www.agoda.com/search?city=${encodeURIComponent(dest)}`;
    case 'hotelscom':
      return `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(dest)}`;
    case 'airbnb':
      return `https://www.airbnb.com/s/${encodeURIComponent(dest)}/homes`;
    case 'kiwi':
      return `https://www.kiwi.com/en/search/results/${encodeURIComponent(
        query.origin || 'london'
      )}/${encodeURIComponent(dest)}`;
    case 'viator':
      return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(dest)}`;
    case 'klook':
      return `https://www.klook.com/search/?query=${encodeURIComponent(dest)}`;
    case 'getyourguide':
      return getGetYourGuideUrl(dest);
    case 'hertz':
      return `https://www.hertz.com/rentacar/reservation/?keyword=${encodeURIComponent(dest)}`;
    case 'avis':
      return `https://www.avis.com/en/reservation?location=${encodeURIComponent(dest)}`;
    default:
      if (query.vertical === 'visa') return getVisaResourceUrl(dest);
      if (query.vertical === 'hotels') return getGoogleHotelsUrl(dest, query.departDate, query.returnDate);
      if (query.vertical === 'activities') return getTripadvisorUrl(`${dest} activities`);
      return getGoogleTravelUrl(`${dest} ${query.vertical}`);
  }
}
