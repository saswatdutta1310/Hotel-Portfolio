import { describe, it, expect } from "vitest";
import { HotelSchema, HotelSummarySchema } from "../src/schemas/hotel.js";

describe("Hotel Schema Validation", () => {
  const validHotel = {
    slug: "azure-haven",
    name: "Azure Haven Resort",
    tagline: "Serenity by the bay",
    description: "A tranquil resort overlooking the blue azure waters of the bay.",
    businessType: "hotel" as const,
    address: {
      street: "1 Ocean Drive",
      area: "Bayfront",
      city: "Seatown",
      state: "Coastland",
      pincode: "500001",
      country: "India"
    },
    geo: {
      lat: 15.2993,
      lng: 74.124
    },
    contact: {
      phone: "TODO",
      whatsapp: "TODO",
      email: "TODO"
    },
    checkIn: "02:00 PM",
    checkOut: "11:00 AM",
    startingPrice: {
      amount: 3500,
      currency: "INR",
      note: "per night"
    },
    rooms: [
      {
        id: "ocean-suite",
        name: "Ocean Suite",
        description: "Suite with ocean vista",
        bed: "King Bed",
        sizeSqFt: 450,
        maxGuests: 2,
        amenities: ["Ocean View", "Balcony"],
        pricePerNight: 3500,
        images: ["/hotels/azure-haven/room-1.jpg"]
      }
    ],
    amenities: ["Free Wi-Fi", "Swimming Pool"],
    gallery: [
      {
        src: "/hotels/azure-haven/hero.jpg",
        alt: "Hotel Exterior",
        category: "Exterior"
      }
    ],
    nearby: [
      {
        name: "Sunset Beach",
        distance: "5 min",
        mode: "walk"
      }
    ],
    houseRules: ["No loud music after 10 PM"],
    faqs: [
      {
        question: "Is breakfast included?",
        answer: "Yes, continental buffet is complimentary."
      }
    ],
    reviews: [
      {
        author: "Aarav Roy",
        text: "Magnificent view and courteous hospitality.",
        source: "Google",
        rating: 5
      }
    ],
    googleBusinessUrl: "TODO",
    social: {
      instagram: "TODO",
      facebook: "TODO"
    },
    theme: {
      primary: "#1A365D",
      accent: "#63B3ED"
    }
  };

  it("should validate a completely valid Hotel object", () => {
    const result = HotelSchema.safeParse(validHotel);
    expect(result.success).toBe(true);
  });

  it("should reject non-kebab-case slug", () => {
    const invalid = { ...validHotel, slug: "Azure_Haven_Resort" };
    const result = HotelSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("slug");
    }
  });

  it("should reject uppercase letters or special symbols in slug", () => {
    expect(HotelSchema.safeParse({ ...validHotel, slug: "azure haven" }).success).toBe(false);
    expect(HotelSchema.safeParse({ ...validHotel, slug: "azure/haven" }).success).toBe(false);
  });

  it("should reject invalid businessType", () => {
    const invalid = { ...validHotel, businessType: "resort" };
    const result = HotelSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("businessType");
    }
  });

  it("should allow null for geo and startingPrice amount", () => {
    const withNulls = {
      ...validHotel,
      geo: { lat: null, lng: null },
      startingPrice: { amount: null, currency: "INR", note: "On request" },
      rooms: [
        {
          ...validHotel.rooms[0],
          sizeSqFt: null,
          pricePerNight: null
        }
      ]
    };
    const result = HotelSchema.safeParse(withNulls);
    expect(result.success).toBe(true);
  });

  it("should reject invalid theme hex code", () => {
    const invalidTheme = {
      ...validHotel,
      theme: { primary: "not-a-hex", accent: "#FFFFFF" }
    };
    const result = HotelSchema.safeParse(invalidTheme);
    expect(result.success).toBe(false);
  });

  it("should validate a valid HotelSummary", () => {
    const summary = {
      slug: "azure-haven",
      name: "Azure Haven Resort",
      tagline: "Serenity by the bay",
      city: "Seatown",
      startingPrice: {
        amount: 3500,
        currency: "INR",
        note: "per night"
      },
      heroImage: "/hotels/azure-haven/hero.jpg"
    };
    const result = HotelSummarySchema.safeParse(summary);
    expect(result.success).toBe(true);
  });
});
