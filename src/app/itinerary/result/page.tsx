'use client';

import { Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { addDoc, collection } from 'firebase/firestore';
import type { User } from 'firebase/auth';
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
import { SignupSaveDialog } from '@/components/signup-save-dialog';

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
            Free preview unlocked. Create a free account only when you want to
            save it.
          </p>
        </CardHeader>
      </div>
    </Card>
  );
}

function DayItineraryAccordion({ trip }: { trip: ParsedTrip | null }) {
  const [openDay, setOpenDay] = useState(1);

  if (!trip?.days?.length) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Itinerary details unavailable</AlertTitle>
        <AlertDescription>
          The day-by-day plan could not be displayed. Please generate a new
          itinerary.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Day-by-day itinerary
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Open each day to see your morning, afternoon, and evening plan.
        </p>
      </div>

      {trip.days.map((day) => {
        const isOpen = openDay === day.day;
        const allActivities = [
          ...day.morning,
          ...day.afternoon,
          ...day.evening,
        ];
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
                  {estimatedCost > 0 ? `£${estimatedCost}` : 'Flexible'} ·
                  Travel intensity: Moderate
                </p>
              </div>

              <Badge variant={isOpen ? 'default' : 'secondary'}>
                {isOpen ? 'Open' : 'View'}
              </Badge>
            </button>

            {isOpen && (
              <CardContent className="space-y-5 border-t p-5">
                <ActivityBlock
                  title="Morning"
                  icon={<Sunrise className="h-5 w-5" />}
                  activities={day.morning}
                />
                <ActivityBlock
                  title="Afternoon"
                  icon={<Sun className="h-5 w-5" />}
                  activities={day.afternoon}
                />
                <ActivityBlock
                  title="Evening"
                  icon={<Moon className="h-5 w-5" />}
                  activities={day.evening}
                />

                <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  Suggested food area:{' '}
                  <span className="font-medium text-foreground">
                    {day.evening?.[0]?.location ||
                      day.afternoon?.[0]?.location ||
                      'Local neighborhood cafés'}
                  </span>
                </div>
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
  icon: ReactNode;
  activities: ParsedTrip['days'][number]['morning'];
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
                    Approx £{activity.cost}
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

function PlacesPreviewCard({
  places,
  onUnlock,
}: {
  places: string[];
  onUnlock: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Places in this trip</CardTitle>
        <CardDescription>
          {places.length || 0} places detected from your itinerary.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-2xl border bg-gradient-to-br from-sky-50 to-slate-100 p-6 text-center dark:from-slate-900 dark:to-slate-800">
          <MapPin className="mx-auto h-8 w-8 text-sky-500" />
          <p className="mt-3 font-medium">
            Interactive map available after signup
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save your trip to keep places, routes, and map planning in one
            dashboard.
          </p>

          <Button onClick={onUnlock} className="mt-4">
            <Lock className="mr-2 h-4 w-4" />
            Unlock Map View
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(places.length ? places : ['More places available after signup']).map(
            (place) => (
              <Badge key={place} variant="secondary">
                {place}
              </Badge>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function HotelRecommendationsCard({ destination }: { destination: string }) {
  const hotels = [
    {
      label: 'Budget',
      area: 'Well-connected outer central area',
      price: 'From £80/night',
      description:
        'Best if you want to keep costs lower while staying close to transport.',
    },
    {
      label: 'Mid-range',
      area: 'Central walkable neighborhood',
      price: 'From £140/night',
      description:
        'Great for first-time visitors who want food, sights, and easy daily routing.',
    },
    {
      label: 'Premium',
      area: 'Iconic view or luxury district',
      price: 'From £280/night',
      description:
        'Ideal for special trips, romantic stays, and a more polished travel experience.',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where to stay</CardTitle>
        <CardDescription>
          Hotel ideas based on your {destination} itinerary.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        {hotels.map((hotel) => (
          <div key={hotel.label} className="rounded-2xl border p-4">
            <Badge>{hotel.label}</Badge>
            <h3 className="mt-3 font-semibold">{hotel.area}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {hotel.description}
            </p>
            <p className="mt-3 text-sm font-semibold">{hotel.price}</p>
          </div>
        ))}

        <p className="text-sm text-muted-foreground sm:col-span-3">
          Save trip to keep hotel recommendations and compare options later.
        </p>
      </CardContent>
    </Card>
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
            <li>
              Explore one quieter side street away from the busiest landmarks.
            </li>
            <li>Add a local viewpoint or park for a slower travel moment.</li>
            <li>
              Use your interests:{' '}
              {interests.slice(0, 3).join(', ') ||
                'food, culture, local places'}
              .
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

function SaveTripPrompt({ onSave }: { onSave: () => void }) {
  return (
    <Card className="border-sky-500/30 bg-sky-50 dark:bg-sky-950/20">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Want to keep this itinerary?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a free account to save, revisit, and organize your trip
            anytime.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save My Trip
          </Button>
          <Button variant="outline">Continue exploring</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PremiumUpgradeCard({ onUpgrade }: { onUpgrade: () => void }) {
  const features = [
    'Edit and refine this itinerary',
    'Save unlimited trips',
    'Unlimited AI travel chat',
    'Budget insights and export tools',
    'Dashboard access for all trips',
  ];

  return (
    <Card className="overflow-hidden border-2 border-sky-500 shadow-2xl">
      <CardHeader className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white">
        <Badge className="w-fit bg-amber-400 text-slate-950 hover:bg-amber-400">
          Most Popular
        </Badge>

        <CardTitle className="mt-3 flex items-center gap-2 text-2xl">
          <Crown className="h-6 w-6 text-amber-400" />
          Unlock Full Travel Planning
        </CardTitle>

        <CardDescription className="text-slate-300">
          Keep this trip, edit it later, plan unlimited itineraries, and use AI
          chat to improve your route, hotels, budget, and travel ideas.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="flex gap-2 text-sm">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-sky-500/10 p-4">
          <p className="text-sm font-medium">Premium helps when you want to:</p>
          <p className="mt-1 text-sm text-muted-foreground">
            save trips, compare options, ask follow-up questions, export your
            plan, and organize everything in one dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-bold">£9.99/month</p>
            <p className="text-xs text-muted-foreground">
              Start free. Upgrade only when you need more.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={onUpgrade}
              className="bg-sky-500 text-slate-950 hover:bg-sky-400"
            >
              Upgrade to Premium
            </Button>
            <Button variant="outline">Maybe later</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StickyActionBar({
  onSave,
  onShare,
  onUpgrade,
}: {
  onSave: () => void;
  onShare: () => void;
  onUpgrade: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <Button size="sm" onClick={onSave}>
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>

        <Button size="sm" variant="outline" onClick={onShare}>
          <Share2 className="mr-1 h-4 w-4" />
          Share
        </Button>

        <Button size="sm" variant="outline" onClick={onUpgrade}>
          <Crown className="mr-1 h-4 w-4" />
          Upgrade
        </Button>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
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

function ItineraryResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [itineraryData, setItineraryData] =
    useState<StoredItineraryData | null>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;

    const storedData = sessionStorage.getItem(id);
    if (storedData) {
      setItineraryData(JSON.parse(storedData));
    }
  }, [id]);

  const parsedTrip = useMemo(
    () => parseItinerary(itineraryData?.generatedItinerary || null),
    [itineraryData]
  );

  const interestsArray = useMemo(
    () => getInterestList(itineraryData?.interests || ''),
    [itineraryData]
  );

  const places = useMemo(() => collectPlaces(parsedTrip), [parsedTrip]);

  const saveTripToFirestore = async (uid: string) => {
    if (!itineraryData || !firestore) return;

    const itinerariesRef = collection(firestore, `users/${uid}/itineraries`);

    const saveData = {
      ...itineraryData,
      userId: uid,
      createdAt: new Date().toISOString(),
    };

    const newDoc = await addDoc(itinerariesRef, saveData);

    if (id) {
      sessionStorage.removeItem(id);
    }

    router.push(`/itinerary/${newDoc.id}`);
  };

  const handleSave = async () => {
    if (!itineraryData) return;

    if (!user) {
      setIsSignupOpen(true);
      return;
    }

    try {
      await saveTripToFirestore(user.uid);

      toast({
        title: 'Itinerary Saved!',
        description: 'Your trip has been saved to your dashboard.',
      });
    } catch (e) {
      console.error('Error saving itinerary:', e);
      toast({
        title: 'Error Saving Itinerary',
        description:
          'There was a problem saving your itinerary. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSignupSuccess = async (newUser: User) => {
    await saveTripToFirestore(newUser.uid);
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    try {
      if (navigator.share) {
        await navigator.share({
          title: `My ${itineraryData?.destination || 'travel'} itinerary`,
          text: 'Check out this AI-generated trip plan from Wanderwise AI.',
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link copied',
        description: 'The itinerary link was copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Share unavailable',
        description: 'Please copy the page link manually.',
      });
    }
  };

  if (!itineraryData) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>No Itinerary Found</AlertTitle>
          <AlertDescription>
            It looks like no itinerary data was provided or the session has
            expired. Please go back and generate a new one.
          </AlertDescription>
        </Alert>

        <Button asChild className="mt-6">
          <Link href="/itinerary-builder">Generate a new itinerary</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto max-w-5xl space-y-8 px-4 pb-28 pt-8 md:pb-12 md:pt-12">
        <TripSummaryCard
          data={itineraryData}
          trip={parsedTrip}
          onSave={handleSave}
        />

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-8">
            <DayItineraryAccordion trip={parsedTrip} />
            <SaveTripPrompt onSave={handleSave} />
            <FoodHiddenGemsCard interests={interestsArray} />
            <TravelTipsCard />
            <PremiumUpgradeCard onUpgrade={handleUpgrade} />
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
                  value={`${itineraryData.duration} days`}
                />
                <DetailRow
                  icon={<DollarSign className="h-4 w-4" />}
                  label="Budget"
                  value={formatBudget(itineraryData.budget)}
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

            <PlacesPreviewCard places={places} onUnlock={handleSave} />
            <HotelRecommendationsCard destination={itineraryData.destination} />
          </aside>
        </div>
      </main>

      <StickyActionBar
        onSave={handleSave}
        onShare={handleShare}
        onUpgrade={handleUpgrade}
      />

      <SignupSaveDialog
        open={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
}

export default function ItineraryResultPage() {
  return (
    <Suspense fallback={<ItineraryDetailsSkeleton />}>
      <ItineraryResultContent />
    </Suspense>
  );
}
