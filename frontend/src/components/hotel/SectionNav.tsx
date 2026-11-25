interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  items: SectionNavItem[];
}

export function SectionNav({ items }: SectionNavProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Hotel sections navigation"
      className="sticky top-16 z-30 w-full border-b border-border bg-background/95 backdrop-blur-xs"
    >
      <div className="max-w-5xl mx-auto px-6 overflow-x-auto scrollbar-none py-2.5">
        <ul className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="inline-block rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-2 focus-visible:outline-ring"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
