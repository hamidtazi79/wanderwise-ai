'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, increment, updateDoc } from 'firebase/firestore';
import {
  Loader2,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';

import { generateSmartItinerary } from '@/ai/flows/generate-smart-itineraries';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useToast } from '@/hooks/use-toast';
import { trackMetaEvent } from '@/lib/gtag';

const formSchema = z.object({
  destination: z.string().min(2, {
    message: 'Destination must be at least 2 characters.',
  }),

  duration: z.coerce
    .number()
    .int()
    .min(1, 'Duration must be at least 1 day.')
    .max(30, 'Duration cannot exceed 30 days.'),

  interests: z.string().min(3, {
    message: 'Please list at least one interest.',
  }),

  budget: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

const FREE_ITINERARY_LIMIT = 2;

export function ItineraryForm() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const destination = searchParams.get('destination');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) {
      return null;
    }

    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);

  const isSubscribed =
    userProfile?.subscriptionStatus !== undefined &&
    userProfile.subscriptionStatus !== 'free';

  const itinerariesGenerated =
    typeof userProfile?.itinerariesGenerated === 'number'
      ? userProfile.itinerariesGenerated
      : 0;

  const isGenerationDisabled =
    Boolean(user) &&
    Boolean(userProfile) &&
    !isSubscribed &&
    itinerariesGenerated >= FREE_ITINERARY_LIMIT;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      destination: destination || '',
      duration: 7,
      interests: '',
      budget: 'medium',
    },
  });

  useEffect(() => {
    if (destination) {
      form.setValue('destination', destination);
    }
  }, [destination, form]);

  useEffect(() => {
    trackMetaEvent('ViewContent', {
      content_name: 'Itinerary Builder Form',
      content_category: 'Travel Planning',
    });
  }, []);

  async function onSubmit(values: FormValues) {
    if (isGenerationDisabled) {
      setError(
        'You have reached your free itinerary generation limit. Please upgrade to continue.'
      );

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateSmartItinerary(values);
      const resultId = `itinerary_${Date.now()}`;

      const storedData = {
        ...values,
        generatedItinerary: JSON.stringify(result),
        createdAsGuest: !user,
      };

      window.sessionStorage.setItem(
        resultId,
        JSON.stringify(storedData)
      );

      if (
        user &&
        userProfile &&
        !isSubscribed &&
        userProfileRef
      ) {
        await updateDoc(userProfileRef, {
          itinerariesGenerated: increment(1),
        });

        toast({
          title: 'Itinerary Generated',
          description: `You have used ${
            itinerariesGenerated + 1
          } of your ${FREE_ITINERARY_LIMIT} free generations.`,
        });
      }

      trackMetaEvent('ViewContent', {
        content_name: 'Itinerary Generated',
        content_category: 'Travel Planning',
        destination: values.destination,
        budget: values.budget,
        duration: values.duration,
        user_type: user ? 'logged_in' : 'guest',
      });

      router.push(`/itinerary/result?id=${resultId}`);
    } catch (caughtError: unknown) {
      console.error(
        'Itinerary Generation Error:',
        caughtError
      );

      const message =
        caughtError instanceof Error
          ? caughtError.message
          : '';

      if (
        message.includes('503') ||
        message.toLowerCase().includes('overloaded')
      ) {
        setError(
          'The AI service is currently busy. Please wait a moment and try again.'
        );
      } else {
        setError(
          'An unexpected error occurred while generating the itinerary. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isUserLoading) {
    return (
      <div
        className="flex min-h-48 items-center justify-center"
        aria-label="Loading itinerary builder"
      >
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
      </div>
    );
  }

  if (isGenerationDisabled) {
    return (
      <div className="w-full">
        <div
          role="alert"
          className="w-full rounded-2xl border border-red-200 bg-red-50 p-5 text-center sm:p-6"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <TriangleAlert
              aria-hidden="true"
              className="h-6 w-6 text-red-600"
            />
          </div>

          <h3 className="mt-4 text-xl font-bold text-red-700">
            Free Itinerary Limit Reached
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-red-700">
            You have used your {FREE_ITINERARY_LIMIT} free
            itinerary generations. Please upgrade for unlimited
            creations and to save your trips.
          </p>

          <Button asChild className="mt-5 min-h-11 px-6">
            <Link
              href="/pricing"
              onClick={() =>
                trackMetaEvent('Subscribe', {
                  content_name:
                    'Upgrade Click From Itinerary Limit',
                  content_category: 'Pricing',
                })
              }
            >
              Upgrade to Premium
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="overflow-visible">
        <CardContent className="p-5 sm:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="e.g., Paris, France"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Where do you want to go?
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        inputMode="numeric"
                        placeholder="e.g., 4"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="e.g., Food, culture, museums, hidden gems"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Separate interests with commas.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>

                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your budget" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="low">
                          Low
                        </SelectItem>

                        <SelectItem value="medium">
                          Medium
                        </SelectItem>

                        <SelectItem value="high">
                          High
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="min-h-11 w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating your trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Free Itinerary
                  </>
                )}
              </Button>

              <p className="text-center text-xs leading-5 text-muted-foreground">
                No signup required to preview your itinerary.
                Create an account only when you want to save it.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert
          variant="destructive"
          className="mt-6"
        >
          <AlertTitle>Error</AlertTitle>

          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {user && !isSubscribed && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          You have used {itinerariesGenerated} of your{' '}
          {FREE_ITINERARY_LIMIT} free saved-account
          generations.
        </p>
      )}
    </div>
  );
}
