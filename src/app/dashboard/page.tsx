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
      <div className="space-y-4">
        {[...Array(pageSize || 3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center">
        <h3 className="text-xl font-semibold">No Saved Trips Yet</h3>
        <p className="mt-2 text-muted-foreground">
          Your generated itineraries will appear here.
        </p>
        <Button asChild className="mt-4">
          <Link href="/itinerary-builder">Create Your First Itinerary</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {itineraries.map((itinerary: any) => (
        <Card key={itinerary.id} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-lg font-semibold">{itinerary.destination}</h3>
              <p className="text-sm text-muted-foreground">
                {itinerary.duration} days, {itinerary.budget} budget
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/itinerary/${itinerary.id}`}>View</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
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
    if (!userProfileRef) return;

    try {
      setIsCancelling(true);

      const stripeSubscriptionId = userProfile?.stripeSubscriptionId;

      if (!stripeSubscriptionId) {
        throw new Error(
          'No Stripe subscription ID found for this account. Please contact support.'
        );
      }

      const result = await cancelStripeSubscriptionAtPeriodEnd(
        stripeSubscriptionId
      );

      if (!result.success) {
        throw new Error('Failed to cancel subscription in Stripe.');
      }

      await updateDoc(userProfileRef, {
        subscriptionCancelAtPeriodEnd: result.cancelAtPeriodEnd,
        subscriptionCurrentPeriodEnd: result.currentPeriodEnd,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Cancellation scheduled',
        description:
          result.currentPeriodEnd
            ? `Your subscription will stay active until ${format(
                new Date(result.currentPeriodEnd),
                'MMMM dd, yyyy'
              )}.`
            : 'Your subscription will stay active until the end of the billing period.',
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

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);
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
        <Card className="lg:col-span-2">
          <CardHeader>
            {isSubscribed ? (
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back,{' '}
                  <span className="text-primary">
                    {userProfile?.displayName || 'Explorer'}
                  </span>
                  !
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Your premium adventure awaits. Ready to plan your next trip?
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">
                  Unlock Your Ultimate Travel Companion
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Upgrade to Wanderwise AI Premium for unlimited itineraries,
                  trip saving, and more.
                </p>
              </div>
            )}
          </CardHeader>

          <CardFooter>
            {isSubscribed ? (
              <Button asChild>
                <Link href="/itinerary-builder">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a New Itinerary
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/pricing">Upgrade to Premium</Link>
              </Button>
            )}
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
                  : 'Thank you for your support!'
                : 'Upgrade for premium features'}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Itineraries</CardTitle>
            <CardDescription>
              Your latest adventures are just a click away.
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
            <CardContent className="space-y-2">
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
