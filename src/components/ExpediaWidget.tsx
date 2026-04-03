'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    EGWidgets?: {
      init?: () => void;
    };
  }
}

const SCRIPT_ID = 'expedia-eg-widgets-script';
const SCRIPT_SRC =
  'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';

function loadExpediaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }

      const handleLoad = () => {
        existingScript.dataset.loaded = 'true';
        resolve();
      };

      const handleError = () => {
        reject(new Error('Failed to load Expedia widget script.'));
      };

      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;

    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true }
    );

    script.addEventListener(
      'error',
      () => {
        reject(new Error('Failed to load Expedia widget script.'));
      },
      { once: true }
    );

    document.body.appendChild(script);
  });
}

export default function ExpediaWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderWidget = async () => {
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

      try {
        await loadExpediaScript();

// 🔥 CRITICAL FIX: wait for DOM to fully paint
requestAnimationFrame(() => {
  setTimeout(() => {
    if (window.EGWidgets?.init) {
      try {
        window.EGWidgets.init();
      } catch (e) {
        console.error('Expedia init error:', e);
      }
    }
  }, 200);
});
      } catch (error) {
        console.error('Expedia widget failed to load:', error);
      }
    };

    renderWidget();

    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={containerRef} className="w-full min-h-[420px]" />;
}
