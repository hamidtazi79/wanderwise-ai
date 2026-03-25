import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog – Wanderwise AI',
  description: 'Travel tips, destination guides, and AI insights from our team.',
  alternates: {
    canonical: '/blog',
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
      excerpt: 'Forget the crowded tourist traps. We’re taking you off the beaten path to discover the most breathtaking, undiscovered spots in Southeast Asia.'
    },
    {
      id: 2,
      title: 'How AI is Revolutionizing Your Travel Planning',
      author: 'John Smith',
      authorId: 'team-member-2',
      date: 'May 25, 2024',
      imageId: 'blog-post-2',
      imageHint: 'travel planning',
      excerpt: 'Curious about the magic behind your perfect itinerary? Dive into how Wanderwise AI uses cutting-edge technology to craft your dream vacation.'
    },
     {
      id: 3,
      title: 'A Foodie\'s Guide to Street Food in Mexico City',
      author: 'Jane Doe',
      authorId: 'team-member-1',
      date: 'May 18, 2024',
      imageId: 'blog-post-3',
      imageHint: 'mexican food',
      excerpt: 'From tacos al pastor to mouth-watering tamales, we\'ve compiled the ultimate guide to eating your way through one of the world\'s great food capitals.'
    },
    {
      id: 4,
      title: 'Paris, France: The Ultimate Cultural Getaway',
      author: 'John Smith',
      authorId: 'team-member-2',
      date: 'June 15, 2024',
      imageId: 'blog-post-4',
      imageHint: 'paris france',
      excerpt: 'Explore the romance, art, and history of Paris. From the Louvre to charming Montmartre, this guide covers the must-see cultural hotspots.'
    },
    {
      id: 5,
      title: 'A Journey Through Time in Rome, Italy',
      author: 'Jane Doe',
      authorId: 'team-member-1',
      date: 'June 18, 2024',
      imageId: 'blog-post-5',
      imageHint: 'rome italy',
      excerpt: 'Walk in the footsteps of emperors and gladiators. This post dives into the ancient history and iconic landmarks of the Eternal City.'
    },
    {
      id: 6,
      title: 'Kyoto, Japan: A Serene Escape into Tradition',
      author: 'John Smith',
      authorId: 'team-member-2',
      date: 'June 21, 2024',
      imageId: 'blog-post-6',
      imageHint: 'kyoto japan',
      excerpt: 'Discover the tranquil temples, stunning gardens, and timeless traditions of Japan’s former imperial capital, Kyoto.'
    },
    {
      id: 7,
      title: 'Lisbon, Portugal: The Vibrant Coastal Capital',
      author: 'Jane Doe',
      authorId: 'team-member-1',
      date: 'June 24, 2024',
      imageId: 'blog-post-7',
      imageHint: 'lisbon portugal',
      excerpt: 'Get lost in the colorful streets, historic trams, and soulful Fado music of Lisbon, a city that perfectly blends tradition and modernity.'
    },
    {
      id: 8,
      title: 'Cairo, Egypt: Gateway to Ancient Wonders',
      author: 'John Smith',
      authorId: 'team-member-2',
      date: 'June 28, 2024',
      imageId: 'blog-post-8',
      imageHint: 'cairo egypt',
      excerpt: 'Uncover the mysteries of the pharaohs, from the Pyramids of Giza to the bustling Khan el-Khalili bazaar, in the heart of Egypt.'
    },
  ];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          The Wanderwise AI Blog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Travel tips, destination guides, and AI insights from our team.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => {
          const authorImage = PlaceHolderImages.find(img => img.id === post.authorId);
          const postImage = PlaceHolderImages.find(img => img.id === post.imageId);

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
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="flex items-center justify-between">
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
    </div>
  );
}
