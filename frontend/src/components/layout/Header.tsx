import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs">
      <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Hotel Portfolio
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/hotels"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Hotels
          </Link>
        </nav>
      </div>
    </header>
  );
}
