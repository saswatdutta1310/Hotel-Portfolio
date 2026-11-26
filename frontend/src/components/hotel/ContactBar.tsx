"use client";

import Link from "next/link";
import { Phone, MessageCircle, Send } from "lucide-react";
import { Contact } from "@/lib/types";
import { buildTelLink, buildWhatsAppLink } from "@/lib/contact-links";

interface ContactBarProps {
  contact: Contact;
  hotelName: string;
}

export function ContactBar({ contact, hotelName }: ContactBarProps) {
  const telLink = buildTelLink(contact.phone);
  const waLink = buildWhatsAppLink(contact.whatsapp, hotelName);

  const scrollToEnquiry = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const enquiryEl = document.getElementById("enquiry");
    if (enquiryEl) {
      e.preventDefault();
      enquiryEl.scrollIntoView({ behavior: "smooth" });
      const firstInput = enquiryEl.querySelector<HTMLElement>("input, textarea");
      firstInput?.focus();
    }
  };

  return (
    <div
      role="region"
      aria-label="Quick contact actions"
      className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-2.5 shadow-lg"
    >
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {telLink && (
          <Link
            href={telLink}
            aria-label={`Call ${hotelName}`}
            className="flex-1 flex items-center justify-center gap-1.5 h-11 min-h-[44px] rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold px-3 transition-colors hover:bg-secondary/80 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>Call</span>
          </Link>
        )}

        {waLink && (
          <Link
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Message ${hotelName} on WhatsApp`}
            className="flex-1 flex items-center justify-center gap-1.5 h-11 min-h-[44px] rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold px-3 transition-colors hover:bg-secondary/80 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>WhatsApp</span>
          </Link>
        )}

        <a
          href="#enquiry"
          onClick={scrollToEnquiry}
          aria-label="Scroll to enquiry form"
          className="flex-1 flex items-center justify-center gap-1.5 h-11 min-h-[44px] rounded-lg bg-primary text-primary-foreground text-xs font-semibold px-3 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Send className="h-4 w-4 shrink-0" />
          <span>Enquire</span>
        </a>
      </div>
    </div>
  );
}
