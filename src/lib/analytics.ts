/** Lightweight analytics event helpers — GA4 / Meta Pixel ready */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent =
  | 'flight_search'
  | 'booking_request'
  | 'visa_enquiry'
  | 'tour_enquiry'
  | 'hotel_enquiry'
  | 'insurance_enquiry'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'affiliate_click'
  | 'page_view';

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, string | number | boolean | undefined>
) {
  const payload = { ...params, event_source: 'synergy_web' };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
  } catch {
    /* ignore */
  }

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, payload);
    }
  } catch {
    /* ignore */
  }

  try {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', event, payload);
    }
  } catch {
    /* ignore */
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload);
  }
}
