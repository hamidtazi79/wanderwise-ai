'use client';

import { useEffect, useRef } from 'react';

export default function ExpediaWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = `
      <div
        class="eg-widget"
        data-widget="search"
        data-program="us-expedia"
        data-lobs="stays,flights"
        data-network="pz"
        data-camref="101115F9kT"
        data-pubref=""
      ></div>
    `;

    const oldScript = document.querySelector(
      'script.eg-widgets-script'
    ) as HTMLScriptElement | null;

    if (!oldScript) {
      const script = document.createElement('script');
      script.src =
        'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
      script.async = true;
      script.className = 'eg-widgets-script';
      document.body.appendChild(script);
    } else {
      oldScript.remove();
      const script = document.createElement('script');
      script.src =
        'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
      script.async = true;
      script.className = 'eg-widgets-script';
      document.body.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="w-full min-h-[420px]" />;
}
