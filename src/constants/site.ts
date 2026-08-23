/** Production site identity — apex domain (www redirects to apex via .htaccess) */
export const SITE_DOMAIN = 'synergytravelsandtour.com';
export const SITE_ORIGIN = `https://${SITE_DOMAIN}`;
export const SITE_NAME = 'Synergy Travels & Tour';

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || SITE_ORIGIN;

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
