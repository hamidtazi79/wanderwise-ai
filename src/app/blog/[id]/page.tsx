import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const blogPosts = [
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
    content: `
<p>Forget the crowded tourist traps. We’re taking you off the beaten path to discover the most breathtaking, undiscovered spots in Southeast Asia. From secluded beaches to ancient temples hidden in the jungle, get ready for an adventure you'll never forget.</p>

<h2>1. Koh Rong, Cambodia</h2>
<p>An island paradise with pristine beaches and a laid-back vibe. Perfect for disconnecting and enjoying nature.</p>

<h2>2. Ha Giang Loop, Vietnam</h2>
<p>A spectacular motorbike journey through some of Northern Vietnam's most dramatic mountain scenery.</p>

<h2>3. Luang Prabang, Laos</h2>
<p>A charming city with a mix of colonial architecture, Buddhist temples, and stunning natural beauty.</p>
`,
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
    content: `
<p>Curious about the magic behind your perfect itinerary? Dive into how Wanderwise AI uses cutting-edge technology to craft your dream vacation.</p>

<h2>Personalized Recommendations</h2>
<p>Our AI analyzes your interests, budget, and travel style to suggest destinations and activities tailored just for you.</p>

<h2>Effortless Itineraries</h2>
<p>Say goodbye to hours of research. Wanderwise AI generates detailed, day-by-day plans in seconds, complete with maps and booking links.</p>
`,
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
    content: `
<p>From tacos al pastor to mouth-watering tamales, we've compiled the ultimate guide to eating your way through one of the world's great food capitals.</p>

<h2>Must-Try Tacos</h2>
<p>Don't miss the iconic Tacos al Pastor, slow-cooked carnitas, and fresh fish tacos from street-side vendors.</p>

<h2>Beyond Tacos</h2>
<p>Explore the world of tamales, tlayudas, and esquites for a true taste of Mexican street cuisine.</p>
`,
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
    content: `
<h2>A Timeless Affair with Art, History, and Romance</h2>
<p>Paris is not just a city; it's an experience. Every cobblestone street, every ornate bridge, and every quaint café tells a story. Whether you're an art aficionado, a history buff, or a hopeless romantic, the City of Light has something to enchant you.</p>

<h2>Must-Visit Cultural Institutions</h2>
<ul>
  <li><strong>The Louvre Museum:</strong> Home to masterpieces like the Mona Lisa and the Venus de Milo. <strong>Tip:</strong> Buy tickets online in advance to avoid long queues and consider a guided tour to navigate its vast collection.</li>
  <li><strong>Musée d'Orsay:</strong> Housed in a former railway station, this museum boasts an unparalleled collection of Impressionist and Post-Impressionist art from masters like Monet, Manet, and Van Gogh.</li>
  <li><strong>Centre Pompidou:</strong> A hub of modern and contemporary art, recognizable by its "inside-out" architecture. The rooftop offers panoramic views of the city.</li>
</ul>

<h2>Historical Hotspots</h2>
<ul>
  <li><strong>Notre-Dame Cathedral:</strong> A masterpiece of French Gothic architecture. While still under restoration, its exterior and the surrounding area are a sight to behold.</li>
  <li><strong>Sainte-Chapelle:</strong> Witness the breathtaking beauty of 1,113 stained-glass windows depicting biblical scenes in this stunning Gothic chapel.</li>
  <li><strong>Montmartre & Sacré-Cœur:</strong> Wander the artistic neighborhood of Montmartre, where Picasso and Dalí once lived. Climb the steps to the Sacré-Cœur Basilica for one of the best views of Paris.</li>
</ul>

<h2>Top Travel Tips</h2>
<ul>
  <li><strong>Use the Métro:</strong> The Paris Métro is efficient and covers the entire city. Buy a carnet (a pack of 10 tickets) or a Navigo pass for longer stays.</li>
  <li><strong>Indulge in Pâtisseries:</strong> Don't leave without trying a croissant from a local boulangerie, macarons from Ladurée or Pierre Hermé, and a classic crème brûlée.</li>
  <li><strong>Enjoy a Seine River Cruise:</strong> See the city's iconic landmarks from a different perspective, especially magical at night when the city is illuminated.</li>
</ul>
`,
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
    content: `
<h2>Where Ancient History and Modern Life Collide</h2>
<p>Rome, the Eternal City, is a living museum. Ruins of the Roman Empire stand beside Renaissance palazzos and bustling piazzas, creating a cityscape unlike any other. Prepare to be captivated by millennia of history, art, and culinary delights.</p>

<h2>Icons of the Ancient World</h2>
<ul>
  <li><strong>The Colosseum:</strong> The largest amphitheater ever built. Imagine the gladiatorial contests and public spectacles that once took place within its walls. <strong>Tip:</strong> Get a combo ticket that includes the Roman Forum and Palatine Hill.</li>
  <li><strong>The Roman Forum & Palatine Hill:</strong> The heart of ancient Rome, this sprawling site was the center of political, commercial, and judicial life. Palatine Hill offers stunning views over the Forum and Circus Maximus.</li>
  <li><strong>The Pantheon:</strong> A marvel of ancient Roman engineering, this former temple with its iconic oculus in the dome has been in continuous use for nearly 2,000 years.</li>
</ul>

<h2>Art and Faith</h2>
<ul>
  <li><strong>Vatican City:</strong> A country within a city. Visit St. Peter's Basilica, climb its dome for an unforgettable view, and explore the Vatican Museums, culminating in the awe-inspiring Sistine Chapel.</li>
  <li><strong>Trevi Fountain:</strong> Don't forget to toss a coin into the world's most famous fountain—legend says it ensures your return to Rome.</li>
  <li><strong>Galleria Borghese:</strong> Home to masterpieces by Bernini and Caravaggio. Reservations are mandatory and must be made weeks in advance.</li>
</ul>

<h2>Top Travel Tips</h2>
<ul>
  <li><strong>Wear Comfortable Shoes:</strong> You'll be doing a lot of walking on cobblestone streets.</li>
  <li><strong>Embrace the Aperitivo:</strong> In the early evening, join the locals for aperitivo—a pre-dinner drink that comes with a complimentary buffet of snacks.</li>
  <li><strong>Stay Hydrated:</strong> Rome has numerous public drinking fountains ('nasoni') with fresh, cold water. Bring a reusable bottle.</li>
</ul>
`,
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
    content: `
<h2>The Heart of Traditional Japan</h2>
<p>For over a thousand years, Kyoto was the imperial capital of Japan, and it remains the country's cultural heart. With its thousands of classical Buddhist temples, Shinto shrines, imperial palaces, and traditional wooden houses, Kyoto is a city that seems suspended in time.</p>

<h2>Temples and Shrines Not to Miss</h2>
<ul>
  <li><strong>Kinkaku-ji (Golden Pavilion):</strong> A stunning Zen temple completely covered in gold leaf, reflecting beautifully in the surrounding pond.</li>
  <li><strong>Fushimi Inari Shrine:</strong> Famous for its thousands of vibrant red torii gates that wind through the hills behind the main shrine. An iconic and unforgettable walk.</li>
  <li><strong>Kiyomizu-dera Temple:</strong> Known for its wooden stage that juts out from the main hall, offering panoramic views of the city below.</li>
</ul>

<h2>Cultural Experiences</h2>
<ul>
  <li><strong>Gion District:</strong> The famous geisha district. Wander its preserved streets, especially at dusk, for a chance to spot a geiko or maiko on her way to an engagement.</li>
  <li><strong>Arashiyama Bamboo Grove:</strong> A magical, otherworldly experience. Stroll through the towering stalks of bamboo, especially beautiful in the early morning light.</li>
  <li><strong>Nishiki Market:</strong> "Kyoto's Kitchen" is a five-block long shopping street lined with more than one hundred shops and restaurants. Sample local delicacies and buy unique ingredients.</li>
</ul>

<h2>Top Travel Tips</h2>
<ul>
  <li><strong>Rent a Bicycle:</strong> Kyoto is a relatively flat city, and cycling is a wonderful way to explore its neighborhoods at your own pace.</li>
  <li><strong>Try a Kaiseki Meal:</strong> Experience the pinnacle of Japanese haute cuisine with a traditional multi-course dinner that is as much a work of art as it is a meal.</li>
  <li><strong>Respect Local Customs:</strong> Be mindful when visiting temples and shrines. Follow rules about photography, dress modestly, and maintain a quiet demeanor.</li>
</ul>
`,
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
    content: `
<h2>A City of Seven Hills, Color, and Light</h2>
<p>Perched on the edge of the Atlantic Ocean, Lisbon is a city that effortlessly blends traditional heritage with striking modernism. With its pastel-colored buildings, historic trams, and soulful Fado music, Portugal's capital is a feast for the senses.</p>

<h2>Iconic Sights and Experiences</h2>
<ul>
  <li><strong>Tram 28:</strong> This historic tram rattles and squeaks its way through the city's most picturesque neighborhoods, including Alfama, Baixa, and Graça. It's a tour and a mode of transport in one.</li>
  <li><strong>Belém Tower & Jerónimos Monastery:</strong> These UNESCO World Heritage sites are stunning examples of Manueline architecture, celebrating Portugal's Age of Discovery.</li>
  <li><strong>Alfama District:</strong> Get lost in the maze-like, cobblestone streets of Lisbon's oldest neighborhood. Climb up to São Jorge Castle for breathtaking views.</li>
</ul>

<h2>Culinary Delights</h2>
<ul>
  <li><strong>Pastéis de Nata:</strong> You cannot leave Lisbon without trying these iconic egg custard tarts. The original recipe is from Pastéis de Belém, but many bakeries have excellent versions.</li>
  <li><strong>Time Out Market (Mercado da Ribeira):</strong> A vibrant food hall where top chefs and restaurants offer modern takes on Portuguese classics.</li>
  <li><strong>Fado Music:</strong> For a truly authentic experience, book a table at a Fado restaurant in Alfama or Bairro Alto. Enjoy a traditional dinner accompanied by the soulful and melancholic sounds of Fado.</li>
</ul>

<h2>Top Travel Tips</h2>
<ul>
  <li><strong>Explore on Foot:</strong> Lisbon is a city best explored on foot, but be prepared for hills! Comfortable shoes are a must.</li>
  <li><strong>Day Trip to Sintra:</strong> Just a short train ride away, the fairytale town of Sintra with its whimsical palaces (like Pena Palace) is an essential day trip.</li>
  <li><strong>Enjoy the Miradouros:</strong> Lisbon is famous for its viewpoints (miradouros). Find one, like Miradouro da Senhora do Monte, grab a drink, and watch the sunset over the city.</li>
</ul>
`,
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
    content: `
<h2>A Chaotic, Captivating Tapestry of History</h2>
<p>Cairo is a mega-city, a whirlwind of sights, sounds, and smells that is both exhilarating and overwhelming. As the gateway to the wonders of Ancient Egypt, it's a city where millennia of history are woven into the fabric of modern life.</p>

<h2>Pharaonic Marvels</h2>
<ul>
  <li><strong>The Pyramids of Giza and the Sphinx:</strong> The last surviving wonder of the ancient world. Standing at the foot of these monumental tombs is a humbling, once-in-a-lifetime experience. <strong>Tip:</strong> Consider hiring a guide to navigate the site and explain its history.</li>
  <li><strong>The Grand Egyptian Museum (GEM):</strong> (Check for opening status) Set to be the world's largest archaeological museum, it will house the entire Tutankhamun collection and countless other artifacts. The older Egyptian Museum in Tahrir Square is also a treasure trove.</li>
  <li><strong>Saqqara & Memphis:</strong> Take a day trip to see the Step Pyramid of Djoser at Saqqara, the world's oldest major stone structure, and the former capital of ancient Egypt, Memphis.</li>
</ul>

<h2>Islamic and Coptic Cairo</h2>
<ul>
  <li><strong>Khan el-Khalili:</strong> A famous and sprawling bazaar where you can haggle for spices, textiles, lanterns, and souvenirs. It's a chaotic and atmospheric experience.</li>
  <li><strong>Islamic Cairo:</strong> Explore historic mosques like the Mosque-Madrassa of Sultan Hassan and the Al-Azhar Mosque, some of the finest examples of Islamic architecture in the world.</li>
  <li><strong>Coptic Cairo:</strong> The heart of Egypt's Christian community, this area is home to the "Hanging Church" and the Coptic Museum.</li>
</ul>

<h2>Top Travel Tips</h2>
<ul>
  <li><strong>Be Prepared for Traffic:</strong> Cairo's traffic is legendary. Plan your travel times accordingly and consider using ride-sharing apps like Uber or Careem.</li>
  <li><strong>Haggling is Expected:</strong> In markets like Khan el-Khalili, bargaining is part of the culture. Start at about half the asking price and negotiate with a smile.</li>
  <li><strong>Dress Conservatively:</strong> When visiting religious sites, it's respectful for both men and women to cover their shoulders and knees. Women may also need a headscarf.</li>
</ul>
`,
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
    content: `
<p>Morocco is one of the most rewarding destinations in North Africa, but the best time to visit depends on the kind of trip you want. Some travelers want cool temperatures for walking through medinas, others want a Sahara adventure, and many want a mix of cities, coast, and food. Choosing the right season can make your itinerary much more enjoyable.</p>

<h2>Spring is one of the best times to visit Morocco</h2>
<p>March to May is often the sweet spot for most travelers. Cities like Marrakech, Fes, Rabat, and Chefchaouen are more comfortable for walking, gardens are greener, and desert trips are still pleasant. Spring works especially well if you want a balanced Morocco itinerary with culture, day trips, and sightseeing.</p>

<h2>Autumn is excellent for cities and desert travel</h2>
<p>September to November is another great period. Summer heat starts to ease, and many visitors prefer autumn for trips that include Marrakech, the Atlas Mountains, and Merzouga desert camps. If your goal is a classic Morocco route with riads, souks, and desert sunsets, autumn is a strong choice.</p>

<h2>Summer can be hot but still works for some destinations</h2>
<p>June to August can be intense in inland cities, especially Marrakech and Fes. However, summer still works well for coastal destinations such as Essaouira, Tangier, and Agadir, where the ocean breeze keeps temperatures more manageable. If you travel in summer, it helps to focus on the coast or limit long midday sightseeing sessions.</p>

<h2>Winter is good for lower prices and quieter cities</h2>
<p>December to February can be a smart time to visit if you prefer fewer crowds and lower accommodation prices. Marrakech and other cities can still be enjoyable in winter, although mornings and evenings can feel cold. Desert nights are especially chilly, so proper layers are important.</p>

<h2>Best season by trip style</h2>
<ul>
  <li><strong>For city breaks:</strong> Spring and autumn are usually best.</li>
  <li><strong>For Sahara desert tours:</strong> Spring and autumn offer the most comfortable temperatures.</li>
  <li><strong>For surfing and coastal travel:</strong> Late spring, summer, and early autumn can work well.</li>
  <li><strong>For budget-conscious travel:</strong> Winter often offers better prices.</li>
</ul>

<h2>Morocco travel tips</h2>
<p>Plan a route that matches the season. In hot months, spend more time on the coast. In spring or autumn, combine cities, mountains, and the desert more easily. If you want a personalized Morocco trip plan, Wanderwise AI can help you build an itinerary based on your dates, budget, and interests.</p>
`,
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
    content: `
<p>Planning a short trip to London can feel overwhelming because the city has so much to see. The key is to avoid doing too much in one day and to group attractions by area. This 3 day London itinerary gives you a practical first-timer route with iconic sights, food stops, and neighborhood time.</p>

<h2>Day 1: Westminster, the South Bank, and Covent Garden</h2>
<p>Start with London’s classic highlights. See Big Ben, the Houses of Parliament, and Westminster Abbey in the morning. Then walk toward St James’s Park or Buckingham Palace if that is on your list. In the afternoon, cross to the South Bank for river views, street performers, and stops around the London Eye area. Finish the evening in Covent Garden for restaurants and a lively atmosphere.</p>

<h2>Day 2: Tower Bridge, the City, and Shoreditch</h2>
<p>Begin near Tower Bridge and the Tower of London. This part of the city mixes history with impressive skyline views. Later, walk through parts of the City of London or stop at Leadenhall Market. In the evening, head to Shoreditch for casual food, coffee spots, and a more creative side of London.</p>

<h2>Day 3: Museums, Notting Hill, or Camden</h2>
<p>Your final day depends on your interests. If you love culture, focus on South Kensington with the Natural History Museum, the Victoria and Albert Museum, or the Science Museum. If you prefer neighborhood charm, explore Notting Hill and Portobello Road. If you want a more alternative atmosphere, Camden can be a fun choice.</p>

<h2>Where to eat in London during a short trip</h2>
<p>London has excellent food variety, so try to mix classics with casual neighborhood spots. You might want a proper pub meal one day, international street food another, and a bakery or brunch stop in between. Borough Market can also be a good option if you want variety without over-planning.</p>

<h2>London travel tips for first-time visitors</h2>
<ul>
  <li><strong>Use contactless payment:</strong> It works well on public transport.</li>
  <li><strong>Group attractions by area:</strong> This saves time and energy.</li>
  <li><strong>Book major attractions early:</strong> Especially for weekends and holidays.</li>
  <li><strong>Leave time to wander:</strong> London is best when you mix landmarks with neighborhood exploration.</li>
</ul>

<h2>Should you use a fixed itinerary?</h2>
<p>A fixed plan helps, but flexibility makes the trip better. Weather, queues, and energy levels can all change your day. If you want a custom London itinerary based on your travel style, Wanderwise AI can generate one quickly and help you refine it further.</p>
`,
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
    content: `
<p>AI travel planning is becoming popular because it helps people organize trips faster. Instead of opening dozens of tabs and comparing scattered advice, you can use AI to structure ideas, suggest routes, and build an itinerary around your budget and interests. The best results usually happen when you use AI as a planning assistant rather than as a blind replacement for judgment.</p>

<h2>Step 1: Start with your trip basics</h2>
<p>Before using any AI travel planner, define your destination, trip length, rough budget, and travel style. Are you looking for a fast-paced city break, a food-focused trip, a beach holiday, or a family itinerary? The clearer your inputs, the more useful the output becomes.</p>

<h2>Step 2: Use AI to generate a first itinerary draft</h2>
<p>This is where AI can save the most time. A good AI itinerary builder can suggest a day-by-day structure, highlight neighborhoods, and recommend the order of activities. Instead of starting from nothing, you begin with a useful draft that you can edit.</p>

<h2>Step 3: Refine the trip with follow-up questions</h2>
<p>Once you have a draft, ask for improvements. You can request a lower budget version, add local food spots, reduce travel time between activities, or make the pace more relaxed. AI works well when you use it interactively and keep refining the plan.</p>

<h2>Step 4: Cross-check practical details</h2>
<p>AI can help organize ideas, but you should still check practical details such as opening hours, transport schedules, and booking requirements before finalizing your trip. Think of AI as the strategist and yourself as the final editor.</p>

<h2>Step 5: Turn planning into action</h2>
<p>After refining the itinerary, compare hotels, flights, and activity options. This is where a travel workflow becomes useful: generate the trip, improve it, then compare booking options in one place. That saves time and reduces decision fatigue.</p>

<h2>Why AI travel planning works</h2>
<ul>
  <li><strong>It saves research time</strong> by creating a strong starting point.</li>
  <li><strong>It personalizes recommendations</strong> based on your inputs.</li>
  <li><strong>It helps you iterate quickly</strong> instead of rebuilding plans from scratch.</li>
  <li><strong>It reduces overwhelm</strong> when planning larger or more complex trips.</li>
</ul>

<h2>Use AI as a smart assistant, not a final authority</h2>
<p>The best way to plan a trip with AI is to combine speed with judgment. Let AI build and improve the structure, then check the practical pieces and adjust based on what matters most to you. If you want to try this approach, Wanderwise AI can help you create and refine a personalized trip plan in minutes.</p>
`,
  },
];

