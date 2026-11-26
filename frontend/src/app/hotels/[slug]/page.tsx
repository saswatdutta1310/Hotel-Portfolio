import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getHotel, getHotels } from "@/lib/api";
import { Hero } from "@/components/hotel/Hero";
import { QuickFacts } from "@/components/hotel/QuickFacts";
import { Rooms } from "@/components/hotel/Rooms";
import { Amenities } from "@/components/hotel/Amenities";
import { Rules } from "@/components/hotel/Rules";
import { FaqSection } from "@/components/hotel/Faq";
import { Gallery } from "@/components/hotel/Gallery";
import { SectionNav } from "@/components/hotel/SectionNav";
import { EnquiryForm } from "@/components/hotel/EnquiryForm";
import { ContactBar } from "@/components/hotel/ContactBar";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildHotelJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/lib/seo-jsonld";

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const heroImg =
    hotel.heroImage ||
    (hotel.gallery && hotel.gallery[0]?.src) ||
    "/hotels/sample-hotel/hero.svg";

  return {
    title: `${hotel.name} - ${hotel.address.city}, ${hotel.address.state}`,
    description: hotel.description || hotel.tagline,
    alternates: {
      canonical: `/hotels/${hotel.slug}`,
    },
    openGraph: {
      title: `${hotel.name} | ${hotel.address.city}`,
      description: hotel.description || hotel.tagline,
      url: `/hotels/${hotel.slug}`,
      images: [
        {
          url: heroImg,
          width: 1200,
          height: 800,
          alt: `${hotel.name} view`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hotel.name} | ${hotel.address.city}`,
      description: hotel.description || hotel.tagline,
      images: [heroImg],
    },
  };
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (!hotel) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Build JSON-LD structured data objects
  const hotelJsonLd = buildHotelJsonLd(siteUrl, hotel);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(siteUrl, {
    name: hotel.name,
    slug: hotel.slug,
  });
  const faqJsonLd = buildFaqPageJsonLd(hotel.faqs);

  // Construct section navigation dynamically based on present data
  const navItems: Array<{ id: string; label: string }> = [
    { id: "overview", label: "Overview" },
  ];

  if (hotel.rooms && hotel.rooms.length > 0) {
    navItems.push({ id: "rooms", label: "Rooms" });
  }

  if (hotel.amenities && hotel.amenities.length > 0) {
    navItems.push({ id: "amenities", label: "Amenities" });
  }

  if (
    Boolean(hotel.checkIn || hotel.checkOut) ||
    (hotel.houseRules && hotel.houseRules.length > 0)
  ) {
    navItems.push({ id: "rules", label: "Policies & Rules" });
  }

  if (hotel.faqs && hotel.faqs.length > 0) {
    navItems.push({ id: "faq", label: "FAQs" });
  }

  if (hotel.gallery && hotel.gallery.length > 0) {
    navItems.push({ id: "gallery", label: "Gallery" });
  }

  // Enquiry is always available
  navItems.push({ id: "enquiry", label: "Enquire" });

  return (
    <article className="pb-28 md:pb-20">
      <JsonLd data={hotelJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <Hero hotel={hotel} />
      <SectionNav items={navItems} />

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-4">
        <section id="overview" className="scroll-mt-24">
          <QuickFacts hotel={hotel} />
          {hotel.description && (
            <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-xs">
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                About the Property
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {hotel.description}
              </p>
            </div>
          )}
        </section>

        <Rooms rooms={hotel.rooms} currency={hotel.startingPrice.currency} />
        <Amenities amenities={hotel.amenities} />
        <Rules
          checkIn={hotel.checkIn}
          checkOut={hotel.checkOut}
          houseRules={hotel.houseRules}
        />
        <FaqSection faqs={hotel.faqs} />
        <Gallery gallery={hotel.gallery} />
        <Suspense fallback={<div className="h-48 rounded-xl border border-border bg-card animate-pulse" />}>
          <EnquiryForm hotelSlug={hotel.slug} />
        </Suspense>
      </div>

      <ContactBar contact={hotel.contact} hotelName={hotel.name} />
    </article>
  );
}
