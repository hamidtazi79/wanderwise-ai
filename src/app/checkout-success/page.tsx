'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyCheckoutSession } from '../checkout/actions';
import { useFirestore, useUser } from '@/firebase/provider';
import { doc, setDoc } from 'firebase/firestore';

function SuccessDisplay() {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
          Payment Successful!
        </CardTitle>
        <CardDescription className="pt-2">
          Welcome to the Wanderwise AI Subscriber Plan. You now have unlimited
          access to all premium features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A confirmation has been sent to your email address. You can now start
          creating unlimited itineraries and get priority support from our AI
          assistant.
        </p>
      </CardContent>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/dashboard">Go to Your Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive">
          Update Failed
        </CardTitle>
        <CardDescription className="pt-2">{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          If this issue persists, please contact our support team.
        </p>
      </CardContent>
      <CardContent>
        <Button asChild className="w-full" variant="outline">
          <Link href="/dashboard">Go to Your Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ProcessingPayment() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h1 className="text-2xl font-semibold">
        Finalizing Your Subscription...
      </h1>
      <p className="text-muted-foreground">
        Please wait while we confirm your payment and update your account.
      </p>
    </div>
  );
}

function CheckoutSuccessContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      router.replace('/');
      return;
    }

    if (!user || !firestore) {
      return;
    }

    const updateSubscription = async () => {
      try {
        const {
          isPaid,
          plan,
          userId,
          customerId,
          subscriptionId,
        } = await verifyCheckoutSession(sessionId);

        if (!isPaid || !plan || userId !== user.uid) {
          throw new Error('Payment verification failed or user mismatch.');
        }

        const userProfileRef = doc(firestore, `users/${user.uid}`);
        const now = new Date().toISOString();

        await setDoc(
          userProfileRef,
          {
            subscriptionStatus: plan,
            subscriptionStartDate: now,
            updatedAt: now,
            stripeCustomerId: customerId || null,
            stripeSubscriptionId: subscriptionId || null,
            subscriptionCancelAtPeriodEnd: false,
          },
          { merge: true }
        );

        setStatus('success');
      } catch (e) {
        console.error('Subscription update failed:', e);
        setErrorMessage(
          'We confirmed your payment, but failed to update your account. Please contact support.'
        );
        setStatus('error');
      }
    };

    updateSubscription();
  }, [user, firestore, searchParams, router]);

  if (status === 'loading') {
    return <ProcessingPayment />;
  }

  if (status === 'error') {
    return <ErrorDisplay message={errorMessage} />;
  }

  return <SuccessDisplay />;
}

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Suspense fallback={<ProcessingPayment />}>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
