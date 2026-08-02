/** Deep-link helpers for live prices and relevant booking/comparison sites */

const pad = (n: number) => n.toString().padStart(2, '0');

export function formatSkyDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date.replace(/-/g, '').slice(2);
  return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export function extractAirportCode(value: string): string {
  const match = value?.match(/\(([^)]+)\)/);
  return (match?.[1] || value || '').toUpperCase().trim();
}

export function extractCityName(value: string): string {
  if (!value) return '';
  return value.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

export type FlightSegment = {
  from: string;
  to: string;
  date: string;
};

export type FlightSearchParams = {
  from: string;
  to: string;
  departure: string;
  returnDate?: string;
  passengers?: string | number;
  tripType?: string;
  segments?: FlightSegment[];
};

export function getValidSegments(params: FlightSearchParams): FlightSegment[] {
  if (params.tripType === 'multicity' && params.segments?.length) {
    return params.segments.filter(
      (seg) => extractAirportCode(seg.from) && extractAirportCode(seg.to) && seg.date
    );
  }
  if (params.from && params.to && params.departure) {
    return [{ from: params.from, to: params.to, date: params.departure }];
  }
  return [];
}

export function formatMultiCityRoute(segments: FlightSegment[]): string {
  if (!segments.length) return '';
  const codes = [extractAirportCode(segments[0].from)];
  segments.forEach((seg) => codes.push(extractAirportCode(seg.to)));
  return codes.filter(Boolean).join(' → ');
}

export function getGoogleFlightsSearchUrl(params: FlightSearchParams): string {
  const adults = Number(params.passengers) || 1;

  if (params.tripType === 'multicity') {
    const segments = getValidSegments(params);
    if (segments.length >= 2) {
      const parts = segments.map((seg, index) => {
        const from = extractAirportCode(seg.from);
        const to = extractAirportCode(seg.to);
        return index === 0
          ? `Flights from ${from} to ${to} on ${seg.date}`
          : `then ${from} to ${to} on ${seg.date}`;
      });
      if (adults > 1) parts.push(`for ${adults} adults`);
      return `https://www.google.com/travel/flights?q=${encodeURIComponent(parts.join(' '))}&hl=en&curr=GBP`;
    }
  }

  const from = extractAirportCode(params.from);
  const to = extractAirportCode(params.to);
  const parts = [`Flights to ${to} from ${from}`];
  if (params.departure) parts.push(`on ${params.departure}`);
  if (params.returnDate && params.tripType === 'roundtrip') parts.push(`returning ${params.returnDate}`);
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(parts.join(' '))}&hl=en&curr=GBP`;
}

export function getSkyscannerFlightsUrl(params: FlightSearchParams): string {
  const adults = Number(params.passengers) || 1;

  if (params.tripType === 'multicity') {
    const segments = getValidSegments(params);
    if (segments.length >= 2) {
      // Skyscanner multi-city deep links vary; search query opens comparable multi-city results.
      const query = formatMultiCityRoute(segments);
      return `https://www.skyscanner.net/?adults=${adults}&cabinclass=economy&rtn=0&preferdirects=false&oym=1&q=${encodeURIComponent(
        `Multi-city flights ${query} ${segments.map((s) => s.date).join(' ')}`
      )}`;
    }
  }

  const from = extractAirportCode(params.from).toLowerCase();
  const to = extractAirportCode(params.to).toLowerCase();
  const out = formatSkyDate(params.departure);
  const ret =
    params.returnDate && params.tripType === 'roundtrip' ? formatSkyDate(params.returnDate) : '';
  const path = ret
    ? `https://www.skyscanner.net/transport/flights/${from}/${to}/${out}/${ret}/`
    : `https://www.skyscanner.net/transport/flights/${from}/${to}/${out}/`;
  return `${path}?adults=${adults}&adultsv2=${adults}&cabinclass=economy&rtn=${ret ? 1 : 0}&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`;
}

export function getKayakFlightsUrl(params: FlightSearchParams): string {
  const adults = Number(params.passengers) || 1;

  if (params.tripType === 'multicity') {
    const segments = getValidSegments(params);
    if (segments.length >= 2) {
      const path = segments
        .map((seg) => `${extractAirportCode(seg.from)}-${extractAirportCode(seg.to)}/${seg.date}`)
        .join('/');
      return `https://www.kayak.com/flights/${path}?sort=bestflight_a&adults=${adults}`;
    }
  }

  const from = extractAirportCode(params.from);
  const to = extractAirportCode(params.to);
  const segment =
    params.returnDate && params.tripType === 'roundtrip'
      ? `${from}-${to}/${params.departure}/${params.returnDate}`
      : `${from}-${to}/${params.departure}`;
  return `https://www.kayak.com/flights/${segment}?sort=bestflight_a&adults=${adults}`;
}

export function getGoogleTravelUrl(query: string): string {
  return `https://www.google.com/travel/search?q=${encodeURIComponent(query)}&hl=en`;
}

export function getGoogleHotelsUrl(destination: string, checkIn?: string, checkOut?: string): string {
  let url = `https://www.google.com/travel/hotels/${encodeURIComponent(destination)}`;
  const params = new URLSearchParams();
  if (checkIn) params.set('checkin', checkIn);
  if (checkOut) params.set('checkout', checkOut);
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export function getBookingHotelsUrl(destination: string, checkIn?: string, checkOut?: string, guests = '2'): string {
  const params = new URLSearchParams({
    ss: destination,
    group_adults: guests,
    no_rooms: '1',
  });
  if (checkIn) params.set('checkin', checkIn);
  if (checkOut) params.set('checkout', checkOut);
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

export function getTripadvisorUrl(query: string): string {
  return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query)}`;
}

export function getGetYourGuideUrl(query: string): string {
  return `https://www.getyourguide.com/s/?q=${encodeURIComponent(query)}`;
}

