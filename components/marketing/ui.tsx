import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("section", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
  size = "section",
  align,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: string;
  /** Legacy alias for align="center". */
  center?: boolean;
  /** "hero" promotes a section opener to the oversized display scale + lede intro. */
  size?: "hero" | "section";
  align?: "left" | "center";
}) {
  const isCenter = align === "center" || (align === undefined && center);
  return (
    <div className={cn("max-w-3xl", isCenter && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={cn(
          "text-balance font-display font-bold tracking-tight text-foreground",
          size === "hero" ? "display-hero" : "text-3xl md:text-[2.6rem] md:leading-[1.1]",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            size === "hero" ? "lede mt-5" : "mt-4 text-lg leading-relaxed text-muted",
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill-chip">{children}</span>;
}

// Deterministic per-sector visual coding for the otherwise text-only cards: a
// stable hash picks one of a few sparkline shapes + a Glacier hue, so each card
// reads as a distinct "data outcome" without any photo/asset pipeline.
const SPARK_HUES = ["--color-primary", "--color-secondary", "--color-primary-deep"];
const SPARK_PATHS = [
  "M0,38 L40,32 L80,36 L120,20 L160,26 L200,10 L240,5",
  "M0,30 L40,34 L80,22 L120,26 L160,14 L200,18 L240,4",
  "M0,40 L40,28 L80,31 L120,16 L160,22 L200,9 L240,12",
];
function hashIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % mod;
}

export async function CaseStudyCard({
  cs,
}: {
  cs: { slug: string; title: string; summary: string; sector: string; region: string };
}) {
  const t = await getTranslations("sharedUi");
  const key = `${cs.sector}${cs.region}`;
  const hue = SPARK_HUES[hashIndex(key, SPARK_HUES.length)];
  const spark = SPARK_PATHS[hashIndex(cs.slug, SPARK_PATHS.length)];
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      {/* data-spark: a per-sector tinted outcome curve, bled to the card edges */}
      <div className="-mx-6 -mt-6 mb-5 h-16 bg-gradient-to-b from-surface2/70 to-transparent px-6 pt-5">
        <svg viewBox="0 0 240 48" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <path d={`${spark} L240,48 L0,48 Z`} style={{ fill: `rgb(var(${hue}) / 0.20)` }} />
          <path
            d={spark}
            fill="none"
            style={{ stroke: `rgb(var(${hue}))` }}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="pill-chip self-start">
        {cs.sector} · {cs.region}
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-foreground">{cs.title}</h3>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{cs.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primaryDeep">
        <span className="link-underline">{t("caseStudyCard.readMore")}</span>
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}

export async function IndustryCard({
  industry,
}: {
  industry: { slug: string; name: string; headline: string };
}) {
  const t = await getTranslations("sharedUi");
  return (
    <Link href={`/industries/${industry.slug}`} className="card card-hover group block">
      <h3 className="font-display text-lg font-bold text-foreground">{industry.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{industry.headline}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
        {t("industryCard.explore")}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}

export async function CtaBand({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const t = await getTranslations("sharedUi");
  const resolvedTitle = title ?? t("ctaBand.title");
  const resolvedSubtitle = subtitle ?? t("ctaBand.subtitle");
  return (
    <section className="section">
      <div className="container-page">
        <div className="panel-sunset panel-editorial relative overflow-hidden rounded-3xl p-10 text-center shadow-soft md:p-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {resolvedTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">{resolvedSubtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary btn-lg hover-sheen">
                {t("ctaBand.primaryCta")}
              </Link>
              <Link href="/services" className="btn-ghost btn-lg">
                {t("ctaBand.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
