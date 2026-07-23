'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Crown,
  ExternalLink,
  Filter,
  Layers3,
  Loader2,
  Lock,
  Map,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
} from 'lucide-react';

import type { GenerateSmartItineraryOutput } from '@/ai/flows/generate-smart-itineraries';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Activity =
  GenerateSmartItineraryOutput['days'][number]['morning'][number];

type HotelRecommendation =
  GenerateSmartItineraryOutput['hotelRecommendations'][number];

type CoordinateValue = {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  coordinates?: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
};

type MappableActivity = Activity & CoordinateValue;
type MappableHotel = HotelRecommendation & CoordinateValue;

type MapPointType = 'activity' | 'hotel';

interface MapPoint {
  id: string;
  name: string;
  location: string;
  description?: string;
  day?: number;
  period?: 'Morning' | 'Afternoon' | 'Evening';
  type: MapPointType;
  latitude?: number;
  longitude?: number;
}

interface PremiumTripMapProps {
  destination: string;
  trip: GenerateSmartItineraryOutput | null;
  isPremium: boolean;
  className?: string;
}

type LeafletModule = typeof import('leaflet');
type LeafletMap = import('leaflet').Map;
type LeafletMarker = import('leaflet').Marker;
type LeafletPolyline = import('leaflet').Polyline;

const DEFAULT_MAP_CENTER: [number, number] = [20, 0];
const DEFAULT_MAP_ZOOM = 2;

const DAY_COLORS = [
  '#0284c7',
  '#7c3aed',
  '#059669',
  '#d97706',
  '#dc2626',
  '#0891b2',
  '#4f46e5',
];