export function getExpediaUrl(query: string): string {
  return `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(query)}`;
}

/** Visa / immigration official resources by country code or name */
export function getVisaResourceUrl(country: string): string {
  const key = country.toLowerCase();
  const map: Record<string, string> = {
    'united states': 'https://travel.state.gov/content/travel/en/us-visas.html',
    usa: 'https://travel.state.gov/content/travel/en/us-visas.html',
    us: 'https://travel.state.gov/content/travel/en/us-visas.html',
    'united kingdom': 'https://www.gov.uk/browse/visas-immigration',
    uk: 'https://www.gov.uk/browse/visas-immigration',
    canada: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
    australia: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder',
    germany: 'https://www.auswaertiges-amt.de/en/visa-service',
    japan: 'https://www.mofa.go.jp/j_info/visit/visa/index.html',
    'saudi arabia': 'https://visa.visitsaudi.com/',
    saudi: 'https://visa.visitsaudi.com/',
    makkah: 'https://visa.visitsaudi.com/',
    uae: 'https://u.ae/en/information-and-services/visa-and-emirates-id',
    dubai: 'https://u.ae/en/information-and-services/visa-and-emirates-id',
    azerbaijan: 'https://evisa.gov.az/en/',
    baku: 'https://evisa.gov.az/en/',
    thailand: 'https://www.thaievisa.go.th/',
    malaysia: 'https://malaysiavisa.imi.gov.my/',
    schengen: 'https://www.schengenvisainfo.com/',
    france: 'https://france-visas.gouv.fr/en/web/france-visas/',
    italy: 'https://vistoperitalia.esteri.it/home/en',
    spain: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visa.aspx',
  };

  for (const [name, url] of Object.entries(map)) {
    if (key.includes(name)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(country + ' visa requirements official')}`;
}

export function getUkVisasUrl(): string {
  return 'https://www.gov.uk/browse/visas-immigration';
}

export function getCorporateTravelUrl(type: 'flights' | 'hotels' | 'meetings' | 'general' = 'general'): string {
  switch (type) {
    case 'flights':
      return 'https://www.google.com/travel/flights?hl=en';
    case 'hotels':
      return 'https://www.booking.com/business.html';
    case 'meetings':
      return 'https://www.google.com/travel/hotels?q=conference%20hotels';
    default:
      return 'https://www.expedia.com/lp/b/corporate-travel';
  }
}

export type CompareLink = {
  id: string;
  label: string;
  href: string;
  accent: string;
};

export function getFlightCompareLinks(params: FlightSearchParams): CompareLink[] {
  const isMulti = params.tripType === 'multicity';
  const segments = getValidSegments(params);
  const ready = isMulti
    ? segments.length >= 2
    : Boolean(params.from && params.to && params.departure);

  if (!ready) return [];

  return [
    {
      id: 'google-flights',
      label: isMulti ? 'Google Multi-city' : 'Google Flights',
      href: getGoogleFlightsSearchUrl(params),
      accent: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
    {
      id: 'skyscanner',
      label: isMulti ? 'Skyscanner Multi-city' : 'Skyscanner',
      href: getSkyscannerFlightsUrl(params),
      accent: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200',
    },
    {
      id: 'kayak',
      label: isMulti ? 'Kayak Multi-city' : 'Kayak',
      href: getKayakFlightsUrl(params),
      accent: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
    },
  ];
}

export function getTourCompareLinks(destination: string, title?: string): CompareLink[] {
  const query = title ? `${title} ${destination}` : `${destination} tours packages`;
  return [
    {
      id: 'google',
      label: 'Google Travel',
      href: getGoogleTravelUrl(query),
      accent: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
    {
      id: 'tripadvisor',
      label: 'Tripadvisor',
      href: getTripadvisorUrl(query),
      accent: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    },
    {
      id: 'getyourguide',
      label: 'GetYourGuide',
      href: getGetYourGuideUrl(destination),
      accent: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200',
    },
  ];
}

export function getHotelCompareLinks(
  destination: string,
  checkIn?: string,
  checkOut?: string,
  guests = '2'
): CompareLink[] {
  return [
    {
      id: 'google-hotels',
      label: 'Google Hotels',
      href: getGoogleHotelsUrl(destination, checkIn, checkOut),
      accent: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
    {
      id: 'booking',
      label: 'Booking.com',
      href: getBookingHotelsUrl(destination, checkIn, checkOut, guests),
      accent: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
    },
    {
      id: 'expedia',
      label: 'Expedia',
      href: getExpediaUrl(destination),
      accent: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
    },
  ];
}

export function getVisaCompareLinks(country: string): CompareLink[] {
  return [
    {
      id: 'official',
      label: 'Official Visa Site',
      href: getVisaResourceUrl(country),
      accent: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    },
    {
      id: 'google',
      label: 'Google Search',
      href: `https://www.google.com/search?q=${encodeURIComponent(country + ' visa requirements')}`,
      accent: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
    {
      id: 'uk-gov',
      label: 'UK Gov Visas',
      href: getUkVisasUrl(),
      accent: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
    },
  ];
}

export function getCorporateCompareLinks(): CompareLink[] {
  return [
    {
      id: 'expedia-biz',
      label: 'Expedia Corporate',
      href: getCorporateTravelUrl('general'),
      accent: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
    },
    {
      id: 'booking-biz',
      label: 'Booking Business',
      href: getCorporateTravelUrl('hotels'),
      accent: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
    },
    {
      id: 'google-flights',
      label: 'Google Flights',
      href: getCorporateTravelUrl('flights'),
      accent: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
  ];
}
