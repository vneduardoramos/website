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

function LayerBand({ layer }: { layer: Layer }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <div className="grid gap-3 p-5 md:grid-cols-[240px_1fr] md:items-center md:gap-6">
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
              <LayerBand layer={layer} />
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

/** The parts list as one continuous board: a fixed label column and uniform
 *  hairline rows, so every group shares the same rhythm (no masonry, no
 *  uneven columns). Mirrors the migrations sources board. */
export function ProductIndex({ layers }: { layers: Layer[] }) {
  return (
    <div className="mt-12 rounded-3xl border border-border bg-surface">
      {layers.map((layer, i) => (
        <div
          key={layer.layer}
          className={`grid gap-4 p-6 md:grid-cols-[230px_1fr] md:gap-8 md:px-8 ${i > 0 ? "border-t border-border" : ""}`}
        >
          <div>
            <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
              {layer.layer}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{layer.blurb}</p>
          </div>
          <ul className="divide-y divide-border">
            {layer.products.map((p) => (
              <li
                key={p.name}
                className="grid gap-1 py-3 first:pt-0 last:pb-0 md:grid-cols-[220px_1fr] md:items-baseline md:gap-6"
              >
                <span className="flex items-baseline gap-2 font-mono text-sm text-foreground">
                  <StatusDot status={p.status} />
                  {p.name}
                </span>
                <span className="text-sm leading-relaxed text-muted">
                  {p.desc}
                  {p.status !== "GA" && (
                    <span className="ml-2 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-wider text-warning">
                      {p.status}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
