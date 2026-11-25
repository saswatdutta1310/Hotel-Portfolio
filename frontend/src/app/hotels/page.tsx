import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getHotels } from "@/lib/api";

export const metadata: Metadata = {
  title: "Hotels & Guest Houses | Directory",
  description: "Browse curated hotel and guest house portfolios",
};

export default async function HotelsPage() {
  const hotels = await getHotels();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Hotel Directory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Browse our handpicked properties and view detailed amenities, photos, and direct host contacts.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <Link
            key={hotel.slug}
            href={`/hotels/${hotel.slug}`}
            className="group rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col"
          >
            <div className="relative h-48 w-full bg-muted overflow-hidden">
              <Image
                src={hotel.heroImage}
                alt={`${hotel.name} preview`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-medium text-muted-foreground">
                  {hotel.city}
                </span>
                <h2 className="text-xl font-bold tracking-tight text-foreground mt-1 group-hover:underline">
                  {hotel.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {hotel.tagline}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Starting from</span>
                <span className="text-sm font-semibold text-foreground">
                  {hotel.startingPrice.amount !== null
                    ? `${hotel.startingPrice.currency} ${hotel.startingPrice.amount}`
                    : "Price on request"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
