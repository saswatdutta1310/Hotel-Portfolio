import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        404
      </h1>
      <p className="mt-2 text-xl font-semibold text-foreground">
        Page Not Found
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        The page or resource you are looking for could not be found.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className={buttonVariants({ variant: "default" })}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
