/**
 * The two house card primitives (from the card studies, picks 03 + 04),
 * used alternately across the site: PlateCard for process/spec grids,
 * LedgerCard for offers and lists. Both carry an eyebrow; neither uses
 * icon tiles, colored rails, or lift-on-hover.
 */
import { SnowMark } from "@/components/marketing/SnowMark";

/** 03 · Plate: flat, square, blueprint registration ticks in the corners,
 *  eyebrow set as a spec line (label left, reference code right). Set `stamp`
 *  on platform-native plates for a faint corner Snowflake cue. */
export function PlateCard({
  label,
  refCode,
  title,
  stamp = false,
  children,
}: {
  label: string;
  refCode?: string;
  title: string;
  stamp?: boolean;
  children: React.ReactNode;
}) {
  const tick = "pointer-events-none absolute h-2 w-2 border-primaryDeep opacity-50 transition-opacity duration-300 group-hover:opacity-100";
  return (
    <div className="group relative h-full overflow-hidden border border-border bg-surface p-6">
      <span aria-hidden className={`${tick} left-1.5 top-1.5 border-l-[1.5px] border-t-[1.5px]`} />
      <span aria-hidden className={`${tick} right-1.5 top-1.5 border-r-[1.5px] border-t-[1.5px]`} />
      <span aria-hidden className={`${tick} bottom-1.5 left-1.5 border-b-[1.5px] border-l-[1.5px]`} />
      <span aria-hidden className={`${tick} bottom-1.5 right-1.5 border-b-[1.5px] border-r-[1.5px]`} />
      {stamp && <SnowMark size={44} className="pointer-events-none absolute -bottom-2 -right-2 opacity-[0.07]" />}
      <div className="flex items-baseline justify-between gap-3 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em]">
        <span className="text-primaryDeep">{label}</span>
        {refCode && <span className="font-normal text-muted">{refCode}</span>}
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-foreground">{title}</h3>
      <div className="relative mt-2 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

/** 04 · Ledger line: index-card stationery with dotted rules, eyebrow and
 *  index on the top line, an optional mono footnote row that wakes on hover. */
export function LedgerCard({
  eyebrow,
  index,
  title,
  foot,
  children,
}: {
  eyebrow: string;
  index?: string;
  title?: string;
  foot?: [string, string];
  children: React.ReactNode;
}) {
  return (
    <div className="group flex h-full flex-col rounded-[10px] border border-border bg-background px-5 pb-4 pt-4">
      <div className="flex items-baseline justify-between gap-3 border-b border-dotted border-primary/40 pb-3">
        <span className="eyebrow">{eyebrow}</span>
        {index && <span className="font-mono text-xs text-muted">№ {index}</span>}
      </div>
      {title && <h3 className="mt-3.5 font-display text-lg font-bold text-foreground">{title}</h3>}
      <div className={`${title ? "mt-2" : "mt-3.5"} flex-1 text-sm leading-relaxed text-muted`}>
        {children}
      </div>
      {foot && (
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-dotted border-primary/40 pt-2.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted transition-colors duration-300 group-hover:text-primaryDeep">
          <span className="whitespace-nowrap">{foot[0]}</span>
          <span className="text-right">{foot[1]}</span>
        </div>
      )}
    </div>
  );
}
