import { describe, it, expect } from "vitest";
import {
  buildTelLink,
  buildWhatsAppLink,
  buildMailtoLink,
} from "./contact-links";

describe("contact-links", () => {
  describe("buildTelLink", () => {
    it("returns null for TODO or empty values", () => {
      expect(buildTelLink("TODO")).toBeNull();
      expect(buildTelLink("todo")).toBeNull();
      expect(buildTelLink("")).toBeNull();
      expect(buildTelLink("   ")).toBeNull();
      expect(buildTelLink(null)).toBeNull();
      expect(buildTelLink(undefined)).toBeNull();
    });

    it("strips spaces, dashes and symbols from phone numbers", () => {
      expect(buildTelLink("+91 98765-43210")).toBe("tel:+919876543210");
      expect(buildTelLink("(0674) 254-8900")).toBe("tel:06742548900");
    });
  });

  describe("buildWhatsAppLink", () => {
    it("returns null for TODO or empty values", () => {
      expect(buildWhatsAppLink("TODO", "Sample Hotel")).toBeNull();
      expect(buildWhatsAppLink("todo", "Sample Hotel")).toBeNull();
      expect(buildWhatsAppLink("", "Sample Hotel")).toBeNull();
      expect(buildWhatsAppLink(null, "Sample Hotel")).toBeNull();
      expect(buildWhatsAppLink(undefined, "Sample Hotel")).toBeNull();
    });

    it("builds a wa.me link with digits and pre-filled message with hotel name", () => {
      const link = buildWhatsAppLink("+91 98765 43210", "Grand Pine Hotel");
      expect(link).toBe(
        "https://wa.me/919876543210?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20a%20stay%20at%20Grand%20Pine%20Hotel."
      );
    });
  });

  describe("buildMailtoLink", () => {
    it("returns null for TODO or empty values", () => {
      expect(buildMailtoLink("TODO")).toBeNull();
      expect(buildMailtoLink("todo")).toBeNull();
      expect(buildMailtoLink("")).toBeNull();
      expect(buildMailtoLink(null)).toBeNull();
      expect(buildMailtoLink(undefined)).toBeNull();
    });

    it("builds mailto link with optional hotel subject", () => {
      expect(buildMailtoLink("stay@example.com")).toBe("mailto:stay@example.com");
      expect(buildMailtoLink("stay@example.com", "Grand Pine")).toBe(
        "mailto:stay@example.com?subject=Enquiry%20-%20Grand%20Pine"
      );
    });
  });
});
