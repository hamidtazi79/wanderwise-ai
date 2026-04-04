import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

import { Logo } from './logo';
import AdSenseSlot from './ads/AdSenseSlot';

function Copyright() {
  const year = new Date().getFullYear();

  return (
    <p className="text-sm text-muted-foreground">
      &copy; {year} Wanderwise AI. All rights reserved.
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-card">
      <AdSenseSlot adSlot="1032171446" />

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">
              Wanderwise AI is an AI travel planner and itinerary generator that
              helps travelers build personalized trip plans, discover new
              destinations, and organize travel faster.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div>
              <h3 className="font-semibold">Explore</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/itinerary-builder" className="hover:underline">
                    AI Itinerary Builder
                  </Link>
                </li>
                <li>
                  <Link href="/ai-chat" className="hover:underline">
                    AI Travel Chat
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:underline">
                    Travel Blog
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:underline">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-4 sm:flex-row">
          <Copyright />

          <div className="flex gap-4">
            <Link
              href="https://www.facebook.com/profile.php?id=61586116611131"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Wanderwise AI on Facebook"
            >
              <Facebook size={20} />
            </Link>

            <Link
              href="https://www.instagram.com/wander.wiseai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Wanderwise AI on Instagram"
            >
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
