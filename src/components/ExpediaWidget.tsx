'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/meta-pixel';

export default function ExpediaWidget() {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_name: 'Expedia Widget',
      content_category: 'Travel Booking',
    });
  }, []);

  const handleWidgetIntent = () => {
    trackEvent('InitiateCheckout', {
      content_name: 'Expedia Widget Click',
      content_category: 'Travel Booking',
    });
  };

  return (
    <div
      className="w-full flex justify-center"
      onClick={handleWidgetIntent}
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
