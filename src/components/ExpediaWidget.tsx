'use client';

export default function ExpediaWidget() {
  const handleClick = () => {
    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }

    // Google Ads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/label', // replace later
      });
    }
  };

  return (
    <div
      className="w-full flex justify-center"
      onClick={handleClick}
    >
      <iframe
        src="/expedia-widget-frame"
        title="Expedia Search Widget"
        className="w-full max-w-[575px] min-h-[420px] border-0"
        loading="lazy"
      />
    </div>
  );
}
