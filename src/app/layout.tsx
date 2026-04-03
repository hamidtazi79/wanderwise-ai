import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from "@/firebase/provider";
import ClientTrackingShell from "./ClientTrackingShell";
import MetaPixel from "@/components/MetaPixel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wanderwise.uk"),
  title: {
    default: "Wanderwise AI – AI Travel Planner & Smart Trip Itinerary Generator",
    template: "%s | Wanderwise AI",
  },
  description:
    "Wanderwise AI is an AI travel planner that helps you build personalized itineraries, discover hidden gems, and organize your trip in seconds.",
  keywords: [
    "AI travel planner",
    "AI trip planner",
    "AI itinerary generator",
    "travel itinerary planner",
    "travel assistant",
    "trip planner UK",
    "Wanderwise AI",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wanderwise AI – AI Travel Planner & Smart Trip Itinerary Generator",
    description:
      "Plan smarter with Wanderwise AI. Create personalized itineraries, explore destinations, and organize trips instantly with AI.",
    url: "https://wanderwise.uk",
    siteName: "Wanderwise AI",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wanderwise AI – AI Travel Planner & Smart Trip Itinerary Generator",
    description:
      "Create personalized travel itineraries, explore destinations, and plan trips in seconds with Wanderwise AI.",
    creator: "@wanderwise",
    site: "@wanderwise",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "travel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020817",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Wanderwise AI",
    url: "https://wanderwise.uk",
    description:
      "AI travel planner that creates personalized itineraries and helps travelers plan smarter.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://wanderwise.uk/ai-chat?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Wanderwise AI",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    url: "https://wanderwise.uk",
    description:
      "Wanderwise AI is an AI-powered travel planner that generates personalized itineraries, offers destination ideas, and helps users organize trips instantly.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
