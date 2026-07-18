'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, UserPlus } from 'lucide-react';

import { useUser } from '@/firebase/provider';
import { Logo } from '@/components/logo';
import { AuthDropdown } from './auth-buttons';
import { Button } from '@/components/ui/button';
import { Skeleton } from './ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/itinerary-builder', label: 'Itinerary Builder' },
  { href: '/ai-chat', label: 'AI Travel Chat' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  const [isMobileMenuOpen, setMobileMenuOpen] =
    React.useState(false);

  const isLoggedIn = Boolean(user);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function isActiveLink(href: string) {
    if (href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
          <div className="shrink-0 md:hidden">
            <Sheet
              open={isMobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-10 w-10 shrink-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">
                    Open navigation menu
                  </span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex w-[85vw] max-w-sm flex-col"
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">
                    Main navigation
                  </SheetTitle>
                </SheetHeader>

                <div className="border-b pb-4">
                  <Logo showText />
                </div>

                <nav
                  className="flex flex-col gap-1 py-4"
                  aria-label="Mobile navigation"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                        isActiveLink(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="border-t py-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <Link
                      href="/about"
                      onClick={closeMobileMenu}
                      className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      About
                    </Link>

                    <Link
                      href="/contact"
                      onClick={closeMobileMenu}
                      className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 border-t pt-4">
                  {isUserLoading ? (
                    <>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : isLoggedIn ? (
                    <AuthDropdown
                      isMobile
                      onAuthAction={closeMobileMenu}
                    />
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link
                          href="/login"
                          onClick={closeMobileMenu}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Log In
                        </Link>
                      </Button>

                      <Button asChild>
                        <Link
                          href="/signup"
                          onClick={closeMobileMenu}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-w-0 md:hidden">
            <Logo showText compact />
          </div>

          <div className="hidden shrink-0 md:block">
            <Logo showText />
          </div>

          <nav
            className="ml-2 hidden min-w-0 items-center gap-5 text-sm md:flex lg:gap-6"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'whitespace-nowrap font-medium transition-colors hover:text-primary',
                  isActiveLink(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:gap-2">
          {isUserLoading ? (
            <>
              <Skeleton className="hidden h-9 w-16 sm:block" />
              <Skeleton className="h-9 w-20" />
            </>
          ) : isLoggedIn ? (
            <AuthDropdown />
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">Log In</Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="whitespace-nowrap px-3 sm:px-4"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
