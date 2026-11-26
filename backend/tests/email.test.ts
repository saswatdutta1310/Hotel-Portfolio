import { describe, it, expect } from "vitest";
import { buildEnquiryEmail, escapeHtml } from "../src/services/email.js";
import { Enquiry } from "../src/schemas/enquiry.js";
import { Hotel } from "../src/schemas/hotel.js";

describe("Email Service & Builder", () => {
  const dummyHotel: Hotel = {
    slug: "sample-hotel",
    name: "Grand Horizon Hotel",
    tagline: "Serenity amidst pine trees",
    description: "A lovely hotel in the hills",
    businessType: "hotel",
    address: {
      street: "1 Ridge Road",
      area: "Mall",
      city: "Hilltown",
      state: "State",
      pincode: "123456",
      country: "India"
    },
    geo: { lat: 10, lng: 20 },
    contact: {
      phone: "+91 9999999999",
      whatsapp: "+91 9999999999",
      email: "manager@grandhorizon.local"
    },
    checkIn: "12:00 PM",
    checkOut: "11:00 AM",
    startingPrice: { amount: 3000, currency: "INR", note: "per night" },
    rooms: [],
    amenities: [],
    gallery: [],
    nearby: [],
    houseRules: [],
    faqs: [],
    reviews: [],
    googleBusinessUrl: "TODO",
    social: { instagram: "TODO", facebook: "TODO" },
    theme: { primary: "#111111", accent: "#222222" }
  };

  const dummyEnquiry: Enquiry = {
    hotelSlug: "sample-hotel",
    name: "Jane <script>alert(1)</script>",
    email: "jane@example.com",
    phone: "+1 234 567 8900",
    message: "Hello & welcome <img src=x onerror=alert(1)>",
    checkIn: "2026-12-10",
    checkOut: "2026-12-12",
    guests: 2
  };

  it("HTML escapes all user-supplied values in email body", () => {
    const email = buildEnquiryEmail(dummyEnquiry, dummyHotel);

    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(email.html).toContain("Hello &amp; welcome");
  });

  it("prevents header injection in headers and subject line", () => {
    const maliciousName = "Jane\r\nBcc: victim@example.com\r\nSubject: Injected";
    const enquiryWithInjection: Enquiry = {
      ...dummyEnquiry,
      name: maliciousName
    };

    const email = buildEnquiryEmail(enquiryWithInjection, dummyHotel);

    // Subject must be templated and not contain user input directly as headers
    expect(email.subject).toBe(`New Website Enquiry for ${dummyHotel.name}`);
    expect(email.subject).not.toContain("Bcc:");
    expect(email.subject).not.toContain("\r\n");

    // From and To headers must not contain user input
    expect(email.to).toBe("manager@grandhorizon.local");
    expect(email.from).not.toContain("Bcc:");
  });

  it("falls back to DEFAULT_ENQUIRY_TO when hotel contact email is 'TODO'", () => {
    const hotelWithoutEmail: Hotel = {
      ...dummyHotel,
      contact: {
        ...dummyHotel.contact,
        email: "TODO"
      }
    };

    const email = buildEnquiryEmail(dummyEnquiry, hotelWithoutEmail);
    expect(email.to).not.toBe("TODO");
    expect(email.to.length).toBeGreaterThan(0);
  });

  it("escapeHtml correctly escapes &, <, >, \", and '", () => {
    const raw = `& < > " '`;
    const escaped = escapeHtml(raw);
    expect(escaped).toBe("&amp; &lt; &gt; &quot; &#039;");
  });
});
