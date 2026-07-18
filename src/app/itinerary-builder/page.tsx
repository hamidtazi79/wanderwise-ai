import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { ItineraryForm } from './itinerary-form';
import ExpediaWidget from '@/components/ExpediaWidget';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'AI Itinerary Builder & Custom Trip Planner',
  description:
    'Use the Wanderwise AI itinerary builder to create a personalized trip plan in seconds. Build a custom travel itinerary based on your destination, budget, and interests.',
  alternates: {
    canonical: '/itinerary-builder',
  },
};

function ItineraryFormFallback() {
  return (
    <div className="space-y-5" aria-label="Loading itinerary form">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-11 w-full" />

      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-11 w-full" />

      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-28 w-full" />

      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-11 w-full" />

      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export default function ItineraryBuilderPage() {
  return (
    <main className="min-w-0 overflow-x-hidden bg-slate-50">
      <section className="relative isolate overflow-hidden border-b border-slate-800 bg-slate-950 text-white sm:bg-gradient-to-br sm:from-slate-950 sm:via-slate-900 sm:to-sky-950">
        <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-sky-950 px-4 py-2 text-sm font-semibold text-sky-200 sm:bg-sky-400/15 sm:text-sky-300">
              <Sparkles className="mr-2 h-4 w-4 shrink-0" />
              <span>AI-powered travel planning</span>
            </div>

            <h1 className="font-headline text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Build your custom trip itinerary in seconds
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Enter your destination, trip length, interests, and budget.
              Wanderwise AI creates a personalized day-by-day itinerary with
              activities, costs, places, hotel ideas, and travel tips.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row sm:flex-wrap">
              <span className="inline-flex w-full items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 sm:w-auto sm:border-white/10 sm:bg-white/5 sm:px-3 sm:py-1">
                <ShieldCheck className="mr-2 h-4 w-4 shrink-0 text-sky-300" />
                No credit card required
              </span>

              <span className="inline-flex w-full items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 sm:w-auto sm:border-white/10 sm:bg-white/5 sm:px-3 sm:py-1">
                <Clock className="mr-2 h-4 w-4 shrink-0 text-sky-300" />
                Itinerary in seconds
              </span>

              <span className="inline-flex w-full items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 sm:w-auto sm:border-white/10 sm:bg-white/5 sm:px-3 sm:py-1">
                <MapPin className="mr-2 h-4 w-4 shrink-0 text-sky-300" />
                Places + hidden gems
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="min-w-0 space-y-8">
            <div className="mt-0 min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7 lg:-mt-20 lg:shadow-2xl">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-950">
                  Create your itinerary
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Try the planner free. Save your trip only when you want to
                  keep it.
                </p>
              </div>

              <Suspense fallback={<ItineraryFormFallback />}>
                <ItineraryForm />
              </Suspense>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">
                How the AI itinerary builder works
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  [
                    '1',
                    'Tell us your trip',
                    'Destination, days, budget, and interests.',
                  ],
                  [
                    '2',
                    'AI builds the plan',
                    'Day-by-day route with activities and tips.',
                  ],
                  [
                    '3',
                    'Save or refine',
                    'Keep your trip, share it, or upgrade for more.',
                  ],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                      {number}
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-950">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Plane className="mt-1 h-6 w-6 shrink-0 text-sky-500" />

                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-slate-950">
                    Search Hotels &amp; Flights
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Compare travel options with our Expedia partner widget.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex min-w-0 justify-center overflow-hidden">
                <ExpediaWidget />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">
                Why travelers use Wanderwise AI
              </h2>

              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                {[
                  'Build a custom itinerary in seconds',
                  'Get ideas based on your interests and budget',
                  'Discover food spots, places, and hidden gems',
                  'Save time compared with manual trip research',
                  'Refine and improve your trip with AI support',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-slate-700">
                Want inspiration first? Visit the{' '}
                <Link
                  href="/blog"
                  className="font-semibold text-sky-700 hover:underline"
                >
                  travel blog
                </Link>{' '}
                or ask the{' '}
                <Link
                  href="/ai-chat"
                  className="font-semibold text-sky-700 hover:underline"
                >
                  AI travel assistant
                </Link>
                .
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
