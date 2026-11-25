import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHotel, getHotels } from "@/lib/api";
import { Hero } from "@/components/hotel/Hero";
import { QuickFacts } from "@/components/hotel/QuickFacts";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const hotels = await getHotels();
  return hotels.map((hotel) => ({
    slug: hotel.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (!hotel) {
    return {
      title: "Hotel Not Found",
    };
  }

  return {
    title: `${hotel.name} | ${hotel.address.city}`,
    description: hotel.description || hotel.tagline,
  };
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (!hotel) {
    notFound();
  }

  return (
    <article className="pb-16">
      <Hero hotel={hotel} />
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <QuickFacts hotel={hotel} />
      </div>
    </article>
  );
}
