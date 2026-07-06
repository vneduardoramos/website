import type { Layer } from "@/components/marketing/platform/PlatformStack";
import { RevealGroup } from "@/components/marketing/Motion";

/**
 * The stack, drawn as a stack: sources flow in at the top, down through the
 * five product layers, and out as decisions at the bottom, with governance as
 * a full-height rail wrapping every layer (that is the real architecture:
 * Horizon spans the stack; it is not a sixth box). Pure JSX + tokens, no
 * images; sequence reveal via the existing Motion primitives.
 */

const ENTRY = ["ERP", "CRM", "SaaS", "Files", "Streams"];
const EXIT = ["Dashboards", "Answers", "Agents", "Apps"];

// One Glacier hue per layer band (full static classes for the JIT).
const BAR = ["bg-primary", "bg-secondary", "bg-royal", "bg-gold", "bg-accent"];

function StatusDot({ status }: { status: string }) {
  const ga = status === "GA";
  return (
    <span
      aria-label={ga ? "Generally available" : status}
      title={status}
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${ga ? "bg-success" : "bg-warning"}`}
    />
  );
}

function Connector() {
  return (
    <div aria-hidden className="flex justify-center py-1">
      <span className="h-5 w-px bg-gradient-to-b from-primary/60 to-primary/15" />
    </div>
  );
}

function ChipRow({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="mr-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {items.map((c) => (
        <span
          key={c}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

function LayerBand({ layer, bar }: { layer: Layer; bar: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <div className="grid gap-3 p-5 pl-6 md:grid-cols-[240px_1fr] md:items-center md:gap-6">
        <div>
          <h3 className="font-display text-base font-bold text-foreground">{layer.layer}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{layer.blurb}</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {layer.products.map((p) => (
            <li
              key={p.name}
              title={p.desc}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground/90"
            >
              <StatusDot status={p.status} />
              {p.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GovernanceRail({ rail }: { rail: Layer }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-primaryDeep/25 bg-primaryDeep/5 p-5">
      <h3 className="font-display text-base font-bold text-primaryDeep">{rail.layer}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{rail.blurb}</p>
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-2">
        {rail.products.map((p) => (
          <li
            key={p.name}
            title={p.desc}
            className="inline-flex items-center gap-2 rounded-lg border border-primaryDeep/20 bg-background px-3 py-1.5 font-mono text-xs text-foreground/90"
          >
            <StatusDot status={p.status} />
            {p.name}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-primaryDeep/70">
        Wraps every layer
      </p>
    </div>
  );
}

export function StackDiagram({ flow, rail }: { flow: Layer[]; rail: Layer }) {
  return (
    <div className="mt-12 rounded-3xl border border-border bg-surface p-4 md:p-6">
      <ChipRow items={ENTRY} label="Your systems in" />
      <Connector />

      <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
        {/* The flow column: five connected layers, top to bottom */}
        <RevealGroup variant="fade-up" className="flex flex-col">
          {flow.map((layer, i) => (
            <div key={layer.layer}>
              {i > 0 && <Connector />}
              <LayerBand layer={layer} bar={BAR[i % BAR.length]} />
            </div>
          ))}
        </RevealGroup>

        {/* Governance hugs the whole stack (below it on mobile) */}
        <GovernanceRail rail={rail} />
      </div>

      <Connector />
      <ChipRow items={EXIT} label="Decisions out" />

      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-4">
        <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Generally available
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Preview: early access through the partnership
        </span>
      </div>
    </div>
  );
}

/** Typographic product index: every product's one-liner, no cards. */
export function ProductIndex({ layers }: { layers: Layer[] }) {
  return (
    <dl className="mt-14 columns-1 gap-10 md:columns-2">
      {layers.map((layer) => (
        <div key={layer.layer} className="mb-8 break-inside-avoid">
          <dt className="border-b border-border pb-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
            {layer.layer}
          </dt>
          {layer.products.map((p) => (
            <dd key={p.name} className="mt-3 text-sm leading-relaxed text-muted">
              <span className="font-semibold text-foreground">{p.name}</span>
              {p.status !== "GA" && (
                <span className="ml-2 align-middle font-mono text-[0.6rem] uppercase tracking-wider text-warning">
                  {p.status}
                </span>
              )}{" "}
              &middot; {p.desc}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}
