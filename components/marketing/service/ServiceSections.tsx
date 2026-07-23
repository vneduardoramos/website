/**
 * Presentational building blocks for the service detail page. Each takes an
 * already-parsed slice of the service body (see lib/service-content.ts) plus the
 * label strings it needs, so the page stays a thin server component and these
 * pieces carry the layout. All server-rendered; the FAQ uses a native <details>
 * disclosure (no client JS).
 */
import { Link } from "@/i18n/navigation";
import { Markdown } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { DeliverItem, Faq } from "@/lib/service-content";

/** Small check glyph, matching the industry deliverables treatment. `accent`
 *  is a full Tailwind text-color class so the mark can carry the service hue. */
function Check({ accent = "text-primaryDeep" }: { accent?: string }) {
  return (
    <span className={cn("mt-0.5 shrink-0", accent)} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l4 4 10-11" />
      </svg>
    </span>
  );
}

/**
 * Deliverables. "cards" mode (bullets with a bold lead-in) renders titled cards;
 * "list" mode (plain bullets) renders an elegant two-column checklist. Inline
 * links in the item body are preserved via <Markdown>.
 */
export function DeliverableGrid({
  items,
  mode,
  accent = "text-primaryDeep",
}: {
  items: DeliverItem[];
  mode: "cards" | "list";
  /** Full text-color class for the check marks (the service accent). */
  accent?: string;
}) {
  if (mode === "cards") {
    return (
      <div className="grid gap-5 md:auto-rows-fr md:grid-cols-2">
        {items.map((it, i) => (
          <div key={i} className="card card-hover flex gap-4">
            <Check accent={accent} />
            <div className="min-w-0">
              {it.term && (
                <h3 className="font-display text-lg font-bold text-foreground">{it.term}</h3>
              )}
              <div className="mt-1.5 text-sm leading-relaxed [&_p]:mb-0">
                <Markdown>{it.body}</Markdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <Check accent={accent} />
          <div className="text-[0.95rem] leading-relaxed text-muted [&_p]:mb-0">
            <Markdown>{it.body}</Markdown>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The engagement mechanism as a numbered flow. Numbering is honest here: this
 * is a genuine sequence (discovery -> sprints -> proof -> keep), unlike the rest
 * of the page. Hairline separators via a gap-px grid over the border color.
 */
export function EngagementFlow({
  steps,
}: {
  steps: { label: string; title: string; body: string }[];
}) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <li key={s.label} className="flex flex-col bg-surface p-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primaryDeep">
            {s.label}
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * FAQ accordion, native <details> disclosures with a + that rotates to x on
 * open (pure CSS). Answers keep their inline links.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-4">
      {items.map((f) => (
        <details key={f.q} className="card group">
          <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-bold text-foreground">
            {f.q}
            <span className="ml-4 text-2xl text-primary transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="mt-4 text-muted [&_p:last-child]:mb-0">
            <Markdown>{f.a}</Markdown>
          </div>
        </details>
      ))}
    </div>
  );
}

/**
 * The nearshore differentiator, rendered in the site's single dark authority
 * band (panel-indigo). This is the page's one bold moment; everything around it
 * stays light and quiet. Prose is inverted for the dark ground.
 */
export function NearshoreBand({
  eyebrow,
  heading,
  locator,
  body,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  heading: string;
  locator: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-soft md:p-12">
      <div className="relative max-w-2xl">
        <p className="eyebrow eyebrow--invert mb-4">{eyebrow}</p>
        <h2 className="text-balance font-display text-3xl font-bold leading-tight text-white md:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-white/55">
          {locator}
        </p>
        <div className="mt-6 leading-relaxed [&_a]:font-semibold [&_a]:!text-white [&_a]:underline [&_a]:underline-offset-4 [&_p]:mb-4 [&_p]:text-white/85 [&_p:last-child]:mb-0 [&_strong]:text-white">
          <Markdown>{body}</Markdown>
        </div>
        <Link href={ctaHref} className="btn-light mt-8 inline-flex">
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/** "At a glance" spec card beside the opening standfirst. */
export function AtAGlance({
  eyebrow,
  facts,
  stackLabel,
  tools,
}: {
  eyebrow: string;
  facts: { label: string; value: string }[];
  stackLabel: string;
  tools: string[];
}) {
  return (
    <aside className="cut-card p-6">
      <p className="eyebrow mb-5">{eyebrow}</p>
      <dl className="space-y-4">
        {facts.map((f) => (
          <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-dotted border-primary/30 pb-4 last:border-0 last:pb-0">
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">{f.label}</dt>
            <dd className="text-right font-display text-sm font-bold text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
      {tools.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">{stackLabel}</p>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool} className="pill-chip">{tool}</span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
