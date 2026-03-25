'use server';

/**
 * @fileOverview Generates smart travel itineraries based on user interests, budget, and duration.
 *
 * - generateSmartItinerary - A function that generates a travel itinerary.
 * - GenerateSmartItineraryInput - The input type for the generateSmartItinerary function.
 * - GenerateSmartItineraryOutput - The return type for the generateSmartItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartItineraryInputSchema = z.object({
  destination: z.string().describe('The destination for the itinerary.'),
  duration: z.number().describe('The duration of the trip in days.'),
  interests: z.string().describe('A comma-separated list of interests.'),
  budget: z
    .enum(['low', 'medium', 'high'])
    .describe('The budget for the trip (e.g., "low", "medium", "high").'),
});
export type GenerateSmartItineraryInput = z.infer<
  typeof GenerateSmartItineraryInputSchema
>;

const ActivitySchema = z.object({
  activity: z.string().describe('A concise title for the activity.'),
  description: z
    .string()
    .describe('A detailed paragraph describing the activity.'),
  location: z.string().optional().describe('The specific address or area.'),
  cost: z.number().describe('The estimated cost of this activity in USD. Must be a number (e.g., 25, 0, 150).'),
});

const DayPlanSchema = z.object({
  day: z.number().describe('The day number of the itinerary (e.g., 1).'),
  title: z
    .string()
    .describe("A short, catchy title for the day's theme or main event."),
  morning: z
    .array(ActivitySchema)
    .describe('An array of activities for the morning.'),
  afternoon: z
    .array(ActivitySchema)
    .describe('An array of activities for the afternoon.'),
  evening: z
    .array(ActivitySchema)
    .describe('An array of activities for the evening.'),
});

const GenerateSmartItineraryOutputSchema = z.object({
  overview: z
    .string()
    .describe(
      'A brief, engaging one-paragraph overview of the entire trip.'
    ),
  days: z
    .array(DayPlanSchema)
    .describe('An array of daily plans for the itinerary.'),
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
  input: {schema: GenerateSmartItineraryInputSchema},
  output: {schema: GenerateSmartItineraryOutputSchema},
  prompt: `You are a world-class travel expert creating a professional, detailed, and engaging travel itinerary in valid JSON format.

  **User Request:**
  - **Destination:** {{destination}}
  - **Duration:** {{duration}} days
  - **Interests:** {{interests}}
  - **Budget:** {{budget}}

  **JSON Output Instructions:**
  1.  **Overview:** Start with a single, engaging paragraph summarizing the trip's essence. This should be the value for the 'overview' key.
  2.  **Daily Plan (\`days\` array):**
      - For EACH of the {{duration}} days, create a JSON object in the 'days' array.
      - Each day object must have a 'day' number and a short, catchy 'title'.
      - Each day must have 'morning', 'afternoon', and 'evening' arrays of activity objects.
      - **Do not leave any time slot array (morning, afternoon, evening) empty. Each must contain at least one activity object.**
  3.  **Activity Objects:**
      - Each activity object must have an 'activity' (a short title) and a 'description' (a full, well-written paragraph).
      - Each activity object MUST have a 'cost' field, which is a number representing the estimated cost in USD (e.g., 50, 0, 125). Make these details realistic for the user's budget.
      - If applicable, include 'location' (address or area).
      - The 'description' should be a natural, flowing paragraph. Do not use lists, bullet points, or labels like "Address:" or "Cost:" within the description text itself. Weave the details into the narrative.
  4.  **Content Style:**
      - The tone should be inspiring, informative, and professional.
      - Ensure the plan is logical, geographically sensible, and tailored to the user's interests and budget.
      - All string values in the JSON must be properly escaped.

  Generate the complete JSON output for the {{duration}}-day itinerary based on the user's request.`,
});

const generateSmartItineraryFlow = ai.defineFlow(
  {
    name: 'generateSmartItineraryFlow',
    inputSchema: GenerateSmartItineraryInputSchema,
    outputSchema: GenerateSmartItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate itinerary. AI returned no output.');
    }
    return output;
  }
);
