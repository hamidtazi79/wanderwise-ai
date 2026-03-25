'use client';

import { useUser } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { usePathname } from 'next/navigation';

const ADS_DISABLED_ON_PAGES = ['/pricing', '/checkout', '/checkout-success'];

export function AdsenseBanner() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const pathname = usePathname();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc(userProfileRef);

  const isFreeTier = !user || userProfile?.subscriptionStatus === 'free';
  const isAdPage = ADS_DISABLED_ON_PAGES.includes(pathname);

  if (isLoading || isUserLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!isFreeTier || isAdPage) {
    return null;
  }

  return (
    <div className="relative rounded-lg border-2 border-dashed border-muted p-4 text-center">
      <Badge
        variant="outline"
        className="absolute -top-3 left-4 bg-background px-2"
      >
        Advertisement
      </Badge>
      <p className="text-sm text-muted-foreground">
        Sponsored content helps keep our free plan available.
      </p>
    </div>
  );
}