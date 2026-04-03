'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Loader2, Sparkles, TriangleAlert, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, increment, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/meta-pixel';

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
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);

  const isSubscribed = userProfile?.subscriptionStatus !== 'free';
  const itinerariesGenerated = userProfile?.itinerariesGenerated || 0;
  const isGenerationDisabled =
    !isSubscribed && itinerariesGenerated >= FREE_ITINERARY_LIMIT;
  const isGuest = !user;

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
    trackEvent('ViewContent', {
      content_name: 'Itinerary Builder Form',
      content_category: 'Travel Planning',
    });
  }, []);

  async function onSubmit(values: FormValues) {
    if (isGuest) {
      trackEvent('CompleteRegistration', {
        content_name: 'Signup Redirect From Itinerary Builder Submit',
      });
      router.push('/signup');
      return;
    }

    if (isGenerationDisabled) {
      setError(
        'You have reached your free itinerary generation limit. Please upgrade to continue.'
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (userProfile && !isSubscribed && userProfileRef) {
        await updateDoc(userProfileRef, {
          itinerariesGenerated: increment(1),
        });

        toast({
          title: 'Free Itinerary Generated',
          description: `You have used ${itinerariesGenerated + 1} of your ${FREE_ITINERARY_LIMIT} free generations.`,
        });
      }

      const result = await generateSmartItinerary(values);
      const resultId = `itinerary_${Date.now()}`;

      const storedData = {
        ...values,
        generatedItinerary: JSON.stringify(result),
      };

      sessionStorage.setItem(resultId, JSON.stringify(storedData));

      trackEvent('ViewContent', {
        content_name: 'Itinerary Generated',
        content_category: 'Travel Planning',
        destination: values.destination,
        budget: values.budget,
        duration: values.duration,
      });

      router.push(`/itinerary/result?id=${resultId}`);
    } catch (e: any) {
      console.error('Itinerary Generation Error:', e);

      if (
        e.message &&
        (e.message.includes('503') || e.message.includes('overloaded'))
      ) {
        setError(
          'The AI service is currently overloaded. Please wait a moment and try again.'
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
    return null;
  }

  const renderAlert = () => {
    if (isGuest) {
      return (
        <Alert variant="destructive" className="text-center">
          <UserPlus className="mx-auto mb-2 h-6 w-6" />
          <AlertTitle>Sign Up to Generate Itineraries</AlertTitle>
          <AlertDescription>
            Please create a free account to start planning your trips with
            Wanderwise AI.
          </AlertDescription>
          <Button asChild size="sm" className="mt-4">
            <Link
              href="/signup"
              onClick={() =>
                trackEvent('CompleteRegistration', {
                  content_name: 'Signup Click From Guest Alert',
                })
              }
            >
              Create an Account
            </Link>
          </Button>
        </Alert>
      );
    }

    if (isGenerationDisabled) {
      return (
        <Alert variant="destructive" className="text-center">
          <TriangleAlert className="mx-auto mb-2 h-6 w-6" />
          <AlertTitle>Free Itinerary Limit Reached</AlertTitle>
          <AlertDescription>
            You have used your {FREE_ITINERARY_LIMIT} free itinerary
            generations. Please upgrade for unlimited creations and to save
            your trips.
          </AlertDescription>
          <Button asChild size="sm" className="mt-4">
            <Link
              href="/pricing"
              onClick={() =>
                trackEvent('Subscribe', {
                  content_name: 'Upgrade Click From Itinerary Limit',
                  content_category: 'Pricing',
                })
              }
            >
              Upgrade to Premium
            </Link>
          </Button>
        </Alert>
      );
    }

    return null;
  };

  const alertContent = renderAlert();

  return (
    <div>
      {alertContent ? (
        alertContent
      ) : (
        <Card>
          <CardContent className="p-6">
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
                        <Input placeholder="e.g., Tokyo, Japan" {...field} />
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
                      <FormLabel>Duration (in days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 7" {...field} />
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
                          placeholder="e.g., Food, history, anime, hiking"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Separate interests with a comma.
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading || isGenerationDisabled}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {user && !isSubscribed && !alertContent && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          You have used {itinerariesGenerated} of your {FREE_ITINERARY_LIMIT}{' '}
          free generations.
        </p>
      )}
    </div>
  );
}