type Props = {
  params: { id: string };
};

const SITE_URL = 'https://wanderwise.uk';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: String(post.id),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === parseInt(params.id, 10));

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postImage = PlaceHolderImages.find((img) => img.id === post.imageId);
  const description = post.excerpt || stripHtml(post.content).slice(0, 155);
  const canonicalUrl = `/blog/${post.id}`;

  return {
    title: post.title,
    description,
    keywords: [
      post.title,
      'travel blog',
      'travel guide',
      'trip planning',
      'AI travel planner',
      'Wanderwise AI',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}${canonicalUrl}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: postImage
        ? [
            {
              url: postImage.imageUrl,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: postImage ? [postImage.imageUrl] : [],
    },
  };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === parseInt(params.id, 10));

  if (!post) {
    notFound();
  }

  const authorImage = PlaceHolderImages.find((img) => img.id === post.authorId);
  const postImage = PlaceHolderImages.find((img) => img.id === post.imageId);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wanderwise AI',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    mainEntityOfPage: `${SITE_URL}/blog/${post.id}`,
    image: postImage ? [postImage.imageUrl] : [],
  };

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Button asChild variant="link" className="mb-4 pl-0">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        {postImage && (
          <Image
            src={postImage.imageUrl}
            alt={post.title}
            data-ai-hint={postImage.imageHint}
            width={800}
            height={450}
            className="mb-8 rounded-lg object-cover"
            priority
          />
        )}

        <header className="mb-8">
          <h1 className="font-headline mb-4 text-4xl font-bold tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar>
                {authorImage && (
                  <AvatarImage src={authorImage.imageUrl} alt={post.author} />
                )}
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm">{post.date}</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>
        </header>

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 rounded-2xl border p-6">
          <h2 className="text-2xl font-semibold">Plan Your Own Trip with AI</h2>
          <p className="mt-3 text-muted-foreground">
            Use Wanderwise AI to create a personalized itinerary, explore
            travel ideas, and organize your trip faster.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/itinerary-builder"
              className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Open Itinerary Builder
            </Link>
            <Link
              href="/ai-chat"
              className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:border-sky-500 hover:text-sky-500"
            >
              Ask the AI Travel Assistant
            </Link>
          </div>
        </div>

        <nav className="mt-10 border-t pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/blog" className="font-medium hover:underline">
              More travel guides
            </Link>
            <Link href="/pricing" className="font-medium hover:underline">
              View pricing
            </Link>
            <Link href="/" className="font-medium hover:underline">
              Back to homepage
            </Link>
          </div>
        </nav>
      </article>
    </div>
  );
}
