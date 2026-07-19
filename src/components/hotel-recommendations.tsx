import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type HotelRecommendations =
  GenerateSmartItineraryOutput['hotelRecommendations'];

type HotelRecommendationsProps = {
  destination: string;
  recommendations?: HotelRecommendations;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HotelRecommendations({
  destination,
  recommendations,
}: HotelRecommendationsProps) {
  const hotels = recommendations ?? [];
  const hasRecommendations = hotels.length === 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where to stay</CardTitle>

        <CardDescription>
          Destination-specific hotel areas and estimated nightly prices for{' '}
          <span className="capitalize">{destination}</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasRecommendations ? (
          <>
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <div
                  key={hotel.category}
                  className="rounded-2xl border bg-card p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <Badge className="w-fit">
                        {hotel.category}
                      </Badge>

                      <h3 className="mt-3 text-base font-semibold leading-6">
                        {hotel.area}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {hotel.description}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-slate-50 px-4 py-3 text-left sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        From
                      </p>

                      <p className="mt-1 whitespace-nowrap text-lg font-bold text-slate-950">
                        {formatUsd(hotel.pricePerNight)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        per night
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Prices are AI-generated estimates in USD and may vary depending
              on travel dates, season, availability, and accommodation type.
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed p-5 text-sm leading-6 text-muted-foreground">
            This itinerary was created before destination-specific hotel
            recommendations were added. Generate a new itinerary to receive
            local hotel areas and estimated USD prices for{' '}
            <span className="capitalize">{destination}</span>.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
