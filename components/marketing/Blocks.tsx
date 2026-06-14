import Link from "next/link";
import { RevealGroup } from "@/components/marketing/Motion";
import { StatCounter } from "@/components/marketing/StatCounter";

const EDGE_FADE =
  "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

/** Horizontal "trusted by" marquee of monochrome client names, pause on hover. */
export function LogoStrip({
  label = "Trusted by data-driven teams across the Americas",
  items,
}: {
  label?: string;
  items: string[];
}) {
  const doubled = [...items, ...items];
  return (
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <div
        className="group relative mt-7 overflow-hidden"
        style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
      >
        <div className="flex w-max animate-marquee items-center gap-x-12 group-hover:[animation-play-state:paused]">
          {doubled.map((name, i) => (
            <span
              key={i}
              aria-hidden={i >= items.length}
              className="whitespace-nowrap font-display text-lg font-bold text-foreground/30 transition-colors hover:text-foreground/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Metric / outcome band: big numbers with labels. */
export function MetricBand({
  metrics,
}: {
  metrics: { value: string; label: string }[];
}) {
  return (
    <RevealGroup className="grid grid-cols-2 gap-8 md:grid-cols-4" variant="pop">
      {metrics.map((m) => (
        <StatCounter
          key={m.label}
          value={m.value}
          label={m.label}
          valueClassName="text-gradient-bold font-display text-4xl font-bold md:text-5xl"
        />
      ))}
    </RevealGroup>
  );
}

/** Compact CTA row used inside sections. */
export function InlineCta({
  title,
  href = "/contact",
  label = "Get in touch",
}: {
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row">
      <p className="font-display text-lg font-bold text-foreground">{title}</p>
      <Link href={href} className="btn-primary group shrink-0">
        {label}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
}
