import { z } from "zod";
import { getHotel } from "../services/hotel-loader.js";

// Check if string contains forbidden ASCII control characters (0-31 except \t, \n, \r, and 127)
function hasForbiddenControlChars(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127) {
      return true;
    }
  }
  return false;
}

// Safe phone format: digits, spaces, +, -, (, ) only
const PHONE_REGEX = /^[0-9+\-()\s]+$/;

// Date format YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const baseCleanString = z
  .string()
  .trim()
  .refine((val: string) => !hasForbiddenControlChars(val), {
    message: "Value contains forbidden control characters"
  });

export const EnquirySchema = z
  .object({
    hotelSlug: baseCleanString
      .pipe(
        z
          .string()
          .min(1, "hotelSlug is required")
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "hotelSlug must be kebab-case")
          .refine((slug: string) => getHotel(slug) !== undefined, {
            message: "hotelSlug does not match any existing hotel"
          })
      ),
    name: baseCleanString
      .pipe(
        z
          .string()
          .min(2, "name must be at least 2 characters")
          .max(80, "name cannot exceed 80 characters")
      ),
    phone: baseCleanString
      .pipe(
        z
          .string()
          .min(7, "phone must be at least 7 characters")
          .max(20, "phone cannot exceed 20 characters")
          .regex(PHONE_REGEX, "phone contains invalid characters")
      )
      .optional(),
    email: baseCleanString
      .pipe(
        z
          .string()
          .max(120, "email cannot exceed 120 characters")
          .email("email must be a valid email address")
      )
      .optional(),
    checkIn: baseCleanString
      .pipe(
        z
          .string()
          .regex(DATE_REGEX, "checkIn must be in YYYY-MM-DD format")
          .refine(
            (val: string) => {
              const today = new Date().toISOString().split("T")[0];
              return val >= today;
            },
            { message: "checkIn cannot be in the past" }
          )
      )
      .optional(),
    checkOut: baseCleanString
      .pipe(
        z
          .string()
          .regex(DATE_REGEX, "checkOut must be in YYYY-MM-DD format")
      )
      .optional(),
    guests: z
      .number()
      .int("guests must be an integer")
      .min(1, "guests must be at least 1")
      .max(20, "guests cannot exceed 20")
      .optional(),
    message: baseCleanString
      .pipe(
        z
          .string()
          .max(1000, "message cannot exceed 1000 characters")
      )
      .optional(),
    website: baseCleanString.optional()
  })
  .strict("Unknown fields are rejected")
  .refine((data) => Boolean(data.phone || data.email), {
    message: "At least one of phone or email is required",
    path: ["phone"]
  })
  .refine(
    (data) => {
      if (data.checkOut && !data.checkIn) {
        return false;
      }
      return true;
    },
    {
      message: "checkIn is required if checkOut is provided",
      path: ["checkIn"]
    }
  )
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut) {
        return data.checkOut > data.checkIn;
      }
      return true;
    },
    {
      message: "checkOut must be strictly after checkIn",
      path: ["checkOut"]
    }
  );

export type Enquiry = z.infer<typeof EnquirySchema>;
