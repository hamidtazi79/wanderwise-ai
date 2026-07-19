'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import {
  ArrowRight,
  Check,
  CircleHelp,
  CloudSun,
  Crown,
  Download,
  Gauge,
  Luggage,
  Map,
  MessageSquare,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
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

import {
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';

type BillingCycle = 'weekly' | 'monthly' | 'yearly';

type Plan = {
  id: BillingCycle;
  label: string;
  price: string;
  period: string;
  note: string;
  savings?: string;
};

type ComparisonValue = boolean | string;

type ComparisonFeature = {
  name: string;
  free: ComparisonValue;
  premium: ComparisonValue;
};

const plans: Record<BillingCycle, Plan> = {
  weekly: {
    id: 'weekly',
    label: 'Weekly',
    price: '$3.99',
    period: '/ week',
    note: 'Best for one short trip',
  },
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    price: '$9.99',
    period: '/ month',
    note: 'Best for active planners',
  },
  yearly: {
    id: 'yearly',
    label: 'Yearly',
    price: '$47.99',
    period: '/ year',
    note: 'Best value for frequent travelers',
    savings: 'Save 60%',
  },
};

const freeFeatures = [
  '2 itinerary generations',
  'Full itinerary preview',
  'Limited AI Travel Chat',
  'Day-by-day travel plan',
  'Basic hotel recommendations',
  'Google Maps links for places',
  'Travel tips and destination ideas',
];

const premiumFeatures = [
  'Unlimited itinerary generation',
  'Unlimited AI Travel Chat',
  'Unlimited saved trips',
  'Interactive trip map',
  'Google Maps navigation',
  'PDF and printable export',
  'Smart travel budget planner',
  'Personalized hotel recommendations',
  'Live weather planning',
  'AI packing checklist',
  'Multi-city trip planning',
  'Faster AI generation',
];

const comparisonFeatures: ComparisonFeature[] = [
  {
    name: 'AI itinerary generation',
    free: '2 generations',
    premium: 'Unlimited',
  },
  {
    name: 'AI Travel Chat',
    free: 'Limited',
    premium: 'Unlimited',
  },
  {
    name: 'Saved trips',
    free: false,
    premium: 'Unlimited',
  },
  {
    name: 'Google Maps place links',
    free: true,
    premium: true,
  },
  {
    name: 'Interactive trip map',
    free: false,
    premium: true,
  },
  {
    name: 'Hotel recommendations',
    free: 'Basic',
    premium: 'Personalized',
  },
  {
    name: 'PDF itinerary export',
    free: false,
    premium: true,
  },
  {
    name: 'Smart budget planner',
    free: false,
    premium: true,
  },
  {
    name: 'Weather planning',
    free: false,
    premium: true,
  },
  {
    name: 'Packing checklist',
    free: false,
    premium: true,
  },
  {
    name: 'Multi-city planning',
    free: false,
    premium: true,
  },
  {
    name: 'Faster AI generation',
    free: false,
    premium: true,
  },
];

const premiumHighlights = [
  {
    icon: Map,
    title: 'Interactive Trip Map',
    description:
      'View attractions, hotels, restaurants, and routes together on one map.',
  },
  {
    icon: WalletCards,
    title: 'Smart Travel Budget',
    description:
      'Estimate activity, accommodation, and daily travel costs more clearly.',
  },
  {
    icon: Download,
    title: 'PDF & Printable Export',
    description:
      'Download your itinerary and keep a clean copy available during your trip.',
  },
  {
    icon: Luggage,
    title: 'AI Packing Checklist',
    description:
      'Create a packing list based on your destination, weather, and trip style.',
  },
  {
    icon: CloudSun,
    title: 'Weather-Aware Planning',
    description:
      'Plan activities around expected travel conditions and seasonal needs.',
  },
  {
    icon: Route,
    title: 'Multi-City Planning',
    description:
      'Build more complex trips across several destinations in one itinerary.',
  },
];

