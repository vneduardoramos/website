/**
 * The page's thesis, shown instead of claimed: real AISQL where the model
 * literal cycles between labs while everything else stays put. The swap IS
 * the animation (CSS steps in globals.css, disabled under reduced motion,
 * where the first name simply stays). Stats sit beside it at display size.
 */

const MODELS = [
  "claude-sonnet-4-5",
  "gpt-5",
  "llama4-maverick",
  "mistral-large2",
  "deepseek-r1",
];

const STATS = [
  { value: "14+", label: "models in Cortex" },
  { value: "6", label: "leading labs" },
  { value: "0", label: "data movement" },
  { value: "1", label: "line to swap" },
];

export function OneLineSwap() {
  return (
    <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-xl md:p-12">
      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="eyebrow eyebrow--invert mb-4">The one-line difference</p>
          <h2 className="max-w-md font-display text-3xl font-bold tracking-tight text-white md:text-4xl md:leading-[1.1]">
            Changing models is a one-line diff.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            The query, the governance, and the data never move. When a stronger model
            ships, we benchmark it on the use case and change one string.
          </p>
          <dl className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-bold text-white md:text-5xl">{s.value}</dd>
                <dd className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The code: everything frozen except the model literal */}
        <figure>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0a1130] shadow-2xl">
            <div aria-hidden className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-red/70" />
              <span className="h-2 w-2 rounded-full bg-gold/80" />
              <span className="h-2 w-2 rounded-full bg-success/70" />
              <span className="ml-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/40">
                claims_triage.sql
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-[1.5rem] text-white/80 md:p-6 md:text-sm">
              <code>
                {"SELECT AI_COMPLETE(\n  '"}
                <span className="model-cycle text-secondary" aria-label={MODELS[0]}>
                  {/* last entry repeats the first so the loop lands seamlessly */}
                  {[...MODELS, MODELS[0]].map((m, i) => (
                    <span key={`${m}-${i}`} aria-hidden={i > 0}>
                      {m}
                    </span>
                  ))}
                </span>
                {"',"}
                <span className="text-white/40">{"   -- the only line that changes"}</span>
                {"\n  CONCAT('Classify this claim: ', claim_text)\n)\nFROM governed.claims;"}
              </code>
            </pre>
          </div>
          <figcaption className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/50">
            Cortex AISQL &middot; runs inside the Snowflake account
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
