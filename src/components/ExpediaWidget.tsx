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
    <div className="w-full max-w-[575px] mx-auto">
      <div
        className="eg-widget"
        data-widget="search"
        data-program="uk-expedia"
        data-lobs="stays,flights"
        data-network="pz"
        data-camref="1100l5Iqgj"
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
          }, 500);
        }}
      />
    </div>
  );
}
