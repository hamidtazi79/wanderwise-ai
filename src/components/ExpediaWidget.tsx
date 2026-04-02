'use client';

import Script from 'next/script';

export default function ExpediaWidget() {
  return (
    <div className="w-full">
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
        src="https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
