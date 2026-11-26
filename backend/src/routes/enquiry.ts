import { Router, Request, Response, NextFunction } from "express";
import express from "express";
import crypto from "crypto";
import { EnquirySchema } from "../schemas/enquiry.js";
import { getHotel } from "../services/hotel-loader.js";
import { EmailService } from "../services/email.js";
import { enquiryRateLimiter } from "../middleware/rate-limit.js";
import { AppError } from "../middleware/errors.js";

export const enquiryRouter = Router();

// Body size limit of 10kb specifically on this route
const json10kb = express.json({ limit: "10kb" });

enquiryRouter.post(
  "/",
  enquiryRateLimiter,
  json10kb,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = `req_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

      // Check if hotel exists first (if body has a raw hotelSlug)
      if (req.body && typeof req.body === "object" && "hotelSlug" in req.body) {
        const slug = String(req.body.hotelSlug).trim();
        const hotel = getHotel(slug);
        if (!hotel) {
          throw new AppError(404, "NOT_FOUND", `Hotel not found: ${slug}`);
        }
      }

      // Validate schema
      const enquiry = EnquirySchema.parse(req.body);

      const hotel = getHotel(enquiry.hotelSlug);
      if (!hotel) {
        throw new AppError(404, "NOT_FOUND", `Hotel not found: ${enquiry.hotelSlug}`);
      }

      // Honeypot check: if filled, return normal success response without sending email
      if (enquiry.website && enquiry.website.trim().length > 0) {
        // Log nothing personal, only hotel slug and request id
        console.log(`[Enquiry:honeypot] [${requestId}] Honeypot triggered for hotel '${hotel.slug}'`);
        return res.status(200).json({ ok: true });
      }

      // Log only the hotel slug and request id
      console.log(`[Enquiry:received] [${requestId}] Processing enquiry for hotel '${hotel.slug}'`);

      try {
        await EmailService.sendEnquiryEmail(enquiry, hotel, requestId);
      } catch {
        throw new AppError(502, "EMAIL_FAILED", "Unable to send enquiry email at this time.");
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);
