declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const pageview = () => {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;
  window.fbq('track', 'PageView');
};

export const trackInitiateCheckout = () => {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;
  window.fbq('track', 'InitiateCheckout');
};

export const trackViewContent = (contentName?: string) => {
  if (typeof window === 'undefined') return;
  if (!window.fbq) return;

  if (contentName) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
    });
    return;
  }

  window.fbq('track', 'ViewContent');
};
