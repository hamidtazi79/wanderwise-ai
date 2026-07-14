import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MessageCircle,
  Sparkles,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

import { ChatInterface } from './chat-interface';

export const metadata: Metadata = {
  title: 'AI Travel Chat & Trip Planning Assistant',
  description:
    'Chat with Wanderwise AI to get personalized travel answers, destination ideas, itinerary help, and trip planning recommendations instantly.',
  alternates: {
    canonical: '/ai-chat',
  },
};

const chatBenefits = [
  {
    label: 'Instant travel answers',
    icon: Clock,
  },
  {
    label: 'Destination recommendations',
    icon: MapPin,
  },
  {
    label: 'Personalized AI guidance',
    icon: ShieldCheck,
  },
];

const assistantCapabilities = [
  'Build a smarter day-by-day route',
  'Find hidden gems and local food spots',
  'Compare neighborhoods and areas to stay',
  'Create realistic travel schedules',
  'Plan around your budget and travel style',
  'Get destination inspiration instantly',
];

const exampleQuestions = [
  '“Plan a 5-day Tokyo itinerary for food lovers.”',
  '“Where should I stay in Paris for nightlife?”',
  '“Best hidden gems in Marrakech?”',
  '“How much budget do I need for Dubai?”',
  '“What is the best area for first-time visitors in Rome?”',
];

export default function AiChatPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative isolate overflow-hidden border-b bg-slate-950 text-white sm:bg-gradient-to-br sm:from-slate-950 sm:via-slate-900 sm:to-sky-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-sky-400/20 bg-slate-900 px-4 py-2 text-sm font-semibold text-sky-300 sm:bg-sky-400/10">
              <Sparkles className="mr-2 h-4 w-4 shrink-0" />
              AI-powered travel assistant
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Ask anything about your next trip
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Wanderwise AI helps you plan smarter trips with instant answers
              about destinations, itineraries, neighborhoods, food, hotels,
              budgets, routes, hidden gems, and travel ideas.
            </p>

            <div className="mt-6 flex flex-col items-start gap-3 text-sm text-slate-300 sm:flex-row sm:flex-wrap">
              {chatBenefits.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex max-w-full items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-2 sm:border-white/10 sm:bg-white/5"
                >
                  <Icon className="mr-2 h-4 w-4 shrink-0 text-sky-300" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10">
                  <MessageCircle className="h-6 w-6 text-sky-500" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    What can Wanderwise AI help with?
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Use AI chat before, during, or after planning.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {assistantCapabilities.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />

                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Example questions to ask</h2>

              <div className="mt-5 space-y-3">
                {exampleQuestions.map((question) => (
                  <div
                    key={question}
                    className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-slate-950 p-6 text-white shadow-xl sm:bg-gradient-to-br sm:from-slate-950 sm:via-slate-900 sm:to-sky-950">
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-6 w-6 shrink-0 text-sky-300" />

                <div>
                  <h2 className="text-xl font-bold">
                    Need a full itinerary instead?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Generate a complete personalized travel plan with the AI
                    itinerary builder.
                  </p>
                </div>
              </div>

              <Link
                href="/itinerary-builder"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Open AI Itinerary Builder
              </Link>
            </div>
          </div>

          <div className="min-h-[650px] overflow-hidden rounded-3xl border bg-white shadow-xl sm:min-h-[750px]">
            <ChatInterface />
          </div>
        </div>
      </section>
    </main>
  );
}
