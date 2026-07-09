import { getTranslations } from "next-intl/server";
import { RevealGroup } from "@/components/marketing/Motion";

/**
 * The migration story, drawn instead of carded:
 *
 * - LegacyContrast: before/after split. The tangled today (systems, ETL,
 *   marts, exports crossing each other) against one calm governed foundation.
 *   Carries the "why teams move" drivers as annotations on each side.
 * - CutoverTimeline: the phased method as two parallel tracks. The legacy
 *   line runs through the phases and *ends* at cutover; the client's practice
 *   (on Snowflake) starts at Convert and keeps going. Parity validation
 *   annotates the parallel-run stretch.
 *
 * Pure JSX/SVG on Glacier tokens; no images.
 */

// The tangled "today": labeled boxes with crossing, broken-looking links.
function TangleSketch({
  ariaLabel,
  legacyWarehouse,
  etlVendor1,
  etlVendor2,
  dataMarts,
  nightlyExports,
}: {
  ariaLabel: string;
  legacyWarehouse: string;
  etlVendor1: string;
  etlVendor2: string;
  dataMarts: string;
  nightlyExports: string;
}) {
  const box = "fill-white/10 stroke-white/25";
  const label = "fill-white/80 font-mono text-[9px] uppercase tracking-wider";
  const wire = "stroke-white/30";
  return (
    <svg viewBox="0 0 400 210" className="w-full" role="img" aria-label={ariaLabel}>
      {/* wires first (crossing on purpose) */}
      <g strokeWidth="1.2" fill="none" strokeDasharray="4 3">
        <path className={wire} d="M85 45 C160 90 240 20 315 62" />
        <path className={wire} d="M85 52 C180 130 150 140 90 158" />
        <path className={wire} d="M315 70 C240 110 190 60 95 160" />
        <path className={wire} d="M90 165 C200 190 260 120 318 74" />
        <path className={wire} d="M200 105 C150 40 260 40 312 60" />
        <path className={wire} d="M200 112 C170 160 260 175 305 168" />
        <path className="stroke-red/60" d="M85 40 C170 10 260 130 300 165" />
      </g>
      {/* systems */}
      <g>
        <rect x="30" y="28" width="110" height="30" rx="6" className={box} />
        <text x="85" y="47" textAnchor="middle" className={label}>{legacyWarehouse}</text>
        <rect x="260" y="46" width="110" height="30" rx="6" className={box} />
        <text x="315" y="65" textAnchor="middle" className={label}>{etlVendor1}</text>
        <rect x="145" y="90" width="110" height="30" rx="6" className={box} />
        <text x="200" y="109" textAnchor="middle" className={label}>{etlVendor2}</text>
        <rect x="35" y="145" width="110" height="30" rx="6" className={box} />
        <text x="90" y="164" textAnchor="middle" className={label}>{dataMarts}</text>
        <rect x="250" y="150" width="110" height="30" rx="6" className={box} />
        <text x="305" y="169" textAnchor="middle" className={label}>{nightlyExports}</text>
      </g>
    </svg>
  );
}

// The calm "after": one foundation, layers in order, nothing leaking.
function FoundationSketch({
  ariaLabel,
  sources,
  layers,
  outputs,
}: {
  ariaLabel: string;
  sources: string;
  layers: string[];
  outputs: string;
}) {
  return (
    <svg viewBox="0 0 400 210" className="w-full" role="img" aria-label={ariaLabel}>
      <g className="font-mono">
        <text x="200" y="18" textAnchor="middle" className="fill-primaryDeep/70 text-[9px] uppercase tracking-wider">{sources}</text>
        <path d="M200 26 v14" className="stroke-primaryDeep/50" strokeWidth="1.5" />
        <rect x="60" y="44" width="280" height="120" rx="12" className="fill-primary/10 stroke-primaryDeep/35" />
        {layers.map((layer, i) => (
          <g key={layer}>
            <rect x="78" y={56 + i * 36} width="244" height="26" rx="6" className="fill-white stroke-primaryDeep/25" />
            <text x="200" y={73 + i * 36} textAnchor="middle" className="fill-[#0f2530] text-[10px]">{layer}</text>
          </g>
        ))}
        <path d="M200 168 v14" className="stroke-primaryDeep/50" strokeWidth="1.5" />
        <text x="200" y="198" textAnchor="middle" className="fill-primaryDeep/70 text-[9px] uppercase tracking-wider">{outputs}</text>
      </g>
    </svg>
  );
}

