import type { CSSProperties } from "react";

// The agentic "control plane" as equal-height cards, from the governed data
// foundation up to action. Cards use the brand cut-corner motif (.cut-card)
// with a per-layer accent set via --eyebrow-accent.
const LAYERS = [
  {
    name: "Data foundation",
    body: "One governed copy of your enterprise data: structured, semi-structured, and unstructured.",
    accent: "var(--color-royal)",
  },
  {
    name: "Governance",
    body: "Access, masking, lineage, and policy with Horizon Catalog: from who can see what to what agents can do.",
    accent: "var(--color-primary-deep)",
  },
  {
    name: "Business context",
    body: "Semantic Views and Horizon Context, so AI reasons from your real definitions, not guesses.",
    accent: "var(--color-secondary)",
  },
  {
    name: "Models",
    body: "Model choice through Cortex: the right model for each workload, run next to the data.",
    accent: "var(--color-purple)",
  },
  {
    name: "Agents",
    body: "Governed agents (Snowflake CoWork, Snowflake CoCo) with verifiable identity and audit trails.",
    accent: "var(--color-accent)",
  },
  {
    name: "Action",
    body: "Insight connected to the workflows and systems where work actually happens.",
    accent: "var(--color-success)",
  },
];

export function ControlPlane({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 md:auto-rows-fr lg:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <div
            key={layer.name}
            className="cut-card flex h-full flex-col p-5"
            style={{ "--eyebrow-accent": layer.accent } as CSSProperties}
          >
            <span
              className="font-mono text-xs font-semibold tabular-nums"
              style={{ color: "rgb(var(--eyebrow-accent))" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-base font-bold text-foreground">{layer.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{layer.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">
        One governed control plane, across every layer
      </p>
    </div>
  );
}
