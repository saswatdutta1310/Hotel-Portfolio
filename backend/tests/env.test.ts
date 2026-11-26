import { describe, it, expect } from "vitest";
import { parseEnv } from "../src/config/env.js";

describe("Environment & CORS Validation", () => {
  const baseValidEnv = {
    PORT: "4000",
    ALLOWED_ORIGIN: "http://localhost:3000",
    TRUST_PROXY: "1",
    NODE_ENV: "development"
  };

  it("parses valid development configuration successfully", () => {
    const result = parseEnv(baseValidEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(4000);
      expect(result.data.TRUST_PROXY).toBe(1);
      expect(result.data.corsOrigins).toEqual(["http://localhost:3000"]);
    }
  });

  it("defaults TRUST_PROXY to 0 when omitted", () => {
    const result = parseEnv({
      PORT: "4000",
      ALLOWED_ORIGIN: "http://localhost:3000"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.TRUST_PROXY).toBe(0);
    }
  });

  it("fails if TRUST_PROXY is negative or not a number", () => {
    const resNegative = parseEnv({ ...baseValidEnv, TRUST_PROXY: "-1" });
    expect(resNegative.success).toBe(false);

    const resNaN = parseEnv({ ...baseValidEnv, TRUST_PROXY: "abc" });
    expect(resNaN.success).toBe(false);
  });

  it("parses comma-separated ALLOWED_ORIGIN into array of trimmed origins", () => {
    const result = parseEnv({
      ...baseValidEnv,
      ALLOWED_ORIGIN: "https://example.com, https://hotel.example.com "
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.corsOrigins).toEqual([
        "https://example.com",
        "https://hotel.example.com"
      ]);
    }
  });

  it("fails in production mode if ALLOWED_ORIGIN is empty", () => {
    const result = parseEnv({
      ...baseValidEnv,
      NODE_ENV: "production",
      ALLOWED_ORIGIN: ""
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("cannot be empty in production mode");
    }
  });

  it("fails in production mode if ALLOWED_ORIGIN contains wildcard '*'", () => {
    const result = parseEnv({
      ...baseValidEnv,
      NODE_ENV: "production",
      ALLOWED_ORIGIN: "https://example.com, *"
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("cannot contain wildcard '*' in production mode");
    }
  });

  it("allows specific origins in production mode", () => {
    const result = parseEnv({
      ...baseValidEnv,
      NODE_ENV: "production",
      ALLOWED_ORIGIN: "https://hotelportfolio.com, https://admin.hotelportfolio.com"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.corsOrigins).toEqual([
        "https://hotelportfolio.com",
        "https://admin.hotelportfolio.com"
      ]);
    }
  });
});
