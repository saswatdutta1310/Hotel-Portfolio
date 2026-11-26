import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hotel Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HotelNotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Hotel Not Found
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        We could not find the hotel or guest house you requested.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="/hotels"
          className={buttonVariants({ variant: "default" })}
        >
          Browse Hotel Directory
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline" })}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
