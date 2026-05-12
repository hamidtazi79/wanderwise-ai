export function getDestinationImage(destination?: string) {
  if (!destination) {
    return 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop';
  }

  const city = destination.toLowerCase();

  const images: Record<string, string> = {
    marrakech:
      'https://images.unsplash.com/photo-1597212720419-d98c6f8577fb?q=80&w=1600&auto=format&fit=crop',
    tangier:
      'https://images.unsplash.com/photo-1548018560-c7196548e84d?q=80&w=1600&auto=format&fit=crop',
    nador:
      'https://images.unsplash.com/photo-1548018560-c7196548e84d?q=80&w=1600&auto=format&fit=crop',
    fes:
      'https://images.unsplash.com/photo-1539020140153-e8c237112e53?q=80&w=1600&auto=format&fit=crop',
    fez:
      'https://images.unsplash.com/photo-1539020140153-e8c237112e53?q=80&w=1600&auto=format&fit=crop',
    paris:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    tokyo:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop',
    oslo:
      'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1600&auto=format&fit=crop',
    london:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop',
    dubai:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
  };

  const matchedCity = Object.keys(images).find((key) => city.includes(key));

  if (matchedCity) {
    return images[matchedCity];
  }

  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(
    `${destination} travel city`
  )}`;
}
