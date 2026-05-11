'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import {
  Check,
  X,
  Sparkles,
  Crown,
  ShieldCheck,
  Plane,
  Clock,
  Map,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';

const features = [
  { text: 'Free itinerary preview', free: true, premium: true },
  { text: 'Itinerary generation', free: '2 saved-account generations', premium: 'Unlimited' },
  { text: 'AI travel chat', free: 'Limited', premium: 'Unlimited' },
  { text: 'Save trips to dashboard', free: false, premium: true },
  { text: 'Export itineraries', free: false, premium: true },
  { text: 'Budget planner', free: false, premium: true },
  { text: 'Priority AI responses', free: false, premium: true },
];

type Plan = {
  price: string;
  period: string;
  id: 'weekly' | 'monthly' | 'yearly';
  savings?: string;
  note: string;
};

const plans: Record<'weekly' | 'monthly' | 'yearly', Plan> = {
  weekly: {
    price: '$3.99',
    period: '/ week',
    id: 'weekly',
    note: 'Best for one short trip',
  },
  monthly: {
    price: '$9.99',
    period: '/ month',
    id: 'monthly',
    note: 'Best for active planners',
  },
  yearly: {
    price: '$47.99',
    period: '/ year',
    id: 'yearly',
    savings: 'Save 60%',
    note: 'Best value',
  },
};

function PricingPageSkeleton() {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-56" />
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <Skeleton className="h-12 w-28" />
            {[...Array(features.length)].map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function FeatureIcon({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <Check className="h-5 w-5 shrink-0 text-green-500" />
  ) : (
    <X className="h-5 w-5 shrink-0 text-muted-foreground" />
  );
}

function PricingContent() {
  const [billingCycle, setBillingCycle] =
    useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc(userProfileRef);

  const isSubscribed =
    userProfile?.subscriptionStatus && userProfile.subscriptionStatus !== 'free';

  const renderFeatureStatus = (
    feature: any,
    planType: 'free' | 'premium'
  ) => {
    const value = feature[planType];
    return <FeatureIcon enabled={value !== false} />;
  };

  const renderFeatureValue = (
    feature: any,
    planType: 'free' | 'premium'
  ) => {
    const value = feature[planType];

    if (typeof value !== 'boolean') {
      return (
        <span className="ml-auto text-right text-sm font-medium text-muted-foreground">
          {value}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <Badge className="mb-4 bg-sky-500/10 text-sky-500 hover:bg-sky-500/10">
          Start free · Upgrade when you need more
        </Badge>

        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Plan your trip first. Upgrade only when it helps.
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Generate your itinerary for free, preview the value, then upgrade if
          you want unlimited trips, saving, AI chat, exports, and budget tools.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <ShieldCheck className="h-4 w-4 text-sky-500" />
            No credit card to start
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Clock className="h-4 w-4 text-sky-500" />
            Itinerary in seconds
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Plane className="h-4 w-4 text-sky-500" />
            Built for real trips
          </span>
        </div>
      </div>

      {isProfileLoading ? (
        <PricingPageSkeleton />
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-5 w-5 text-sky-500" />
              </div>

              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>
                Best for trying Wanderwise AI and previewing your first trip
                plan before creating an account.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground"> / month</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate and preview your itinerary first.
                </p>
              </div>

              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {renderFeatureStatus(feature, 'free')}
                    <span>{feature.text}</span>
                    {renderFeatureValue(feature, 'free')}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/itinerary-builder">
                  Start Planning Free
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="relative flex flex-col overflow-hidden border-2 border-sky-500 shadow-2xl">
            <div className="absolute right-4 top-4">
              <Badge className="bg-amber-400 text-slate-950 hover:bg-amber-400">
                Most Popular
              </Badge>
            </div>

            <CardHeader className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-sky-400/20">
                <Crown className="h-5 w-5 text-sky-300" />
              </div>

              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription className="text-slate-300">
                Best for travelers who want to save, edit, compare, export, and
                plan multiple trips with AI.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pt-6">
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {plans[billingCycle].price}
                </span>
                <span className="text-muted-foreground">
                  {plans[billingCycle].period}
                </span>

                <p className="mt-1 text-sm text-muted-foreground">
                  {plans[billingCycle].note}
                </p>

                {plans[billingCycle].savings && (
                  <p className="mt-1 text-sm font-semibold text-green-500">
                    {plans[billingCycle].savings}
                  </p>
                )}
              </div>

              <RadioGroup
                defaultValue="monthly"
                onValueChange={(value: 'weekly' | 'monthly' | 'yearly') =>
                  setBillingCycle(value)
                }
                className="mb-8 grid grid-cols-1 gap-3"
              >
                {Object.values(plans).map((plan) => (
                  <Label
                    key={plan.id}
                    htmlFor={plan.id}
                    className="flex cursor-pointer items-center space-x-4 rounded-xl border p-4 transition hover:bg-muted/50 has-[input:checked]:border-sky-500 has-[input:checked]:bg-sky-500/10"
                  >
                    <RadioGroupItem value={plan.id} id={plan.id} />

                    <div className="flex w-full items-center justify-between gap-4">
                      <div>
                        <span className="font-medium capitalize">
                          {plan.id}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {plan.note}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold">{plan.price}</span>
                        {plan.savings && (
                          <span className="ml-2 text-xs font-semibold text-green-500">
                            {plan.savings}
                          </span>
                        )}
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {renderFeatureStatus(feature, 'premium')}
                    <span>{feature.text}</span>
                    {renderFeatureValue(feature, 'premium')}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl bg-sky-500/10 p-4 text-sm">
                <div className="flex gap-3">
                  <Map className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                  <p className="text-muted-foreground">
                    Premium is designed for users who want to keep trips in a
                    dashboard, refine plans with AI, and organize travel faster.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              {isSubscribed ? (
                <Button variant="outline" className="w-full" disabled>
                  Your Current Plan
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full bg-sky-500 text-slate-950 hover:bg-sky-400"
                >
                  <Link href={`/checkout?plan=${billingCycle}`}>
                    Upgrade to Premium
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border bg-muted/30 p-6 text-center">
        <h2 className="text-xl font-semibold">
          Not ready to upgrade yet?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start with the free itinerary builder. You can preview your trip first
          and upgrade later only if you want saving, editing, exports, and
          unlimited planning.
        </p>

        <Button asChild variant="outline" className="mt-5">
          <Link href="/itinerary-builder">Try the Free Planner</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              Choose Your Plan
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Unlock the full power of Wanderwise AI and travel smarter.
            </p>
          </div>
          <PricingPageSkeleton />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
