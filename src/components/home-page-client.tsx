'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase/provider";

export default function HomePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  // Shared logic for all "free planning" CTAs
  const handleStartPlanning = () => {
    if (isUserLoading) return; // avoid navigation while auth is loading

    if (!user) {
      // Not logged in → ask them to sign up, then return to the builder
      router.push("/signup?redirect=/itinerary-builder");
    } else {
      // Already logged in → go directly to the planner
      router.push("/itinerary-builder");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-24 md:flex-row md:items-center md:pb-28 md:pt-28">
          {/* Text */}
          <div className="flex-1 space-y-6">
            <p className="text-sm font-semibold tracking-wide text-sky-400 uppercase">
              AI-Powered Travel Planning
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Plan Your Entire Trip{" "}
              <span className="text-sky-400">in Seconds</span> with AI
            </h1>
            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              Wanderwise AI builds custom itineraries, finds hidden gems, suggests
              where to stay, and answers all your travel questions — instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {/* PRIMARY CTA – now respects login state */}
              <button
                type="button"
                onClick={handleStartPlanning}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
                disabled={isUserLoading}
              >
                🎒 Start Planning Free
              </button>

              {/* Scroll down to the sample itinerary section */}
              <Link
                href="#sample-itinerary"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-50 transition hover:border-sky-400 hover:text-sky-300"
              >
                📄 See Example Itinerary
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>⭐ Trusted by travelers worldwide</span>
              <span>•</span>
              <span>🔒 Secure &amp; private</span>
              <span>•</span>
              <span>⚡ No credit card required</span>
            </div>
          </div>

          {/* Simple hero art / placeholder */}
          <div className="flex-1">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-900/40 p-6 shadow-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-300">
                Live AI Itinerary Preview
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3">
                  <span className="text-slate-200">Destination</span>
                  <span className="font-semibold text-sky-300">Tokyo, Japan</span>
                </div>
                <div className="rounded-2xl bg-slate-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Day 1 – Wanderwise AI Suggests:
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-200">
                    <li>• Morning at Senso-ji &amp; Asakusa district</li>
                    <li>• Lunch at a hidden ramen spot near Ueno</li>
                    <li>• Sunset at Tokyo Skytree</li>
                    <li>• Izakaya night in Shinjuku Omoide Yokocho</li>
                  </ul>
                </div>
                <p className="text-xs text-slate-400">
                  Your itinerary will be tailored to your dates, budget, and travel style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-slate-800 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How Wanderwise AI Works
          </h2>
          <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
            Go from “no idea where to start” to a complete trip plan in three simple steps.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                1
              </div>
              <h3 className="text-lg font-semibold">Tell Us Your Destination</h3>
              <p className="text-sm text-slate-300">
                Choose where you&apos;re going, your dates, budget, and the way you like
                to travel — chill, adventurous, foodie, family, or a mix.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                2
              </div>
              <h3 className="text-lg font-semibold">Get Your Personalized Itinerary</h3>
              <p className="text-sm text-slate-300">
                Wanderwise AI builds a day-by-day plan with sights, food, neighborhoods,
                and timing — all optimized for your preferences.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                3
              </div>
              <h3 className="text-lg font-semibold">Chat &amp; Refine with AI</h3>
              <p className="text-sm text-slate-300">
                Ask follow-up questions, swap activities, adjust the pace, or get budget
                advice. Your AI travel assistant is available 24/7.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            {/* Reuses same logic */}
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

      {/* SAMPLE ITINERARY */}
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
                Here&apos;s an example of a 3-day Paris itinerary. Your plan will be fully
                personalized based on your interests and budget.
              </p>

              <div className="mt-6 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-200">
                <div>
                  <h3 className="text-sm font-semibold text-sky-300">
                    Day 1 – Icons &amp; First Impressions
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
                    Day 2 – Art, Views &amp; Neighborhoods
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
                    Day 3 – Old Paris &amp; Farewell
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
                <li>✔ Save hours of research and comparing blogs</li>
                <li>✔ Avoid tourist traps and generic suggestions</li>
                <li>✔ Get ideas aligned with your travel style</li>
                <li>✔ See optimal order of activities &amp; neighborhoods</li>
                <li>✔ Unlimited tweaks via AI chat</li>
              </ul>

              <div className="mt-4">
                <Link
                  href="/ai-chat"
                  className="inline-flex items-center justify-center rounded-full border border-sky-400 px-5 py-2.5 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/10"
                >
                  💬 Chat with the Travel Assistant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="border-b border-slate-800 bg-slate-950/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Start Free, Upgrade When You&apos;re Ready
            </h2>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Test Wanderwise AI with a free plan. Unlock unlimited trips and AI chat with
              Premium — starting from{" "}
              <span className="font-semibold text-sky-300">$3.99/week</span>.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-lg font-semibold">Free Plan</h3>
              <p className="mt-1 text-sm text-slate-300">
                For trying Wanderwise AI for the first time.
              </p>
              <p className="mt-4 text-3xl font-bold">$0</p>
              <p className="text-xs text-slate-400">No credit card required</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• 1 custom itinerary</li>
                <li>• Limited AI chat messages</li>
                <li>• Preview key trip details</li>
              </ul>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStartPlanning}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-50 transition hover:border-sky-400 hover:text-sky-300"
                  disabled={isUserLoading}
                >
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Premium */}
            <div className="flex flex-col rounded-3xl border border-sky-500 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
              <h3 className="text-lg font-semibold">Premium Plan</h3>
              <p className="mt-1 text-sm text-slate-200">
                For frequent travelers, digital nomads, and planners.
              </p>
              <p className="mt-4 text-3xl font-bold">$9.99</p>
              <p className="text-xs text-slate-400">
                per month · or as low as{" "}
                <span className="font-semibold">$3.99/week</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                <li>• Unlimited itineraries</li>
                <li>• Unlimited AI travel chat</li>
                <li>• Save &amp; edit trips in your dashboard</li>
                <li>• Smart recommendations and budget insights</li>
                <li>• Priority support</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/pricing"
                  className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
                >
                  View Full Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Loved by Smart, Curious Travelers
          </h2>
          <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
            Wanderwise AI helps turn vague ideas into real, bookable trips.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
              <p>
                &ldquo;Best travel assistant ever. It saved me hours planning my Europe
                trip.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-400">
                — Sarah L., United Kingdom
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
              <p>
                &ldquo;The AI chat gave me hidden gems I never found on Google or
                TikTok.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-400">
                — Julien M., France
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
              <p>
                &ldquo;I tried a few AI travel tools — Wanderwise feels the most human and
                practical.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-400">
                — Carla D., Canada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Plan Your Next Trip?
          </h2>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Enter your destination, pick your dates, and let Wanderwise AI build your
            first itinerary — completely free.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <input
              type="text"
              placeholder="Where do you want to go next?"
              className="w-full max-w-md rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            {/* Uses same start-planning handler */}
            <button
              type="button"
              onClick={handleStartPlanning}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              disabled={isUserLoading}
            >
              🧭 Get My Free Trip Plan
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            No spam, no pressure — just smarter travel planning.
          </p>
        </div>
      </section>
    </main>
  );
}