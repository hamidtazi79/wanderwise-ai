'use client';

import type { ReactNode } from 'react';

import {
  Backpack,
  BedDouble,
  Bus,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  DollarSign,
  Info,
  MapPin,
  Plane,
  Plug,
  Shirt,
  Smartphone,
  Snowflake,
  Sun,
  Ticket,
  TrainFront,
  Umbrella,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';

import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TripIntelligenceProps {
  destination: string;
  duration: number;
  budget: 'low' | 'medium' | 'high';
  trip: GenerateSmartItineraryOutput | null;
}

type BudgetLevel = TripIntelligenceProps['budget'];

type HotelRecommendation =
  GenerateSmartItineraryOutput['hotelRecommendations'][number];

interface PackingItem {
  label: string;
  icon: ReactNode;
}

interface BudgetRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  description?: string;
  bold?: boolean;
}

const DAILY_FOOD_ESTIMATES: Record<BudgetLevel, number> = {
  low: 30,
  medium: 55,
  high: 95,
};

const DAILY_TRANSPORT_ESTIMATES: Record<BudgetLevel, number> = {
  low: 12,
  medium: 22,
  high: 45,
};

const FALLBACK_HOTEL_ESTIMATES: Record<BudgetLevel, number> = {
  low: 60,
  medium: 130,
  high: 290,
};

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function normalizeDuration(duration: number) {
  if (!Number.isFinite(duration) || duration < 1) {
    return 1;
  }

  return Math.round(duration);
}

function getBudgetLabel(budget: BudgetLevel) {
  if (budget === 'low') {
    return 'Budget-friendly';
  }

  if (budget === 'high') {
    return 'Premium';
  }

  return 'Mid-range';
}

function getExpectedHotelCategory(budget: BudgetLevel) {
  if (budget === 'low') {
    return 'budget';
  }

  if (budget === 'high') {
    return 'premium';
  }

  return 'mid-range';
}

function findMatchingHotel(
  recommendations: GenerateSmartItineraryOutput['hotelRecommendations'] | undefined,
  budget: BudgetLevel
): HotelRecommendation | null {
  if (!recommendations?.length) {
    return null;
  }

  const expectedCategory = getExpectedHotelCategory(budget);

  const exactMatch = recommendations.find((hotel) => {
    return hotel.category.trim().toLowerCase() === expectedCategory;
  });

  if (exactMatch) {
    return exactMatch;
  }

  if (budget === 'medium') {
    const alternativeMatch = recommendations.find((hotel) => {
      const category = hotel.category.trim().toLowerCase();

      return category.includes('mid') || category.includes('medium');
    });

    if (alternativeMatch) {
      return alternativeMatch;
    }
  }

  return recommendations[0] ?? null;
}

function calculateActivityCost(trip: GenerateSmartItineraryOutput | null) {
  if (!trip?.days?.length) {
    return 0;
  }

  return trip.days.reduce((tripTotal, day) => {
    const activities = [
      ...(day.morning ?? []),
      ...(day.afternoon ?? []),
      ...(day.evening ?? []),
    ];

    const dayTotal = activities.reduce((activityTotal, activity) => {
      const cost = Number(activity.cost);

      return activityTotal + (Number.isFinite(cost) && cost > 0 ? cost : 0);
    }, 0);

    return tripTotal + dayTotal;
  }, 0);
}

