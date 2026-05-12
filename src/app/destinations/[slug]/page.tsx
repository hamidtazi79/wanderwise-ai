import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Sparkles, Plane } from 'lucide-react';

import { destinations, DestinationSlug } from '@/lib/destinations';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const destination =
    destinations[params.slug as DestinationSlug];

  if (!destination) {
    return {
      title: 'Destination Not Found',
    };
  }

  return {
    title: `${destination.name} Travel Guide & AI Itinerary Planner`,
    description: destination.description,
    alternates: {
      canonical: `/destinations/${params.slug}`,
    },
    openGraph: {
      title: `${destination.name} Travel Guide`,
      description: destination.description,
      images: [destination.image],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({
    slug,
  }));
}

export default function DestinationPage({ params }: Props) {
  const destination =
    destinations[params.slug as DestinationSlug];

  if (!destination) {
    notFound();
  }

  return (
    <main className="bg-slate-950 text-white">
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2,6,23,0.65), rgba(2,6,23,0.92)), url(${destination.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-300">
              <Sparkles className="mr-2 h-4 w-4" />
              AI destination guide
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              Visit {destination.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-200">
              {destination.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <MapPin className="mr-2 h-4 w-4 text-sky-300" />
                {destination.country}
              </div>

              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <Plane className="mr-2 h-4 w-4 text-sky-300" />
                AI itinerary planning
              </div>
            </div>

            <div className="mt-8">
              <Link
                href={`/itinerary-builder?destination=${destination.name}`}
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              >
                Generate {destination.name} Itinerary
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Best areas',
              text: `Explore the best neighborhoods, attractions, and local experiences in ${destination.name}.`,
            },
            {
              title: 'Food & hidden gems',
              text: `Discover authentic restaurants, cafés, markets, and hidden local places.`,
            },
            {
              title: 'Smart planning',
              text: `Use Wanderwise AI to generate a personalized itinerary in seconds.`,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <h2 className="text-xl font-bold">{item.title}</h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <h2 className="text-3xl font-bold">
            Plan your {destination.name} trip with AI
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Generate a personalized day-by-day itinerary with activities,
            restaurants, hidden gems, hotels, and travel tips.
          </p>

          <Link
            href={`/itinerary-builder?destination=${destination.name}`}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
          >
            Start Planning Free
          </Link>
        </div>
      </section>
    </main>
  );
}
