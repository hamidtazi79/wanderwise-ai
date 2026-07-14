'use client';

import { useState, type FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserRound,
} from 'lucide-react';

import { useAuth, useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { trackSignup } from '@/lib/gtag';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignupSuccess: (user: User) => Promise<void>;
}

type AuthMode = 'signup' | 'login';
type SignupMethod = 'email' | 'google';

function getCookie(name: string) {
  if (typeof document === 'undefined') return '';

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : '';
}

async function sendMetaCompleteRegistration(
  email: string,
  signupMethod: SignupMethod
) {
  try {
    await fetch('/api/meta-complete-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        signup_method: signupMethod,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        event_source_url:
          typeof window !== 'undefined' ? window.location.href : '',
      }),
    });
  } catch (error) {
    console.error('Meta CompleteRegistration API error:', error);
  }
}

function getFriendlyAuthError(error: unknown) {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Choose “Log in” instead.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Please use a stronger password with at least 6 characters.';

    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email or password is incorrect. Please try again.';

    case 'auth/too-many-requests':
      return 'Too many attempts were made. Please wait briefly and try again.';

    case 'auth/network-request-failed':
      return 'A network problem occurred. Check your connection and try again.';

    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Please allow popups and try again.';

    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using another sign-in method.';

    default:
      return 'Something went wrong. Please try again.';
  }
}

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    className="mr-2 h-4 w-4"
    viewBox="0 0 24 24"
  >
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
  </svg>
);

export function SignupSaveDialog({
  open,
  onOpenChange,
  onSignupSuccess,
}: SignupSaveDialogProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isLoading = isEmailLoading || isGoogleLoading;

  async function createProfileIfNotExists(
    user: User,
    requestedDisplayName?: string
  ) {
    const userRef = doc(firestore, `users/${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return false;
    }

    const finalDisplayName =
      requestedDisplayName.trim() ||
      user.displayName ||
      user.email?.split('@')[0] ||
      'Traveller';

    if (
      requestedDisplayName.trim() &&
      user.displayName !== requestedDisplayName.trim()
    ) {
      await updateProfile(user, {
        displayName: requestedDisplayName.trim(),
      });
    }

    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      displayName: finalDisplayName,
      photoURL: user.photoURL || null,
      subscriptionStatus: 'free',
      itinerariesGenerated: 0,
      chatMessagesSent: 0,
      createdAt: new Date().toISOString(),
    });

    return true;
  }

  function resetForm() {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  }

  function changeMode(nextMode: AuthMode) {
    if (isLoading) return;

    setMode(nextMode);
    setPassword('');
    setShowPassword(false);
  }

  async function finishAuthentication(user: User) {
    await onSignupSuccess(user);
    onOpenChange(false);
    resetForm();

    toast({
      title: 'Trip saved!',
      description: 'Your itinerary is now available in your dashboard.',
    });
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = displayName.trim();

    if (mode === 'signup' && normalizedName.length < 2) {
      toast({
        title: 'Please enter your name',
        description: 'Your name must contain at least 2 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!normalizedEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Your password must contain at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsEmailLoading(true);

    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

        await createProfileIfNotExists(result.user, normalizedName);

        trackSignup('email');
        await sendMetaCompleteRegistration(normalizedEmail, 'email');

        await finishAuthentication(result.user);
        return;
      }

      const result = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      await finishAuthentication(result.user);
    } catch (error) {
      console.error('Email authentication error:', error);

      toast({
        title: mode === 'signup' ? 'Sign up failed' : 'Login failed',
        description: getFriendlyAuthError(error),
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleGoogleAuthentication() {
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(auth, provider);
      const isNewProfile = await createProfileIfNotExists(result.user);

      if (isNewProfile) {
        trackSignup('google');

        if (result.user.email) {
          await sendMetaCompleteRegistration(result.user.email, 'google');
        }
      }

      await finishAuthentication(result.user);
    } catch (error) {
      const errorCode =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof error.code === 'string'
          ? error.code
          : '';

      if (errorCode !== 'auth/popup-closed-by-user') {
        console.error('Google authentication error:', error);

        toast({
          title: 'Google sign-in failed',
          description: getFriendlyAuthError(error),
          variant: 'destructive',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  function handleDialogChange(nextOpen: boolean) {
    if (isLoading) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setMode('signup');
      resetForm();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto p-0 sm:max-w-md">
        <div className="border-b bg-gradient-to-br from-sky-50 via-background to-background px-6 py-6 dark:from-sky-950/40">
          <DialogHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              {mode === 'signup' ? (
                <UserRound className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>

            <DialogTitle className="text-2xl">
              {mode === 'signup'
                ? 'Save your trip in 10 seconds'
                : 'Log in and save your trip'}
            </DialogTitle>

            <DialogDescription className="leading-6">
              {mode === 'signup'
                ? 'Create a free Wanderwise account and keep this itinerary safely in your dashboard.'
                : 'Log in to your existing account and save this itinerary without leaving the page.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            onClick={handleGoogleAuthentication}
            disabled={isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or use email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="save-trip-name">Full name</Label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="save-trip-name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="h-11 pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="save-trip-email">Email address</Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="save-trip-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="save-trip-password">Password</Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="save-trip-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  className="h-11 px-10"
                  disabled={isLoading}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-sky-500 text-slate-950 hover:bg-sky-400"
              disabled={isLoading}
            >
              {isEmailLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {mode === 'signup'
                ? 'Create Account & Save Trip'
                : 'Log In & Save Trip'}
            </Button>
          </form>

          <div className="rounded-xl border bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Your itinerary will be saved automatically
            </div>

            <p className="mt-1 pl-6 text-xs leading-5 text-muted-foreground">
              No credit card required. Your trip stays visible after signup or
              login.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {mode === 'signup'
              ? 'Already have an account?'
              : 'New to Wanderwise?'}

            <button
              type="button"
              onClick={() =>
                changeMode(mode === 'signup' ? 'login' : 'signup')
              }
              className="ml-1 font-semibold text-primary hover:underline"
              disabled={isLoading}
            >
              {mode === 'signup' ? 'Log in' : 'Create a free account'}
            </button>
          </p>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to the Wanderwise terms and privacy
            policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
