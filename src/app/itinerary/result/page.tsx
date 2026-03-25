'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FileText,
  Calendar,
  DollarSign,
  Tag,
  Info,
  PlusCircle,
  Save,
  Sunrise,
  Sun,
  Moon,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Suspense, useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase/provider';
import {
  addDoc,
  collection,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';

interface StoredItineraryData {
  destination: string;
  duration: number;
  interests: string;
  budget: 'low' | 'medium' | 'high';
  generatedItinerary: string;
}

function ParsedItinerary({ itinerary }: { itinerary: string | null }) {
  if (!itinerary) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Itinerary Not Available</AlertTitle>
        <AlertDescription>
          The content for this itinerary could not be loaded. It might be empty
          or formatted incorrectly.
        </AlertDescription>
      </Alert>
    );
  }

  let parsedItinerary: GenerateSmartItineraryOutput;
  try {
    parsedItinerary = JSON.parse(itinerary);
  } catch (error) {
    console.error('Failed to parse itinerary JSON:', error);
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Parsing Error</AlertTitle>
        <AlertDescription>
          There was an issue displaying the itinerary. The format is invalid.
        </AlertDescription>
      </Alert>
    );
  }

  const { overview, days } = parsedItinerary;

  return (
    <div className="space-y-8">
      <p className="text-lg text-muted-foreground">{overview}</p>
      <Separator />
      {days.map(day => (
        <div key={day.day} className="relative pl-8">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            {day.day}
          </div>
          <h2 className="text-2xl font-bold font-headline">{day.title}</h2>

          <div className="mt-6 space-y-8">
            {/* Morning */}
            <div className="space-y-4">
              <h3 className="flex items-center text-xl font-semibold text-primary">
                <Sunrise className="mr-3 h-6 w-6" />
                Morning
              </h3>
              {day.morning.map((act, i) => (
                <Card key={`morning-${i}`} className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="mr-3 h-5 w-5 text-accent" />
                      {act.activity}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{act.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      {act.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{act.location}</span>
                        </div>
                      )}
                      {act.cost != null && (
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="mr-2 h-4 w-4" />
                           <span>Estimated Cost: ${act.cost}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Afternoon */}
            <div className="space-y-4">
              <h3 className="flex items-center text-xl font-semibold text-primary">
                <Sun className="mr-3 h-6 w-6" />
                Afternoon
              </h3>
              {day.afternoon.map((act, i) => (
                <Card key={`afternoon-${i}`} className="bg-muted/30">
                   <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="mr-3 h-5 w-5 text-accent" />
                      {act.activity}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{act.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      {act.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{act.location}</span>
                        </div>
                      )}
                      {act.cost != null && (
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="mr-2 h-4 w-4" />
                           <span>Estimated Cost: ${act.cost}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Evening */}
            <div className="space-y-4">
              <h3 className="flex items-center text-xl font-semibold text-primary">
                <Moon className="mr-3 h-6 w-6" />
                Evening
              </h3>
              {day.evening.map((act, i) => (
                <Card key={`evening-${i}`} className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="mr-3 h-5 w-5 text-accent" />
                      {act.activity}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{act.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      {act.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{act.location}</span>
                        </div>
                      )}
                      {act.cost != null && (
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="mr-2 h-4 w-4" />
                           <span>Estimated Cost: ${act.cost}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ItineraryDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
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

  const [itineraryData, setItineraryData] = useState<StoredItineraryData | null>(null);
  
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
        const storedData = sessionStorage.getItem(id);
        if (storedData) {
            setItineraryData(JSON.parse(storedData));
        }
    }
  }, [id]);

  const handleSave = async () => {
    if (!user || !firestore) {
      toast({
        title: 'Login Required',
        description: 'Please log in or create an account to save your itinerary.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (!itineraryData) {
      toast({
        title: 'Error',
        description: 'Could not save itinerary due to missing information.',
        variant: 'destructive',
      });
      return;
    }

    // Save to Firestore
    const itinerariesRef = collection(
      firestore,
      `users/${user.uid}/itineraries`
    );
    const saveData = {
      ...itineraryData,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    try {
      const newDoc = await addDoc(itinerariesRef, saveData);
      toast({
        title: 'Itinerary Saved!',
        description: 'Your trip has been saved to your dashboard.',
      });
      // Clean up sessionStorage after saving
      if (id) {
        sessionStorage.removeItem(id);
      }
      router.push(`/itinerary/${newDoc.id}`);
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

  if (!itineraryData) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>No Itinerary Found</AlertTitle>
          <AlertDescription>
            It looks like no itinerary data was provided or the session has expired. Please go back and generate a new one.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const interestsArray = itineraryData.interests
    ? itineraryData.interests.split(',').map((interest: string) => interest.trim())
    : [];

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="font-headline text-4xl font-bold tracking-tight">
                Your Itinerary: {itineraryData.destination}
              </CardTitle>
              <CardDescription className="mt-2 text-lg text-muted-foreground">
                A personalized plan for your adventure.
              </CardDescription>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Itinerary
              </Button>
              <Button asChild variant="outline">
                <Link href="/itinerary-builder">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Itinerary
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{itineraryData.duration} Days</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{itineraryData.budget}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 sm:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Interests</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {interestsArray.map((interest: string) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <Separator />

          <ParsedItinerary itinerary={itineraryData.generatedItinerary} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ItineraryResultPage() {
  return (
    <Suspense fallback={<ItineraryDetailsSkeleton />}>
      <ItineraryResultContent />
    </Suspense>
  );
}
