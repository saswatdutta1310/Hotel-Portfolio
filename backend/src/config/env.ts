import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default("4000")
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error(`PORT must be a valid number, got: ${val}`);
      }
      return parsed;
    }),
  ALLOWED_ORIGIN: z.string().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional().default("TODO"),
  ENQUIRY_FROM_EMAIL: z.string().optional().default("TODO"),
  TURNSTILE_SECRET_KEY: z.string().optional().default("TODO"),

  // Email service variables
  EMAIL_MODE: z.enum(["console", "smtp"]).default("console"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z
    .string()
    .default("587")
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error(`SMTP_PORT must be a valid number, got: ${val}`);
      }
      return parsed;
    }),
  SMTP_USER: z.string().default("TODO"),
  SMTP_PASS: z.string().default("TODO"),
  MAIL_FROM: z.string().default("no-reply@hotelportfolio.local"),
  DEFAULT_ENQUIRY_TO: z.string().default("reservations@hotelportfolio.local")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errorDetails = parsedEnv.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error("Environment variable validation failed:\n" + errorDetails);
  process.exit(1);
}

export const env = parsedEnv.data;
