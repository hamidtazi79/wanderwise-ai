'use client';

import { useFirestore, useUser, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
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
  Download,
  Sunrise,
  Sun,
  Moon,
  MapPin,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

function BudgetPlanner({ itinerary }: { itinerary: GenerateSmartItineraryOutput | null }) {
    if (!itinerary) return null;

    const totalCost = itinerary.days.reduce((total, day) => {
        const dayTotal = [...day.morning, ...day.afternoon, ...day.evening].reduce((daySum, activity) => daySum + activity.cost, 0);
        return total + dayTotal;
    }, 0);

    const chartData = itinerary.days.map(day => {
        const dailyTotal = [...day.morning, ...day.afternoon, ...day.evening].reduce((sum, act) => sum + act.cost, 0);
        return {
            day: `Day ${day.day}`,
            totalCost: dailyTotal,
        };
    });

     const chartConfig = {
        totalCost: {
            label: "Daily Cost",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Total Estimated Budget</CardTitle>
                    <CardDescription>An AI-powered estimate for your entire trip.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">${totalCost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Based on the generated activities and budget level.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Cost Breakdown</CardTitle>
                    <CardDescription>Visualize your estimated spending for each day of the trip.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="w-full h-[300px]">
                        <BarChart data={chartData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis 
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip 
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="totalCost" fill="var(--color-totalCost)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}


function ParsedItinerary({ itinerary }: { itinerary: GenerateSmartItineraryOutput | null }) {
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

  const { overview, days } = itinerary;

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

export default function ItineraryResultPage() {
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
  const isSubscribed = userProfile?.subscriptionStatus !== 'free';

  const handleExport = () => {
    if (!itinerary?.generatedItinerary) return;

    let textContent = '';
    try {
      const parsed: GenerateSmartItineraryOutput = JSON.parse(itinerary.generatedItinerary);
      textContent += `Wanderwise AI Itinerary: ${itinerary.destination}\n`;
      textContent += `Duration: ${itinerary.duration} days\n`;
      textContent += `Budget: ${itinerary.budget}\n`;
      textContent += `Interests: ${itinerary.interests}\n\n`;
      textContent += `OVERVIEW:\n${parsed.overview}\n\n`;

      parsed.days.forEach(day => {
        textContent += `----------\n`;
        textContent += `DAY ${day.day}: ${day.title}\n`;
        textContent += `----------\n\n`;
        
        textContent += `MORNING:\n`;
        day.morning.forEach(act => {
            textContent += `- ${act.activity} ($${act.cost})\n  ${act.description}\n`;
            if (act.location) textContent += `  Location: ${act.location}\n`;
        });
        textContent += `\n`;

        textContent += `AFTERNOON:\n`;
        day.afternoon.forEach(act => {
            textContent += `- ${act.activity} ($${act.cost})\n  ${act.description}\n`;
            if (act.location) textContent += `  Location: ${act.location}\n`;
        });
        textContent += `\n`;

        textContent += `EVENING:\n`;
        day.evening.forEach(act => {
            textContent += `- ${act.activity} ($${act.cost})\n  ${act.description}\n`;
            if (act.location) textContent += `  Location: ${act.location}\n`;
        });
        textContent += `\n\n`;
      });

    } catch {
      textContent = "Could not parse itinerary. Raw data:\n" + itinerary.generatedItinerary;
    }


    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${itinerary.destination.replace(/ /g, '_')}_Itinerary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
    const parsedItineraryData = useMemoFirebase(() => {
        if (!itinerary?.generatedItinerary) return null;
        try {
            return JSON.parse(itinerary.generatedItinerary);
        } catch {
            return null;
        }
    }, [itinerary]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <ItineraryDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Itinerary</AlertTitle>
          <AlertDescription>
            There was a problem fetching your itinerary. It's possible you
            don't have permission to view this document. Please try again
            later.
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
            We couldn't find the itinerary you're looking for. It may have
            been deleted or the link is incorrect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const interestsArray = itinerary.interests
    .split(',')
    .map((interest: string) => interest.trim());

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="font-headline text-4xl font-bold tracking-tight">
                Your Itinerary: {itinerary.destination}
              </CardTitle>
              <CardDescription className="mt-2 text-lg text-muted-foreground">
                A personalized plan for your adventure.
              </CardDescription>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              {isSubscribed && (
                <Button onClick={handleExport} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
              <Button asChild>
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
                <div className="text-2xl font-bold">
                  {itinerary.duration} Days
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {itinerary.budget}
                </div>
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
            <Tabs defaultValue="itinerary">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="itinerary">
                         <FileText className="mr-2 h-4 w-4" />
                        Itinerary
                    </TabsTrigger>
                    <TabsTrigger value="budget" disabled={!isSubscribed}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Budget
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="itinerary" className="mt-6">
                    <ParsedItinerary itinerary={parsedItineraryData} />
                </TabsContent>
                <TabsContent value="budget" className="mt-6">
                    <BudgetPlanner itinerary={parsedItineraryData} />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
