import { cn } from "@/lib/utils";

// The agentic "control plane" as equal-height cards, from the governed data
// foundation up to action. Each layer carries an accent top-border; the grid
// uses auto-rows-fr so every card in a row is the same height.
const LAYERS = [
  {
    name: "Data foundation",
    body: "One governed copy of your enterprise data: structured, semi-structured, and unstructured.",
    accent: "border-t-royal",
  },
  {
    name: "Governance",
    body: "Access, masking, lineage, and policy with Horizon Catalog: from who can see what to what agents can do.",
    accent: "border-t-primaryDeep",
  },
  {
    name: "Business context",
    body: "Semantic Views and Horizon Context, so AI reasons from your real definitions, not guesses.",
    accent: "border-t-secondary",
  },
  {
    name: "Models",
    body: "Model choice through Cortex: the right model for each workload, run next to the data.",
    accent: "border-t-purple",
  },
  {
    name: "Agents",
    body: "Governed agents (Snowflake CoWork, Snowflake CoCo) with verifiable identity and audit trails.",
    accent: "border-t-accent",
  },
  {
    name: "Action",
    body: "Insight connected to the workflows and systems where work actually happens.",
    accent: "border-t-success",
  },
];

export function ControlPlane({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 md:auto-rows-fr lg:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <div
            key={layer.name}
            className={cn("card card-hover flex h-full flex-col border-t-4", layer.accent)}
          >
            <span className="font-mono text-xs tabular-nums text-muted">
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
