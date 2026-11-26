import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebSiteJsonLd } from "@/lib/seo-jsonld";

export const metadata: Metadata = {
  title: "Serene Boutique Hotels & Guest Houses",
  description:
    "Explore curated boutique hotels and quiet guest houses. View amenities, transparent room rates, and connect directly with property owners.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Serene Boutique Hotels & Guest Houses | Hotel Portfolio",
    description:
      "Explore curated boutique hotels and quiet guest houses. View amenities, transparent room rates, and connect directly with property owners.",
    url: "/",
    images: [
      {
        url: "/hotels/sample-hotel/hero.svg",
        width: 1200,
        height: 800,
        alt: "Hotel Portfolio - Serene Boutique Stays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serene Boutique Hotels & Guest Houses | Hotel Portfolio",
    description:
      "Explore curated boutique hotels and quiet guest houses. Connect directly with hosts without booking fees.",
    images: ["/hotels/sample-hotel/hero.svg"],
  },
};

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const websiteJsonLd = buildWebSiteJsonLd(siteUrl);

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Find your next serene stay
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Explore curated boutique hotels and guest houses. Discover quiet locations,
            room amenities, check-in details, and connect directly with hosts.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/hotels"
              className={buttonVariants({ variant: "default" })}
            >
              Explore Hotels
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
