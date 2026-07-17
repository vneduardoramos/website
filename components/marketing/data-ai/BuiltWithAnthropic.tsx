import { getTranslations } from "next-intl/server";
import { AnthropicMark, ProviderMark } from "@/components/marketing/ProviderMark";
import { MODEL_PROVIDERS } from "@/lib/model-providers";

/**
 * The Anthropic moment: we're an Anthropic partner and Claude is our default
 * reasoning model, inside Snowflake (as a Cortex model, next to governed data)
 * and in the flow of work (Claude, Claude Code, and MCP). The estate stays
 * open, so the small model row keeps the honesty without burying the lead.
 */

export async function BuiltWithAnthropic() {
  const t = await getTranslations("dataAiUi");
  const points = t.raw("builtWithAnthropic.points") as { term: string; desc: string }[];

  return (
    <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-soft-lg md:p-12">
      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        {/* Left: the partnership + the case for Claude as default */}
        <div>
          <p className="eyebrow eyebrow--invert mb-4 inline-flex items-center gap-2">
            <AnthropicMark size={14} />
            {t("builtWithAnthropic.eyebrow")}
          </p>
          <h2 className="max-w-md font-display text-3xl font-bold tracking-tight text-white md:text-4xl md:leading-[1.1]">
            {t("builtWithAnthropic.h2")}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            {t("builtWithAnthropic.body")}
          </p>
          <dl className="mt-8 space-y-4">
            {points.map((p) => (
              <div key={p.term} className="border-t border-white/10 pt-3">
                <dt className="font-display text-sm font-bold text-white">{p.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-white/70">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: Claude as the default in Cortex AISQL, then the open estate */}
        <div>
          <figure>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-codeInk shadow-soft-lg">
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
                  <span className="font-semibold text-secondary">claude-opus-4-8</span>
                  {"',"}
                  <span className="text-white/40">{t("builtWithAnthropic.sqlComment")}</span>
                  {"\n  CONCAT('Classify this claim: ', claim_text)\n)\nFROM governed.claims;"}
                </code>
              </pre>
            </div>
            <figcaption className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/50">
              {t("builtWithAnthropic.figcaption")}
            </figcaption>
          </figure>

          {/* The estate stays open: honesty without burying Claude */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/45">
              {MODEL_PROVIDERS.map((p) => {
                const isAnthropic = p.key === "anthropic";
                return p.src ? (
                  <span key={p.key} className="inline-flex items-center gap-2">
                    <ProviderMark
                      src={p.src}
                      color={p.color}
                      lit={isAnthropic}
                      size={isAnthropic ? 20 : 18}
                      className={isAnthropic ? "" : "opacity-70"}
                    />
                    {isAnthropic && (
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/70">
                        {t("builtWithAnthropic.default")}
                      </span>
                    )}
                  </span>
                ) : null;
              })}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/55">
              {t("builtWithAnthropic.closing")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
