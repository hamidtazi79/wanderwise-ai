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
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.innerHTML = `
      <div
        class="eg-widget"
        data-widget="search"
        data-program="uk-expedia"
        data-lobs="stays,flights"
        data-network="pz"
        data-camref="1100l5Iqgj"
        data-pubref=""
      ></div>
    `;

    const existing = document.querySelector(
      'script.eg-widgets-script'
    ) as HTMLScriptElement | null;

    const init = () => {
      try {
        window.EGWidgets?.init?.();
      } catch (error) {
        console.error('Expedia widget init failed:', error);
      }
    };

    if (existing) {
      setTimeout(init, 300);
      return;
    }

    const script = document.createElement('script');
    script.className = 'eg-widgets-script';
    script.src =
      'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
    script.async = true;
    script.onload = () => {
      setTimeout(init, 300);
    };
    script.onerror = () => {
      console.error('Failed to load Expedia widget script');
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div
        ref={hostRef}
        className="w-full max-w-[575px] min-h-[420px]"
        suppressHydrationWarning
      />
    </div>
  );
}
