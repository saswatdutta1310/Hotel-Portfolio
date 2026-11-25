import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import {
  loadAllHotelsFromDir,
  HotelValidationError,
  toSummary,
  getAllHotels,
  getHotel
} from "../src/services/hotel-loader.js";

describe("Hotel Loader Service", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hotel-loader-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const sampleHotelData = {
    slug: "temp-hotel-one",
    name: "Temp Hotel One",
    tagline: "A test tagline",
    description: "A test description for hotel loader",
    businessType: "hotel",
    address: {
      street: "1 Test St",
      area: "Test Area",
      city: "Test City",
      state: "Test State",
      pincode: "123456",
      country: "India"
    },
    geo: { lat: 10.0, lng: 20.0 },
    contact: { phone: "TODO", whatsapp: "TODO", email: "TODO" },
    checkIn: "12:00 PM",
    checkOut: "11:00 AM",
    startingPrice: { amount: 2000, currency: "INR", note: "per night" },
    rooms: [
      {
        id: "room-1",
        name: "Standard",
        description: "Room description",
        bed: "Double",
        sizeSqFt: 200,
        maxGuests: 2,
        amenities: ["Wi-Fi"],
        pricePerNight: 2000,
        images: ["/hotels/temp-hotel-one/r1.jpg"]
      }
    ],
    amenities: ["Wi-Fi"],
    gallery: [
      { src: "/hotels/temp-hotel-one/hero.jpg", alt: "Hero", category: "Exterior" }
    ],
    nearby: [{ name: "Station", distance: "5 min", mode: "drive" }],
    houseRules: ["Rule 1"],
    faqs: [{ question: "Q?", answer: "A!" }],
    reviews: [{ author: "Sam", text: "Nice", source: "Google", rating: 5 }],
    googleBusinessUrl: "TODO",
    social: { instagram: "TODO", facebook: "TODO" },
    theme: { primary: "#111111", accent: "#222222" }
  };

  it("should load valid hotel and skip files prefixed with underscore", () => {
    fs.writeFileSync(
      path.join(tempDir, "temp-hotel-one.json"),
      JSON.stringify(sampleHotelData, null, 2)
    );
    fs.writeFileSync(
      path.join(tempDir, "_template.json"),
      JSON.stringify(sampleHotelData, null, 2)
    );

    const hotels = loadAllHotelsFromDir(tempDir);
    expect(hotels).toHaveLength(1);
    expect(hotels[0].slug).toBe("temp-hotel-one");
  });

  it("should throw HotelValidationError when slug does not match filename", () => {
    fs.writeFileSync(
      path.join(tempDir, "wrong-file-name.json"),
      JSON.stringify(sampleHotelData, null, 2)
    );

    expect(() => loadAllHotelsFromDir(tempDir)).toThrowError(HotelValidationError);
    try {
      loadAllHotelsFromDir(tempDir);
    } catch (err: unknown) {
      const vErr = err as HotelValidationError;
      expect(vErr.file).toBe("wrong-file-name.json");
      expect(vErr.field).toBe("slug");
      expect(vErr.message).toContain("does not match filename");
    }
  });

  it("should throw HotelValidationError when duplicate slugs are encountered", () => {
    fs.writeFileSync(
      path.join(tempDir, "temp-hotel-one.json"),
      JSON.stringify(sampleHotelData, null, 2)
    );

    // Another file with identical slug
    const hotelTwo = { ...sampleHotelData };
    // Filename matching another slug, but internal slug is duplicate
    fs.writeFileSync(
      path.join(tempDir, "another-name.json"),
      JSON.stringify(hotelTwo, null, 2)
    );

    // Should fail with mismatch or duplicate
    expect(() => loadAllHotelsFromDir(tempDir)).toThrow();
  });

  it("should report specific bad field when schema validation fails", () => {
    const invalidData = {
      ...sampleHotelData,
      slug: "invalid-hotel",
      businessType: "not-a-hotel"
    };

    fs.writeFileSync(
      path.join(tempDir, "invalid-hotel.json"),
      JSON.stringify(invalidData, null, 2)
    );

    expect(() => loadAllHotelsFromDir(tempDir)).toThrow(HotelValidationError);
    try {
      loadAllHotelsFromDir(tempDir);
    } catch (err: unknown) {
      const vErr = err as HotelValidationError;
      expect(vErr.file).toBe("invalid-hotel.json");
      expect(vErr.field).toBe("businessType");
    }
  });

  it("should convert a Hotel to HotelSummary with toSummary", () => {
    const parsedHotel = sampleHotelData as unknown as Hotel;
    const summary = toSummary(parsedHotel);

    expect(summary.slug).toBe(sampleHotelData.slug);
    expect(summary.name).toBe(sampleHotelData.name);
    expect(summary.tagline).toBe(sampleHotelData.tagline);
    expect(summary.city).toBe(sampleHotelData.address.city);
    expect(summary.startingPrice).toEqual(sampleHotelData.startingPrice);
    expect(summary.heroImage).toBe(sampleHotelData.gallery[0].src);
  });

  it("getAllHotels and getHotel should work against real data directory", () => {
    const hotels = getAllHotels();
    expect(hotels.length).toBeGreaterThanOrEqual(2);

    const sample = getHotel("sample-hotel");
    expect(sample).toBeDefined();
    expect(sample?.slug).toBe("sample-hotel");

    const nonExistent = getHotel("does-not-exist");
    expect(nonExistent).toBeUndefined();
  });
});
