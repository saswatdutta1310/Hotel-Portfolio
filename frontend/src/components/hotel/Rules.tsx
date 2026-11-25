import { Clock, ShieldAlert } from "lucide-react";

interface RulesProps {
  checkIn: string;
  checkOut: string;
  houseRules: string[];
}

export function Rules({ checkIn, checkOut, houseRules }: RulesProps) {
  const hasRules = houseRules && houseRules.length > 0;
  const hasTimes = Boolean(checkIn || checkOut);

  if (!hasRules && !hasTimes) {
    return null;
  }

  return (
    <section id="rules" className="scroll-mt-20 py-8 border-t border-border">
      <div className="pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Property Rules &amp; Policies
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Important timings and stay guidelines to ensure a pleasant experience for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hasTimes && (
          <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Timings</h3>
            </div>
            <dl className="space-y-3 text-sm">
              {checkIn && (
                <div className="flex justify-between items-baseline border-b border-border pb-2">
                  <dt className="text-muted-foreground">Check-in</dt>
                  <dd className="font-medium text-foreground">{checkIn}</dd>
                </div>
              )}
              {checkOut && (
                <div className="flex justify-between items-baseline pt-1">
                  <dt className="text-muted-foreground">Check-out</dt>
                  <dd className="font-medium text-foreground">{checkOut}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {hasRules && (
          <div className={`rounded-lg border border-border bg-card p-5 shadow-xs ${hasTimes ? "md:col-span-2" : "md:col-span-3"}`}>
            <div className="flex items-center gap-2 mb-4 text-foreground">
              <ShieldAlert className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">House Guidelines</h3>
            </div>
            <ul className="space-y-2.5">
              {houseRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground shrink-0 mt-2" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
