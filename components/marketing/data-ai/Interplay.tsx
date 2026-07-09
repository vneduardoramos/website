import { getTranslations } from "next-intl/server";
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

// Which plane each loop step runs on (structural, not copy).
const LOOP_PLANES: ("in" | "out")[] = ["out", "in", "out", "in"];

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

export async function Interplay() {
  const t = await getTranslations("dataAiUi");
  const insideItems = t.raw("interplay.inside.items") as string[];
  const outsideItems = t.raw("interplay.outside.items") as string[];
  const connect = t.raw("interplay.connect") as { term: string; desc: string }[];
  const loop = t.raw("interplay.loop") as string[];

  return (
    <div>
      {/* Two planes, with the connective tissue named between them */}
      <div className="grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
        <Reveal>
          <Plane kind="in" label={t("interplay.inside.label")} role={t("interplay.inside.role")} items={insideItems} />
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
            {t("interplay.connector")}
          </span>
        </Reveal>

        <Reveal delay={150}>
          <Plane kind="out" label={t("interplay.outside.label")} role={t("interplay.outside.role")} items={outsideItems} />
        </Reveal>
      </div>

      {/* What connects them */}
      <RevealGroup className="mt-5 grid gap-x-8 gap-y-5 rounded-2xl border border-border bg-surface2/60 p-6 md:grid-cols-3 md:p-7" variant="fade-up">
        {connect.map((c) => (
          <div key={c.term} className="border-t border-border pt-3">
            <p className="font-display text-sm font-bold text-foreground">{c.term}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.desc}</p>
          </div>
        ))}
      </RevealGroup>

      {/* The loop: one request across both planes */}
      <div className="mt-8">
        <p className="eyebrow mb-4">{t("interplay.eyebrow")}</p>
        <RevealGroup className="grid gap-3 md:grid-cols-4" variant="fade-up">
          {loop.map((text, i) => {
            const plane = LOOP_PLANES[i];
            return (
              <div key={text} className="relative rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primaryDeep">{`0${i + 1}`}</span>
                  <span
                    className={`font-mono text-[0.6rem] uppercase tracking-[0.14em] ${plane === "in" ? "text-primary" : "text-accent"}`}
                  >
                    {plane === "in" ? t("interplay.badge.inSnowflake") : t("interplay.badge.inField")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{text}</p>
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </div>
  );
}
