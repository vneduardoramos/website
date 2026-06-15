// The agentic "control plane" as a layered stack, from the governed data
// foundation up to action. Sourced from the agentic-enterprise thesis; each
// layer pairs a capability with the governance that makes it safe.
const LAYERS = [
  {
    name: "Data foundation",
    body: "One governed copy of your enterprise data: structured, semi-structured, and unstructured.",
    rail: "border-l-royal",
  },
  {
    name: "Governance",
    body: "Access, masking, lineage, and policy with Horizon Catalog: from who can see what to what agents can do.",
    rail: "border-l-primaryDeep",
  },
  {
    name: "Business context",
    body: "Semantic Views and Horizon Context, so AI reasons from your real definitions, not guesses.",
    rail: "border-l-secondary",
  },
  {
    name: "Models",
    body: "Model choice through Cortex: the right model for each workload, run next to the data.",
    rail: "border-l-purple",
  },
  {
    name: "Agents",
    body: "Governed agents (Snowflake CoWork, Snowflake CoCo) with verifiable identity and audit trails.",
    rail: "border-l-accent",
  },
  {
    name: "Action",
    body: "Insight connected to the workflows and systems where work actually happens.",
    rail: "border-l-success",
  },
];

export function ControlPlane({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ol className="space-y-2.5">
        {LAYERS.map((layer, i) => (
          <li
            key={layer.name}
            className={`flex items-start gap-4 rounded-xl border border-border border-l-4 ${layer.rail} bg-background px-5 py-4 shadow-soft`}
          >
            <span className="mt-0.5 font-mono text-xs tabular-nums text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-foreground">{layer.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{layer.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-primaryDeep">
        One governed control plane, across every layer
      </p>
    </div>
  );
}
