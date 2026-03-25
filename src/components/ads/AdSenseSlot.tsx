'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  adSlot: string;
  className?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
};

const ADS_DISABLED_ON_PAGES = [
  '/pricing',
  '/checkout',
  '/checkout-success',
  '/login',
  '/signup',
];

export default function AdSenseSlot({
  adSlot,
  className,
  format = 'auto',
}: Props) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const pathname = usePathname();

  const hasRequestedAd = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const subscriptionStatus = userProfile?.subscriptionStatus ?? 'free';
  const isFreeTier = !user || subscriptionStatus === 'free';
  const isAdPage = !ADS_DISABLED_ON_PAGES.includes(pathname);
  const showAd = isFreeTier && isAdPage;

  useEffect(() => {
    if (!showAd) return;
  
    const timer = setTimeout(() => {
      try {
        if (
          typeof window !== "undefined" &&
          window.adsbygoogle &&
          insRef.current &&
          !insRef.current.hasAttribute("data-adsbygoogle-status")
        ) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }, 500);
  
    return () => clearTimeout(timer);
  }, [pathname, showAd]);

  if (isUserLoading || isProfileLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!showAd) return null;

  return (
    <div key={`${pathname}-${adSlot}`} className={cn('container py-4', className)}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', minHeight: '90px' }}
        data-ad-client="ca-pub-9326997552597196"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}