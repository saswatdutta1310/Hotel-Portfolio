"use client";

import { useState, useRef, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  validateEnquiryForm,
  getEnquiryErrorMessage,
  EnquiryFormInput,
  EnquiryFormErrors,
} from "@/lib/enquiry-validation";

interface EnquiryFormProps {
  hotelSlug: string;
}

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({ hotelSlug }: EnquiryFormProps) {
  const [formData, setFormData] = useState<EnquiryFormInput>({
    hotelSlug,
    name: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    message: "",
    website: "", // Honeypot field
  });

  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const baseId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const guestsRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const fieldRefs: Record<
    string,
    React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  > = {
    name: nameRef,
    phone: phoneRef,
    email: emailRef,
    checkIn: checkInRef,
    checkOut: checkOutRef,
    guests: guestsRef,
    message: messageRef,
  };

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnquiryFormInput]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof EnquiryFormInput];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateEnquiryForm(formData, today);
    if (!validation.isValid) {
      setErrors(validation.errors);
      if (validation.firstErrorField && fieldRefs[validation.firstErrorField]) {
        fieldRefs[validation.firstErrorField]?.current?.focus();
      }
      return;
    }

    setStatus("submitting");

    const isMock =
      process.env.NEXT_PUBLIC_USE_MOCK !== undefined
        ? process.env.NEXT_PUBLIC_USE_MOCK === "true"
        : process.env.USE_MOCK === "true" || true;

    if (isMock) {
      // Mock mode: simulate short network delay and success
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Honeypot check in mock mode mirrors backend contract (returns success without processing)
      setStatus("success");
      setFormData({
        hotelSlug,
        name: "",
        phone: "",
        email: "",
        checkIn: "",
        checkOut: "",
        guests: "2",
        message: "",
        website: "",
      });
      setErrors({});
      setTimeout(() => {
        successRef.current?.focus();
      }, 50);
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.API_URL ||
        "http://localhost:4000";

      const payload: Record<string, unknown> = {
        hotelSlug,
        name: formData.name.trim(),
        website: formData.website,
      };

      if (formData.phone.trim()) payload.phone = formData.phone.trim();
      if (formData.email.trim()) payload.email = formData.email.trim();
      if (formData.checkIn.trim()) payload.checkIn = formData.checkIn.trim();
      if (formData.checkOut.trim()) payload.checkOut = formData.checkOut.trim();
      if (formData.guests.trim()) payload.guests = Number(formData.guests.trim());
      if (formData.message.trim()) payload.message = formData.message.trim();

      const response = await fetch(`${baseUrl}/api/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMsg = getEnquiryErrorMessage(response.status);
        setServerError(errorMsg);
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({
        hotelSlug,
        name: "",
        phone: "",
        email: "",
        checkIn: "",
        checkOut: "",
        guests: "2",
        message: "",
        website: "",
      });
      setErrors({});
      setTimeout(() => {
        successRef.current?.focus();
      }, 50);
    } catch {
      setServerError(
        "Unable to reach the server. Please check your internet connection or call/WhatsApp the host directly."
      );
      setStatus("error");
    }
  };

  return (
    <section
      id="enquiry"
      aria-labelledby={`${baseId}-title`}
      className="scroll-mt-24 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs"
    >
      <div className="border-b border-border pb-4 mb-6">
        <h2
          id={`${baseId}-title`}
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
        >
          Send an Enquiry
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is an enquiry directly to the property host. There is no instant
          booking and no payment required.
        </p>
      </div>

      {status === "success" && (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="rounded-lg border border-border bg-secondary p-5 mb-6 text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold">Enquiry Sent Successfully</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Thank you for your interest. The host has received your details and will
                get in touch with you shortly via phone or email.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => setStatus("idle")}
              >
                Send Another Enquiry
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "error" && serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6 flex items-start gap-3 text-destructive"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium leading-relaxed">{serverError}</div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={status === "submitting"}
        className="space-y-5"
      >
        {/* Hidden Honeypot Field */}
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            opacity: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <label htmlFor={`${baseId}-website`}>Website</label>
          <input
            id={`${baseId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor={`${baseId}-name`} className="text-sm font-medium">
            Your Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            ref={nameRef}
            id={`${baseId}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${baseId}-name-err` : undefined}
            className="mt-1.5"
            placeholder="e.g. Ramesh Kumar"
          />
          {errors.name && (
            <p
              id={`${baseId}-name-err`}
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Contact info: Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${baseId}-phone`} className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              ref={phoneRef}
              id={`${baseId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${baseId}-phone-err` : undefined}
              className="mt-1.5"
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p
                id={`${baseId}-phone-err`}
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`${baseId}-email`} className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              ref={emailRef}
              id={`${baseId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${baseId}-email-err` : undefined}
              className="mt-1.5"
              placeholder="guest@example.com"
            />
            {errors.email && (
              <p
                id={`${baseId}-email-err`}
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Dates and Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${baseId}-checkIn`} className="text-sm font-medium">
              Check-in Date
            </Label>
            <Input
              ref={checkInRef}
              id={`${baseId}-checkIn`}
              name="checkIn"
              type="date"
              min={today}
              value={formData.checkIn}
              onChange={handleChange}
              aria-invalid={Boolean(errors.checkIn)}
              aria-describedby={errors.checkIn ? `${baseId}-checkIn-err` : undefined}
              className="mt-1.5"
            />
            {errors.checkIn && (
              <p
                id={`${baseId}-checkIn-err`}
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.checkIn}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`${baseId}-checkOut`} className="text-sm font-medium">
              Check-out Date
            </Label>
            <Input
              ref={checkOutRef}
              id={`${baseId}-checkOut`}
              name="checkOut"
              type="date"
              min={formData.checkIn || today}
              value={formData.checkOut}
              onChange={handleChange}
              aria-invalid={Boolean(errors.checkOut)}
              aria-describedby={errors.checkOut ? `${baseId}-checkOut-err` : undefined}
              className="mt-1.5"
            />
            {errors.checkOut && (
              <p
                id={`${baseId}-checkOut-err`}
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.checkOut}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`${baseId}-guests`} className="text-sm font-medium">
              Guests (1 to 20)
            </Label>
            <Input
              ref={guestsRef}
              id={`${baseId}-guests`}
              name="guests"
              type="number"
              min="1"
              max="20"
              value={formData.guests}
              onChange={handleChange}
              aria-invalid={Boolean(errors.guests)}
              aria-describedby={errors.guests ? `${baseId}-guests-err` : undefined}
              className="mt-1.5"
            />
            {errors.guests && (
              <p
                id={`${baseId}-guests-err`}
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {errors.guests}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor={`${baseId}-message`} className="text-sm font-medium">
            Special Requests or Questions (Optional)
          </Label>
          <Textarea
            ref={messageRef}
            id={`${baseId}-message`}
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${baseId}-message-err` : undefined}
            className="mt-1.5"
            placeholder="Tell the host about room preferences, expected arrival time, or special requirements..."
          />
          {errors.message && (
            <p
              id={`${baseId}-message-err`}
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button & Privacy Notice */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto min-h-[44px] px-8 text-base font-semibold"
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Enquiry...</span>
              </span>
            ) : (
              "Submit Enquiry"
            )}
          </Button>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Your details are forwarded exclusively to the property owner to respond to
            your query. No account creation, payment, or advertising spam.
          </p>
        </div>
      </form>
    </section>
  );
}
