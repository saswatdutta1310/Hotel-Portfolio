import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z
      .string()
      .default("4000")
      .refine((val) => !isNaN(parseInt(val, 10)), {
        message: "PORT must be a valid number"
      })
      .transform((val) => parseInt(val, 10)),
    ALLOWED_ORIGIN: z.string().default("http://localhost:3000"),
    TRUST_PROXY: z
      .string()
      .default("0")
      .refine(
        (val) => {
          const parsed = parseInt(val, 10);
          return !isNaN(parsed) && parsed >= 0;
        },
        { message: "TRUST_PROXY must be a non-negative integer" }
      )
      .transform((val) => parseInt(val, 10)),
    RESEND_API_KEY: z.string().optional().default("TODO"),
    ENQUIRY_FROM_EMAIL: z.string().optional().default("TODO"),
    TURNSTILE_SECRET_KEY: z.string().optional().default("TODO"),

    // Email service variables
    EMAIL_MODE: z.enum(["console", "smtp"]).default("console"),
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z
      .string()
      .default("587")
      .refine((val) => !isNaN(parseInt(val, 10)), {
        message: "SMTP_PORT must be a valid number"
      })
      .transform((val) => parseInt(val, 10)),
    SMTP_USER: z.string().default("TODO"),
    SMTP_PASS: z.string().default("TODO"),
    MAIL_FROM: z.string().default("no-reply@hotelportfolio.local"),
    DEFAULT_ENQUIRY_TO: z.string().default("reservations@hotelportfolio.local")
  })
  .transform((data) => {
    // Parse ALLOWED_ORIGIN as a comma-separated list of origins
    const origins = data.ALLOWED_ORIGIN.split(",")
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    return {
      ...data,
      corsOrigins: origins
    };
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "production") {
      if (data.corsOrigins.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ALLOWED_ORIGIN"],
          message: "ALLOWED_ORIGIN cannot be empty in production mode"
        });
      }
      if (data.corsOrigins.includes("*")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ALLOWED_ORIGIN"],
          message: "ALLOWED_ORIGIN cannot contain wildcard '*' in production mode"
        });
      }
    }
  });

export function parseEnv(rawEnv: Record<string, string | undefined>) {
  return envSchema.safeParse(rawEnv);
}

const parsedEnv = parseEnv(process.env);

if (!parsedEnv.success) {
  const errorDetails = parsedEnv.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error("Environment variable validation failed:\n" + errorDetails);
  process.exit(1);
}

export const env = parsedEnv.data;
