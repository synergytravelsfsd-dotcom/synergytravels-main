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
  | 'page_view'
  | 'lead_submitted';

/** Inject GA4 / Meta Pixel scripts when measurement IDs are set in env. */
export function initAnalytics(): void {
  if (typeof document === 'undefined') return;

  const ga4 = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim();
  const meta = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim();

  if (ga4 && !document.getElementById('synergy-ga4')) {
    const s = document.createElement('script');
    s.id = 'synergy-ga4';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4);
  }

  if (meta && !document.getElementById('synergy-meta-pixel')) {
    const s = document.createElement('script');
    s.id = 'synergy-meta-pixel';
    s.innerHTML = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${meta.replace(/'/g, '')}');
fbq('track','PageView');`;
    document.head.appendChild(s);
  }
}

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
