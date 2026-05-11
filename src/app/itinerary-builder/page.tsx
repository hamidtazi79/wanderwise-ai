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

export const metadata: Metadata = {
  title: 'AI Itinerary Builder & Custom Trip Planner',
  description:
    'Use the Wanderwise AI itinerary builder to create a personalized trip plan in seconds. Build a custom travel itinerary based on your destination, budget, and interests.',
  alternates: { canonical: '/itinerary-builder' },
};

export default function ItineraryBuilderPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white">
        <div className="container mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-sky-400/15 px-4 py-2 text-sm font-semibold text-sky-300">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-powered travel planning
            </div>

            <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-6xl">
              Build your custom trip itinerary in seconds
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Enter your destination, trip length, interests, and budget.
              Wanderwise AI creates a personalized day-by-day itinerary with
              activities, costs, places, hotel ideas, and travel tips.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <ShieldCheck className="mr-2 h-4 w-4 text-sky-300" />
                No credit card required
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Clock className="mr-2 h-4 w-4 text-sky-300" />
                Itinerary in seconds
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <MapPin className="mr-2 h-4 w-4 text-sky-300" />
                Places + hidden gems
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="-mt-20 rounded-3xl border bg-white p-5 shadow-2xl sm:p-7">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">Create your itinerary</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try the planner free. Save your trip only when you want to keep it.
                </p>
              </div>

              <Suspense fallback={<div>Loading form...</div>}>
                <ItineraryForm />
              </Suspense>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">
                How the AI itinerary builder works
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ['1', 'Tell us your trip', 'Destination, days, budget, and interests.'],
                  ['2', 'AI builds the plan', 'Day-by-day route with activities and tips.'],
                  ['3', 'Save or refine', 'Keep your trip, share it, or upgrade for more.'],
                ].map(([num, title, text]) => (
                  <div key={num} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                      {num}
                    </div>
                    <h3 className="mt-3 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Plane className="h-6 w-6 text-sky-500" />
                <div>
                  <h2 className="text-2xl font-bold">Search Hotels & Flights</h2>
                  <p className="text-sm text-muted-foreground">
                    Compare travel options with our Expedia partner widget.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <ExpediaWidget />
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">
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
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl bg-sky-50 p-4 text-sm text-slate-700">
                Want inspiration first? Visit the{' '}
                <Link href="/blog" className="font-semibold text-sky-700 hover:underline">
                  travel blog
                </Link>{' '}
                or ask the{' '}
                <Link href="/ai-chat" className="font-semibold text-sky-700 hover:underline">
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
