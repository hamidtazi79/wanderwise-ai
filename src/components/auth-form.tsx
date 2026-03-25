
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : "";
}

async function sendMetaCompleteRegistration(email: string, signupMethod = "password") {
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");

  const res = await fetch("/api/meta-complete-registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      signup_method: signupMethod,
      fbp,
      fbc,
      event_source_url: window.location.href,
    }),
  });

  const data = await res.json();
  console.log("Meta API response:", data);
}
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const signupSchema = z
  .object({
    displayName: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type AuthFormValues =
  | z.infer<typeof loginSchema>
  | z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const createProfileIfNotExists = async (
  user: FirebaseUser,
  firestore: ReturnType<typeof useFirestore>,
  displayName?: string
) => {
  if (!firestore) return;

  const userProfileRef = doc(firestore, `users/${user.uid}`);
  const userProfileSnap = await getDoc(userProfileRef);

  if (!userProfileSnap.exists()) {
    const { email, photoURL } = user;
    const finalDisplayName =
      displayName || user.displayName || email?.split('@')[0];
    
    // This is a new user, we need to update their profile in Auth as well
    if (displayName && user.displayName !== displayName) {
      await updateProfile(user, { displayName });
    }

    await setDoc(userProfileRef, {
      id: user.uid,
      email,
      displayName: finalDisplayName,
      photoURL,
      subscriptionStatus: 'free',
      itinerariesGenerated: 0,
      chatMessagesSent: 0,
      createdAt: new Date().toISOString(),
    });
  }
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const formSchema = mode === 'login' ? loginSchema : signupSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' && { displayName: '', confirmPassword: '' }),
    } as any,
  });

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      form.setError('email', {
        type: 'manual',
        message: 'Please enter your email to reset your password.',
      });
      return;
    }
    if (!auth) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for a link to reset your password.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    if (!auth || !firestore) {
      toast({ title: 'Auth service not ready', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const signupData = data as z.infer<typeof signupSchema>;
      
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signupData.email,
          signupData.password
        );
      
        await sendMetaCompleteRegistration(
          signupData.email,
          "email"
        );
      
        await createProfileIfNotExists(
          userCredential.user,
          firestore,
          signupData.displayName
        );
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: mode === 'signup' ? 'Sign Up Failed' : 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
      toast({
        title: 'Error',
        description: 'Authentication service not available.',
        variant: 'destructive',
      });
      return;
    }

    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createProfileIfNotExists(result.user, firestore);
      router.push('/dashboard');
    } catch (error: any) {
      // Don't show toast for user-closed popups
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Google sign-in error", error);
        toast({
          title: 'Google sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'signup' && (
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      disabled={isLoading || isGoogleLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    autoComplete="email"
                    disabled={isLoading || isGoogleLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoComplete={
                      mode === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    disabled={isLoading || isGoogleLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === 'signup' && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      autoComplete="new-password"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      {mode === 'login' && (
        <Button
          variant="link"
          size="sm"
          onClick={handlePasswordReset}
          className="px-0"
          disabled={isLoading || isGoogleLoading}
        >
          Forgot password?
        </Button>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full"
        variant="outline"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>
    </div>
  );
}

    