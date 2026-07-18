'use server';

/**
 * @fileOverview Generates destination-specific travel itineraries,
 * activity costs, and hotel recommendations.
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
    .describe('The city, region, or country for the itinerary.'),

  duration: z
    .number()
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
    .optional()
    .describe(
      'A specific landmark, neighborhood, district, or approximate area.'
    ),

  cost: z
    .number()
    .describe(
      'The estimated per-person cost of the activity in USD. Use 0 for free activities.'
    ),
});

const DayPlanSchema = z.object({
  day: z
    .number()
    .describe('The itinerary day number, beginning with 1.'),

  title: z
    .string()
    .describe("A short and engaging title for the day's theme."),

  morning: z
    .array(ActivitySchema)
    .describe('One or more morning activities.'),

  afternoon: z
    .array(ActivitySchema)
    .describe('One or more afternoon activities.'),

  evening: z
    .array(ActivitySchema)
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

  pricePerNight: z
    .number()
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
destination-specific itinerary.

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
- Treat all prices as realistic estimates, not guaranteed live prices.
- Keep the itinerary geographically sensible.
- Avoid inventing exact street addresses when uncertain.
- Never reuse generic accommodation areas such as
  "outer central area" or "luxury district" when a real local area
  can reasonably be recommended.

OVERVIEW

Create one engaging paragraph summarizing the trip.

DAILY ITINERARY

Create exactly {{duration}} day objects.

Each day must include:

- A sequential day number.
- A short, engaging title.
- At least one morning activity.
- At least one afternoon activity.
- At least one evening activity.

Every activity must include:

- A concise activity title.
- A useful, natural description.
- A realistic estimated per-person cost in USD.
- Use 0 when the activity is free.
- A relevant location, neighborhood, landmark, or area when possible.

Descriptions must be natural paragraphs.

Do not place labels such as "Address:", "Price:", or "Cost:"
inside activity descriptions.

HOTEL RECOMMENDATIONS

Create exactly three hotelRecommendations in this order:

1. Budget
2. Mid-range
3. Premium

For each recommendation:

- Recommend a real and suitable area within or near {{destination}}.
- Explain why the area suits that accommodation category.
- Provide a realistic approximate starting price per night.
- Use USD only.
- Set currency to "USD".
- Return the price as a number without a currency symbol.
- Do not recommend a specific hotel unless you are confident it exists.
- Prefer neighborhood or district recommendations over hotel names.
- Prices must reflect the local accommodation market.

For example, an affordable Moroccan city should normally have
lower accommodation estimates than central London, Paris, New York,
Dubai, Tokyo, or Switzerland.

Return only data matching the required output schema.
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

    if (output.hotelRecommendations.length !== 3) {
      throw new Error(
        'The AI did not generate all three accommodation recommendations.'
      );
    }

    return output;
  }
);
