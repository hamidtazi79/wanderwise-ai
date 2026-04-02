'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function ExpediaWidget() {
  useEffect(() => {
    // Force widget re-init after load
    const timer = setTimeout(() => {
      if (window && (window as any).egWidgets) {
        (window as any).egWidgets.init();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div
        id="expedia-widget"
        className="eg-widget"
        data-widget="search"
        data-program="us-expedia"
        data-lobs="stays,flights"
        data-network="pz"
        data-camref="101115F9kT"
        data-pubref=""
      />

      <Script
        src="https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
