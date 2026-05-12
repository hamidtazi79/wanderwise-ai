'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  FileText,
  User,
  CreditCard,
  Loader2,
  LayoutDashboard,
  PlusCircle,
  MessageCircle,
  BookUser,
  Sparkles,
  Award,
  Calendar,
  Repeat,
  MapPin,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  limit,
} from 'firebase/firestore';
import Link from 'next/link';
import { ProfileForm } from './profile-form';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addMonths, addYears } from 'date-fns';
import { useState } from 'react';
import { cancelStripeSubscriptionAtPeriodEnd } from './actions';
import { getDestinationImage } from '@/lib/getDestinationImage';


function formatTripDate(createdAt?: string) {
  if (!createdAt) return 'Recently saved';

  try {
    return format(new Date(createdAt), 'MMM dd, yyyy');
  } catch {
    return 'Recently saved';
  }
}

function ItinerariesList({ pageSize }: { pageSize?: number }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const itinerariesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;

    const baseQuery = collection(firestore, `users/${user.uid}/itineraries`);
    const constraints: any[] = [orderBy('createdAt', 'desc')];

    if (pageSize) {
      constraints.push(limit(pageSize));
    }

    return query(baseQuery, ...constraints);
  }, [user, firestore, pageSize]);

  const { data: itineraries, isLoading } = useCollection(itinerariesQuery);

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(pageSize || 3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-36 w-full" />
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-muted/40 px-6 py-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
          <Sparkles className="h-7 w-7" />
        </div>

        <h3 className="text-xl font-semibold">No Saved Trips Yet</h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Generate your first AI itinerary and save it here as a visual travel
          card.
        </p>

        <Button asChild className="mt-5">
          <Link href="/itinerary-builder">Create Your First Itinerary</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary: any) => {
        const imageUrl = getDestinationImage(itinerary.destination);

        return (
          <Card
            key={itinerary.id}
            className="group overflow-hidden border-slate-800/60 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className="relative h-40 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.15), rgba(2, 6, 23, 0.85)), url(${imageUrl})`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{itinerary.destination}</span>
                </div>

                <h3 className="mt-1 line-clamp-1 text-xl font-bold">
                  {itinerary.destination}
                </h3>
              </div>
            </div>

            <CardContent className="space-y-4 p-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-500">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  {itinerary.duration} days
                </span>

                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
                  {itinerary.budget} budget
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTripDate(itinerary.createdAt)}</span>
              </div>

              <Button asChild className="w-full">
                <Link href={`/itinerary/${itinerary.id}`}>
                  Open Trip
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SubscriptionTab() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc(userProfileRef);

  const planName = userProfile?.subscriptionStatus || 'free';
  const isSubscribed = planName !== 'free';
  const isCancellationScheduled = !!userProfile?.subscriptionCancelAtPeriodEnd;

  const getRenewalDate = () => {
    if (userProfile?.subscriptionCurrentPeriodEnd) {
      return format(
        new Date(userProfile.subscriptionCurrentPeriodEnd),
        'MMMM dd, yyyy'
      );
    }

    if (!userProfile?.subscriptionStartDate) return null;

    const startDate = new Date(userProfile.subscriptionStartDate);

    if (userProfile.subscriptionStatus === 'weekly') {
      return format(
        new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        'MMMM dd, yyyy'
      );
    }

    if (userProfile.subscriptionStatus === 'monthly') {
      return format(addMonths(startDate, 1), 'MMMM dd, yyyy');
    }

    if (userProfile.subscriptionStatus === 'yearly') {
      return format(addYears(startDate, 1), 'MMMM dd, yyyy');
    }

    return null;
  };

  const renewalDate = getRenewalDate();

  const handleCancelSubscription = async () => {
    if (!userProfileRef || !user?.email) return;

    try {
      setIsCancelling(true);

      const result = await cancelStripeSubscriptionAtPeriodEnd({
        subscriptionId: userProfile?.stripeSubscriptionId || null,
        email: user.email,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      await updateDoc(userProfileRef, {
        stripeSubscriptionId:
          result.subscriptionId || userProfile?.stripeSubscriptionId || null,
        stripeCustomerId:
          result.customerId || userProfile?.stripeCustomerId || null,
        subscriptionCancelAtPeriodEnd: result.cancelAtPeriodEnd,
        subscriptionCurrentPeriodEnd: result.currentPeriodEnd,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Cancellation scheduled',
        description: result.currentPeriodEnd
          ? `Your subscription will remain active until ${format(
              new Date(result.currentPeriodEnd),
              'MMMM dd, yyyy'
            )}.`
          : 'Your subscription will remain active until the end of the billing period.',
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error cancelling subscription',
        description:
          e?.message ||
          'There was a problem cancelling your subscription. Please try again.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          View and manage your current subscription plan.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin" />
            <span>Loading your subscription details...</span>
          </div>
        ) : userProfile ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/50 p-6">
              <p className="text-sm font-medium text-muted-foreground">
                Current Plan
              </p>
              <p className="text-xl font-bold capitalize text-primary">
                {planName}
              </p>
            </Card>

            <Card className="bg-muted/50 p-6">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <p className="text-xl font-bold">
                {isSubscribed
                  ? isCancellationScheduled
                    ? 'Cancelling'
                    : 'Active'
                  : 'Inactive'}
              </p>
            </Card>

            {isSubscribed && userProfile.subscriptionStartDate && (
              <>
                <Card className="bg-muted/50 p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Subscription Date
                      </p>
                      <p className="font-semibold">
                        {format(
                          new Date(userProfile.subscriptionStartDate),
                          'MMMM dd, yyyy'
                        )}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-muted/50 p-6">
                  <div className="flex items-center gap-3">
                    <Repeat className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {isCancellationScheduled
                          ? 'Access Until'
                          : 'Next Renewal Date'}
                      </p>
                      <p className="font-semibold">{renewalDate || '—'}</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Could not load subscription details.
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t pt-6">
        {isSubscribed ? (
          <div className="w-full">
            <p className="mb-4 text-sm text-muted-foreground">
              {isCancellationScheduled
                ? 'Your subscription is already scheduled to cancel at the end of the current billing period.'
                : 'Need to make changes to your plan?'}
            </p>

            {isCancellationScheduled ? (
              <Button variant="outline" disabled>
                Cancellation Scheduled
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Manage Subscription</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Cancel Your Subscription
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Your Stripe subscription will be cancelled at the end of
                      your current billing period. You will keep premium access
                      until that date. No future renewals will be charged.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCancelling}>
                      Go Back
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ) : (
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/pricing">Upgrade to Premium</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function OverviewTab({
  onTabChange,
}: {
  onTabChange: (value: string) => void;
}) {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const itinerariesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/itineraries`),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc(userProfileRef);
  const { data: itineraries } = useCollection(itinerariesQuery);

  const isSubscribed = userProfile?.subscriptionStatus !== 'free';

  if (isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-sky-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white lg:col-span-2">
          <CardHeader>
            {isSubscribed ? (
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
                  Premium travel workspace
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Welcome back,{' '}
                  <span className="text-sky-300">
                    {userProfile?.displayName || 'Explorer'}
                  </span>
                  !
                </h2>
                <p className="mt-2 text-slate-300">
                  Your saved trips, AI planning tools, and travel ideas are ready.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
                  Free travel planning
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Turn your next trip idea into a real itinerary
                </h2>
                <p className="mt-2 text-slate-300">
                  Generate a trip for free, preview the plan, and save it when
                  you are ready.
                </p>
              </div>
            )}
          </CardHeader>

          <CardFooter>
            <Button asChild className="bg-sky-400 text-slate-950 hover:bg-sky-300">
              <Link href="/itinerary-builder">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a New Itinerary
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {userProfile?.subscriptionStatus || 'Free'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isSubscribed
                ? userProfile?.subscriptionCancelAtPeriodEnd
                  ? 'Cancellation scheduled at period end'
                  : 'Premium features active'
                : 'Free planning mode'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itineraries Saved
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itineraries?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {isSubscribed
                ? 'Unlimited generations remaining'
                : `${userProfile?.itinerariesGenerated || 0}/2 used`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Messages Sent
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.chatMessagesSent || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isSubscribed
                ? 'Unlimited messages'
                : `${userProfile?.chatMessagesSent || 0}/1 used`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Tier</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {userProfile?.subscriptionStatus || 'Free'}
            </div>
            <p className="text-xs text-muted-foreground">Current plan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Itineraries</CardTitle>
            <CardDescription>
              Your latest saved trips, now shown as visual travel cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItinerariesList pageSize={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump right back in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/itinerary-builder">
                <PlusCircle className="mr-2" />
                Create New Itinerary
              </Link>
            </Button>

            <Button asChild className="w-full" variant="secondary">
              <Link href="/ai-chat">
                <Sparkles className="mr-2" />
                Ask AI Assistant
              </Link>
            </Button>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => onTabChange('profile')}
            >
              <BookUser className="mr-2" />
              Update Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto py-12">
      <h1 className="font-headline mb-8 text-4xl font-bold tracking-tight">
        Dashboard
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[500px] md:grid-cols-4">
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="itineraries">
            <FileText className="mr-2 h-4 w-4" />
            My Trips
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="itineraries" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Trips</CardTitle>
              <CardDescription>
                Access and manage all your saved travel plans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItinerariesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
