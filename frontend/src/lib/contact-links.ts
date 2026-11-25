/**
 * Strips non-digit characters except leading '+' for standard international phone dialing.
 */
function sanitizePhoneNumber(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) {
    return "+" + trimmed.slice(1).replace(/\D/g, "");
  }
  return trimmed.replace(/\D/g, "");
}

function isValidValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.toUpperCase() !== "TODO";
}

/**
 * Builds a tel: link, stripping spaces, dashes, parentheses and symbols.
 * Returns null if the phone is missing, empty, or "TODO".
 */
export function buildTelLink(phone: string | undefined | null): string | null {
  if (!isValidValue(phone)) {
    return null;
  }
  const sanitized = sanitizePhoneNumber(phone!);
  if (!sanitized || sanitized === "+") {
    return null;
  }
  return `tel:${sanitized}`;
}

/**
 * Builds a WhatsApp wa.me link with a pre-filled enquiry message.
 * Strips symbols and leading '+' for WhatsApp URL convention (wa.me numbers must be digits only).
 * Returns null if the phone is missing, empty, or "TODO".
 */
export function buildWhatsAppLink(
  whatsapp: string | undefined | null,
  hotelName: string
): string | null {
  if (!isValidValue(whatsapp)) {
    return null;
  }
  const cleanDigits = whatsapp!.replace(/\D/g, "");
  if (!cleanDigits) {
    return null;
  }
  const text = encodeURIComponent(`Hi, I would like to enquire about a stay at ${hotelName}.`);
  return `https://wa.me/${cleanDigits}?text=${text}`;
}

/**
 * Builds a mailto: link.
 * Returns null if the email is missing, empty, or "TODO".
 */
export function buildMailtoLink(
  email: string | undefined | null,
  hotelName?: string
): string | null {
  if (!isValidValue(email)) {
    return null;
  }
  const trimmed = email!.trim();
  if (!hotelName) {
    return `mailto:${trimmed}`;
  }
  const subject = encodeURIComponent(`Enquiry - ${hotelName}`);
  return `mailto:${trimmed}?subject=${subject}`;
}
