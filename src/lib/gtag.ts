export const GA_MEASUREMENT_ID = 'G-F70BJG24V4';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackGAEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('event', eventName, params || {});
}

export function trackSignUp(method: string) {
  trackGAEvent('sign_up', {
    method,
  });
}
