import type { Metadata } from 'next';
import Link from 'next/link';
import { ChatInterface } from './chat-interface';

export const metadata: Metadata = {
  title: 'AI Travel Chat & Trip Planning Assistant',
  description:
    'Chat with Wanderwise AI to get personalized travel answers, destination ideas, itinerary help, and trip planning recommendations instantly.',
  alternates: {
    canonical: '/ai-chat',
  },
  keywords: [
    'AI travel chat',
    'AI travel assistant',
    'trip planning assistant',
    'travel chatbot',
    'AI trip planner',
    'travel recommendations AI',
    'Wanderwise AI',
  ],
  openGraph: {
    title: 'AI Travel Chat & Trip Planning Assistant',
    description:
      'Get instant travel help, destination ideas, and itinerary support with the Wanderwise AI travel assistant.',
    url: 'https://wanderwise.uk/ai-chat',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Travel Chat & Trip Planning Assistant',
    description:
      'Get instant travel help, destination ideas, and itinerary support with the Wanderwise AI travel assistant.',
  },
};

export default function AiChatPage() {
  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">
          AI Travel Chat for Instant Trip Planning Help
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Use the Wanderwise AI travel assistant to ask questions about
          destinations, itineraries, budgets, neighborhoods, food, activities,
          and smarter trip planning.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          This AI travel chat is designed to help you explore ideas before you
          book, improve your travel plan, and discover practical recommendations
          faster. You can also use the{' '}
          <Link href="/itinerary-builder" className="font-medium hover:underline">
            AI itinerary builder
          </Link>{' '}
          to generate a custom trip plan, or read destination guides on the{' '}
          <Link href="/blog" className="font-medium hover:underline">
            Wanderwise travel blog
          </Link>
          .
        </p>
      </div>

      <div className="h-[calc(100vh-16rem)] min-h-[600px]">
        <ChatInterface />
      </div>
    </div>
  );
}
