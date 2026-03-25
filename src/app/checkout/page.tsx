
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { createSubscriptionCheckoutSession } from './actions';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function CheckoutRedirecting() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 py-12 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h1 className="text-2xl font-semibold">Connecting to Secure Checkout</h1>
      <p className="max-w-md text-muted-foreground">
        Please wait while we transfer you to Stripe to complete your subscription.
      </p>
    </div>
  );
}

function CheckoutError({ error }: { error: string }) {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-semibold">Checkout Error</h1>
      <p className="max-w-xl text-muted-foreground">
        We encountered a problem while trying to create your checkout session.
      </p>
      <div className="mt-2 w-full max-w-xl rounded-md border bg-muted p-4 text-left text-sm text-destructive">
        <p className="font-mono">{error}</p>
      </div>
      <p className="mt-4 text-muted-foreground">
        Please check your configuration or contact support.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/pricing">Return to Pricing</Link>
      </Button>
    </div>
  );
}


function CheckoutContent() {
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace('/signup?redirect=/pricing');
      return;
    }

    const plan = searchParams.get('plan');
    if (plan === 'weekly' || plan === 'monthly' || plan === 'yearly') {
      createSubscriptionCheckoutSession(plan, user.uid)
        .then(({ url }) => {
          // This will only be called on success
          window.location.assign(url);
        })
        .catch((err: Error) => {
          // If the server action throws an error, it's caught here
          console.error("Caught error on client:", err);
          setError(err.message || 'An unknown error occurred.');
        });
    } else {
      // If plan is missing or invalid, show an error.
      setError('No valid subscription plan was selected. Please return to the pricing page and choose a plan.');
    }
  }, [user, isUserLoading, searchParams, router]);

  if (error) {
    return <CheckoutError error={error} />;
  }

  // If there's no error, we are in the 'redirecting' state.
  return <CheckoutRedirecting />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutRedirecting />}>
      <CheckoutContent />
    </Suspense>
  );
}
