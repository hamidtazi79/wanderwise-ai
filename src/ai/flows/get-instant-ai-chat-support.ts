'use server';

/**
 * @fileOverview Provides instant AI-powered chat support for travel-related questions.
 *
 * - getInstantAIChatSupport - A function that provides an AI-powered response to a user's query.
 * - GetInstantAIChatSupportInput - The input type for the getInstantAIChatSupport function.
 * - GetInstantAIChatSupportOutput - The return type for the getInstantAIChatSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const GetInstantAIChatSupportInputSchema = z.object({
  query: z.string().describe('The user\'s current question or message.'),
  history: z
    .array(MessageSchema)
    .describe('The previous messages in the conversation.'),
});

export type GetInstantAIChatSupportInput = z.infer<
  typeof GetInstantAIChatSupportInputSchema
>;

const GetInstantAIChatSupportOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s query.'),
});

export type GetInstantAIChatSupportOutput = z.infer<
  typeof GetInstantAIChatSupportOutputSchema
>;

export async function getInstantAIChatSupport(
  input: GetInstantAIChatSupportInput
): Promise<GetInstantAIChatSupportOutput> {
  return getInstantAIChatSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getInstantAIChatSupportPrompt',
  input: {schema: GetInstantAIChatSupportInputSchema},
  output: {schema: GetInstantAIChatSupportOutputSchema},
  prompt: `You are Wanderwise AI, a friendly and expert travel assistant. Your goal is to provide helpful, accurate, and engaging answers to travel-related questions.

  Use the provided conversation history to maintain context.

  **Conversation History:**
  {{#each history}}
  - **{{role}}**: {{content}}
  {{/each}}

  **Current User Query:**
  {{query}}

  Based on this, provide a helpful and concise response. Format your response using Markdown for readability (e.g., use lists, bold text). Your response should directly answer the query and feel like a natural continuation of the conversation.`,
});

const getInstantAIChatSupportFlow = ai.defineFlow(
  {
    name: 'getInstantAIChatSupportFlow',
    inputSchema: GetInstantAIChatSupportInputSchema,
    outputSchema: GetInstantAIChatSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);
