import type { Metadata } from "next";
import { Suspense } from "react";
import { ItineraryForm } from "./itinerary-form";
import ExpediaWidget from "@/components/ExpediaWidget";

export const metadata: Metadata = {
  title: "AI Itinerary Builder – Wanderwise AI",
  description:
    "Generate a complete custom travel itinerary in seconds using Wanderwise AI.",
  alternates: {
    canonical: "/itinerary-builder",
  },
};

export default function ItineraryBuilderPage() {
  return (
    <div className="container mx-auto max-w-6xl py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <div className="text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              Create Your Perfect Itinerary
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Let our AI craft a personalized travel plan just for you.
              <br />
              <span className="text-primary font-medium">
                Subscribers can save their generated itineraries.
              </span>
            </p>
          </div>

          <div className="mt-10">
            <Suspense fallback={<div>Loading form...</div>}>
              <ItineraryForm />
            </Suspense>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Search Hotels & Flights</h2>
            <p className="mt-2 text-muted-foreground">
              Compare travel options with our Expedia partner widget.
            </p>

            <div className="mt-6 flex justify-center">
  <ExpediaWidget />
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
