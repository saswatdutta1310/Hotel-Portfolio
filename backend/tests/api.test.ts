import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Backend API Endpoints", () => {
  it("GET /health returns 200 with { status: 'ok' }", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /api/hotels returns 200 with { hotels: HotelSummary[] }", async () => {
    const res = await request(app).get("/api/hotels");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("hotels");
    expect(Array.isArray(res.body.hotels)).toBe(true);
    expect(res.body.hotels.length).toBeGreaterThanOrEqual(2);

    const first = res.body.hotels[0];
    expect(first).toHaveProperty("slug");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("tagline");
    expect(first).toHaveProperty("city");
    expect(first).toHaveProperty("startingPrice");
    expect(first).toHaveProperty("heroImage");
  });

  it("GET /api/hotels/:slug returns 200 with complete Hotel contract for valid slug", async () => {
    const res = await request(app).get("/api/hotels/sample-hotel");
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe("sample-hotel");
    expect(res.body.businessType).toBe("hotel");
    expect(res.body.rooms.length).toBe(3);
    expect(res.body.reviews.length).toBe(2);
    expect(res.body.contact.phone).toBe("TODO");
    expect(res.body.contact.email).toBe("TODO");
    expect(res.body.contact.whatsapp).toBe("TODO");
    expect(res.body.googleBusinessUrl).toBe("TODO");
  });

  it("GET /api/hotels/:slug returns 200 with complete Hotel contract for sample-guesthouse", async () => {
    const res = await request(app).get("/api/hotels/sample-guesthouse");
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe("sample-guesthouse");
    expect(res.body.rooms.length).toBe(2);
    expect(res.body.reviews.length).toBe(2);
  });

  it("GET /api/hotels/:slug returns 404 with NOT_FOUND code for unknown slug", async () => {
    const res = await request(app).get("/api/hotels/unknown-hotel-slug");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Hotel not found: unknown-hotel-slug"
      }
    });
  });

  it("GET unknown route returns 404 in contract error format", async () => {
    const res = await request(app).get("/random-unknown-endpoint");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toContain("Route not found: GET /random-unknown-endpoint");
  });
});
