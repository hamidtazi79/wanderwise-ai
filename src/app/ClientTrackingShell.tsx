// src/app/ClientTrackingShell.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import TrackingScripts from '@/components/TrackingScripts';

const STORAGE_KEY = 'wanderwise_cookie_consent';

type ConsentStatus = 'unknown' | 'accepted' | 'rejected';

export default function ClientTrackingShell() {
  const [status, setStatus] = useState<ConsentStatus>('unknown');
  const [hasLoadedConsent, setHasLoadedConsent] = useState(false);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(STORAGE_KEY);

      if (savedConsent === 'accepted' || savedConsent === 'rejected') {
        setStatus(savedConsent);
      } else {
        setStatus('unknown');
      }
    } catch (error) {
      console.error('Unable to read cookie consent:', error);
      setStatus('unknown');
    } finally {
      setHasLoadedConsent(true);
    }
  }, []);

  function saveConsent(nextStatus: Exclude<ConsentStatus, 'unknown'>) {
    setStatus(nextStatus);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextStatus);
      window.dispatchEvent(
        new CustomEvent('ww-cookie-consent-changed', {
          detail: {
            status: nextStatus,
          },
        })
      );
    } catch (error) {
      console.error('Unable to save cookie consent:', error);
    }
  }

  function handleAccept() {
    saveConsent('accepted');
  }

  function handleReject() {
    saveConsent('rejected');
  }

  if (!hasLoadedConsent) {
    return null;
  }

  return (
    <>
      {status === 'accepted' && <TrackingScripts />}

      {status === 'unknown' && (
        <aside
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-700 bg-slate-950 shadow-[0_-10px_35px_rgba(15,23,42,0.25)]"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 text-sm text-slate-100 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="max-w-2xl space-y-1">
              <p className="font-semibold">
                We use cookies to improve your experience.
              </p>

              <p className="text-xs leading-5 text-slate-400">
                We use optional cookies for analytics and personalized content.
                Read our{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-sky-300 underline underline-offset-2 hover:text-sky-200"
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="/terms"
                  className="font-medium text-sky-300 underline underline-offset-2 hover:text-sky-200"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={handleReject}
                className="min-h-10 flex-1 rounded-full border border-slate-600 px-5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:flex-none"
              >
                Decline
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="min-h-10 flex-1 rounded-full bg-sky-400 px-5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:flex-none"
              >
                Accept cookies
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
