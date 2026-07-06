"use client";

import { RevealGroup, useStepThresholds } from "@/components/marketing/Motion";
import { cn } from "@/lib/utils";

export type Status = "GA" | "Public Preview" | "Private Preview" | "Preview";
export type Product = { name: string; status: Status; desc: string };
export type Layer = { layer: string; blurb: string; products: Product[] };

function StatusTag({ status, active }: { status: Status; active: boolean }) {
  const cls =
    status === "GA"
      ? "bg-success/15 text-success"
      : status === "Public Preview"
      ? "bg-primary/15 text-primaryDeep"
      : "bg-amber/15 text-amber";
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        cls,
        active && "node-active",
      )}
    >
      {status}
    </span>
  );
}

/**
 * One layer of the platform stack. Owns its own scroll engine so the layer
 * triggers as it enters view: a faint surface panel "fills" bottom→top via the
 * inherited `--progress` (.layer-fill), the product cards pop in (RevealGroup),
 * and each status badge gets the one-time cyan settle glow once active.
 */
function LayerCard({ layer }: { layer: Layer }) {
  const { ref, activeUpTo } = useStepThresholds<HTMLDivElement>(1, {
    start: 0.92,
    end: 0.6,
  });
  const active = activeUpTo >= 1;

  return (
    <div ref={ref} className="card relative isolate flex h-full flex-col overflow-hidden">
      {/* Decorative assemble panel, fills bottom→top as the layer enters view. */}
      <div
        aria-hidden
        className="layer-fill pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-secondary/45 bg-secondary/10 shadow-[inset_0_2px_0_rgb(var(--color-secondary)/0.4)]"
      />
      <h3 className="font-display text-xl font-bold text-foreground">{layer.layer}</h3>
      <p className="mt-2 text-sm text-muted">{layer.blurb}</p>
      <RevealGroup
        as="ul"
        variant="pop"
        className="mt-5 space-y-4 border-t border-border pt-5"
      >
        {layer.products.map((p) => (
          <li key={p.name}>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-foreground">{p.name}</span>
              <StatusTag status={p.status} active={active} />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
          </li>
        ))}
      </RevealGroup>
    </div>
  );
}

/**
 * "Platform assembles layer by layer" set-piece. Renders each layer in the grid;
 * every layer carries its own scroll trigger, so the stagger reads naturally as
 * the user scrolls. No sticky pins. Fully open under reduced motion / mobile
 * (the shared primitives + globals.css guards handle that).
 */
export function PlatformStack({ layers }: { layers: Layer[] }) {
  return (
    <div className="mt-12 grid items-start gap-6 md:grid-cols-2">
      {layers.map((l) => (
        <LayerCard key={l.layer} layer={l} />
      ))}
    </div>
  );
}
