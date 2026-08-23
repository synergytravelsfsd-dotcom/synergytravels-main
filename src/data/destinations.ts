/** Curated destination content for Phase 6 SEO — unique, useful, no invented fares */

export type DestinationGuide = {
  slug: string;
  name: string;
  country: string;
  region: string;
  headline: string;
  summary: string;
  bestTime: string;
  flightsNote: string;
  hotelsNote: string;
  packagesNote: string;
  attractions: string[];
  visaNote: string;
  faqs: Array<{ q: string; a: string }>;
  tips: string[];
  ctaService: 'flights' | 'hotels' | 'packages' | 'visa' | 'umrah';
};

export const DESTINATIONS: DestinationGuide[] = [
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    headline: 'Dubai holidays, flights and stays with Synergy',
    summary:
      'Dubai combines modern skyline experiences, desert landscapes and family attractions. Synergy helps with flights, hotels and tailored packages from our Dubai base.',
    bestTime: 'November to March for milder weather; summer is hotter with indoor attractions.',
    flightsNote:
      'Request flight options into DXB or DWC. We quote after checking current supplier availability — no invented live fares on this page.',
    hotelsNote:
      'Tell us dates, area preference (Marina, Downtown, JBR, Palm) and budget band for hotel arrangements.',
    packagesNote:
      'City + desert combinations and family itineraries can be drafted via our holiday builder, then quoted by the team.',
    attractions: ['Burj Khalifa area', 'Dubai Marina & JBR', 'Desert safari experiences', 'Old Dubai souks', 'Museum of the Future (check opening)'],
    visaNote:
      'Visa rules depend on passport nationality and stay purpose. Synergy provides document guidance only — we do not grant visas.',
    faqs: [
      {
        q: 'Can Synergy book Dubai hotels and flights together?',
        a: 'Yes — send dates and travellers via enquiry or the holiday builder. We confirm options before payment.',
      },
      {
        q: 'Do you show live Dubai flight prices here?',
        a: 'No. Prices are confirmed in a Synergy quotation after we check authorised sources.',
      },
    ],
    tips: ['Plan outdoor sightseeing for cooler months', 'Keep passport validity in mind for entry rules', 'Share flexible dates for better quote options'],
    ctaService: 'packages',
  },
  {
    slug: 'istanbul',
    name: 'Istanbul',
    country: 'Türkiye',
    region: 'Europe / Asia',
    headline: 'Istanbul city breaks and holiday packages',
    summary:
      'Istanbul blends historic districts, Bosphorus views and vibrant food culture. Synergy assists with flights, hotels and short-break packages.',
    bestTime: 'April–June and September–November are popular for comfortable sightseeing.',
    flightsNote: 'Enquire for IST/SAW routes from your departure city. Multi-city Europe add-ons can be discussed.',
    hotelsNote: 'Sultanahmet, Beyoğlu and modern business districts each suit different travel styles — tell us your preference.',
    packagesNote: '3–7 night cultural itineraries are a common request; we tailor after enquiry.',
    attractions: ['Hagia Sophia area', 'Blue Mosque vicinity', 'Grand Bazaar', 'Bosphorus cruise', 'Galata / Karaköy'],
    visaNote: 'e-Visa / sticker requirements vary by nationality. Synergy can guide paperwork — not an immigration decision.',
    faqs: [
      {
        q: 'Is Istanbul good for a short family trip?',
        a: 'Yes for many families — share ages and pacing preferences so we can suggest a suitable outline.',
      },
    ],
    tips: ['Wear comfortable shoes for old city hills', 'Carry a light layer for evenings', 'Book popular attractions in peak season ahead of time'],
    ctaService: 'packages',
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    headline: 'London flights, hotels and UK trip planning',
    summary:
      'London is a frequent hub for tourism, study visits and connecting travel. Synergy supports flight and hotel enquiries plus UK visitor visa assistance guidance.',
    bestTime: 'May–September for longer daylight; winter has festive attractions with colder weather.',
    flightsNote: 'Request quotes for LHR/LGW/STN/LCY depending on your routing needs.',
    hotelsNote: 'Zone preference and budget band help us shortlist suitable stays.',
    packagesNote: 'London-only or UK multi-city outlines can be prepared after we understand dates and travellers.',
    attractions: ['West End & museums', 'South Bank', 'Royal parks', 'Day trips (Windsor, Oxford — seasonal)'],
    visaNote: 'UK visitor visas are decided by UK authorities. Synergy assists with preparation only.',
    faqs: [
      {
        q: 'Can you help with UK visitor visa documents?',
        a: 'We provide checklist-style assistance and application support guidance. Approval is never guaranteed.',
      },
    ],
    tips: ['Use an Oyster/contactless plan for transport', 'Allow buffer time between flights and visa appointments', 'Share passport nationality early for visa guidance'],
    ctaService: 'visa',
  },
  {
    slug: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    region: 'Indian Ocean',
    headline: 'Maldives honeymoon and resort holidays',
    summary:
      'Maldives trips are usually resort-led with seaplane or speedboat transfers. Synergy helps design enquire-to-quote packages around your dates and resort style.',
    bestTime: 'Dry season is typically November–April; monsoon months can still suit some travellers.',
    flightsNote: 'Most itineraries route via MLE. We quote flights + transfer notes after confirming dates.',
    hotelsNote: 'Resort category (overwater, beach, family) drives the quote — tell us your preference clearly.',
    packagesNote: 'Honeymoon and anniversary packages are common requests; inclusions vary by resort.',
    attractions: ['House reef snorkelling', 'Sunset cruises', 'Spa days', 'Sandbank experiences'],
    visaNote: 'Entry permissions depend on nationality and airline/immigration rules at travel time — verify before departure.',
    faqs: [
      {
        q: 'Do you publish Maldives package prices online?',
        a: 'No fixed live package prices here. We issue a written Synergy quotation once dates and resort style are clear.',
      },
    ],
    tips: ['Confirm transfer type (speedboat vs seaplane)', 'Share board basis preference (BB/HB/AI)', 'Allow connection buffers via hub cities'],
    ctaService: 'packages',
  },
  {
    slug: 'umrah-makkah-madinah',
    name: 'Umrah (Makkah & Madinah)',
    country: 'Saudi Arabia',
    region: 'Middle East',
    headline: 'Umrah travel assistance with Synergy',
    summary:
      'Umrah travel requires careful timing, documentation and accommodation near the Haramain. Synergy assists with package enquiries and travel arrangements — religious rulings remain with qualified scholars.',
    bestTime: 'Depends on personal schedule and seasonal demand; Ramadan and peak periods need earlier planning.',
    flightsNote: 'Routes typically involve JED or MED. We quote after understanding group size and preferred dates.',
    hotelsNote: 'Distance to Haram and room type are key — share walking-distance preference if relevant.',
    packagesNote: 'Umrah package enquiries should include passport nationalities and intended length of stay.',
    attractions: ['Makkah', 'Madinah', 'Ziyarat arrangements (where applicable)'],
    visaNote:
      'Saudi entry/Umrah permissions are subject to official rules. Synergy provides process guidance only and does not grant visas.',
    faqs: [
      {
        q: 'Can Synergy guarantee Umrah visa approval?',
        a: 'No. We assist with travel planning and documentation guidance. Decisions rest with the authorities.',
      },
    ],
    tips: ['Start document checks early', 'Confirm group members’ passport validity', 'Ask about transport between Makkah and Madinah'],
    ctaService: 'umrah',
  },
  {
    slug: 'pakistan',
    name: 'Pakistan',
    country: 'Pakistan',
    region: 'South Asia',
    headline: 'Pakistan flights and family visit travel',
    summary:
      'Many travellers request Pakistan flights for family visits across cities such as Lahore, Islamabad and Karachi. Synergy helps with routing enquiries and multi-city needs.',
    bestTime: 'Varies by region — northern areas differ from southern cities; share your city list for better advice.',
    flightsNote: 'Common gateways include LHE, ISB and KHI. Multi-city and open-jaw options can be discussed in enquiry.',
    hotelsNote: 'City hotels for family visits are arranged on request with dates and locality preferences.',
    packagesNote: 'Family visit itineraries are usually custom rather than fixed catalogue packages.',
    attractions: ['City family time', 'Optional domestic connections', 'Seasonal northern travel (plan carefully)'],
    visaNote: 'Entry requirements depend on passport and purpose of travel. Guidance only — not an immigration decision.',
    faqs: [
      {
        q: 'Can you help with multi-city Pakistan tickets?',
        a: 'Yes — include all cities and preferred dates in your enquiry so we can request suitable options.',
      },
    ],
    tips: ['List all passengers’ ages', 'Mention baggage needs early', 'Allow buffer for domestic connections'],
    ctaService: 'flights',
  },
];

export function getDestination(slug: string): DestinationGuide | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function listDestinationSlugs(): string[] {
  return DESTINATIONS.map((d) => d.slug);
}
