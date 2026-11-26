import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { EmailService } from "../src/services/email.js";

describe("POST /api/enquiry API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const validPayload = {
    hotelSlug: "sample-hotel",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    checkIn: "2026-12-01",
    checkOut: "2026-12-05",
    guests: 2,
    message: "Looking forward to our stay."
  };

  it("valid enquiry succeeds with 200 and { ok: true }", async () => {
    const sendMailSpy = vi.spyOn(EmailService, "sendEnquiryEmail").mockResolvedValue();

    const res = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", "198.51.100.10")
      .send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(sendMailSpy).toHaveBeenCalledTimes(1);
  });

  it("invalid body returns 400 VALIDATION_ERROR without echoing user input", async () => {
    const res = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", "198.51.100.11")
      .send({
        hotelSlug: "sample-hotel",
        name: "J" // Too short (min 2)
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    // Ensure raw invalid user input is not echoed in error message
    expect(res.body.error.message).not.toContain("J");
  });

  it("unknown hotel returns 404 NOT_FOUND", async () => {
    const res = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", "198.51.100.12")
      .send({
        ...validPayload,
        hotelSlug: "non-existent-hotel"
      });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toContain("non-existent-hotel");
  });

  it("honeypot returns success without sending email", async () => {
    const sendMailSpy = vi.spyOn(EmailService, "sendEnquiryEmail").mockResolvedValue();

    const res = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", "198.51.100.13")
      .send({
        ...validPayload,
        website: "https://spam-bot.example.com"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(sendMailSpy).not.toHaveBeenCalled();
  });

  it("email failure returns 502 with EMAIL_FAILED and no internal details", async () => {
    vi.spyOn(EmailService, "sendEnquiryEmail").mockRejectedValue(
      new Error("SMTP server connection timeout at internal:25")
    );

    const res = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", "198.51.100.14")
      .send(validPayload);

    expect(res.status).toBe(502);
    expect(res.body).toEqual({
      error: {
        code: "EMAIL_FAILED",
        message: "Unable to send enquiry email at this time."
      }
    });
    // Ensure internal stack details or internal error strings are NOT leaked
    expect(JSON.stringify(res.body)).not.toContain("internal:25");
    expect(JSON.stringify(res.body)).not.toContain("timeout");
  });

  it("body over 10kb returns 413 PAYLOAD_TOO_LARGE", async () => {
    const hugeMessage = "A".repeat(12 * 1024); // 12kb
    const res = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", "198.51.100.15")
      .send({
        ...validPayload,
        message: hugeMessage
      });

    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("sixth request from same IP within window returns 429 RATE_LIMITED", async () => {
    vi.spyOn(EmailService, "sendEnquiryEmail").mockResolvedValue();

    const testIp = "198.51.100.99";

    // Send 5 successful requests
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/api/enquiry")
        .set("X-Forwarded-For", testIp)
        .send(validPayload);
      expect(res.status).toBe(200);
    }

    // 6th request
    const sixthRes = await request(app)
      .post("/api/enquiry")
      .set("X-Forwarded-For", testIp)
      .send(validPayload);

    expect(sixthRes.status).toBe(429);
    expect(sixthRes.body.error.code).toBe("RATE_LIMITED");
  });
});
