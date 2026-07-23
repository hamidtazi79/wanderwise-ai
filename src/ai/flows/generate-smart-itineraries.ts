'use server';

/**
 * @fileOverview Generates destination-specific travel itineraries,
 * activity costs, hotel recommendations, and map coordinates.
 *
 * - generateSmartItinerary - Generates a personalized travel itinerary.
 * - GenerateSmartItineraryInput - Input type for itinerary generation.
 * - GenerateSmartItineraryOutput - Output type for itinerary generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSmartItineraryInputSchema = z.object({
  destination: z
    .string()
    .min(2)
    .describe('The city, region, or country for the itinerary.'),

  duration: z
    .number()
    .int()
    .min(1)
    .max(14)
    .describe('The duration of the trip in days.'),

  interests: z
    .string()
    .describe('A comma-separated list of traveler interests.'),

  budget: z
    .enum(['low', 'medium', 'high'])
    .describe('The traveler budget level.'),
});

export type GenerateSmartItineraryInput = z.infer<
  typeof GenerateSmartItineraryInputSchema
>;

const ActivitySchema = z.object({
  activity: z
    .string()
    .describe('A concise title for the activity.'),

  description: z
    .string()
    .describe(
      'A detailed, natural paragraph explaining the activity and why it suits the traveler.'
    ),

  location: z
    .string()
    .describe(
      'A specific landmark, neighborhood, district, attraction, or approximate area.'
    ),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .describe(
      'The approximate latitude of the activity location as a decimal number.'
    ),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .describe(
      'The approximate longitude of the activity location as a decimal number.'
    ),

  cost: z
    .number()
    .min(0)
    .describe(
      'The estimated per-person cost of the activity in USD. Use 0 for free activities.'
    ),
});

const DayPlanSchema = z.object({
  day: z
    .number()
    .int()
    .min(1)
    .describe('The itinerary day number, beginning with 1.'),

  title: z
    .string()
    .describe("A short and engaging title for the day's theme."),

  morning: z
    .array(ActivitySchema)
    .min(1)
    .describe('One or more morning activities.'),

  afternoon: z
    .array(ActivitySchema)
    .min(1)
    .describe('One or more afternoon activities.'),

  evening: z
    .array(ActivitySchema)
    .min(1)
    .describe('One or more evening activities.'),
});

const HotelRecommendationSchema = z.object({
  category: z
    .enum(['Budget', 'Mid-range', 'Premium'])
    .describe('The accommodation price category.'),

  area: z
    .string()
    .describe(
      'A real neighborhood, district, resort area, or suitable part of the destination.'
    ),

  description: z
    .string()
    .describe(
      'A concise explanation of why this area suits this category of traveler.'
    ),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .describe(
      'The approximate latitude of the recommended accommodation area.'
    ),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .describe(
      'The approximate longitude of the recommended accommodation area.'
    ),

  pricePerNight: z
    .number()
    .min(0)
    .describe(
      'A realistic approximate starting nightly accommodation price in USD.'
    ),

  currency: z
    .literal('USD')
    .describe('The currency used for the nightly price.'),
});

const GenerateSmartItineraryOutputSchema = z.object({
  overview: z
    .string()
    .describe(
      'A brief and engaging paragraph summarizing the complete trip.'
    ),

  days: z
    .array(DayPlanSchema)
    .describe('The complete day-by-day itinerary.'),

  hotelRecommendations: z
    .array(HotelRecommendationSchema)
    .length(3)
    .describe(
      'Exactly three destination-specific accommodation recommendations: Budget, Mid-range, and Premium.'
    ),
});

export type GenerateSmartItineraryOutput = z.infer<
  typeof GenerateSmartItineraryOutputSchema
>;

export async function generateSmartItinerary(
  input: GenerateSmartItineraryInput
): Promise<GenerateSmartItineraryOutput> {
  return generateSmartItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartItineraryPrompt',

  input: {
    schema: GenerateSmartItineraryInputSchema,
  },

  output: {
    schema: GenerateSmartItineraryOutputSchema,
  },

  prompt: `
You are a world-class travel planner creating a professional,
destination-specific itinerary with map-ready location data.

USER REQUEST

Destination: {{destination}}
Duration: {{duration}} days
Interests: {{interests}}
Budget: {{budget}}

GENERAL REQUIREMENTS

- Generate practical recommendations specifically for {{destination}}.
- Adapt activities, accommodation areas, and prices to the destination.
- Adapt the itinerary to the user's selected budget.
- Use USD for every activity and accommodation price.
- Treat all prices as realistic planning estimates, not guaranteed live prices.
- Keep the itinerary geographically sensible.
- Group activities in nearby areas whenever practical.
- Avoid unnecessary travel across opposite sides of the destination on the same day.
- Avoid inventing exact street addresses when uncertain.
- Never reuse generic accommodation areas such as "outer central area",
  "city center area", or "luxury district" when a real local area can
  reasonably be recommended.
- Return only data matching the required output schema.

MAP COORDINATE REQUIREMENTS

Every activity and hotel recommendation must include:

- latitude
- longitude

Coordinate rules:

- Return latitude and longitude as decimal numbers.
- Do not return coordinates as strings.
- Latitude must be between -90 and 90.
- Longitude must be between -180 and 180.
- Coordinates should represent the named landmark, attraction,
  neighborhood, district, or approximate area.
- Use the center point of a neighborhood or district when the recommendation
  covers a broad area.
- Do not invent overly precise coordinates for an uncertain location.
- Use reasonable approximate coordinates that place the marker in the
  correct destination and local area.
- Confirm mentally that the coordinates belong to {{destination}} before
  returning them.
- Do not accidentally swap latitude and longitude.
- All activity coordinates must remain geographically close to the requested
  destination unless the itinerary explicitly includes a realistic day trip.

OVERVIEW

Create one engaging paragraph summarizing the complete trip.

DAILY ITINERARY

Create exactly {{duration}} day objects.

Each day must include:

- A sequential day number beginning with 1.
- A short and engaging title.
- At least one morning activity.
- At least one afternoon activity.
- At least one evening activity.

Every activity must include:

- A concise activity title.
- A useful and natural description.
- A realistic estimated per-person cost in USD.
- Use 0 when the activity is free.
- A specific location, neighborhood, landmark, attraction, or area.
- Approximate latitude.
- Approximate longitude.

Descriptions must be natural paragraphs.

Do not place labels such as "Address:", "Latitude:", "Longitude:",
"Price:", or "Cost:" inside activity descriptions.

Use the structured fields for location, coordinates, and cost.

HOTEL RECOMMENDATIONS

Create exactly three hotelRecommendations in this order:

1. Budget
2. Mid-range
3. Premium

For each recommendation:

- Recommend a real and suitable area within or near {{destination}}.
- Explain why the area suits that accommodation category.
- Provide the approximate center latitude of the recommended area.
- Provide the approximate center longitude of the recommended area.
- Provide a realistic approximate starting price per night.
- Use USD only.
- Set currency to "USD".
- Return the price as a number without a currency symbol.
- Do not recommend a specific hotel unless you are confident it exists.
- Prefer neighborhood or district recommendations over hotel names.
- Prices must reflect the local accommodation market.
- The Budget, Mid-range, and Premium areas may be different when appropriate.
- Make sure all three coordinates belong to their corresponding recommended
  areas.

For example, an affordable Moroccan or Tunisian city should normally have
lower accommodation estimates than central London, Paris, New York,
Dubai, Tokyo, or Switzerland.

FINAL VALIDATION

Before returning the result, verify:

- The number of day objects exactly equals {{duration}}.
- Day numbers are sequential.
- Every morning, afternoon, and evening array contains at least one activity.
- Every activity contains location, latitude, longitude, and cost.
- There are exactly three hotel recommendations.
- Hotel categories appear in this exact order:
  Budget, Mid-range, Premium.
- Every hotel recommendation contains latitude and longitude.
- All prices use USD.
- Coordinates are decimal numbers rather than text.
- Coordinates correspond approximately to the named places.
- The result matches the required output schema exactly.
`,
});

const generateSmartItineraryFlow = ai.defineFlow(
  {
    name: 'generateSmartItineraryFlow',
    inputSchema: GenerateSmartItineraryInputSchema,
    outputSchema: GenerateSmartItineraryOutputSchema,
  },

  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error(
        'Failed to generate itinerary. The AI returned no output.'
      );
    }

    if (output.days.length !== input.duration) {
      throw new Error(
        `The AI generated ${output.days.length} days instead of ${input.duration}.`
      );
    }

    const expectedCategories = ['Budget', 'Mid-range', 'Premium'] as const;

    if (output.hotelRecommendations.length !== expectedCategories.length) {
      throw new Error(
        'The AI did not generate all three accommodation recommendations.'
      );
    }

    expectedCategories.forEach((category, index) => {
      const recommendation = output.hotelRecommendations[index];

      if (recommendation.category !== category) {
        throw new Error(
          `Hotel recommendation ${index + 1} must use the ${category} category.`
        );
      }
    });

    output.days.forEach((day, dayIndex) => {
      const expectedDayNumber = dayIndex + 1;

      if (day.day !== expectedDayNumber) {
        throw new Error(
          `The itinerary day sequence is invalid. Expected day ${expectedDayNumber}, but received day ${day.day}.`
        );
      }

      const activities = [
        ...day.morning,
        ...day.afternoon,
        ...day.evening,
      ];

      activities.forEach((activity) => {
        if (!activity.location.trim()) {
          throw new Error(
            `An activity on day ${day.day} is missing its location.`
          );
        }

        if (
          !Number.isFinite(activity.latitude) ||
          !Number.isFinite(activity.longitude)
        ) {
          throw new Error(
            `An activity on day ${day.day} has invalid map coordinates.`
          );
        }
      });
    });

    output.hotelRecommendations.forEach((recommendation) => {
      if (
        !Number.isFinite(recommendation.latitude) ||
        !Number.isFinite(recommendation.longitude)
      ) {
        throw new Error(
          `${recommendation.category} accommodation has invalid map coordinates.`
        );
      }
    });

    return output;
  }
);
