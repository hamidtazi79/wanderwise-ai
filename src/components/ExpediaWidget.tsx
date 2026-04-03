'use client';

import Script from 'next/script';

declare global {
  interface Window {
    EGWidgets?: {
      init?: () => void;
    };
  }
}

export default function ExpediaWidget() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[575px]">
        <div
          className="eg-widget"
          data-widget="search"
          data-program="us-expedia"
          data-lobs="stays,flights"
          data-network="pz"
          data-camref="101115F9kT"
          data-pubref=""
        />

        <Script
          id="expedia-widget-script"
          src="https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js"
          strategy="afterInteractive"
          onLoad={() => {
            setTimeout(() => {
              try {
                window.EGWidgets?.init?.();
              } catch (error) {
                console.error('Expedia widget init failed:', error);
              }
            }, 300);
          }}
        />
      </div>
    </div>
  );
}
