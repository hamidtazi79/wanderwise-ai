'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters.').optional(),
  photoURL: z.string().url().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardContent>
        </Card>
    );
}

export function ProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        displayName: '',
        email: '',
        bio: '',
        photoURL: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
        form.reset({
            displayName: userProfile.displayName || '',
            email: userProfile.email || '',
            bio: userProfile.bio || '',
            photoURL: userProfile.photoURL || '',
        });
    }
  }, [userProfile, form]);

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ProfileFormValues) {
    if (!userProfileRef || !user) return;

    const updatedData = {
        displayName: values.displayName,
        bio: values.bio,
        photoURL: values.photoURL,
        updatedAt: new Date().toISOString(),
    };

    await updateDoc(userProfileRef, updatedData);
    
    toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully saved.',
    });
  }

  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
                Manage your account details and preferences.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="your@email.com" {...field} disabled />
                                </FormControl>
                                <FormDescription>
                                    You cannot change your email address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us a little about your travel style." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
