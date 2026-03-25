'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'ww-cookie-consent-v1';

type ConsentStatus = 'unknown' | 'accepted' | 'rejected';

export default function CookieConsentBar() {
  const [status, setStatus] = useState<ConsentStatus>('unknown');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === 'accepted' || saved === 'rejected') {
      setStatus(saved);
    }
  }, []);

  const handleChoice = (value: 'accepted' | 'rejected') => {
    setStatus(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CONSENT_KEY, value);
      window.dispatchEvent(new Event('ww-cookie-consent-changed'));
    }
  };

  // Don’t render on server or if already decided
  if (!isMounted || status !== 'unknown') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3 sm:px-0 sm:pb-4">
      <div className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/95 px-4 py-3 shadow-lg backdrop-blur sm:flex sm:items-center sm:gap-4 sm:px-5 sm:py-4">
        <p className="text-xs text-slate-200 sm:text-sm">
          We use cookies to improve your experience, analyze traffic and measure ads.{' '}
          <Link
            href="/privacy"
            className="font-medium text-sky-300 underline-offset-2 hover:underline"
          >
            Learn more
          </Link>
          .
        </p>

        <div className="mt-3 flex shrink-0 gap-2 sm:mt-0 sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-xs sm:text-sm"
            onClick={() => handleChoice('rejected')}
          >
            Reject
          </Button>
          <Button
            size="sm"
            className="bg-sky-500 text-xs text-slate-950 hover:bg-sky-400 sm:text-sm"
            onClick={() => handleChoice('accepted')}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