function getGoogleMapsUrl(place: string, destination: string) {
  const query = [place, destination].filter(Boolean).join(', ');

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

function toFiniteNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function readCoordinates(value: CoordinateValue) {
  const latitude =
    toFiniteNumber(value.latitude) ??
    toFiniteNumber(value.lat) ??
    toFiniteNumber(value.coordinates?.latitude) ??
    toFiniteNumber(value.coordinates?.lat);

  const longitude =
    toFiniteNumber(value.longitude) ??
    toFiniteNumber(value.lng) ??
    toFiniteNumber(value.coordinates?.longitude) ??
    toFiniteNumber(value.coordinates?.lng);

  if (
    latitude == null ||
    longitude == null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return {
      latitude: undefined,
      longitude: undefined,
    };
  }

  return {
    latitude,
    longitude,
  };
}

function buildActivityPoint(
  activity: Activity,
  day: number,
  period: MapPoint['period'],
  index: number
): MapPoint {
  const mappableActivity = activity as MappableActivity;
  const coordinates = readCoordinates(mappableActivity);
  const location = activity.location?.trim() || activity.activity;

  return {
    id: `activity-${day}-${period}-${index}-${location}`,
    name: activity.activity,
    location,
    description: activity.description,
    day,
    period,
    type: 'activity',
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
}

function buildMapPoints(trip: GenerateSmartItineraryOutput | null) {
  if (!trip) {
    return [];
  }

  const points: MapPoint[] = [];

  trip.days?.forEach((day) => {
    day.morning?.forEach((activity, index) => {
      points.push(buildActivityPoint(activity, day.day, 'Morning', index));
    });

    day.afternoon?.forEach((activity, index) => {
      points.push(buildActivityPoint(activity, day.day, 'Afternoon', index));
    });

    day.evening?.forEach((activity, index) => {
      points.push(buildActivityPoint(activity, day.day, 'Evening', index));
    });
  });

  trip.hotelRecommendations?.forEach((hotel, index) => {
    const mappableHotel = hotel as MappableHotel;
    const coordinates = readCoordinates(mappableHotel);

    points.push({
      id: `hotel-${index}-${hotel.area}`,
      name: `${hotel.category} stay`,
      location: hotel.area,
      description: hotel.description,
      type: 'hotel',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  });

  const seen = new Set<string>();

  return points.filter((point) => {
    const key = `${point.type}-${point.location.toLowerCase()}-${point.day ?? 0}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function createMarkerIcon(
  L: LeafletModule,
  point: MapPoint
): import('leaflet').DivIcon {
  const isHotel = point.type === 'hotel';
  const dayIndex = Math.max(0, (point.day ?? 1) - 1);
  const markerColor = isHotel
    ? '#f59e0b'
    : DAY_COLORS[dayIndex % DAY_COLORS.length];

  const markerLabel = isHotel ? 'H' : String(point.day ?? '•');

  return L.divIcon({
    className: 'wanderwise-map-marker',
    html: `
      <div
        style="
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: ${markerColor};
          color: white;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.28);
          font-size: 12px;
          font-weight: 800;
        "
        aria-label="${isHotel ? 'Hotel' : `Day ${point.day}`} marker"
      >
        ${markerLabel}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildPopupHtml(point: MapPoint, destination: string) {
  const mapsUrl = getGoogleMapsUrl(point.location, destination);
  const meta =
    point.type === 'hotel'
      ? 'Hotel area'
      : `Day ${point.day} · ${point.period ?? 'Activity'}`;

  return `
    <div style="min-width: 210px; max-width: 270px;">
      <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.04em;">
        ${escapeHtml(meta)}
      </div>
      <div style="margin-top: 6px; font-size: 15px; font-weight: 700; color: #0f172a;">
        ${escapeHtml(point.name)}
      </div>
      <div style="margin-top: 4px; font-size: 13px; color: #475569;">
        ${escapeHtml(point.location)}
      </div>
      ${
        point.description
          ? `<div style="margin-top: 8px; font-size: 12px; line-height: 1.5; color: #64748b;">
              ${escapeHtml(point.description.slice(0, 180))}
            </div>`
          : ''
      }
      <a
        href="${mapsUrl}"
        target="_blank"
        rel="noopener noreferrer"
        style="
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: #0369a1;
          text-decoration: none;
        "
      >
        Open in Google Maps ↗
      </a>
    </div>
  `;
}

function InteractiveMapCanvas({
  points,
  destination,
}: {
  points: MapPoint[];
  destination: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const routeRef = useRef<LeafletPolyline | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const coordinatePoints = useMemo(
    () =>
      points.filter(
        (point) =>
          point.latitude != null &&
          point.longitude != null
      ),
    [points]
  );

  useEffect(() => {
    let isCancelled = false;

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      try {
        setIsLoading(true);
        setMapError(null);

        const leafletModule = await import('leaflet');
        const L = leafletModule.default ?? leafletModule;

        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const map = L.map(mapContainerRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
          zoomControl: true,
          scrollWheelZoom: false,
          worldCopyJump: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapRef.current = map;

        window.setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error('Unable to initialize Leaflet map:', error);

        if (!isCancelled) {
          setMapError(
            'The interactive map could not be loaded. Google Maps links remain available below.'
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    initializeMap();

    return () => {
      isCancelled = true;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      routeRef.current?.remove();
      routeRef.current = null;

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function updateMapLayers() {
      const map = mapRef.current;

      if (!map) {
        return;
      }

      try {
        const leafletModule = await import('leaflet');
        const L = leafletModule.default ?? leafletModule;

        if (isCancelled) {
          return;
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        routeRef.current?.remove();
        routeRef.current = null;

        const bounds: [number, number][] = [];
        const activityRoute: [number, number][] = [];

        coordinatePoints.forEach((point) => {
          if (point.latitude == null || point.longitude == null) {
            return;
          }

          const position: [number, number] = [
            point.latitude,
            point.longitude,
          ];

          const marker = L.marker(position, {
            icon: createMarkerIcon(L, point),
            title: point.location,
            keyboard: true,
          });

          marker
            .bindPopup(buildPopupHtml(point, destination), {
              maxWidth: 300,
            })
            .addTo(map);

          markersRef.current.push(marker);
          bounds.push(position);

          if (point.type === 'activity') {
            activityRoute.push(position);
          }
        });

        if (activityRoute.length >= 2) {
          const route = L.polyline(activityRoute, {
            color: '#0284c7',
            weight: 3,
            opacity: 0.7,
            dashArray: '7 8',
          }).addTo(map);

          routeRef.current = route;
        }

        if (bounds.length === 1) {
          map.setView(bounds[0], 14);
        } else if (bounds.length > 1) {
          map.fitBounds(bounds, {
            padding: [36, 36],
            maxZoom: 15,
          });
        } else {
          map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
        }

        window.setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error('Unable to update map markers:', error);

        if (!isCancelled) {
          setMapError(
            'The map markers could not be displayed. Google Maps links remain available below.'
          );
        }
      }
    }

    updateMapLayers();

    return () => {
      isCancelled = true;
    };
  }, [coordinatePoints, destination]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border bg-muted">
        <div
          ref={mapContainerRef}
          className="h-[420px] w-full"
          aria-label={`Interactive map for ${destination}`}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
              Loading interactive map…
            </div>
          </div>
        )}
      </div>

      {mapError && (
        <Alert variant="destructive">
          <AlertTitle>Map unavailable</AlertTitle>
          <AlertDescription>{mapError}</AlertDescription>
        </Alert>
      )}

      {!mapError && coordinatePoints.length === 0 && (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertTitle>Map coordinates are not available yet</AlertTitle>
          <AlertDescription>
            The component is ready, but the itinerary generator must include
            latitude and longitude for activities and hotel areas before markers
            can appear. The place links below continue to work.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function FreeMapPreview({
  destination,
  placeCount,
}: {
  destination: string;
  placeCount: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-50 via-white to-slate-100 p-6 text-center dark:from-sky-950/30 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
        <Lock className="h-7 w-7" />
      </div>

      <Badge className="mt-4 bg-amber-400 text-slate-950 hover:bg-amber-400">
        Premium feature
      </Badge>

      <h3 className="mt-4 text-xl font-bold">
        Unlock the interactive trip map
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        View {placeCount} detected trip places for {destination} on one map,
        filter locations by day, see hotel areas, and open individual places in
        Google Maps.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Badge variant="secondary">
          <Layers3 className="mr-1 h-3 w-3" />
          Day filters
        </Badge>

        <Badge variant="secondary">
          <Route className="mr-1 h-3 w-3" />
          Route preview
        </Badge>

        <Badge variant="secondary">
          <BedDouble className="mr-1 h-3 w-3" />
          Hotel areas
        </Badge>
      </div>

      <Button asChild className="mt-6">
        <Link href="/pricing">
          <Crown className="mr-2 h-4 w-4" />
          View Premium Plans
        </Link>
      </Button>
    </div>
  );
}

export default function PremiumTripMap({
  destination,
  trip,
  isPremium,
  className,
}: PremiumTripMapProps) {
  const allPoints = useMemo(() => buildMapPoints(trip), [trip]);
  const availableDays = useMemo(
    () =>
      Array.from(
        new Set(
          allPoints
            .filter((point) => point.type === 'activity' && point.day != null)
            .map((point) => point.day as number)
        )
      ).sort((a, b) => a - b),
    [allPoints]
  );

  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [showHotels, setShowHotels] = useState(true);

  useEffect(() => {
    if (
      selectedDay !== 'all' &&
      !availableDays.includes(selectedDay)
    ) {
      setSelectedDay('all');
    }
  }, [availableDays, selectedDay]);

  const filteredPoints = useMemo(
    () =>
      allPoints.filter((point) => {
        if (point.type === 'hotel') {
          return showHotels;
        }

        return selectedDay === 'all' || point.day === selectedDay;
      }),
    [allPoints, selectedDay, showHotels]
  );

  const visibleActivities = filteredPoints.filter(
    (point) => point.type === 'activity'
  );
  const visibleHotels = filteredPoints.filter(
    (point) => point.type === 'hotel'
  );

  const coordinateCount = filteredPoints.filter(
    (point) =>
      point.latitude != null &&
      point.longitude != null
  ).length;

  const resetFilters = () => {
    setSelectedDay('all');
    setShowHotels(true);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-sky-500" />
              Interactive Trip Map
            </CardTitle>

            <CardDescription className="mt-2">
              Explore itinerary activities and recommended hotel areas for{' '}
              <span className="capitalize">{destination}</span>.
            </CardDescription>
          </div>

          <Badge
            className={
              isPremium
                ? 'w-fit bg-amber-400 text-slate-950 hover:bg-amber-400'
                : 'w-fit'
            }
            variant={isPremium ? 'default' : 'secondary'}
          >
            {isPremium ? (
              <>
                <Crown className="mr-1 h-3 w-3" />
                Premium unlocked
              </>
            ) : (
              <>
                <Lock className="mr-1 h-3 w-3" />
                Premium
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isPremium ? (
          <>
            <div className="flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 flex items-center gap-2 text-sm font-semibold">
                  <Filter className="h-4 w-4" />
                  Filter map
                </span>

                <Button
                  type="button"
                  size="sm"
                  variant={selectedDay === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedDay('all')}
                >
                  All days
                </Button>

                {availableDays.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    size="sm"
                    variant={selectedDay === day ? 'default' : 'outline'}
                    onClick={() => setSelectedDay(day)}
                  >
                    Day {day}
                  </Button>
                ))}

                <Button
                  type="button"
                  size="sm"
                  variant={showHotels ? 'secondary' : 'outline'}
                  onClick={() => setShowHotels((current) => !current)}
                >
                  <BedDouble className="mr-1 h-4 w-4" />
                  Hotels
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={resetFilters}
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span>{visibleActivities.length} activities visible</span>
                <span>{visibleHotels.length} hotel areas visible</span>
                <span>{coordinateCount} markers ready</span>
              </div>
            </div>

            <InteractiveMapCanvas
              points={filteredPoints}
              destination={destination}
            />
          </>
        ) : (
          <FreeMapPreview
            destination={destination}
            placeCount={allPoints.filter((point) => point.type === 'activity').length}
          />
        )}

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Places in this trip</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Google Maps links remain available to every Wanderwise user.
              </p>
            </div>

            <Badge variant="secondary">
              {visibleActivities.length + visibleHotels.length} places
            </Badge>
          </div>

          {filteredPoints.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredPoints.map((point) => (
                <a
                  key={point.id}
                  href={getGoogleMapsUrl(point.location, destination)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-start justify-between gap-3 rounded-xl border bg-card p-4 transition hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span
                      className={
                        point.type === 'hotel'
                          ? 'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400'
                      }
                    >
                      {point.type === 'hotel' ? (
                        <BedDouble className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </span>

                    <span className="min-w-0">
                      <span className="block break-words text-sm font-semibold">
                        {point.location}
                      </span>

                      <span className="mt-1 block text-xs text-muted-foreground">
                        {point.type === 'hotel'
                          ? 'Recommended hotel area'
                          : `Day ${point.day} · ${point.period}`}
                      </span>
                    </span>
                  </span>

                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-sky-600" />
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
              No places are available for the current filter.
            </div>
          )}
        </div>

        {isPremium && (
          <div className="flex items-start gap-3 rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground">
            <Navigation className="mt-0.5 h-4 w-4 shrink-0" />

            <p>
              Route lines connect available activity coordinates in itinerary
              order. They are a visual planning guide, not turn-by-turn
              navigation. Use Google Maps for live directions and traffic.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
