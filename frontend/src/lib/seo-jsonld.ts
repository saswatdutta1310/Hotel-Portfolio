import { Hotel, Faq } from "@/lib/types";

/**
 * Escapes unsafe characters so JSON-LD cannot break out of `<script>` tags (prevents XSS).
 */
export function safeJsonLdReplacer(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function isValidValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.toUpperCase() !== "TODO";
}

/**
 * Builds schema.org WebSite structured data for the home page.
 */
export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: "Hotel Portfolio",
    description:
      "SEO-first portfolio websites for curated boutique hotels and guest houses.",
  };
}

/**
 * Builds schema.org BreadcrumbList structured data for a hotel page.
 */
export function buildBreadcrumbJsonLd(siteUrl: string, hotel: { name: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hotels",
        item: `${siteUrl}/hotels`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hotel.name,
        item: `${siteUrl}/hotels/${hotel.slug}`,
      },
    ],
  };
}

/**
 * Builds schema.org FAQPage structured data from hotel FAQ items.
 */
export function buildFaqPageJsonLd(faqs: Faq[]) {
  if (!faqs || faqs.length === 0) return null;

  const mainEntity = faqs
    .filter((f) => isValidValue(f.question) && isValidValue(f.answer))
    .map((f) => ({
      "@type": "Question",
      name: f.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer.trim(),
      },
    }));

  if (mainEntity.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

/**
 * Builds schema.org Hotel structured data from hotel object conforming strictly to types.ts.
 * Omits any field that is missing, empty, or "TODO".
 * Never invents ratings, reviews, or addresses.
 */
export function buildHotelJsonLd(siteUrl: string, hotel: Hotel) {
  const hotelUrl = `${siteUrl}/hotels/${hotel.slug}`;
  const image =
    hotel.heroImage || (hotel.gallery && hotel.gallery[0]?.src) || undefined;
  const fullImageUrl = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : undefined;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description || hotel.tagline,
    url: hotelUrl,
  };

  if (fullImageUrl) {
    jsonLd.image = fullImageUrl;
  }

  // Address
  if (hotel.address) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: hotel.address.street,
      addressLocality: hotel.address.city,
      addressRegion: hotel.address.state,
      postalCode: hotel.address.pincode,
      addressCountry: hotel.address.country,
    };
  }

  // Geo coordinates
  if (
    hotel.geo &&
    hotel.geo.lat !== null &&
    hotel.geo.lng !== null &&
    !isNaN(hotel.geo.lat) &&
    !isNaN(hotel.geo.lng)
  ) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: hotel.geo.lat,
      longitude: hotel.geo.lng,
    };
  }

  // Telephone - only if present and not "TODO"
  if (isValidValue(hotel.contact?.phone)) {
    jsonLd.telephone = hotel.contact.phone.trim();
  }

  // Checkin & Checkout times - only if present and not "TODO"
  if (isValidValue(hotel.checkIn)) {
    jsonLd.checkinTime = hotel.checkIn.trim();
  }
  if (isValidValue(hotel.checkOut)) {
    jsonLd.checkoutTime = hotel.checkOut.trim();
  }

  // Amenity Features
  if (hotel.amenities && hotel.amenities.length > 0) {
    jsonLd.amenityFeature = hotel.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    }));
  }

  // Price range note if available
  if (hotel.startingPrice && hotel.startingPrice.amount !== null) {
    jsonLd.priceRange = `${hotel.startingPrice.currency} ${hotel.startingPrice.amount}+`;
  }

  return jsonLd;
}
