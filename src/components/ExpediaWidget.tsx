'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    EGWidgets?: {
      init?: () => void;
    };
  }
}

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

    const existingScript = document.querySelector(
      'script[data-expedia-widget="true"]'
    ) as HTMLScriptElement | null;

    const initWidget = () => {
      if (window.EGWidgets && typeof window.EGWidgets.init === 'function') {
        window.EGWidgets.init();
      }
    };

    if (existingScript) {
      if (existingScript.getAttribute('data-loaded') === 'true') {
        initWidget();
      } else {
        existingScript.addEventListener('load', initWidget, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
    script.async = true;
    script.setAttribute('data-expedia-widget', 'true');
    script.addEventListener('load', () => {
      script.setAttribute('data-loaded', 'true');
      initWidget();
    });

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', initWidget);
    };
  }, []);

  return <div ref={containerRef} className="w-full min-h-[420px]" />;
}
