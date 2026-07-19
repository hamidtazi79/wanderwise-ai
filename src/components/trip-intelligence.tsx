'use client';

import {
  Wallet,
  BedDouble,
  UtensilsCrossed,
  Bus,
  Ticket,
  Backpack,
  Shirt,
  Smartphone,
  Plug,
  Umbrella,
  Sun,
  Snowflake,
  Plane,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';

interface Props {
  destination: string;
  duration: number;
  budget: 'low' | 'medium' | 'high';
  trip: GenerateSmartItineraryOutput | null;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TripIntelligence({
  destination,
  duration,
  budget,
  trip,
}: Props) {
  const activityCost =
    trip?.days.reduce((total, day) => {
      const activities = [
        ...day.morning,
        ...day.afternoon,
        ...day.evening,
      ];

      return (
        total +
        activities.reduce(
          (sum, activity) => sum + (Number(activity.cost) || 0),
          0
        )
      );
    }, 0) ?? 0;

  const hotel =
    trip?.hotelRecommendations.find((h) => {
      if (budget === 'low') return h.category === 'Budget';
      if (budget === 'medium') return h.category === 'Mid-range';
      return h.category === 'Premium';
    }) ?? null;

  const accommodation =
    hotel?.pricePerNight
      ? hotel.pricePerNight * duration
      : budget === 'low'
      ? duration * 55
      : budget === 'medium'
      ? duration * 120
      : duration * 280;

  const food =
    budget === 'low'
      ? duration * 30
      : budget === 'medium'
      ? duration * 55
      : duration * 90;

  const transport =
    budget === 'low'
      ? duration * 12
      : budget === 'medium'
      ? duration * 20
      : duration * 40;

  const total =
    accommodation +
    food +
    transport +
    activityCost;

  const average = total / duration;

  const packing = [
    {
      icon: Plane,
      label: 'Passport / ID',
    },
    {
      icon: Smartphone,
      label: 'Phone charger',
    },
    {
      icon: Plug,
      label: 'Travel adapter',
    },
    {
      icon: Backpack,
      label: 'Small day backpack',
    },
    {
      icon: Shirt,
      label: 'Comfortable clothes',
    },
    {
      icon: Umbrella,
      label: 'Compact umbrella',
    },
    {
      icon: Sun,
      label: 'Sunglasses',
    },
    {
      icon: Snowflake,
      label: 'Warm layer (if needed)',
    },
  ];

  const transportTips = [
    'Use public transport for longer journeys.',
    'Walk between nearby attractions.',
    'Buy a daily transport pass if available.',
    'Use official taxi or ride-sharing apps.',
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">
          Trip Intelligence
        </h2>

        <p className="mt-2 text-muted-foreground">
          Smart travel insights for your visit to{' '}
          <strong>{destination}</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-sky-500" />
              Estimated Budget
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <BudgetRow
              icon={<BedDouble className="h-4 w-4" />}
              label="Accommodation"
              value={formatUsd(accommodation)}
            />

            <BudgetRow
              icon={<UtensilsCrossed className="h-4 w-4" />}
              label="Food"
              value={formatUsd(food)}
            />

            <BudgetRow
              icon={<Bus className="h-4 w-4" />}
              label="Transport"
              value={formatUsd(transport)}
            />

            <BudgetRow
              icon={<Ticket className="h-4 w-4" />}
              label="Activities"
              value={formatUsd(activityCost)}
            />

            <div className="border-t pt-4">
              <BudgetRow
                icon={<DollarSign className="h-5 w-5" />}
                label="Estimated Total"
                value={formatUsd(total)}
                bold
              />

              <BudgetRow
                icon={<Wallet className="h-4 w-4" />}
                label="Daily Average"
                value={formatUsd(average)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Packing Checklist
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {packing.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border p-3"
                >
                  <item.icon className="h-5 w-5 text-sky-500" />

                  <span className="text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Local Transport Tips
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {transportTips.map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-3 rounded-xl border p-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />

              <p className="text-sm">
                {tip}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {hotel && (
        <Card>
          <CardHeader>
            <CardTitle>
              Recommended Area
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Badge>{hotel.category}</Badge>

            <h3 className="text-xl font-semibold">
              {hotel.area}
            </h3>

            <p className="text-muted-foreground">
              {hotel.description}
            </p>

            <p className="font-semibold text-sky-600">
              From {formatUsd(hotel.pricePerNight)} per night
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
}

function BudgetRow({
  icon,
  label,
  value,
  bold,
}: RowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}

        <span className={bold ? 'font-semibold' : ''}>
          {label}
        </span>
      </div>

      <span className={bold ? 'font-bold' : ''}>
        {value}
      </span>
    </div>
  );
}
