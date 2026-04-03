'use client';

import { useEffect } from 'react';
import { trackInitiateCheckout, trackViewContent } from '@/lib/meta-pixel';

export default function ExpediaWidget() {
  useEffect(() => {
    trackViewContent('Expedia Widget');
  }, []);

  const handleWidgetIntent = () => {
    trackInitiateCheckout();
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
