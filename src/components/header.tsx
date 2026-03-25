'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogIn, UserPlus } from 'lucide-react';
import React from 'react';

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
  { href: '/ai-chat', label: 'AI Chat' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const isLoggedIn = !!user;

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
              </SheetHeader>

              <div className="flex h-full flex-col">
                <div className="border-b pb-4">
                  <Logo showText={true} />
                </div>

                <nav className="flex flex-col gap-4 py-4" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        'text-lg font-medium transition-colors',
                        isActiveLink(link.href)
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-2 border-t pt-4">
                  {isLoggedIn ? (
                    <AuthDropdown isMobile={true} onAuthAction={closeMobileMenu} />
                  ) : (
                    <>
                      <Button asChild onClick={closeMobileMenu} variant="outline">
                        <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Log In
                        </Link>
                      </Button>

                      <Button asChild onClick={closeMobileMenu}>
                        <Link href="/signup">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className="md:hidden">
            <Logo showText={true} />
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-medium transition-colors hover:text-primary',
                  isActiveLink(link.href) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-2">
            {isUserLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ) : isLoggedIn ? (
              <AuthDropdown />
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Log In</Link>
                </Button>

                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
