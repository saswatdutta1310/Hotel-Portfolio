import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { Hotel } from "@/lib/types";
import { buildTelLink, buildWhatsAppLink } from "@/lib/contact-links";
import { buttonVariants } from "@/components/ui/button";

interface HeroProps {
  hotel: Hotel;
}

export function Hero({ hotel }: HeroProps) {
  const telLink = buildTelLink(hotel.contact.phone);
  const waLink = buildWhatsAppLink(hotel.contact.whatsapp, hotel.name);
  const heroImageSrc =
    hotel.heroImage || (hotel.gallery && hotel.gallery[0]?.src) || "/hotels/sample-hotel/hero.svg";

  return (
    <section className="relative w-full border-b border-border bg-card">
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-muted">
        <Image
          src={heroImageSrc}
          alt={`${hotel.name} hero view`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white max-w-5xl mx-auto">
          <span className="text-sm font-medium tracking-wide uppercase text-white/80">
            {hotel.address.city}, {hotel.address.state}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-1">
            {hotel.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
            {hotel.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
        {telLink && (
          <Link
            href={telLink}
            className={buttonVariants({ variant: "default" })}
            aria-label={`Call ${hotel.name}`}
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>Call</span>
          </Link>
        )}
        {waLink && (
          <Link
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
            aria-label={`Message ${hotel.name} on WhatsApp`}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>WhatsApp</span>
          </Link>
        )}
      </div>
    </section>
  );
}
