// src/app/ClientTrackingShell.tsx
"use client";

import { useEffect, useState } from "react";
import TrackingScripts from "@/components/TrackingScripts";

const STORAGE_KEY = "wanderwise_cookie_consent";

type ConsentStatus = "unknown" | "accepted" | "rejected";

export default function ClientTrackingShell() {
  const [status, setStatus] = useState<ConsentStatus>("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === "accepted" || saved === "rejected") {
      setStatus(saved);
    } else {
      setStatus("unknown");
    }
  }, []);

  const handleAccept = () => {
    setStatus("accepted");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
      window.dispatchEvent(new Event("ww-cookie-consent-changed"));
    }
  };

  const handleReject = () => {
    setStatus("rejected");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "rejected");
      window.dispatchEvent(new Event("ww-cookie-consent-changed"));
    }
  };

  return (
    <>
      {status === "accepted" && <TrackingScripts />}

      {status === "unknown" && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 text-sm text-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold">
                We use cookies to improve your experience.
              </p>

              <p className="text-xs text-slate-400">
                We use cookies for analytics and personalized content. Read our{" "}
                <a
                  href="/privacy"
                  className="underline text-sky-300 hover:text-sky-400"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms"
                  className="underline text-sky-300 hover:text-sky-400"
                >
                  Terms of Service
                </a>.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReject}
                className="rounded-full border border-slate-600 px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-400"
              >
                Decline
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
              >
                Accept cookies
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
