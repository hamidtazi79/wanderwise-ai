import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

const SITE_URL = 'https://wanderwise.uk';

export const metadata: Metadata = {
  title: 'Travel Blog, Destination Guides & AI Trip Planning Tips',
  description:
    'Read travel guides, destination inspiration, itinerary ideas, and AI trip planning tips on the Wanderwise AI blog.',
  alternates: {
    canonical: '/blog',
  },
  keywords: [
    'travel blog',
    'destination guides',
    'AI travel planner blog',
    'trip planning tips',
    'itinerary ideas',
    'travel inspiration',
    'Wanderwise AI blog',
  ],
  openGraph: {
    title: 'Travel Blog, Destination Guides & AI Trip Planning Tips',
    description:
      'Explore destination guides, travel tips, and AI travel planning insights from Wanderwise AI.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Blog, Destination Guides & AI Trip Planning Tips',
    description:
      'Explore destination guides, travel tips, and AI travel planning insights from Wanderwise AI.',
  },
};

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Hidden Gems in Southeast Asia',
    author: 'Jane Doe',
    authorId: 'team-member-1',
    date: 'June 1, 2024',
    imageId: 'blog-post-1',
    imageHint: 'tropical beach',
    excerpt:
      'Forget the crowded tourist traps. We’re taking you off the beaten path to discover the most breathtaking, undiscovered spots in Southeast Asia.',
  },
  {
    id: 2,
    title: 'How AI is Revolutionizing Your Travel Planning',
    author: 'John Smith',
    authorId: 'team-member-2',
    date: 'May 25, 2024',
    imageId: 'blog-post-2',
    imageHint: 'travel planning',
    excerpt:
      'Curious about the magic behind your perfect itinerary? Dive into how Wanderwise AI uses cutting-edge technology to craft your dream vacation.',
  },
  {
    id: 3,
    title: "A Foodie's Guide to Street Food in Mexico City",
    author: 'Jane Doe',
    authorId: 'team-member-1',
    date: 'May 18, 2024',
    imageId: 'blog-post-3',
    imageHint: 'mexican food',
    excerpt:
      "From tacos al pastor to mouth-watering tamales, we've compiled the ultimate guide to eating your way through one of the world's great food capitals.",
  },
  {
    id: 4,
    title: 'Paris, France: The Ultimate Cultural Getaway',
    author: 'John Smith',
    authorId: 'team-member-2',
    date: 'June 15, 2024',
    imageId: 'blog-post-4',
    imageHint: 'paris france',
    excerpt:
      'Explore the romance, art, and history of Paris. From the Louvre to charming Montmartre, this guide covers the must-see cultural hotspots.',
  },
  {
    id: 5,
    title: 'A Journey Through Time in Rome, Italy',
    author: 'Jane Doe',
    authorId: 'team-member-1',
    date: 'June 18, 2024',
    imageId: 'blog-post-5',
    imageHint: 'rome italy',
    excerpt:
      'Walk in the footsteps of emperors and gladiators. This post dives into the ancient history and iconic landmarks of the Eternal City.',
  },
  {
    id: 6,
    title: 'Kyoto, Japan: A Serene Escape into Tradition',
    author: 'John Smith',
    authorId: 'team-member-2',
    date: 'June 21, 2024',
    imageId: 'blog-post-6',
    imageHint: 'kyoto japan',
    excerpt:
      'Discover the tranquil temples, stunning gardens, and timeless traditions of Japan’s former imperial capital, Kyoto.',
  },
  {
    id: 7,
    title: 'Lisbon, Portugal: The Vibrant Coastal Capital',
    author: 'Jane Doe',
    authorId: 'team-member-1',
    date: 'June 24, 2024',
    imageId: 'blog-post-7',
    imageHint: 'lisbon portugal',
    excerpt:
      'Get lost in the colorful streets, historic trams, and soulful Fado music of Lisbon, a city that perfectly blends tradition and modernity.',
  },
  {
    id: 8,
    title: 'Cairo, Egypt: Gateway to Ancient Wonders',
    author: 'John Smith',
    authorId: 'team-member-2',
    date: 'June 28, 2024',
    imageId: 'blog-post-8',
    imageHint: 'cairo egypt',
    excerpt:
      'Uncover the mysteries of the pharaohs, from the Pyramids of Giza to the bustling Khan el-Khalili bazaar, in the heart of Egypt.',
  },
  {
    id: 9,
    title: 'Best Time to Visit Morocco: Weather, Seasons, and Travel Tips',
    author: 'Jane Doe',
    authorId: 'team-member-1',
    date: 'April 4, 2026',
    imageId: 'blog-post-1',
    imageHint: 'morocco desert',
    excerpt:
      'Planning a trip to Morocco? Here is the best time to visit Morocco for cities, desert tours, beaches, and cultural travel, with practical seasonal tips.',
  },
  {
    id: 10,
    title: '3 Day London Itinerary: What to See, Eat, and Do',
    author: 'John Smith',
    authorId: 'team-member-2',
    date: 'April 4, 2026',
    imageId: 'blog-post-4',
    imageHint: 'london city',
    excerpt:
      'This 3 day London itinerary covers major landmarks, local food spots, walkable neighborhoods, and practical planning tips for a first trip to London.',
  },
  {
    id: 11,
    title: 'How to Plan a Trip with AI: Smarter Travel Planning Step by Step',
    author: 'Jane Doe',
    authorId: 'team-member-1',
    date: 'April 4, 2026',
    imageId: 'blog-post-2',
    imageHint: 'ai travel planning',
    excerpt:
      'Learn how to plan a trip with AI, from choosing a destination to building a personalized itinerary, saving research time, and refining your travel plan faster.',
  },
];

