import type { SearchVertical } from '../metasearch/types';

/** Canonical SPA page ids — every navigateToPage target must resolve here */
export const APP_PAGES = [
  'home',
  'compare',
  'packages',
  'tours',
  'visa',
  'hotels',
  'adventure',
  'corporate',
  'umrah',
  'hajj',
  'insurance',
  'activities',
  'cars',
  'cruises',
  'trip-detail',
  'checkout',
  'not-found',
] as const;

export type AppPage = (typeof APP_PAGES)[number];

const PAGE_SET = new Set<string>(APP_PAGES);

export function isAppPage(page: string): page is AppPage {
  return PAGE_SET.has(page);
}

/** Map metasearch vertical → dedicated content page (when not going to compare) */
export const VERTICAL_PAGE: Partial<Record<SearchVertical, AppPage>> = {
  packages: 'packages',
  visa: 'visa',
  hotels: 'hotels',
  corporate: 'corporate',
  umrah: 'umrah',
  hajj: 'hajj',
  insurance: 'insurance',
  activities: 'activities',
  cars: 'cars',
  cruises: 'cruises',
  flights: 'home',
};

/** Synergy-owned offers book into these internal pages */
export const SYNERGY_BOOK_PAGE: Partial<Record<SearchVertical, AppPage>> = {
  packages: 'packages',
  visa: 'visa',
  umrah: 'umrah',
  hajj: 'hajj',
  corporate: 'corporate',
  insurance: 'insurance',
  cruises: 'cruises',
  hotels: 'hotels',
  activities: 'tours',
  flights: 'home',
  cars: 'cars',
};

export function resolveNavigateTarget(raw: string): AppPage {
  if (!raw) return 'home';
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, '-');
  if (isAppPage(normalized)) return normalized;

  const aliases: Record<string, AppPage> = {
    flight: 'home',
    flights: 'home',
    'flight-booking': 'home',
    package: 'packages',
    'travel-packages': 'packages',
    tour: 'tours',
    visas: 'visa',
    'visa-services': 'visa',
    hotel: 'hotels',
    adventures: 'adventure',
    honeymoon: 'adventure',
    'car-rental': 'cars',
    'car-rentals': 'cars',
    rental: 'cars',
    activity: 'activities',
    cruise: 'cruises',
    religious: 'umrah',
    'umrah-packages': 'umrah',
    contact: 'home',
    about: 'home',
    compare: 'compare',
    metasearch: 'compare',
  };

  return aliases[normalized] || 'not-found';
}

export function buildPageHash(page: AppPage, tripId?: string | null): string {
  if (page === 'home') return '#/';
  if (page === 'trip-detail' && tripId) return `#/trip-detail/${encodeURIComponent(tripId)}`;
  return `#/${page}`;
}

export function parsePageHash(hash: string): { page: AppPage; tripId?: string } {
  const raw = hash.replace(/^#\/?/, '').trim();
  if (!raw) return { page: 'home' };
  const [segment, ...rest] = raw.split('/');
  const page = resolveNavigateTarget(segment || 'home');
  if (page === 'trip-detail' && rest[0]) {
    return { page, tripId: decodeURIComponent(rest[0]) };
  }
  return { page };
}

export type NavigateDetail =
  | AppPage
  | string
  | { page: string; tripId?: string; vertical?: SearchVertical };

export function navigateToAppPage(
  page: AppPage | string,
  extras?: { tripId?: string; vertical?: SearchVertical }
) {
  const resolved = isAppPage(String(page)) ? (page as AppPage) : resolveNavigateTarget(String(page));

  if (resolved === 'trip-detail' && extras?.tripId) {
    window.dispatchEvent(
      new CustomEvent('navigateToPage', {
        detail: { page: 'trip-detail', tripId: extras.tripId },
      })
    );
    return;
  }

  if (extras?.vertical) {
    window.dispatchEvent(
      new CustomEvent('navigateToPage', {
        detail: { page: resolved, vertical: extras.vertical },
      })
    );
    return;
  }

  window.dispatchEvent(new CustomEvent('navigateToPage', { detail: resolved }));
}
