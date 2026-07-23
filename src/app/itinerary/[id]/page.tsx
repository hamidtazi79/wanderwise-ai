'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import {
  Calendar,
  CheckCircle,
  Crown,
  DollarSign,
  Download,
  FileText,
  Info,
  Lock,
  MapPin,
  Moon,
  PlusCircle,
  Share2,
  Sparkles,
  Sun,
  Sunrise,
  Tag,
} from 'lucide-react';

import { useFirestore, useUser, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';
import { getDestinationImage } from '@/lib/getDestinationImage';
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
import HotelRecommendations from '@/components/hotel-recommendations';
import TripIntelligence from '@/components/trip-intelligence';
import PremiumTripMap from '@/components/premium-trip-map';

type StoredItineraryData = {
  destination: string;
  duration: number;
  interests: string;
  budget: 'low' | 'medium' | 'high';
  generatedItinerary: string;
};

function parseItinerary(raw?: string): GenerateSmartItineraryOutput | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatBudget(budget: string) {
  if (budget === 'low') return 'Budget-friendly';
  if (budget === 'high') return 'Premium';
  return 'Mid-range';
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}


function getInterestList(interests?: string) {
  return (interests || '')
    .split(',')
    .map((interest) => interest.trim())
    .filter(Boolean);
}



function TripHero({
  data,
  trip,
  isSubscribed,
  onExport,
  onShare,
}: {
  data: StoredItineraryData;
  trip: GenerateSmartItineraryOutput | null;
  isSubscribed: boolean;
  onExport: () => void;
  onShare: () => void;
}) {
  const interests = getInterestList(data.interests);
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
              Saved trip
            </Badge>
            <Badge variant="secondary">{data.duration} days</Badge>
            <Badge variant="secondary">{formatBudget(data.budget)}</Badge>
            {isSubscribed && (
              <Badge className="bg-amber-400 text-slate-950 hover:bg-amber-400">
                Premium
              </Badge>
            )}
          </div>

          <div>
            <CardTitle className="text-4xl font-bold tracking-tight sm:text-6xl">
              {data.destination}
            </CardTitle>
            <CardDescription className="mt-3 text-base text-slate-200 sm:text-lg">
              {data.duration} days ·{' '}
              {interests.length ? interests.join(' + ') : 'Personalized'} ·{' '}
              {formatBudget(data.budget)}
            </CardDescription>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-slate-100 sm:text-base">
            {trip?.overview ||
              'Your saved itinerary is ready. Review your day-by-day plan, places, hotel ideas, hidden gems, and travel tips.'}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-sky-400 text-slate-950 hover:bg-sky-300"
            >
              <Link href="/itinerary-builder">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Another Trip
              </Link>
            </Button>

            <Button size="lg" variant="secondary" onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            {isSubscribed ? (
              <Button size="lg" variant="secondary" onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link href="/pricing">
                  <Lock className="mr-2 h-4 w-4" />
                  Unlock Export
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </div>
    </Card>
  );
}

function DayAccordion({ trip }: { trip: GenerateSmartItineraryOutput | null }) {
  const [openDay, setOpenDay] = useState(1);

  if (!trip?.days?.length) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Itinerary details unavailable</AlertTitle>
        <AlertDescription>
          The day-by-day plan could not be displayed.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Day-by-day itinerary</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Open each day to review your morning, afternoon, and evening plan.
        </p>
      </div>

      {trip.days.map((day) => {
        const isOpen = openDay === day.day;
        const allActivities = [...day.morning, ...day.afternoon, ...day.evening];
        const estimatedCost = allActivities.reduce(
          (sum, activity) => sum + (Number(activity.cost) || 0),
          0
        );

        return (
          <Card key={day.day} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenDay(isOpen ? 0 : day.day)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                  Day {day.day}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{day.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estimated spend:{' '}
                  {estimatedCost > 0 ? formatUsd(estimatedCost) : 'Flexible'} ·
                  Travel intensity: Moderate
                </p>
              </div>

              <Badge variant={isOpen ? 'default' : 'secondary'}>
                {isOpen ? 'Open' : 'View'}
              </Badge>
            </button>

            {isOpen && (
              <CardContent className="space-y-5 border-t p-5">
                <ActivityBlock title="Morning" icon={<Sunrise className="h-5 w-5" />} activities={day.morning} />
                <ActivityBlock title="Afternoon" icon={<Sun className="h-5 w-5" />} activities={day.afternoon} />
                <ActivityBlock title="Evening" icon={<Moon className="h-5 w-5" />} activities={day.evening} />
              </CardContent>
            )}
          </Card>
        );
      })}
    </section>
  );
}

function ActivityBlock({
  title,
  icon,
  activities,
}: {
  title: string;
  icon: React.ReactNode;
  activities: GenerateSmartItineraryOutput['days'][number]['morning'];
}) {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-semibold text-primary">
        {icon}
        {title}
      </h4>

      {activities.map((activity, index) => (
        <div key={`${title}-${index}`} className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-4 w-4 text-sky-500" />
            <div>
              <p className="font-semibold">{activity.activity}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {activity.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {activity.location && (
                  <Badge variant="secondary">
                    <MapPin className="mr-1 h-3 w-3" />
                    {activity.location}
                  </Badge>
                )}
                {activity.cost != null && (
                  <Badge variant="secondary">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Approx {formatUsd(Number(activity.cost) || 0)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FoodHiddenGemsCard({ interests }: { interests: string[] }) {
  return (
    <Card className="border-sky-500/20">
      <CardHeader>
        <CardTitle>Food & hidden gems</CardTitle>
        <CardDescription>
          Extra ideas to make the trip feel more local and personal.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-muted/50 p-4">
          <h3 className="font-semibold">Local food ideas</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Try a classic breakfast at a neighborhood café.</li>
            <li>Choose one market or food hall for casual local variety.</li>
            <li>Plan one slower dinner near your evening activity.</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-muted/50 p-4">
          <h3 className="font-semibold">Hidden gem ideas</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Explore one quieter side street away from the busiest landmarks.</li>
            <li>Add a local viewpoint or park for a slower travel moment.</li>
            <li>
              Personalize around:{' '}
              {interests.slice(0, 3).join(', ') || 'food, culture, local places'}.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function TravelTipsCard() {
  const tips = [
    'Start popular attractions early to avoid the busiest crowds.',
    'Group activities by neighborhood to reduce wasted travel time.',
    'Leave one flexible slot each day for weather, rest, or discovery.',
    'Use public transport for longer moves and walk local areas slowly.',
    'Book high-demand restaurants or attractions in advance.',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI travel tips</CardTitle>
        <CardDescription>
          Smart reminders to make your itinerary easier to use.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-2">
        {tips.map((tip) => (
          <div key={tip} className="flex gap-3 rounded-xl border p-3 text-sm">
            <CheckCircle className="mt-0.5 h-4 w-4 text-sky-500" />
            <span>{tip}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PremiumUpgradeCard() {
  const features = [
    'Edit itinerary',
    'Save unlimited trips',
    'AI travel chat',
    'Budget insights',
    'Export trip plans',
  ];

  return (
    <Card className="border-amber-400/40">
      <CardHeader>
        <Badge className="w-fit bg-amber-400 text-slate-950 hover:bg-amber-400">
          Most Popular
        </Badge>
        <CardTitle className="mt-2 flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Unlock Full Travel Planning
        </CardTitle>
        <CardDescription>
          Upgrade to edit itineraries, save unlimited trips, export plans, and use AI chat for smarter recommendations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="flex gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-sky-500" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-bold">£9.99/month</p>
          <Button asChild>
            <Link href="/pricing">Upgrade to Premium</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-3 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ItineraryDetailsSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="space-y-6">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function SavedItineraryPage() {
  const params = useParams();
  const id = params.id as string;

  const { user } = useUser();
  const firestore = useFirestore();

  const itineraryRef = useMemoFirebase(() => {
    if (!user || !firestore || !id) return null;
    return doc(firestore, `users/${user.uid}/itineraries`, id);
  }, [user, firestore, id]);

  const { data: itinerary, isLoading, error } = useDoc(itineraryRef);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);
  const isSubscribed =
    Boolean(userProfile?.subscriptionStatus) &&
    userProfile.subscriptionStatus !== 'free';

  const parsedTrip = useMemo(
    () => parseItinerary(itinerary?.generatedItinerary),
    [itinerary]
  );

  const interestsArray = useMemo(
    () => getInterestList(itinerary?.interests),
    [itinerary]
  );

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    try {
      if (navigator.share) {
        await navigator.share({
          title: `My ${itinerary?.destination || 'travel'} itinerary`,
          text: 'Check out this AI-generated trip plan from Wanderwise AI.',
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert('Itinerary link copied.');
    } catch {
      alert('Sharing is unavailable. Please copy the page link manually.');
    }
  };

  const handleExport = () => {
    if (!itinerary?.generatedItinerary) return;

    let textContent = '';

    try {
      const parsed: GenerateSmartItineraryOutput = JSON.parse(
        itinerary.generatedItinerary
      );

      textContent += `Wanderwise AI Itinerary: ${itinerary.destination}\n`;
      textContent += `Duration: ${itinerary.duration} days\n`;
      textContent += `Budget: ${itinerary.budget}\n`;
      textContent += `Interests: ${itinerary.interests}\n\n`;
      textContent += `OVERVIEW:\n${parsed.overview}\n\n`;

      parsed.days.forEach((day) => {
        textContent += `----------\n`;
        textContent += `DAY ${day.day}: ${day.title}\n`;
        textContent += `----------\n\n`;

        textContent += `MORNING:\n`;
        day.morning.forEach((act) => {
          textContent += `- ${act.activity} (${formatUsd(Number(act.cost) || 0)})\n  ${act.description}\n`;
          if (act.location) textContent += `  Location: ${act.location}\n`;
        });

        textContent += `\nAFTERNOON:\n`;
        day.afternoon.forEach((act) => {
          textContent += `- ${act.activity} (${formatUsd(Number(act.cost) || 0)})\n  ${act.description}\n`;
          if (act.location) textContent += `  Location: ${act.location}\n`;
        });

        textContent += `\nEVENING:\n`;
        day.evening.forEach((act) => {
          textContent += `- ${act.activity} (${formatUsd(Number(act.cost) || 0)})\n  ${act.description}\n`;
          if (act.location) textContent += `  Location: ${act.location}\n`;
        });

        textContent += `\n\n`;
      });
    } catch {
      textContent =
        'Could not parse itinerary. Raw data:\n' +
        itinerary.generatedItinerary;
    }

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${itinerary.destination.replace(
      / /g,
      '_'
    )}_Itinerary.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <ItineraryDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Itinerary</AlertTitle>
          <AlertDescription>
            There was a problem fetching your itinerary. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>Itinerary Not Found</AlertTitle>
          <AlertDescription>
            We could not find this itinerary. It may have been deleted or the link
            is incorrect.
          </AlertDescription>
        </Alert>

        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  const data = itinerary as StoredItineraryData;

  return (
    <main className="container mx-auto max-w-5xl space-y-8 px-4 pb-28 pt-8 md:pb-12 md:pt-12">
      <TripHero
        data={data}
        trip={parsedTrip}
        isSubscribed={isSubscribed}
        onExport={handleExport}
        onShare={handleShare}
      />

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-8">
          <DayAccordion trip={parsedTrip} />

          <TripIntelligence
            destination={data.destination}
            duration={data.duration}
            budget={data.budget}
            trip={parsedTrip}
          />

          <FoodHiddenGemsCard interests={interestsArray} />
          <TravelTipsCard />

          {!isSubscribed && <PremiumUpgradeCard />}
        </div>

        <aside className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Trip details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Duration"
                value={`${data.duration} days`}
              />

              <DetailRow
                icon={<DollarSign className="h-4 w-4" />}
                label="Budget"
                value={formatBudget(data.budget)}
              />

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Interests
                </div>

                <div className="flex flex-wrap gap-2">
                  {interestsArray.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <PremiumTripMap
            destination={data.destination}
            trip={parsedTrip}
            isPremium={isSubscribed}
          />
          <HotelRecommendations
            destination={data.destination}
            recommendations={parsedTrip?.hotelRecommendations}
          />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-2xl backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Button size="sm" asChild>
            <Link href="/itinerary-builder">
              <PlusCircle className="mr-1 h-4 w-4" />
              New
            </Link>
          </Button>

          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>

          {isSubscribed ? (
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link href="/pricing">
                <Crown className="mr-1 h-4 w-4" />
                Upgrade
              </Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

