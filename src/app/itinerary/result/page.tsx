'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { addDoc, collection } from 'firebase/firestore';
import {
  Calendar,
  CheckCircle,
  Crown,
  DollarSign,
  FileText,
  Info,
  Lock,
  MapPin,
  Moon,
  PlusCircle,
  Save,
  Share2,
  Sparkles,
  Sun,
  Sunrise,
  Tag,
} from 'lucide-react';

import { useUser, useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StoredItineraryData {
  destination: string;
  duration: number;
  interests: string;
  budget: 'low' | 'medium' | 'high';
  generatedItinerary: string;
  createdAsGuest?: boolean;
}

type ParsedTrip = GenerateSmartItineraryOutput;

function getDestinationImage(destination?: string) {
  const query = encodeURIComponent(`${destination || 'travel'} destination city`);
  return `https://source.unsplash.com/1600x900/?${query}`;
}

function parseItinerary(raw: string | null): ParsedTrip | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatBudget(budget: StoredItineraryData['budget']) {
  if (budget === 'low') return 'Budget-friendly';
  if (budget === 'high') return 'Premium';
  return 'Mid-range';
}

function getInterestList(interests: string) {
  return interests
    .split(',')
    .map((interest) => interest.trim())
    .filter(Boolean);
}

function collectPlaces(trip: ParsedTrip | null) {
  if (!trip?.days) return [];

  const places = new Set<string>();

  trip.days.forEach((day) => {
    [...day.morning, ...day.afternoon, ...day.evening].forEach((activity) => {
      if (activity.location) places.add(activity.location);
    });
  });

  return Array.from(places).slice(0, 10);
}

function TripSummaryCard({
  data,
  trip,
  onSave,
}: {
  data: StoredItineraryData;
  trip: ParsedTrip | null;
  onSave: () => void;
}) {
  const imageUrl = getDestinationImage(data.destination);

  return (
    <Card className="overflow-hidden border-sky-500/30 shadow-2xl">
      <div
        className="relative min-h-[420px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2,6,23,0.25), rgba(2,6,23,0.92)), url(${imageUrl})`,
        }}
      >
        <CardHeader className="relative z-10 flex min-h-[420px] justify-end space-y-5 p-6 text-white sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-sky-400 text-slate-950 hover:bg-sky-400">
              AI trip ready
            </Badge>
            <Badge variant="secondary">{data.duration} days</Badge>
            <Badge variant="secondary">{formatBudget(data.budget)}</Badge>
          </div>

          <div>
            <CardTitle className="text-4xl font-bold tracking-tight sm:text-6xl">
              {data.destination}
            </CardTitle>
            <CardDescription className="mt-3 text-base text-slate-200 sm:text-lg">
              {data.duration} days ·{' '}
              {getInterestList(data.interests).join(' + ') || 'Personalized'} ·{' '}
              {formatBudget(data.budget)}
            </CardDescription>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-slate-100 sm:text-base">
            {trip?.overview ||
              'Your personalized itinerary is ready. Explore your day-by-day plan, places to visit, hotel ideas, and travel tips before creating an account.'}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onSave}
              size="lg"
              className="bg-sky-400 text-slate-950 hover:bg-sky-300"
            >
              <Save className="mr-2 h-4 w-4" />
              Save This Trip
            </Button>

            <Button asChild size="lg" variant="secondary">
              <Link href="/itinerary-builder">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Another Trip
              </Link>
            </Button>
          </div>

          <p className="text-xs text-slate-300">
            Free preview unlocked. Create a free account only when you want to save it.
          </p>
        </CardHeader>
      </div>
    </Card>
  );
}

/* keep the rest of your current file exactly the same from DayItineraryAccordion down */
