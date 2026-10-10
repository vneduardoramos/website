import { getTranslations } from "next-intl/server";
import { SnowMark } from "@/components/marketing/SnowMark";
import { RevealGroup, Reveal } from "@/components/marketing/Motion";

/**
 * The page's thesis, shown as a card + a worked loop: agents reason over
 * governed data inside Snowflake, then take the next action themselves,
 * running as a verifiable identity with per-agent permissions. One request
 * stays inside the same governed perimeter end to end, and comes back cited,
 * in policy, and logged.
 */

export async function AgentLoop() {
  const t = await getTranslations("dataAiUi");
  const items = t.raw("agentLoop.items") as string[];
  const loop = t.raw("agentLoop.loop") as string[];

  return (
    <div>
      <Reveal>
        <div className="card mx-auto max-w-xl">
          <div className="flex items-center gap-2.5">
            <SnowMark size={20} />
            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
              {t("agentLoop.label")}
            </p>
          </div>
          <p className="mt-3 font-display text-lg font-bold text-foreground">{t("agentLoop.role")}</p>
          <ul className="mt-4 space-y-2.5">
            {items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* The loop: one request, start to finish, inside the governed perimeter */}
      <div className="mt-8">
        <p className="eyebrow mb-4 text-center">{t("agentLoop.eyebrow")}</p>
        <RevealGroup className="grid gap-3 md:grid-cols-4" variant="fade-up">
          {loop.map((text, i) => (
            <div key={text} className="relative rounded-xl border border-border bg-surface p-4">
              <span className="font-mono text-xs font-semibold text-primaryDeep">{`0${i + 1}`}</span>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{text}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
