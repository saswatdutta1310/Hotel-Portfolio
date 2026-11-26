import { describe, it, expect } from "vitest";
import {
  validateEnquiryForm,
  getEnquiryErrorMessage,
  EnquiryFormInput,
} from "./enquiry-validation";

describe("enquiry-validation", () => {
  const baseInput: EnquiryFormInput = {
    hotelSlug: "sample-hotel",
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john@example.com",
    checkIn: "2026-12-01",
    checkOut: "2026-12-05",
    guests: "2",
    message: "Interested in quiet room.",
    website: "",
  };

  const today = "2026-11-26";

  it("passes validation for valid input", () => {
    const result = validateEnquiryForm(baseInput, today);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.firstErrorField).toBeUndefined();
  });

  describe("name validation", () => {
    it("fails when name is missing or whitespace", () => {
      const result = validateEnquiryForm({ ...baseInput, name: "   " }, today);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Name is required.");
      expect(result.firstErrorField).toBe("name");
    });

    it("fails when name is shorter than 2 chars or longer than 80", () => {
      expect(validateEnquiryForm({ ...baseInput, name: "A" }, today).errors.name).toBe(
        "Name must be between 2 and 80 characters."
      );
      expect(
        validateEnquiryForm({ ...baseInput, name: "A".repeat(81) }, today).errors.name
      ).toBe("Name must be between 2 and 80 characters.");
    });
  });

  describe("phone and email validation", () => {
    it("fails if both phone and email are empty", () => {
      const result = validateEnquiryForm(
        { ...baseInput, phone: "", email: "" },
        today
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe(
        "Please provide at least a phone number or email address."
      );
      expect(result.errors.email).toBe(
        "Please provide at least a phone number or email address."
      );
    });

    it("passes if only phone is provided", () => {
      const result = validateEnquiryForm(
        { ...baseInput, phone: "+91 9876543210", email: "" },
        today
      );
      expect(result.isValid).toBe(true);
    });

    it("passes if only email is provided", () => {
      const result = validateEnquiryForm(
        { ...baseInput, phone: "", email: "guest@hotel.com" },
        today
      );
      expect(result.isValid).toBe(true);
    });

    it("validates phone format and length", () => {
      expect(
        validateEnquiryForm({ ...baseInput, phone: "123" }, today).errors.phone
      ).toContain("Phone must be 7 to 20 characters");

      expect(
        validateEnquiryForm({ ...baseInput, phone: "invalid-phone!!!" }, today).errors
          .phone
      ).toContain("Phone must be 7 to 20 characters");
    });

    it("validates email format and length", () => {
      expect(
        validateEnquiryForm({ ...baseInput, email: "not-an-email" }, today).errors
          .email
      ).toContain("valid email address");

      expect(
        validateEnquiryForm(
          { ...baseInput, email: `${"a".repeat(115)}@test.com` },
          today
        ).errors.email
      ).toContain("valid email address (maximum 120 characters)");
    });
  });

  describe("check-in and check-out validation", () => {
    it("fails if checkIn is in the past", () => {
      const result = validateEnquiryForm(
        { ...baseInput, checkIn: "2026-11-20" },
        today
      );
      expect(result.errors.checkIn).toBe("Check-in date cannot be in the past.");
    });

    it("fails if checkOut is provided without checkIn", () => {
      const result = validateEnquiryForm(
        { ...baseInput, checkIn: "", checkOut: "2026-12-05" },
        today
      );
      expect(result.errors.checkOut).toBe(
        "Check-in date is required if check-out date is selected."
      );
    });

    it("fails if checkOut is on or before checkIn", () => {
      const result = validateEnquiryForm(
        { ...baseInput, checkIn: "2026-12-05", checkOut: "2026-12-05" },
        today
      );
      expect(result.errors.checkOut).toBe("Check-out date must be after check-in date.");
    });
  });

  describe("guests and message validation", () => {
    it("validates guest range 1 to 20", () => {
      expect(
        validateEnquiryForm({ ...baseInput, guests: "0" }, today).errors.guests
      ).toBe("Number of guests must be between 1 and 20.");

      expect(
        validateEnquiryForm({ ...baseInput, guests: "25" }, today).errors.guests
      ).toBe("Number of guests must be between 1 and 20.");

      expect(
        validateEnquiryForm({ ...baseInput, guests: "3.5" }, today).errors.guests
      ).toBe("Number of guests must be between 1 and 20.");
    });

    it("validates message max length 1000", () => {
      const longMessage = "m".repeat(1001);
      expect(
        validateEnquiryForm({ ...baseInput, message: longMessage }, today).errors
          .message
      ).toBe("Message must not exceed 1000 characters.");
    });
  });

  describe("getEnquiryErrorMessage", () => {
    it("returns expected user friendly messages", () => {
      expect(getEnquiryErrorMessage(400)).toContain("review your enquiry details");
      expect(getEnquiryErrorMessage(404)).toContain("hotel could not be found");
      expect(getEnquiryErrorMessage(413)).toContain("message is too large");
      expect(getEnquiryErrorMessage(429)).toContain("Too many enquiries");
      expect(getEnquiryErrorMessage(502)).toContain("Unable to deliver your enquiry");
      expect(getEnquiryErrorMessage(500)).toContain("Something went wrong");
    });
  });
});
