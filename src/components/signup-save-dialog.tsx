'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
import { Loader2 } from 'lucide-react';

interface SignupSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignupSuccess: (user: User) => Promise<void>;
}

export function SignupSaveDialog({
  open,
  onOpenChange,
  onSignupSuccess,
}: SignupSaveDialogProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function createProfileIfNotExists(user: User) {
    if (!firestore) return;

    const userRef = doc(firestore, `users/${user.uid}`);
    const snap = await getDoc(userRef);

    if (snap.exists()) return;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      displayName: displayName || user.email?.split('@')[0],
      photoURL: user.photoURL || null,
      subscriptionStatus: 'free',
      itinerariesGenerated: 0,
      chatMessagesSent: 0,
      createdAt: new Date().toISOString(),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!auth || !firestore) {
      toast({
        title: 'Auth not ready',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await createUserWithEmailAndPassword(auth, email, password);

      await createProfileIfNotExists(result.user);

      trackSignup('email');

      await onSignupSuccess(result.user);

      onOpenChange(false);

      toast({
        title: 'Trip saved!',
        description: 'Your itinerary is now saved in your dashboard.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save your trip in 10 seconds</DialogTitle>
          <DialogDescription>
            Create a free account to keep and edit your itinerary anytime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create My Free Account
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No spam. Takes less than 10 seconds.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