function BudgetRow({
  icon,
  label,
  value,
  description,
  bold = false,
}: BudgetRowProps) {
  return (
    <div
      className={
        bold
          ? 'flex items-start justify-between gap-4 rounded-xl bg-sky-50 p-4 dark:bg-sky-950/30'
          : 'flex items-start justify-between gap-4'
      }
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={
            bold
              ? 'mt-0.5 text-sky-600 dark:text-sky-400'
              : 'mt-0.5 text-muted-foreground'
          }
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className={bold ? 'font-semibold' : 'font-medium'}>{label}</p>

          {description && (
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      <span
        className={
          bold
            ? 'shrink-0 text-lg font-bold text-sky-700 dark:text-sky-300'
            : 'shrink-0 font-semibold'
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function TripIntelligence({
  destination,
  duration,
  budget,
  trip,
}: TripIntelligenceProps) {
  const tripDays = normalizeDuration(duration);

  // A five-day trip normally requires four hotel nights.
  const accommodationNights = Math.max(1, tripDays - 1);

  const selectedHotel = findMatchingHotel(
    trip?.hotelRecommendations,
    budget
  );

  const hotelNightlyPrice =
    selectedHotel?.pricePerNight &&
    Number.isFinite(Number(selectedHotel.pricePerNight))
      ? Number(selectedHotel.pricePerNight)
      : FALLBACK_HOTEL_ESTIMATES[budget];

  const accommodationCost = hotelNightlyPrice * accommodationNights;
  const foodCost = DAILY_FOOD_ESTIMATES[budget] * tripDays;
  const transportCost = DAILY_TRANSPORT_ESTIMATES[budget] * tripDays;
  const activityCost = calculateActivityCost(trip);

  const estimatedTotal =
    accommodationCost + foodCost + transportCost + activityCost;

  const dailyAverage = estimatedTotal / tripDays;

  const packingItems: PackingItem[] = [
    {
      label: 'Passport / ID',
      icon: <Plane className="h-4 w-4" />,
    },
    {
      label: 'Phone charger',
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      label: 'Travel adapter',
      icon: <Plug className="h-4 w-4" />,
    },
    {
      label: 'Small day backpack',
      icon: <Backpack className="h-4 w-4" />,
    },
    {
      label: 'Comfortable clothes',
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      label: 'Compact umbrella',
      icon: <Umbrella className="h-4 w-4" />,
    },
    {
      label: 'Sunglasses',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      label: 'Warm layer if needed',
      icon: <Snowflake className="h-4 w-4" />,
    },
  ];

  const transportTips = [
    {
      icon: <TrainFront className="h-4 w-4" />,
      title: 'Use public transport',
      description:
        'Use metro, train, tram, or bus services for longer journeys across the destination.',
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      title: 'Walk between nearby places',
      description:
        'Group attractions by neighborhood to reduce unnecessary travel time.',
    },
    {
      icon: <Ticket className="h-4 w-4" />,
      title: 'Check transport passes',
      description:
        'A daily or multi-day travel pass may cost less than purchasing separate tickets.',
    },
    {
      icon: <Bus className="h-4 w-4" />,
      title: 'Use official transport services',
      description:
        'Choose licensed taxis or trusted ride-sharing applications when public transport is unsuitable.',
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Trip Intelligence
          </h2>

          <Badge variant="secondary">{getBudgetLabel(budget)}</Badge>
        </div>

        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
          Smart budget, packing, and transport guidance for your visit to{' '}
          <span className="font-semibold text-foreground capitalize">
            {destination}
          </span>
          .
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-sky-500" />
              Estimated Budget
            </CardTitle>

            <CardDescription>
              Estimated costs for one traveler over {tripDays}{' '}
              {tripDays === 1 ? 'day' : 'days'}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 p-5 sm:p-6">
            <BudgetRow
              icon={<BedDouble className="h-4 w-4" />}
              label="Accommodation"
              description={`${accommodationNights} ${
                accommodationNights === 1 ? 'night' : 'nights'
              } × ${formatUsd(hotelNightlyPrice)}`}
              value={formatUsd(accommodationCost)}
            />

            <BudgetRow
              icon={<UtensilsCrossed className="h-4 w-4" />}
              label="Food"
              description={`${formatUsd(
                DAILY_FOOD_ESTIMATES[budget]
              )} daily estimate`}
              value={formatUsd(foodCost)}
            />

            <BudgetRow
              icon={<Bus className="h-4 w-4" />}
              label="Local transport"
              description={`${formatUsd(
                DAILY_TRANSPORT_ESTIMATES[budget]
              )} daily estimate`}
              value={formatUsd(transportCost)}
            />

            <BudgetRow
              icon={<Ticket className="h-4 w-4" />}
              label="Activities"
              description="Based on costs included in the generated itinerary"
              value={formatUsd(activityCost)}
            />

            <div className="space-y-3 border-t pt-5">
              <BudgetRow
                icon={<CircleDollarSign className="h-5 w-5" />}
                label="Estimated total"
                value={formatUsd(estimatedTotal)}
                bold
              />

              <BudgetRow
                icon={<Clock3 className="h-4 w-4" />}
                label="Average per day"
                value={formatUsd(dailyAverage)}
              />
            </div>

            <Alert className="border-dashed">
              <Info className="h-4 w-4" />

              <AlertDescription className="text-xs leading-5">
                These are planning estimates in USD. Flights, shopping,
                insurance, visa fees, and unexpected expenses are not included.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Backpack className="h-5 w-5 text-sky-500" />
              Packing Checklist
            </CardTitle>

            <CardDescription>
              Essential items for a comfortable and organized trip.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {packingItems.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-16 items-center gap-3 rounded-xl border bg-card p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                    {item.icon}
                  </span>

                  <span className="text-sm font-medium leading-5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-semibold">Before departure</p>

              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Check passport validity and destination entry requirements.
                </p>

                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Download reservations, tickets, and important addresses.
                </p>

                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Keep essential medication and valuables in your hand luggage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <TrainFront className="h-5 w-5 text-sky-500" />
            Local Transport Tips
          </CardTitle>

          <CardDescription>
            Practical suggestions for moving around {destination}.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
          {transportTips.map((tip) => (
            <div
              key={tip.title}
              className="flex items-start gap-3 rounded-xl border bg-card p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                {tip.icon}
              </span>

              <div>
                <p className="text-sm font-semibold">{tip.title}</p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedHotel && (
        <Card className="overflow-hidden border-sky-500/20">
          <CardHeader className="border-b bg-sky-50/70 dark:bg-sky-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-sky-500" />
                  Recommended Area
                </CardTitle>

                <CardDescription className="mt-2">
                  The accommodation option that best matches your selected
                  budget.
                </CardDescription>
              </div>

              <Badge className="w-fit">{selectedHotel.category}</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold">
                  {selectedHotel.area}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {selectedHotel.description}
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-muted/50 px-5 py-4 sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Estimated from
                </p>

                <p className="mt-1 text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {formatUsd(selectedHotel.pricePerNight)}
                </p>

                <p className="text-xs text-muted-foreground">per night</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground">
        <DollarSign className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          All amounts are estimates generated for planning purposes. Actual
          costs can change depending on dates, season, availability, exchange
          rates, booking time, and personal spending choices.
        </p>
      </div>
    </section>
  );
}
