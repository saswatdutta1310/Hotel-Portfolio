import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/env.js";
import { Enquiry } from "../schemas/enquiry.js";
import { Hotel } from "../schemas/hotel.js";

/**
 * Escapes characters for HTML content bodies.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}

export function buildEnquiryEmail(enquiry: Enquiry, hotel: Hotel): EmailPayload {
  const recipient =
    hotel.contact.email && hotel.contact.email !== "TODO"
      ? hotel.contact.email
      : env.DEFAULT_ENQUIRY_TO;

  // Prevent header injection: Subject and Headers are strictly hardcoded templates without user-controlled newlines
  const subject = `New Website Enquiry for ${hotel.name}`;

  const safeName = escapeHtml(enquiry.name);
  const safePhone = enquiry.phone ? escapeHtml(enquiry.phone) : "Not provided";
  const safeEmail = enquiry.email ? escapeHtml(enquiry.email) : "Not provided";
  const safeCheckIn = enquiry.checkIn ? escapeHtml(enquiry.checkIn) : "Not specified";
  const safeCheckOut = enquiry.checkOut ? escapeHtml(enquiry.checkOut) : "Not specified";
  const safeGuests = enquiry.guests !== undefined ? String(enquiry.guests) : "Not specified";
  const safeMessage = enquiry.message ? escapeHtml(enquiry.message).replace(/\n/g, "<br/>") : "None";

  const html = `
    <h2>New Website Enquiry</h2>
    <p><strong>Property:</strong> ${escapeHtml(hotel.name)} (${escapeHtml(hotel.slug)})</p>
    <hr/>
    <h3>Guest Details</h3>
    <ul>
      <li><strong>Name:</strong> ${safeName}</li>
      <li><strong>Phone:</strong> ${safePhone}</li>
      <li><strong>Email:</strong> ${safeEmail}</li>
    </ul>
    <h3>Stay Details</h3>
    <ul>
      <li><strong>Check-in:</strong> ${safeCheckIn}</li>
      <li><strong>Check-out:</strong> ${safeCheckOut}</li>
      <li><strong>Guests:</strong> ${safeGuests}</li>
    </ul>
    <h3>Message</h3>
    <p>${safeMessage}</p>
  `.trim();

  const text = `
New Website Enquiry for ${hotel.name} (${hotel.slug})
----------------------------------------
Guest Details:
Name: ${enquiry.name}
Phone: ${enquiry.phone || "Not provided"}
Email: ${enquiry.email || "Not provided"}

Stay Details:
Check-in: ${enquiry.checkIn || "Not specified"}
Check-out: ${enquiry.checkOut || "Not specified"}
Guests: ${enquiry.guests !== undefined ? enquiry.guests : "Not specified"}

Message:
${enquiry.message || "None"}
  `.trim();

  return {
    to: recipient,
    from: env.MAIL_FROM,
    subject,
    html,
    text
  };
}

let transporterInstance: Transporter | null = null;

export function getTransporter(): Transporter {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth:
        env.SMTP_USER && env.SMTP_USER !== "TODO"
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS
            }
          : undefined
    });
  }
  return transporterInstance;
}

export class EmailService {
  public static async sendEnquiryEmail(
    enquiry: Enquiry,
    hotel: Hotel,
    requestId: string
  ): Promise<void> {
    const emailPayload = buildEnquiryEmail(enquiry, hotel);

    if (env.EMAIL_MODE === "console") {
      // Console mode: log without personal data
      console.log(
        `[EmailService:console] [${requestId}] Enquiry email generated for hotel '${hotel.slug}' to recipient '${emailPayload.to}'`
      );
      return;
    }

    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: emailPayload.from,
        to: emailPayload.to,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text
      });
      console.log(
        `[EmailService:smtp] [${requestId}] Enquiry email dispatched successfully for hotel '${hotel.slug}'`
      );
    } catch (err: unknown) {
      console.error(
        `[EmailService:error] [${requestId}] Failed to dispatch email for hotel '${hotel.slug}':`,
        err instanceof Error ? err.message : "Unknown SMTP error"
      );
      throw err;
    }
  }
}
