import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";

/**
 * 5 enquiries per IP per hour.
 * Returns contract error format with code RATE_LIMITED and HTTP 429.
 * When trust proxy is configured in Express (app.set("trust proxy", ...)),
 * express-rate-limit accurately identifies the visitor IP via req.ip.
 */
export const enquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false
  },
  keyGenerator: (req: Request) => {
    // If an X-Forwarded-For header is present, take the first client IP
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const clientIp = forwarded.split(",")[0].trim();
      return ipKeyGenerator(clientIp);
    }
    return ipKeyGenerator(req.ip || "127.0.0.1");
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
