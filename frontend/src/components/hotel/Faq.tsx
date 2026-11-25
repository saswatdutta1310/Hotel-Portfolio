import { HelpCircle } from "lucide-react";
import { Faq } from "@/lib/types";

interface FaqProps {
  faqs: Faq[];
}

export function FaqSection({ faqs }: FaqProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="scroll-mt-20 py-8 border-t border-border">
      <div className="pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Helpful answers to common questions about reservations, policies, and amenities.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group rounded-lg border border-border bg-card p-4 transition-colors open:bg-card/80 focus-within:ring-2 focus-within:ring-ring focus-within:outline-hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-sm sm:text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 select-none">
              <span className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{faq.question}</span>
              </span>
              <span className="ml-4 flex h-6 w-6 items-center justify-center text-muted-foreground transition-transform duration-200 group-open:rotate-180">
                ↓
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-border/60 text-sm text-muted-foreground leading-relaxed pl-6">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
