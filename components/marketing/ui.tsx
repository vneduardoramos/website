import { getTranslations } from "next-intl/server";
import { Img } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { caseStackKey } from "@/lib/case-stack";

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
  as: Heading = "h2",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: string;
  /** Legacy alias for align="center". */
  center?: boolean;
  /** "hero" promotes a section opener to the oversized display scale + lede intro. */
  size?: "hero" | "section";
  align?: "left" | "center";
  /**
   * Heading level. Defaults to h2, which is right for a section opener. Pass
   * "h1" when this heading IS the page title and no PageHero precedes it, so the
   * page does not start its outline at h2 with no h1 at all.
   */
  as?: "h1" | "h2";
}) {
  const isCenter = align === "center" || (align === undefined && center);
  return (
    <div className={cn("max-w-3xl", isCenter && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Heading
        className={cn(
          "text-balance font-display font-bold tracking-tight text-foreground",
          size === "hero" ? "display-hero" : "text-3xl md:text-[2.6rem] md:leading-[1.1]",
        )}
      >
        {title}
      </Heading>
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

export async function CaseStudyCard({
  cs,
}: {
  cs: {
    slug: string;
    title: string;
    summary: string;
    sector: string;
    region: string;
    heroImage?: string | null;
    stack?: unknown;
  };
}) {
  const t = await getTranslations("sharedUi");
  const stackKey = caseStackKey(cs.stack);
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden p-0"
    >
      {/* The engagement's own photograph. This used to be a decorative curve
          whose shape was picked by hashing the slug and whose color came from
          hashing the sector, which is to say the artwork was arbitrary. Every
          case study ships a hero image; show it. */}
      {cs.heroImage && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Img
            src={cs.heroImage}
            alt={`${cs.sector}: ${cs.title}`}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="pill-chip self-start">
          {cs.sector} · {cs.region}
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-foreground">{cs.title}</h3>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{cs.summary}</p>
        {stackKey && (
          <span className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
            {stackKey === "claude" ? t("caseStudyCard.builtWithClaude") : t("caseStudyCard.builtOnSnowflake")}
          </span>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primaryDeep">
          <span className="link-underline">{t("caseStudyCard.readMore")}</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
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
  primary,
  secondary,
}: {
  title?: string;
  subtitle?: string;
  /** Override the default buttons when a page's close needs its own verbs. */
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  const t = await getTranslations("sharedUi");
  const resolvedTitle = title ?? t("ctaBand.title");
  const resolvedSubtitle = subtitle ?? t("ctaBand.subtitle");
  const p = primary ?? { label: t("ctaBand.primaryCta"), href: "/contact" };
  const sec = secondary ?? { label: t("ctaBand.secondaryCta"), href: "/services" };
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
              <Link href={p.href} className="btn-primary btn-lg hover-sheen">
                {p.label}
              </Link>
              <Link href={sec.href} className="btn-ghost btn-lg">
                {sec.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
