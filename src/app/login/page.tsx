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

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome back
          </CardTitle>

          <CardDescription>
            Access your saved itineraries, AI travel tools, and trip dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AuthForm mode="login" />

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Continue planning your trips instantly.
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Create a free account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