const faqItems = [
  {
    question: 'Can I start for free?',
    answer:
      'Yes. You can generate and preview your first itineraries before deciding whether Premium is useful for you.',
  },
  {
    question: 'Can I cancel my Premium subscription?',
    answer:
      'Yes. You can cancel according to the subscription-management options connected to your Stripe billing setup.',
  },
  {
    question: 'Can I change from weekly to monthly or yearly?',
    answer:
      'Yes. Your billing options can be changed through the subscription-management flow connected to your account.',
  },
  {
    question: 'Does Premium work on mobile?',
    answer:
      'Yes. Wanderwise AI is designed to work across phones, tablets, and desktop computers.',
  },
  {
    question: 'Are hotel and activity prices guaranteed?',
    answer:
      'No. Travel prices are estimates and may change depending on dates, availability, season, and provider.',
  },
  {
    question: 'What happens to my saved trips if I cancel?',
    answer:
      'Your account remains available, but Premium-only access and unlimited features may become restricted when the subscription ends.',
  },
];

function PricingPageSkeleton() {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-2">
      {[0, 1].map((item) => (
        <Card key={item} className="flex min-h-[640px] flex-col">
          <CardHeader className="space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-5 w-full max-w-sm" />
          </CardHeader>

          <CardContent className="flex-1 space-y-5">
            <Skeleton className="h-12 w-36" />

            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-52" />
              </div>
            ))}
          </CardContent>

          <CardFooter>
            <Skeleton className="h-11 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function StatusIcon({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
      <Check className="h-4 w-4 text-emerald-600" />
    </span>
  ) : (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
      <X className="h-4 w-4 text-slate-400" />
    </span>
  );
}

function ComparisonCell({ value }: { value: ComparisonValue }) {
  if (typeof value === 'boolean') {
    return (
      <div className="flex justify-center">
        <StatusIcon enabled={value} />
      </div>
    );
  }

  return (
    <span className="text-sm font-medium text-slate-700">
      {value}
    </span>
  );
}

