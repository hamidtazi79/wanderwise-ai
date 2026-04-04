import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ItineraryForm } from './itinerary-form';
import ExpediaWidget from '@/components/ExpediaWidget';

export const metadata: Metadata = {
  title: 'AI Itinerary Builder & Custom Trip Planner',
  description:
    'Use the Wanderwise AI itinerary builder to create a personalized trip plan in seconds. Build a custom travel itinerary based on your destination, budget, and interests.',
  alternates: {
    canonical: '/itinerary-builder',
  },
  keywords: [
    'AI itinerary builder',
    'custom trip planner',
    'AI trip planner',
    'travel itinerary generator',
    'AI travel planner',
    'personalized itinerary',
    'Wanderwise AI',
  ],
  openGraph: {
    title: 'AI Itinerary Builder & Custom Trip Planner',
    description:
      'Create a personalized travel itinerary in seconds with Wanderwise AI. Plan smarter trips based on your destination, budget, and interests.',
    url: 'https://wanderwise.uk/itinerary-builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Itinerary Builder & Custom Trip Planner',
    description:
      'Create a personalized travel itinerary in seconds with Wanderwise AI.',
  },
};

export default function ItineraryBuilderPage() {
  return (
    <div className="container mx-auto max-w-6xl py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <div className="text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              AI Itinerary Builder for Personalized Trip Planning
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Create a custom travel itinerary in seconds with Wanderwise AI.
              Plan your trip based on your destination, budget, interests, and
              travel style.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Subscribers can save generated itineraries, refine plans faster,
              and organize multiple trips in one place.
            </p>
          </div>

          <div className="mt-10">
            <Suspense fallback={<div>Loading form...</div>}>
              <ItineraryForm />
            </Suspense>
          </div>

          <div className="mt-10 space-y-4 rounded-2xl border p-6">
            <h2 className="text-2xl font-semibold">
              How the AI itinerary builder works
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Enter your destination, choose the length of your trip, and add
              your interests. Wanderwise AI will generate a personalized
              itinerary designed around your preferences. This makes it easier
              to plan city breaks, long holidays, family trips, food-focused
              getaways, or flexible travel adventures without spending hours on
              manual research.
            </p>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              If you want more inspiration before generating your itinerary, you
              can visit the{' '}
              <Link href="/blog" className="font-medium hover:underline">
                travel blog
              </Link>{' '}
              or use the{' '}
              <Link href="/ai-chat" className="font-medium hover:underline">
                AI travel assistant
              </Link>{' '}
              to explore destinations and travel ideas.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Search Hotels & Flights</h2>
            <p className="mt-2 text-muted-foreground">
              Compare travel options with our Expedia partner widget.
            </p>

            <div className="mt-6 flex justify-center">
              <ExpediaWidget />
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-2xl font-semibold">
              Why use Wanderwise AI for trip planning?
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground sm:text-base">
              <li>✔ Build a custom itinerary in seconds</li>
              <li>✔ Get ideas based on your interests and budget</li>
              <li>✔ Save time compared with manual trip research</li>
              <li>✔ Explore hotels and flights in one planning flow</li>
              <li>✔ Refine and improve your trip with AI support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