export default function BlogPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Wanderwise AI Blog',
    description:
      'Travel guides, destination inspiration, itinerary ideas, and AI trip planning tips from Wanderwise AI.',
    url: `${SITE_URL}/blog`,
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.id}`,
      datePublished: new Date(post.date).toISOString(),
      author: {
        '@type': 'Person',
        name: post.author,
      },
      description: post.excerpt,
    })),
  };

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Travel Blog, Destination Guides & AI Trip Planning Tips
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Explore destination guides, travel inspiration, itinerary ideas, and
          practical trip planning advice from Wanderwise AI.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
        <p>
          The Wanderwise AI blog is designed for travelers who want better ideas,
          smarter plans, and practical destination advice. Whether you are
          looking for city break inspiration, cultural travel guides, food
          recommendations, or help organizing a trip, our blog gives you a
          useful starting point.
        </p>
        <p>
          Alongside destination content, we also share insights into AI trip
          planning, itinerary building, and smarter ways to organize travel.
          You can use our articles for inspiration and then create your own plan
          with the{' '}
          <Link href="/itinerary-builder" className="font-medium hover:underline">
            AI itinerary builder
          </Link>{' '}
          or ask follow-up questions in the{' '}
          <Link href="/ai-chat" className="font-medium hover:underline">
            AI travel assistant
          </Link>
          .
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => {
          const authorImage = PlaceHolderImages.find(
            (img) => img.id === post.authorId
          );
          const postImage = PlaceHolderImages.find(
            (img) => img.id === post.imageId
          );

          return (
            <Card key={post.id} className="flex flex-col">
              {postImage && (
                <Image
                  src={postImage.imageUrl}
                  alt={post.title}
                  data-ai-hint={postImage.imageHint}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover"
                />
              )}

              <CardHeader>
                <CardTitle className="leading-snug">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1" />

              <CardFooter className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {authorImage && (
                      <AvatarImage src={authorImage.imageUrl} alt={post.author} />
                    )}
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </div>
                </div>

                <Button asChild variant="link">
                  <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl border p-8">
        <h2 className="text-2xl font-semibold">
          Ready to Build Your Own Trip Plan?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Use Wanderwise AI to generate a personalized itinerary, discover
          destinations, and organize your next trip faster.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/itinerary-builder"
            className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Open Itinerary Builder
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:border-sky-500 hover:text-sky-500"
          >
            View Pricing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:border-sky-500 hover:text-sky-500"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
