export const destinations = {
  paris: {
    name: 'Paris',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    description:
      'Discover Paris with AI-powered itineraries, hidden gems, food spots, museums, neighborhoods, and day-by-day travel planning.',
  },

  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop',
    description:
      'Explore Tokyo with personalized AI itineraries, anime districts, sushi spots, nightlife, temples, and local experiences.',
  },

  marrakech: {
    name: 'Marrakech',
    country: 'Morocco',
    image:
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1600&auto=format&fit=crop',
    description:
      'Plan your Marrakech trip with AI-generated itineraries, riads, souks, food recommendations, desert experiences, and hidden gems.',
  },

  dubai: {
    name: 'Dubai',
    country: 'UAE',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
    description:
      'Discover Dubai with luxury travel itineraries, desert adventures, beaches, shopping, skyline views, and AI travel planning.',
  },

  london: {
    name: 'London',
    country: 'United Kingdom',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop',
    description:
      'Explore London with smart AI travel planning, museums, food markets, neighborhoods, attractions, and custom itineraries.',
  },
};

export type DestinationSlug = keyof typeof destinations;
