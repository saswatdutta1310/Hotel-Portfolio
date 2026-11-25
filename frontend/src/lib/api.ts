import { Hotel, HotelSchema, HotelSummary } from "./types";
import sampleHotelData from "./fixtures/sample-hotel.json";
import sampleGuesthouseData from "./fixtures/sample-guesthouse.json";

function isMockEnabled(): boolean {
  if (process.env.USE_MOCK !== undefined) {
    return process.env.USE_MOCK === "true";
  }
  return true;
}

function getApiUrl(): string {
  return process.env.API_URL || "http://localhost:4000";
}

function toSummary(hotel: Hotel): HotelSummary {
  return {
    slug: hotel.slug,
    name: hotel.name,
    tagline: hotel.tagline,
    city: hotel.address.city,
    startingPrice: hotel.startingPrice,
    heroImage: hotel.heroImage || (hotel.gallery[0]?.src ?? "/hotels/sample-hotel/hero.svg"),
  };
}

const mockHotels: Hotel[] = [
  HotelSchema.parse(sampleHotelData),
  HotelSchema.parse(sampleGuesthouseData),
];

export async function getHotels(): Promise<HotelSummary[]> {
  if (isMockEnabled()) {
    return mockHotels.map(toSummary);
  }

  const res = await fetch(`${getApiUrl()}/api/hotels`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch hotels: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.hotels;
}

export async function getHotel(slug: string): Promise<Hotel | null> {
  if (isMockEnabled()) {
    const hotel = mockHotels.find((h) => h.slug === slug);
    return hotel ? hotel : null;
  }

  const res = await fetch(`${getApiUrl()}/api/hotels/${slug}`, {
    next: { revalidate: 300 },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch hotel "${slug}": ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return HotelSchema.parse(data);
}
