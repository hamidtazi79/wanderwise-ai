'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';

export default function HomePage() {
  const router = useRouter();
  const { isUserLoading } = useUser();
  const [destination, setDestination] = useState('');

  const handleStartPlanning = () => {
    router.push('/itinerary-builder');
  };

  const handleDestinationStart = () => {
    const trimmedDestination = destination.trim();

    if (trimmedDestination) {
      router.push(
        `/itinerary-builder?destination=${encodeURIComponent(trimmedDestination)}`
      );
      return;
    }

    router.push('/itinerary-builder');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_35%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-24 md:flex-row md:items-center md:pb-28 md:pt-28">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-400">
              AI-powered travel planning
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Plan your entire trip{' '}
              <span className="text-sky-400">in seconds</span>
            </h1>

            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Generate a personalized itinerary for free. Explore your full trip
              plan first, then create an account only when you want to save,
              organize, or upgrade your travel planning.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleStartPlanning}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
                disabled={isUserLoading}
              >
                🎒 Start Planning Free
              </button>

              <Link
                href="#sample-itinerary"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:border-sky-400 hover:text-sky-300"
              >
                📄 See Example Itinerary
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>⭐ Full itinerary preview</span>
              <span>•</span>
              <span>🔒 Save after signup</span>
              <span>•</span>
              <span>⚡ No credit card required</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-900/40 p-6 shadow-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-300">
                Live AI itinerary preview
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3">
                  <span className="text-slate-200">Destination</span>
                  <span className="font-semibold text-sky-300">
                    Tokyo, Japan
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Day 1 — Wanderwise AI suggests
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-200">
                    <li>• Morning at Senso-ji &amp; Asakusa district</li>
                    <li>• Lunch at a hidden ramen spot near Ueno</li>
                    <li>• Sunset at Tokyo Skytree</li>
                    <li>• Izakaya night in Shinjuku Omoide Yokocho</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-400">
                  Preview the trip first. Save it later when you want to keep it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <div className="max-w-4xl space-y-5">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What Is Wanderwise AI?
            </h2>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Wanderwise AI is a smart AI travel planner built for travelers who
              want faster, better, and more personalized trip planning. Instead
              of spending hours comparing blogs, maps, hotel options, and things
              to do, you can generate a complete travel itinerary in seconds.
            </p>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Wanderwise AI adapts to your destination, budget, travel style, and
              preferences. It can suggest attractions, neighborhoods, food spots,
              daily schedules, and useful trip structure while helping you refine
              your plans with AI tools.
            </p>

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              You can explore the{' '}
              <Link
                href="/itinerary-builder"
                className="font-medium text-sky-300 hover:text-sky-200"
              >
                AI itinerary builder
              </Link>
              , compare plans on the{' '}
              <Link
                href="/pricing"
                className="font-medium text-sky-300 hover:text-sky-200"
              >
                pricing page
              </Link>
              , browse ideas on the{' '}
              <Link
                href="/blog"
                className="font-medium text-sky-300 hover:text-sky-200"
              >
                travel blog
              </Link>
              , or ask follow-up questions in the{' '}
              <Link
                href="/ai-chat"
                className="font-medium text-sky-300 hover:text-sky-200"
              >
                AI travel chat
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How Wanderwise AI Works
          </h2>

          <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
            Generate first. Explore freely. Save only when the trip feels worth
            keeping.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Enter your trip idea',
                text: 'Choose your destination, trip length, budget, and interests.',
              },
              {
                step: '2',
                title: 'Preview the full itinerary',
                text: 'See the day-by-day plan, places, food ideas, hotel suggestions, and tips.',
              },
              {
                step: '3',
                title: 'Save or upgrade later',
                text: 'Create a free account to save. Upgrade only for advanced planning tools.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={handleStartPlanning}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              disabled={isUserLoading}
            >
              ✨ Try the Planner Free
            </button>
          </div>
        </div>
      </section>

      <section
        id="sample-itinerary"
        className="border-b border-slate-800 bg-slate-950"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-10 md:grid-cols-[1.3fr,1fr] md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                See a Trip Plan Created by Wanderwise AI
              </h2>

              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Here is an example of a 3-day Paris itinerary. Your own plan
                will be personalized based on your interests, budget, and travel
                style.
              </p>

              <div className="mt-6 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-200">
                <div>
                  <h3 className="text-sm font-semibold text-sky-300">
                    Day 1 — Icons &amp; First Impressions
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li>• Morning at the Eiffel Tower &amp; Champ de Mars</li>
                    <li>• Seine river walk &amp; café stop</li>
                    <li>• Afternoon at the Louvre Museum</li>
                    <li>• Dinner at a cozy bistro in Saint-Germain</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-sky-300">
                    Day 2 — Art, Views &amp; Neighborhoods
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li>• Montmartre walking tour &amp; Sacré-Cœur</li>
                    <li>• Hidden streets &amp; local bakeries</li>
                    <li>• Sunset at Arc de Triomphe</li>
                    <li>• Drinks around the Champs-Élysées</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-sky-300">
                    Day 3 — Old Paris &amp; Farewell
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li>• Notre-Dame area &amp; Île de la Cité</li>
                    <li>• Food market or cheese &amp; wine tasting</li>
                    <li>• Relaxing Seine cruise to end the trip</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold">Why plan with AI?</h3>

              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>✔ Save hours of travel research</li>
                <li>✔ Build realistic day-by-day plans</li>
                <li>✔ Discover food spots and hidden gems</li>
                <li>✔ Match ideas to your budget and travel style</li>
                <li>✔ Save and organize trips after signup</li>
              </ul>

              <Link
                href="/itinerary-builder"
                className="inline-flex items-center justify-center rounded-full border border-sky-400 px-5 py-2.5 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/10"
              >
                Generate your own itinerary
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Start Free, Upgrade When You&apos;re Ready
            </h2>

            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Preview your itinerary for free. Upgrade only when you want
              unlimited trips, AI chat, exporting, and advanced planning tools.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-lg font-semibold">Free Plan</h3>
              <p className="mt-1 text-sm text-slate-300">
                For trying Wanderwise AI and previewing your first trips.
              </p>

              <p className="mt-4 text-3xl font-bold">$0</p>
              <p className="text-xs text-slate-400">No credit card required</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• Generate and preview itineraries</li>
                <li>• Save after creating a free account</li>
                <li>• Upgrade only when you need more tools</li>
              </ul>

              <button
                type="button"
                onClick={handleStartPlanning}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-50 transition hover:border-sky-400 hover:text-sky-300"
                disabled={isUserLoading}
              >
                Get Started Free
              </button>
            </div>

            <div className="flex flex-col rounded-3xl border border-sky-500 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
              <h3 className="text-lg font-semibold">Premium Plan</h3>
              <p className="mt-1 text-sm text-slate-200">
                For travelers who want unlimited planning and advanced tools.
              </p>

              <p className="mt-4 text-3xl font-bold">$9.99</p>
              <p className="text-xs text-slate-400">
                per month · or as low as{' '}
                <span className="font-semibold">$3.99/week</span>
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                <li>• Unlimited itineraries</li>
                <li>• Unlimited AI travel chat</li>
                <li>• Export trip plans</li>
                <li>• Budget insights</li>
                <li>• Dashboard access</li>
              </ul>

              <Link
                href="/pricing"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              >
                View Full Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Loved by Smart, Curious Travelers
          </h2>

          <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
            Wanderwise AI helps turn vague ideas into real, bookable trips.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              [
                'Best travel assistant ever. It saved me hours planning my Europe trip.',
                'Sarah L., United Kingdom',
              ],
              [
                'The AI chat gave me hidden gems I never found on Google or TikTok.',
                'Julien M., France',
              ],
              [
                'I tried a few AI travel tools — Wanderwise feels the most human and practical.',
                'Carla D., Canada',
              ],
            ].map(([quote, name]) => (
              <div
                key={name}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200"
              >
                <p>&ldquo;{quote}&rdquo;</p>
                <p className="mt-3 text-xs font-semibold text-slate-400">
                  — {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Explore More Travel Planning Resources
          </h2>

          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            Wanderwise AI is more than a simple itinerary generator. Use it to
            build trips faster, explore travel inspiration, and get practical
            guidance before your next holiday.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              href="/itinerary-builder"
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-sky-500"
            >
              <h3 className="text-lg font-semibold">AI Itinerary Builder</h3>
              <p className="mt-2 text-sm text-slate-300">
                Generate a personalized itinerary for your destination, budget,
                and travel style.
              </p>
            </Link>

            <Link
              href="/blog"
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-sky-500"
            >
              <h3 className="text-lg font-semibold">Travel Blog</h3>
              <p className="mt-2 text-sm text-slate-300">
                Read destination guides, travel planning tips, and itinerary
                ideas.
              </p>
            </Link>

            <Link
              href="/pricing"
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-sky-500"
            >
              <h3 className="text-lg font-semibold">Pricing &amp; Plans</h3>
              <p className="mt-2 text-sm text-slate-300">
                Compare free and premium features before upgrading.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Plan Your Next Trip?
          </h2>

          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Enter your destination and let Wanderwise AI build your first trip
            plan.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Where do you want to go next?"
              className="w-full max-w-md rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />

            <button
              type="button"
              onClick={handleDestinationStart}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              disabled={isUserLoading}
            >
              🧭 Get My Free Trip Plan
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            No spam, no pressure — signup is only needed when you save.
          </p>
        </div>
      </section>
    </main>
  );
}


