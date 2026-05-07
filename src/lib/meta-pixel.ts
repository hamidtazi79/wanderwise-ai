declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function hasTrackingConsent() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('wanderwise_cookie_consent') === 'accepted';
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (!window.fbq) return;

  window.fbq('track', eventName, params || {});
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (!window.gtag) return;

  window.gtag('event', eventName, params || {});
}

export function trackSignup(method: 'email' | 'google') {
  trackMetaEvent('CompleteRegistration', {
    content_name: 'Signup',
    status: true,
    signup_method: method,
  });

  trackGaEvent('sign_up', {
    method,
  });
}

export function trackPageView(url?: string) {
  trackMetaEvent('PageView');

  trackGaEvent('page_view', {
    page_location: url || window.location.href,
  });
}
