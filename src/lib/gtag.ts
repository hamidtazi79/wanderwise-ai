export const GA_MEASUREMENT_ID = 'G-F70BJG24V4';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function hasTrackingConsent() {
  if (typeof window === 'undefined') return false;

  return (
    localStorage.getItem('wanderwise_cookie_consent') === 'accepted'
  );
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;
  if (!hasTrackingConsent()) return;

  window.gtag('event', eventName, params || {});
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;
  if (!hasTrackingConsent()) return;

  window.fbq('track', eventName, params || {});
}

export function trackSignup(method: 'email' | 'google') {
  trackGaEvent('sign_up', {
    method,
  });

  trackMetaEvent('CompleteRegistration', {
    content_name: 'Signup',
    signup_method: method,
    status: true,
  });
}

export function trackPageView(url?: string) {
  trackGaEvent('page_view', {
    page_location: url || window.location.href,
  });

  trackMetaEvent('PageView');
}
