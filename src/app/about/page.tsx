'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-story');

  return (
    <div className="container mx-auto py-16">
      {/* Story Section */}
      <section className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Built for explorers, powered by AI.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Wanderwise AI started with a simple idea: make travel planning intelligent, personal, and effortless. We grew tired of spending hours sifting through blogs, maps, and reviews. We believed there had to be a smarter way to explore the world.
          </p>
          <p className="mt-4 text-muted-foreground">
            Our mission is to empower every traveler with a personal AI assistant that understands their unique tastes and preferences. We handle the heavy lifting of planning so you can focus on what truly matters: experiencing the wonder of travel.
          </p>
        </div>
        <div>
          {aboutImage && (
            <Image
              src={aboutImage.imageUrl}
              alt={aboutImage.description}
              data-ai-hint={aboutImage.imageHint}
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </section>
    </div>
  );
}