function PricingContent() {
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>('monthly');

  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) {
      return null;
    }

    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
  } = useDoc(userProfileRef);

  const isSubscribed =
    Boolean(userProfile?.subscriptionStatus) &&
    userProfile?.subscriptionStatus !== 'free';

  const selectedPlan = plans[billingCycle];

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <Badge className="mb-5 bg-sky-400/15 text-sky-300 hover:bg-sky-400/15">
            Simple, transparent pricing
          </Badge>

          <h1 className="mx-auto max-w-4xl font-headline text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Start planning free.
            <span className="block text-sky-400">
              Upgrade when you need more.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Generate your itinerary first, explore the full plan, and
            unlock unlimited AI travel planning, maps, exports, budget
            tools, and saved trips when Premium becomes useful.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-slate-300 sm:flex-row sm:flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              No credit card to start
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2">
              <Gauge className="h-4 w-4 text-sky-300" />
              Itinerary in seconds
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2">
              <Plane className="h-4 w-4 text-sky-300" />
              Built for real trips
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {isProfileLoading ? (
          <PricingPageSkeleton />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <Card className="flex flex-col overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="space-y-4 p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">
                  <Sparkles className="h-6 w-6 text-sky-600" />
                </div>

                <div>
                  <CardTitle className="text-3xl">
                    Free
                  </CardTitle>

                  <CardDescription className="mt-2 text-base leading-7">
                    Explore Wanderwise AI and generate your first
                    personalized travel plans.
                  </CardDescription>
                </div>

                <div>
                  <span className="text-5xl font-extrabold tracking-tight text-slate-950">
                    $0
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    / month
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 px-6 pb-6 sm:px-8 sm:pb-8">
                <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Included with Free
                </p>

                <ul className="space-y-4">
                  {freeFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <StatusIcon enabled />
                      <span className="pt-0.5 text-sm leading-6 text-slate-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-semibold text-slate-950">
                    Best for
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Trying Wanderwise AI, planning an occasional trip,
                    and previewing the experience before subscribing.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-slate-50 p-6 sm:px-8">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Link href="/itinerary-builder">
                    Start Planning Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative flex flex-col overflow-hidden border-2 border-sky-500 shadow-2xl">
              <div className="absolute right-4 top-4 z-10">
                <Badge className="bg-amber-400 text-slate-950 hover:bg-amber-400">
                  Most Popular
                </Badge>
              </div>

              <CardHeader className="space-y-4 bg-slate-950 p-6 text-white sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15">
                  <Crown className="h-6 w-6 text-sky-300" />
                </div>

                <div>
                  <CardTitle className="text-3xl text-white">
                    Premium
                  </CardTitle>

                  <CardDescription className="mt-2 max-w-lg text-base leading-7 text-slate-300">
                    A complete AI travel-planning toolkit for travelers
                    who want unlimited trips and advanced tools.
                  </CardDescription>
                </div>

                <div>
                  <span className="text-5xl font-extrabold tracking-tight">
                    {selectedPlan.price}
                  </span>
                  <span className="text-slate-300">
                    {' '}
                    {selectedPlan.period}
                  </span>

                  <p className="mt-2 text-sm text-slate-300">
                    {selectedPlan.note}
                  </p>

                  {selectedPlan.savings && (
                    <p className="mt-2 text-sm font-semibold text-emerald-300">
                      {selectedPlan.savings}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-6 sm:p-8">
                <RadioGroup
                  value={billingCycle}
                  onValueChange={(value) =>
                    setBillingCycle(value as BillingCycle)
                  }
                  className="grid gap-3"
                >
                  {Object.values(plans).map((plan) => (
                    <Label
                      key={plan.id}
                      htmlFor={plan.id}
                      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 has-[[data-state=checked]]:border-sky-500 has-[[data-state=checked]]:bg-sky-50"
                    >
                      <RadioGroupItem
                        value={plan.id}
                        id={plan.id}
                      />

                      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-950">
                            {plan.label}
                          </p>

                          <p className="text-xs leading-5 text-muted-foreground">
                            {plan.note}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-bold text-slate-950">
                            {plan.price}
                          </p>

                          {plan.savings && (
                            <p className="text-xs font-semibold text-emerald-600">
                              {plan.savings}
                            </p>
                          )}
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                <div className="my-8 border-t" />

                <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Everything in Free, plus
                </p>

                <ul className="grid gap-4 sm:grid-cols-2">
                  {premiumFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <StatusIcon enabled />
                      <span className="pt-0.5 text-sm leading-6 text-slate-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5">
                  <div className="flex items-start gap-3">
                    <Map className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />

                    <div>
                      <p className="font-semibold text-slate-950">
                        Interactive trip map
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        View itinerary places, hotel areas, restaurants,
                        and routes together in one travel map.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-sky-50 p-6 sm:px-8">
                {isSubscribed ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Your Current Plan
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-sky-500 text-slate-950 hover:bg-sky-400"
                  >
                    <Link href={`/checkout?plan=${billingCycle}`}>
                      Upgrade to Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary">
              Compare plans
            </Badge>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              See exactly what Premium unlocks
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Start with the essentials and upgrade when you want a
              complete travel-planning workspace.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Feature
                    </th>
                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Free
                    </th>
                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Premium
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={feature.name}
                      className={
                        index % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50'
                      }
                    >
                      <td className="border-t px-5 py-4 text-sm font-medium text-slate-800">
                        {feature.name}
                      </td>

                      <td className="border-t px-5 py-4 text-center">
                        <ComparisonCell value={feature.free} />
                      </td>

                      <td className="border-t px-5 py-4 text-center">
                        <ComparisonCell
                          value={feature.premium}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="bg-sky-400/15 text-sky-300 hover:bg-sky-400/15">
              Premium travel tools
            </Badge>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              More than unlimited itineraries
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300">
              Premium gives you practical tools to organize, navigate,
              budget, save, and use your itinerary during the trip.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {premiumHighlights.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/15">
                    <Icon className="h-5 w-5 text-sky-300" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <div className="text-center">
            <CircleHelp className="mx-auto h-10 w-10 text-sky-500" />

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-xl text-sky-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-sky-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-sky-600" />

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
            Ready to travel smarter?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Start with the free planner today. Upgrade only when you
            want unlimited trips and advanced travel tools.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/itinerary-builder">
                Start Planning Free
              </Link>
            </Button>

            {!isSubscribed && (
              <Button
                asChild
                size="lg"
                variant="outline"
              >
                <Link href={`/checkout?plan=${billingCycle}`}>
                  Choose Premium
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50">
          <section className="bg-slate-950 px-4 py-16 text-center text-white">
            <Skeleton className="mx-auto h-7 w-52 bg-slate-800" />
            <Skeleton className="mx-auto mt-5 h-14 max-w-3xl bg-slate-800" />
            <Skeleton className="mx-auto mt-5 h-6 max-w-xl bg-slate-800" />
          </section>

          <div className="mx-auto max-w-6xl px-4 py-12">
            <PricingPageSkeleton />
          </div>
        </main>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
