import { rateLimit } from "express-rate-limit";
import { Request, Response } from "express";

/**
 * 5 enquiries per IP per hour.
 * Returns contract error format with code RATE_LIMITED and HTTP 429.
 */
export const enquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req: Request) => {
    // Prefer X-Forwarded-For if set (e.g., in reverse proxy / test), fallback to req.ip
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || "127.0.0.1";
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMITED",
        message: "Too many enquiries from this IP, please try again later."
      }
    });
  }
});
