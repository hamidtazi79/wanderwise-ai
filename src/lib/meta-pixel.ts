export const META_PIXEL_ID = '2385858521843343';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function hasTrackingConsent() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('wanderwise_cookie_consent') === 'accepted';
}

export function pageview() {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (!window.fbq) return;

  window.fbq('track', 'PageView');
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (!window.fbq) return;

  window.fbq('track', eventName, params || {});
}
