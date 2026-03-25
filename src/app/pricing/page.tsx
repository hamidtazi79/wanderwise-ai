'use client';
import { useState, Suspense } from 'react';
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
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  { text: 'Itinerary Generation', free: '2 free', premium: 'Unlimited' },
  { text: 'AI Chat Access', free: '1 message', premium: 'Unlimited' },
  { text: 'Save Trips to Cloud', free: false, premium: true },
  { text: 'Export Itineraries', free: false, premium: true },
  { text: 'Personalized Budget Planner', free: false, premium: true },
  { text: 'Priority AI Responses', free: false, premium: true },
];

type Plan = {
  price: string;
  period: string;
  id: 'weekly' | 'monthly' | 'yearly';
  savings?: string;
};

const plans: Record<'weekly' | 'monthly' | 'yearly', Plan> = {
    weekly: { price: '$3.99', period: '/ week', id: 'weekly' },
    monthly: { price: '$9.99', period: '/ month', id: 'monthly' },
    yearly: { price: '$47.99', period: '/ year', id: 'yearly', savings: 'Save 60%' },
};

function PricingPageSkeleton() {
    return (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Free Plan</CardTitle>
                    <CardDescription>For casual explorers and first-time users.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="mb-6">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground">/ month</span>
                    </div>
                    <div className="space-y-4">
                        {[...Array(features.length)].map((_, i) => (
                             <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                             </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" disabled>Your Current Plan</Button>
                </CardFooter>
            </Card>
            <Card className="border-2 border-primary flex flex-col shadow-lg">
                <CardHeader>
                    <CardTitle>Subscriber Plan</CardTitle>
                    <CardDescription>For frequent travelers and power planners.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="mb-6">
                        <Skeleton className="h-10 w-24" />
                    </div>
                     <div className="space-y-4">
                        {[...Array(features.length)].map((_, i) => (
                             <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                             </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled>
                         <Skeleton className="h-5 w-24" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function PricingContent() {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const isSubscribed = userProfile?.subscriptionStatus && userProfile.subscriptionStatus !== 'free';

  const renderFeatureStatus = (feature: any, planType: 'free' | 'premium') => {
    if (typeof feature[planType] === 'boolean') {
      return feature[planType] ? <Check className="text-green-500" size={20} /> : <X className="text-red-500" size={20} />;
    }
    return <Check className="text-green-500" size={20} />;
  };

  const renderFeatureValue = (feature: any, planType: 'free' | 'premium') => {
    const value = feature[planType];
    if (typeof value !== 'boolean') {
      return <span className="ml-auto text-right font-medium text-muted-foreground">{value}</span>;
    }
    return null;
  };

  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Choose Your Plan
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Unlock the full power of Wanderwise AI and travel smarter.
        </p>
      </div>
      
      {isProfileLoading ? <PricingPageSkeleton /> : (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Free Plan</CardTitle>
                    <CardDescription>For casual explorers and first-time users.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="mb-6">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground">/ month</span>
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
                    <Button variant="outline" className="w-full" disabled={!isSubscribed}>
                        Your Current Plan
                    </Button>
                </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary flex flex-col shadow-lg">
                <CardHeader>
                    <CardTitle>Subscriber Plan</CardTitle>
                    <CardDescription>For frequent travelers and power planners.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="mb-6">
                        <span className="text-4xl font-bold">
                            {plans[billingCycle].price}
                        </span>
                        <span className="text-muted-foreground">{plans[billingCycle].period}</span>
                         {plans[billingCycle].savings && <p className="text-sm text-accent">{plans[billingCycle].savings}</p>}
                    </div>

                    <RadioGroup defaultValue="monthly" onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setBillingCycle(value)} className="grid grid-cols-1 gap-4 mb-8">
                      {Object.values(plans).map((plan) => (
                          <Label key={plan.id} htmlFor={plan.id} className="flex items-center space-x-4 border rounded-md p-4 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <div className="flex justify-between w-full items-center">
                                <span className="font-medium capitalize">{plan.id}</span>
                                <div className="text-right">
                                    <span className="font-semibold">{plan.price}</span>
                                    {plan.savings && <span className="ml-2 text-xs text-accent">({plan.savings})</span>}
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
                </CardContent>
                <CardFooter>
                    {isSubscribed ? (
                         <Button variant="outline" className="w-full" disabled>Your Current Plan</Button>
                    ) : (
                        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                            <Link href={`/checkout?plan=${billingCycle}`}>Subscribe Now</Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  );
}


export default function PricingPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto max-w-5xl py-12">
                <div className="text-center">
                     <h1 className="font-headline text-4xl font-bold tracking-tight">Choose Your Plan</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Unlock the full power of Wanderwise AI and travel smarter.
                    </p>
                </div>
                <PricingPageSkeleton />
            </div>
        }>
            <PricingContent />
        </Suspense>
    )
}
