import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Itinerary Builder – Wanderwise AI",
  description:
    "Generate a complete custom travel itinerary in seconds using Wanderwise AI.",
  alternates: {
    canonical: "/itinerary-builder",
  },
};
import { ItineraryForm } from './itinerary-form';
import { Suspense } from 'react';


function ItineraryBuilderContent() {
    return (
        <div className="container mx-auto max-w-3xl py-12">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                Create Your Perfect Itinerary
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                Let our AI craft a personalized travel plan just for you.
                <br />
                <span className="text-primary font-medium">Subscribers can save their generated itineraries.</span>
                </p>
            </div>

            <div className="mt-10">
                <ItineraryForm />
            </div>
        </div>
    )
}

export default function ItineraryBuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ItineraryBuilderContent />
    </Suspense>
  );
}
