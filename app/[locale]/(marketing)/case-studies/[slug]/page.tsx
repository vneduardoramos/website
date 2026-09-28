import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { Img as Image } from "@/components/marketing/Img";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudySlugs, getCaseStudies } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { MetricBand } from "@/components/marketing/Blocks";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverForSector } from "@/lib/covers";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import { asObjectArray, asStringArray, parseJson } from "@/lib/utils";
import { productLogo } from "@/lib/product-logos";
import { JsonLd } from "@/components/JsonLd";
import { MaskReveal } from "@/components/marketing/Motion";
import { theme } from "@/config/theme";
import { pageMeta, ORG_REF } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const cs = await getCaseStudyBySlug(slug, locale as Locale);
  if (!cs) {
    const t = await getTranslations({ locale, namespace: "caseStudyDetail.meta" });
    return { title: t("fallbackTitle"), robots: { index: false, follow: false } };
  }
  return pageMeta({
    title: cs.seoTitle ?? cs.title,
    description: cs.seoDescription ?? cs.summary,
    path: `/case-studies/${slug}`,
    image: cs.heroImage,
    type: "article",
    locale,
    ownOgFile: true,
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudyDetail");

  const cs = await getCaseStudyBySlug(slug, locale as Locale);
  if (!cs) notFound();

  // Qualitative, study-agnostic placeholders for CMS-created studies without
  // their own metrics. Deliberately NOT the firm-wide delivery band (0014 keeps
  // per-case-study outcomes study-specific; the band is not one client's result).
  const FALLBACK_METRICS = t.raw("fallbackMetrics") as { value: string; label: string }[];

  // Anonymity is the default: refer to the client as "a <sector> organization"
  // and say so. A customer who approved being named (clientNamed) has to opt out
  // of BOTH, otherwise the chrome insists the name is withheld while the body
  // copy uses it in every paragraph.
  const article = /^[aeiou]/i.test(cs.sector) ? "an" : "a";
  const named = cs.clientNamed && Boolean(cs.client?.name);
  const clientName = named
    ? cs.client!.name
    : t("clientName", { article, sector: cs.sector.toLowerCase() });
  const heroImage = cs.heroImage ?? "/assets/images/photos/analytics-dashboard-charts.jpg";

  // DB-driven outcome metrics (fall back to a generic set if empty).
  const dbMetrics = asObjectArray<{ value: string; label: string }>(cs.metrics).filter(
    (m) => m && m.value && m.label,
  );
  const metrics = dbMetrics.length > 0 ? dbMetrics : FALLBACK_METRICS;

  // The named products this engagement was built on. Only rendered when the
  // record carries them, so the five Snowflake studies are untouched.
  const stack = asStringArray(cs.stack);
  // A named customer can show their mark; an anonymized one obviously cannot.
  const clientLogo = named ? cs.client?.logoColor : null;

  // DB-driven pull quote.
  const quote = parseJson<{ text?: string; author?: string; role?: string } | null>(
    cs.quote,
    null,
  );

  // All studies in index-page order (order asc): related picks + prev/next nav.
  const all = await getCaseStudies({}, locale as Locale);
  const related = all
    .filter((other) => other.slug !== cs.slug && other.sector === cs.sector)
    .slice(0, 3);
  const currentIndex = all.findIndex((other) => other.slug === cs.slug);
  const prev = currentIndex > 0 ? all[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < all.length - 1 ? all[currentIndex + 1] : null;

  const localePath = locale === "es" ? "/es" : "";

  const caseStudyLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.summary,
    about: cs.sector,
    articleSection: cs.sector,
    datePublished: cs.publishedAt ?? undefined,
    dateModified: cs.updatedAt ?? cs.publishedAt ?? undefined,
    author: ORG_REF,
    publisher: ORG_REF,
    image: /^https?:\/\//i.test(heroImage) ? heroImage : `${theme.brand.url}${heroImage}`,
    mainEntityOfPage: `${theme.brand.url}${localePath}/case-studies/${cs.slug}`,
  };

  return (
    <>
      <JsonLd data={caseStudyLd} />
      {/* <article> wraps the case study itself; the closing CTA stays outside,
          so a text extractor gets a clean boundary for the piece. */}
      <article>
      {/* ── Header ──────────────────────────────────────────────── */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: t("breadcrumb.home"), href: "/" },
              { label: t("breadcrumb.caseStudies"), href: "/case-studies" },
              { label: cs.title },
            ]}
          />

          <p className="eyebrow mt-6">{t("eyebrow")}</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted">
            {cs.sector} · {cs.region}
          </p>
          <h1 className="knockout-text mt-3 text-balance font-display text-4xl font-bold tracking-tight md:text-5xl">
            {cs.title}
          </h1>
          <p className="mt-6 text-lg text-muted">{cs.summary}</p>
          <p className="mt-4 text-sm text-muted">{named ? t("namedNote", { clientName }) : t("anonNote")}</p>
          {clientLogo && (
            <Image
              src={clientLogo}
              alt={clientName}
              width={813}
              height={115}
              className="mt-6 h-8 w-auto md:h-9"
            />
          )}
        </div>
      </Section>

      {/* ── Full-bleed hero image (F2 cutout reveal) ────────────── */}
      <div className="container-page">
        <MaskReveal>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border shadow-soft-lg">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/15" />
            <Image
              src={heroImage}
              alt={`${cs.title}: ${cs.sector}`}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="aspect-[21/9] object-cover"
            />
          </div>
        </MaskReveal>
      </div>

      {/* ── Outcome metrics (dark band for punch) ───────────────── */}
      <Section>
        <div className="panel-dark relative overflow-hidden rounded-3xl p-10 shadow-soft-lg md:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="eyebrow mb-8 text-center">{t("metrics.eyebrow")}</p>
            <MetricBand metrics={metrics} />
            {stack.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow">{t("stackLabel")}</p>
                {/* Products with a brand mark show it; everything else is a
                    text chip, so the row stays honest about what we can and
                    cannot render as a logo. */}
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {stack.map((item) => {
                    const logo = productLogo(item);
                    return logo ? (
                      <Image
                        key={item}
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.w}
                        height={logo.h}
                        className="h-10 w-auto md:h-12"
                      />
                    ) : (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
                      >
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Anonymization flipped into a strength: the client stays unnamed,
            the people who delivered don't. When the customer IS named, that
            framing makes no sense, so the label just credits the team. */}
        <LeadershipStrip
          label={named ? t("leadershipLabelNamed") : t("leadershipLabel")}
          className="mt-8 justify-center"
        />
      </Section>

      {/* ── Story (challenge / solution / results via Markdown) ──── */}
      <div className="relative">
        <WaveDivider position="top" fill="fill-surface2" />
        <Section className="section-tint relative overflow-hidden">
          <SectionDecor variant="grid" />
          <div className="relative">
            <SectionHeading
              eyebrow={t("story.eyebrow")}
              title={t("story.title", { clientName })}
            />

            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-16">
              <div className="prose-vn max-w-none">
                {cs.body ? (
                  <Markdown>{cs.body}</Markdown>
                ) : (
                  <p>
                    {t("story.fallbackBody", {
                      clientName,
                      sector: cs.sector.toLowerCase(),
                    })}
                  </p>
                )}
              </div>

              {/* Sticky image rail for variety alongside the prose. */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-soft">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/10" />
                  <Image
                    src={`/assets/images/cases/${cs.slug}-detail.jpg`}
                    alt={t("story.detailImageAlt", { title: cs.title })}
                    width={720}
                    height={900}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                {cs.industry && (
                  <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
                    <p className="eyebrow">{t("story.relatedIndustry")}</p>
                    <Link
                      href={`/industries/${cs.industry.slug}`}
                      className="mt-2 inline-block font-display text-lg font-bold text-primaryDeep"
                    >
                      {cs.industry.name} →
                    </Link>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </Section>
        <WaveDivider position="bottom" fill="fill-background" />
      </div>

      {/* ── A FeatureSplit for visual rhythm ────────────────────── */}
      <Section>
        <FeatureSplit
          eyebrow={t("result.eyebrow")}
          title={t.rich("result.title", {
            hl: (c) => <span className="text-gradient">{c}</span>,
          })}
          body={t("result.body", { clientName, region: cs.region })}
          bullets={metrics.slice(0, 4).map((m) => `${m.value}: ${m.label}`)}
          image={heroImage}
          imageAlt={t("result.imageAlt", { title: cs.title })}
          reverse
          cta={{ label: t("result.cta"), href: "/contact" }}
        />
      </Section>

      {/* ── Pull quote (tinted) ─────────────────────────────────── */}
      {quote?.text && (
        <Section className="section-warm relative overflow-hidden">
          <SectionDecor variant="swoosh" />
          <figure className="relative mx-auto max-w-3xl text-center">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-10 w-10 text-primary/40"
              fill="currentColor"
              aria-hidden
            >
              <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6Zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6Z" />
            </svg>
            <blockquote className="mt-6 font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">
              “{quote.text}”
            </blockquote>
            <figcaption className="mt-8 text-sm">
              {quote.author && (
                <span className="font-semibold text-foreground">
                  {quote.author}
                </span>
              )}
              <span className="block text-muted">
                {[quote.role, clientName].filter(Boolean).join(", ")}
              </span>
            </figcaption>
          </figure>
        </Section>
      )}

      {/* ── Related case studies (same sector) ──────────────────── */}
      {related.length > 0 && (
        <Section className="relative overflow-hidden">
          <SectionDecor variant="dots" />
          <div className="relative">
            <SectionHeading
              eyebrow={t("related.eyebrow")}
              title={t("related.title", { sector: cs.sector })}
            />
            <div className="mt-10 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <CoverCard
                  key={other.slug}
                  href={`/case-studies/${other.slug}`}
                  image={other.heroImage ?? coverForSector(other.sector, other.slug)}
                  imageAlt={`${other.title}: ${other.sector}`}
                  kicker={`${other.sector} · ${other.region}`}
                  title={other.title}
                  excerpt={other.summary}
                  meta={other.client?.name ?? undefined}
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ── Prev / next engagement (quiet, hairline-top) ────────── */}
      {(prev || next) && (
        <div className="container-page">
          <nav
            aria-label={t("nav.ariaLabel")}
            className="grid gap-8 border-t border-border pt-10 sm:grid-cols-2"
          >
            <div>
              {prev && (
                <Link href={`/case-studies/${prev.slug}`} className="group inline-block">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {t("nav.prev")}
                  </span>
                  <span className="mt-1.5 block font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primaryDeep">
                    {prev.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {next && (
                <Link href={`/case-studies/${next.slug}`} className="group inline-block">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {t("nav.next")}
                  </span>
                  <span className="mt-1.5 block font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primaryDeep">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      <div className="container-page">
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <Link
            href="/case-studies"
            className="text-sm font-semibold text-primaryDeep"
          >
            {t("backToIndex")}
          </Link>
        </div>
      </div>
      </article>

      <CtaBand />
    </>
  );
}
