declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;

  if (params) {
    window.fbq('track', eventName, params);
    return;
  }

  window.fbq('track', eventName);
}
