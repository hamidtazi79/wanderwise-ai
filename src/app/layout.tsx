import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import ClientTrackingShell from './ClientTrackingShell';
import MetaPixel from '@/components/MetaPixel';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wanderwise.uk'),
  title: {
    default: 'Wanderwise AI | AI Travel Planner & Itinerary Generator',
    template: '%s | Wanderwise AI',
  },
  description:
    'Wanderwise AI is an AI travel planner and itinerary generator that helps you create personalized travel plans, discover hidden gems, and organize trips in seconds.',
  applicationName: 'Wanderwise AI',
  keywords: [
    'AI travel planner',
    'AI itinerary generator',
    'AI trip planner',
    'travel itinerary planner',
    'trip planner',
    'travel planner UK',
    'travel assistant',
    'AI travel assistant',
    'custom itinerary generator',
    'Wanderwise AI',
  ],
  authors: [{ name: 'Wanderwise AI' }],
  creator: 'Wanderwise AI',
  publisher: 'Wanderwise AI',
  category: 'travel',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Wanderwise AI | AI Travel Planner & Itinerary Generator',
    description:
      'Plan smarter with Wanderwise AI. Create personalized itineraries, explore destinations, and organize trips instantly with AI.',
    url: 'https://wanderwise.uk',
    siteName: 'Wanderwise AI',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wanderwise AI - AI Travel Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wanderwise AI | AI Travel Planner & Itinerary Generator',
    description:
      'Create personalized travel itineraries, explore destinations, and plan trips in seconds with Wanderwise AI.',
    creator: '@wanderwise',
    site: '@wanderwise',
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020817',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wanderwise AI',
    url: 'https://wanderwise.uk',
    description:
      'Wanderwise AI is an AI travel planner and itinerary generator that helps users build smarter trips with personalized recommendations.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://wanderwise.uk/ai-chat?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-GB',
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Wanderwise AI',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    url: 'https://wanderwise.uk',
    description:
      'Wanderwise AI is an AI-powered travel planner that generates personalized itineraries, destination ideas, and smart travel recommendations.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI itinerary generation',
      'Personalized trip planning',
      'Travel recommendations',
      'AI travel chat',
      'Budget-based travel suggestions',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wanderwise AI',
    url: 'https://wanderwise.uk',
    logo: 'https://wanderwise.uk/icon.png',
    sameAs: [],
  };

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full font-body antialiased">
        <MetaPixel />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <FirebaseProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseProvider>

        <ClientTrackingShell />
      </body>
    </html>
  );
}
