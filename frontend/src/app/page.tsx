import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Find your next serene stay
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Explore curated boutique hotels and guest houses. Discover quiet locations,
          room amenities, check-in details, and connect directly with hosts.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/hotels"
            className={buttonVariants({ variant: "default" })}
          >
            Explore Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