export async function LegacyContrast() {
  const t = await getTranslations("migrationsUi");
  const pains = t.raw("legacyContrast.pains") as { title: string; body: string }[];
  const gains = t.raw("legacyContrast.gains") as { title: string; body: string }[];
  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-2">
      {/* Today */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-foreground p-7 md:p-8">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-white/60">{t("legacyContrast.today")}</p>
        <TangleSketch
          ariaLabel={t("tangle.ariaLabel")}
          legacyWarehouse={t("tangle.legacyWarehouse")}
          etlVendor1={t("tangle.etlVendor1")}
          etlVendor2={t("tangle.etlVendor2")}
          dataMarts={t("tangle.dataMarts")}
          nightlyExports={t("tangle.nightlyExports")}
        />
        <ul className="mt-5 space-y-3 border-t border-white/15 pt-5">
          {pains.map((p) => (
            <li key={p.title} className="text-sm leading-relaxed text-white/70">
              <span className="font-semibold text-white/90">{p.title}.</span> {p.body}
            </li>
          ))}
        </ul>
      </div>
      {/* After */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-primary/30 bg-surface p-7 md:p-8">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-primaryDeep">{t("legacyContrast.onSnowflake")}</p>
        <FoundationSketch
          ariaLabel={t("foundation.ariaLabel")}
          sources={t("foundation.sources")}
          layers={t.raw("foundation.layers") as string[]}
          outputs={t("foundation.outputs")}
        />
        <ul className="mt-5 space-y-3 border-t border-border pt-5">
          {gains.map((g) => (
            <li key={g.title} className="text-sm leading-relaxed text-muted">
              <span className="font-semibold text-foreground">{g.title}.</span> {g.body}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type Phase = { title: string; body: string };

export async function CutoverTimeline({ phases }: { phases: Phase[] }) {
  const t = await getTranslations("migrationsUi");
  return (
    <div className="mt-12 overflow-x-auto pb-2">
      <div className="min-w-[880px]">
        {/* phase headers */}
        <div className="grid grid-cols-[110px_repeat(5,1fr)] gap-x-4">
          <span aria-hidden />
          {phases.map((p, i) => (
            <div key={p.title} className="border-l border-border pl-3">
              <span className="font-mono text-xs font-semibold tracking-widest text-primaryDeep" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-display text-sm font-bold leading-snug text-foreground">{p.title}</h3>
            </div>
          ))}
        </div>

        {/* week ruler: honest ticks under the phases. Real timelines vary, so
            the ruler is labeled as a typical arc rather than a promise. */}
        <div className="mt-4 grid grid-cols-[110px_repeat(5,1fr)] gap-x-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          <span>{t("cutover.typicalArc")}</span>
          {(t.raw("cutover.weeks") as string[]).map((w) => (
            <span key={w} className="border-l border-border pl-3">
              {w}
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-right font-mono text-[0.62rem] text-muted">
          {t("cutover.typicalArcNote")}
        </p>

        {/* the two tracks */}
        <div className="mt-5 grid grid-cols-[110px_repeat(5,1fr)] items-center gap-x-4 gap-y-3">
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">{t("cutover.legacy")}</span>
          <div className="col-span-4 flex items-center">
            <div className="h-2.5 flex-1 rounded-full bg-gradient-to-r from-foreground/50 to-red/60" />
            <span className="ml-2 whitespace-nowrap rounded-full border border-red/40 bg-red/10 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-red">
              {t("cutover.retired")}
            </span>
          </div>
          <span aria-hidden />

          <span className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-primaryDeep">{t("cutover.thePractice")}</span>
          <span aria-hidden />
          <div className="col-span-4 flex items-center">
            <div className="h-2.5 flex-1 rounded-l-full bg-gradient-to-r from-primary/70 to-primary" />
            <span aria-hidden className="-ml-px text-primary">▶</span>
          </div>
        </div>

        {/* parity annotation under the parallel-run stretch */}
        <div className="mt-3 grid grid-cols-[110px_repeat(5,1fr)] gap-x-4">
          <span aria-hidden />
          <span aria-hidden />
          <div className="col-span-3">
            <span className="inline-flex items-center gap-2 rounded-lg border border-primaryDeep/25 bg-primaryDeep/5 px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-wider text-primaryDeep">
              {t("cutover.parity")}
            </span>
          </div>
        </div>

        {/* phase bodies */}
        <RevealGroup className="mt-6 grid grid-cols-[110px_repeat(5,1fr)] gap-x-4" variant="fade-up">
          <span aria-hidden />
          {phases.map((p) => (
            <p key={p.title} className="border-l border-border pl-3 text-xs leading-relaxed text-muted">
              {p.body}
            </p>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
