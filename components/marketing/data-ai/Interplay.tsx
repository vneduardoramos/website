import { SnowMark } from "@/components/marketing/SnowMark";
import { AnthropicMark } from "@/components/marketing/ProviderMark";
import { RevealGroup, Reveal } from "@/components/marketing/Motion";

/**
 * The page's thesis, shown as a diagram + a worked loop: agents run on two
 * planes that interplay. Inside Snowflake, they reason over governed data
 * without moving it; in the flow of work, Claude takes the next action where
 * teams already are. One identity, governed endpoints, and MCP connect them, so
 * a request can cross both planes and come back cited and logged.
 */

const INSIDE = {
  role: "Reason over governed data, without moving it",
  items: [
    "Cortex agents + AISQL, next to the data",
    "Semantic Views: one shared definition of every metric",
    "Cortex Analyst + Search for cited answers",
    "AI Agent Identity: per-agent access, full lineage",
  ],
};

const OUTSIDE = {
  role: "Take the next action where teams already work",
  items: [
    "Claude in Slack, docs, and the browser",
    "Claude Code in the engineering workflow",
    "Answers + actions back inside the ERP, CRM, and apps",
    "Custom agents on governed endpoints",
  ],
};

// What lets the two planes talk. MCP is Anthropic's open protocol; the other
// two are the governance that has to span both.
const CONNECT = [
  { term: "One identity", desc: "Every agent, inside or out, acts as a governed identity with per-agent permissions." },
  { term: "Governed endpoints", desc: "The business exposes data as endpoints agents call, never raw copies they hold." },
  { term: "MCP", desc: "Anthropic's open protocol connects Claude to governed data and the tools teams use." },
];

// A single request crossing both planes, so "interplay" reads concretely.
const LOOP = [
  { plane: "out", text: "A rep asks Claude in Slack which accounts are at risk." },
  { plane: "in", text: "Claude calls a governed endpoint; Cortex answers from Semantic Views, with citations." },
  { plane: "out", text: "Claude drafts the outreach in the rep's inbox, inside policy." },
  { plane: "in", text: "The whole exchange is logged against one identity and lineage." },
];

function Plane({
  kind,
  label,
  role,
  items,
}: {
  kind: "in" | "out";
  label: string;
  role: string;
  items: string[];
}) {
  return (
    <div className="card flex h-full flex-col">
      <div className="flex items-center gap-2.5">
        {kind === "in" ? (
          <SnowMark size={20} />
        ) : (
          <AnthropicMark size={20} />
        )}
        <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
          {label}
        </p>
      </div>
      <p className="mt-3 font-display text-lg font-bold text-foreground">{role}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Interplay() {
  return (
    <div>
      {/* Two planes, with the connective tissue named between them */}
      <div className="grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
        <Reveal>
          <Plane kind="in" label="Inside Snowflake" role={INSIDE.role} items={INSIDE.items} />
        </Reveal>

        {/* Connector: bidirectional, the interplay made literal */}
        <Reveal
          delay={90}
          className="flex flex-row items-center justify-center gap-2 md:flex-col"
        >
          <span aria-hidden className="font-mono text-lg text-primary md:rotate-90">
            &harr;
          </span>
          <span className="whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted md:[writing-mode:vertical-rl]">
            interplay
          </span>
        </Reveal>

        <Reveal delay={150}>
          <Plane kind="out" label="In the flow of work" role={OUTSIDE.role} items={OUTSIDE.items} />
        </Reveal>
      </div>

      {/* What connects them */}
      <RevealGroup className="mt-5 grid gap-x-8 gap-y-5 rounded-2xl border border-border bg-surface2/60 p-6 md:grid-cols-3 md:p-7" variant="fade-up">
        {CONNECT.map((c) => (
          <div key={c.term} className="border-t border-border pt-3">
            <p className="font-display text-sm font-bold text-foreground">{c.term}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.desc}</p>
          </div>
        ))}
      </RevealGroup>

      {/* The loop: one request across both planes */}
      <div className="mt-8">
        <p className="eyebrow mb-4">One request, both planes</p>
        <RevealGroup className="grid gap-3 md:grid-cols-4" variant="fade-up">
          {LOOP.map((step, i) => (
            <div key={step.text} className="relative rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-primaryDeep">{`0${i + 1}`}</span>
                <span
                  className={`font-mono text-[0.6rem] uppercase tracking-[0.14em] ${step.plane === "in" ? "text-primary" : "text-accent"}`}
                >
                  {step.plane === "in" ? "in Snowflake" : "in the field"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{step.text}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
