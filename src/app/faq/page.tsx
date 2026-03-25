import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What is Wanderwise AI?',
    answer:
      'Wanderwise AI is an intelligent travel assistant that uses artificial intelligence to help you plan and book your perfect trip. We generate personalized itineraries, offer real-time chat support, and provide smart travel recommendations.',
  },
  {
    question: 'How does the itinerary generation work?',
    answer:
      'You provide us with your destination, travel dates, interests, and budget. Our AI then processes this information to create a detailed, day-by-day itinerary complete with suggested activities, restaurants, and sights.',
  },
  {
    question: 'Is the Free Plan really free?',
    answer:
      'Yes! Our Free Plan allows you to explore our core features, including limited itinerary generation and AI chat access, with no cost. For unlimited access and premium features, you can upgrade to our Subscriber Plan.',
  },
  {
    question: 'Can I save my generated itineraries?',
    answer:
      'Saving itineraries to the cloud is a premium feature available to our subscribers. This allows you to access your travel plans from any device, anytime.',
  },
  {
    question: 'How accurate is the AI travel assistant?',
    answer:
      'Our AI is trained on vast amounts of travel data to provide helpful and relevant information. However, details like opening hours or prices can change. We always recommend verifying critical information before you travel.',
  },
  {
    question: 'What happens if I need help during my trip?',
    answer:
      'Our AI Chat is available 24/7 to provide instant support for your travel-related questions, whether you need a quick recommendation or help with a booking.',
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Have questions? We have answers. If you can&apos;t find what you&apos;re looking for,
          feel free to contact our support team.
        </p>
      </div>

      <div className="mt-12">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
