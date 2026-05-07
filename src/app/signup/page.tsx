'use client';

import { AuthForm } from '@/components/auth-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Save your trip in 10 seconds
          </CardTitle>

          <CardDescription>
            Create a free account to save, edit, and access your itinerary anytime.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AuthForm mode="signup" />

          <div className="mt-4 space-y-1 text-center text-xs text-muted-foreground">
            <p>✅ No credit card required</p>
            <p>🔒 No spam, ever</p>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
