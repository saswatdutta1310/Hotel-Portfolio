import { describe, it, expect } from "vitest";
import {
  safeJsonLdReplacer,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildHotelJsonLd,
} from "./seo-jsonld";
import { Hotel } from "./types";
import sitemap from "@/app/sitemap";

describe("seo-jsonld", () => {
  const siteUrl = "http://localhost:3000";

  const mockHotel: Hotel = {
    slug: "sample-hotel",
    name: "The Grand Pine Hotel",
    tagline: "Mountain tranquility and refined pine valley comfort",
    description: "Nestled high in the misty pine ridge.",
    businessType: "hotel",
    heroImage: "/hotels/sample-hotel/hero.svg",
    address: {
      street: "12 Pine Ridge Road",
      area: "Highland Valley",
      city: "Shimla",
      state: "Himachal Pradesh",
      pincode: "171001",
      country: "India",
    },
    geo: {
      lat: 31.1048,
      lng: 77.1734,
    },
    contact: {
      phone: "TODO",
      whatsapp: "TODO",
      email: "TODO",
    },
    checkIn: "02:00 PM",
    checkOut: "11:00 AM",
    startingPrice: {
      amount: 4200,
      currency: "INR",
      note: "per night",
    },
    rooms: [],
    amenities: ["High-speed Wi-Fi", "Free Parking"],
    gallery: [],
    nearby: [],
    houseRules: [],
    faqs: [
      {
        question: "Is parking available?",
        answer: "Yes, free on site.",
      },
    ],
    reviews: [],
    googleBusinessUrl: "TODO",
    social: {
      instagram: "TODO",
      facebook: "TODO",
    },
    theme: {
      primary: "#1b4332",
      accent: "#40916c",
    },
  };

  it("escapes '</script>' characters to prevent script tag breakout", () => {
    const malicious = {
      description: "</script><script>alert('xss')</script>",
    };
    const escaped = safeJsonLdReplacer(malicious);
    expect(escaped).not.toContain("</script>");
    expect(escaped).toContain("\\u003c/script>");
  });

  it("builds WebSite JSON-LD correctly", () => {
    const data = buildWebSiteJsonLd(siteUrl);
    expect(data["@type"]).toBe("WebSite");
    expect(data.url).toBe(siteUrl);
  });

  it("builds BreadcrumbList JSON-LD correctly", () => {
    const data = buildBreadcrumbJsonLd(siteUrl, {
      name: "The Grand Pine Hotel",
      slug: "sample-hotel",
    });
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(3);
    expect(data.itemListElement[2].name).toBe("The Grand Pine Hotel");
  });

  it("builds FAQPage JSON-LD correctly and filters invalid entries", () => {
    const data = buildFaqPageJsonLd([
      { question: "Is parking free?", answer: "Yes." },
      { question: "TODO", answer: "TODO" },
    ]);
    expect(data).not.toBeNull();
    expect(data!["@type"]).toBe("FAQPage");
    expect(data!.mainEntity).toHaveLength(1);
    expect(data!.mainEntity[0].name).toBe("Is parking free?");
  });

  it("omits TODO values, telephone, and does not invent aggregateRating", () => {
    const data = buildHotelJsonLd(siteUrl, mockHotel);
    expect(data["@type"]).toBe("Hotel");
    expect(data.name).toBe("The Grand Pine Hotel");
    expect(data.url).toBe(`${siteUrl}/hotels/sample-hotel`);

    // Verify telephone is omitted because phone is "TODO"
    expect(data.telephone).toBeUndefined();

    // Verify aggregateRating is never invented
    expect(data.aggregateRating).toBeUndefined();

    // Verify address and geo are populated
    expect(data.address).toBeDefined();
    expect(data.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 31.1048,
      longitude: 77.1734,
    });

    // Verify times are present
    expect(data.checkinTime).toBe("02:00 PM");
    expect(data.checkoutTime).toBe("11:00 AM");
  });

  it("includes telephone only when valid number is present", () => {
    const hotelWithPhone = {
      ...mockHotel,
      contact: {
        phone: "+91 9876543210",
        whatsapp: "TODO",
        email: "TODO",
      },
    };
    const data = buildHotelJsonLd(siteUrl, hotelWithPhone);
    expect(data.telephone).toBe("+91 9876543210");
  });

  it("sitemap generator outputs valid routes including hotels", async () => {
    const routes = await sitemap();
    expect(routes.length).toBeGreaterThanOrEqual(3);
    const urls = routes.map((r) => r.url);
    expect(urls).toContain("http://localhost:3000");
    expect(urls).toContain("http://localhost:3000/hotels");
    expect(urls).toContain("http://localhost:3000/hotels/sample-hotel");
  });
});
