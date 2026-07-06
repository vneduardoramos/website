import { cn } from "@/lib/utils";
import { LedgerCard } from "@/components/marketing/Cards";
import type { Benefit } from "@/lib/benefits";

/**
 * Benefits as ledger lines: each card carries a short eyebrow label and its
 * running index. Shared by /life-at-viewnear and the careers pages.
 */
export function BenefitsGrid({ items, className }: { items: Benefit[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 md:auto-rows-fr lg:grid-cols-3",
        className,
      )}
    >
      {items.map((b, i) => (
        <LedgerCard
          key={b.title}
          eyebrow={b.label}
          index={String(i + 1).padStart(2, "0")}
          title={b.title}
        >
          {b.body}
        </LedgerCard>
      ))}
    </div>
  );
}
