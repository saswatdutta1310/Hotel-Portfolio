export interface EnquiryFormInput {
  hotelSlug: string;
  name: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
  website: string;
}

export type EnquiryFormErrors = Partial<Record<keyof EnquiryFormInput, string>>;

export interface ValidationResult {
  isValid: boolean;
  errors: EnquiryFormErrors;
  firstErrorField?: keyof EnquiryFormInput;
}

const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates enquiry form inputs matching docs/api-contract.md rules:
 * - hotelSlug: required, kebab-case
 * - name: required, 2 to 80 chars after trimming
 * - phone: optional, 7 to 20 chars, digits/spaces/+/-/() only
 * - email: optional, valid email, max 120 chars
 * - At least one of phone or email is required
 * - checkIn: optional, YYYY-MM-DD, not in the past
 * - checkOut: optional, YYYY-MM-DD, after checkIn; if checkOut is sent, checkIn is required
 * - guests: optional, integer between 1 and 20
 * - message: optional, max 1000 characters
 * - website: honeypot field
 */
export function validateEnquiryForm(
  data: EnquiryFormInput,
  todayStr?: string
): ValidationResult {
  const errors: EnquiryFormErrors = {};
  const today = todayStr || new Date().toISOString().split("T")[0];

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (trimmedName.length < 2 || trimmedName.length > 80) {
    errors.name = "Name must be between 2 and 80 characters.";
  }

  const trimmedPhone = data.phone.trim();
  const trimmedEmail = data.email.trim();

  if (!trimmedPhone && !trimmedEmail) {
    errors.phone = "Please provide at least a phone number or email address.";
    errors.email = "Please provide at least a phone number or email address.";
  } else {
    if (trimmedPhone) {
      if (!PHONE_REGEX.test(trimmedPhone)) {
        errors.phone = "Phone must be 7 to 20 characters and contain only numbers, +, -, () and spaces.";
      }
    }
    if (trimmedEmail) {
      if (trimmedEmail.length > 120 || !EMAIL_REGEX.test(trimmedEmail)) {
        errors.email = "Please enter a valid email address (maximum 120 characters).";
      }
    }
  }

  const trimmedCheckIn = data.checkIn.trim();
  const trimmedCheckOut = data.checkOut.trim();

  if (trimmedCheckIn) {
    if (!DATE_REGEX.test(trimmedCheckIn) || isNaN(Date.parse(trimmedCheckIn))) {
      errors.checkIn = "Check-in date must be in YYYY-MM-DD format.";
    } else if (trimmedCheckIn < today) {
      errors.checkIn = "Check-in date cannot be in the past.";
    }
  }

  if (trimmedCheckOut) {
    if (!trimmedCheckIn) {
      errors.checkOut = "Check-in date is required if check-out date is selected.";
    } else if (!DATE_REGEX.test(trimmedCheckOut) || isNaN(Date.parse(trimmedCheckOut))) {
      errors.checkOut = "Check-out date must be in YYYY-MM-DD format.";
    } else if (trimmedCheckOut <= trimmedCheckIn) {
      errors.checkOut = "Check-out date must be after check-in date.";
    }
  }

  const trimmedGuests = data.guests.trim();
  if (trimmedGuests) {
    const parsedGuests = Number(trimmedGuests);
    if (!Number.isInteger(parsedGuests) || parsedGuests < 1 || parsedGuests > 20) {
      errors.guests = "Number of guests must be between 1 and 20.";
    }
  }

  const trimmedMessage = data.message.trim();
  if (trimmedMessage.length > 1000) {
    errors.message = "Message must not exceed 1000 characters.";
  }

  const fieldOrder: Array<keyof EnquiryFormInput> = [
    "name",
    "phone",
    "email",
    "checkIn",
    "checkOut",
    "guests",
    "message",
    "website",
  ];

  const firstErrorField = fieldOrder.find((field) => errors[field]);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorField,
  };
}

/**
 * Maps HTTP status codes to user-friendly messages without exposing raw server internals.
 */
export function getEnquiryErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Please review your enquiry details and ensure all required fields are correctly filled.";
    case 404:
      return "The requested hotel could not be found. Please refresh and try again.";
    case 413:
      return "Your enquiry message is too large. Please shorten your message and try again.";
    case 429:
      return "Too many enquiries sent from your location. Please wait an hour before submitting again.";
    case 502:
      return "Unable to deliver your enquiry right now. Please try calling or messaging the host directly.";
    default:
      return "Something went wrong while sending your enquiry. Please try again shortly or contact the hotel directly.";
  }
}
