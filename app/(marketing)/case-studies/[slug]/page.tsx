import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { Img as Image } from "@/components/marketing/Img";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudySlugs, getCaseStudies } from "@/lib/queries";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { MetricBand } from "@/components/marketing/Blocks";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverForSector } from "@/lib/covers";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import { asObjectArray, parseJson } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { MaskReveal } from "@/components/marketing/Motion";
import { theme } from "@/config/theme";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

// Qualitative, study-agnostic placeholders for CMS-created studies without their
// own metrics. Deliberately NOT the firm-wide delivery band (0014 keeps
// per-case-study outcomes study-specific; the band is not one client's result).
const FALLBACK_METRICS = [
  { value: "One", label: "Governed source of truth" },
  { value: "Medallion", label: "Bronze to Gold foundation" },
  { value: "Built in", label: "Security and lineage" },
  { value: "8–16 wks", label: "From kickoff to first value" },
];

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cs = await getCaseStudyBySlug(params.slug);
  if (!cs) return { title: "Case study" };
  return pageMeta({
    title: cs.title,
    description: cs.summary,
    path: `/case-studies/${params.slug}`,
    image: cs.heroImage,
    type: "article",
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const cs = await getCaseStudyBySlug(params.slug);
  if (!cs) notFound();

  // Refer to the client generically to preserve anonymity.
  const article = /^[aeiou]/i.test(cs.sector) ? "an" : "a";
  const clientName = `${article} ${cs.sector.toLowerCase()} organization`;
  const heroImage = cs.heroImage ?? "/assets/images/photos/analytics.jpg";

  // DB-driven outcome metrics (fall back to a generic set if empty).
  const dbMetrics = asObjectArray<{ value: string; label: string }>(cs.metrics).filter(
    (m) => m && m.value && m.label,
  );
  const metrics = dbMetrics.length > 0 ? dbMetrics : FALLBACK_METRICS;

  // DB-driven pull quote.
  const quote = parseJson<{ text?: string; author?: string; role?: string } | null>(
    cs.quote,
    null,
  );

  // All studies in index-page order (order asc): related picks + prev/next nav.
  const all = await getCaseStudies({});
  const related = all
    .filter((other) => other.slug !== cs.slug && other.sector === cs.sector)
    .slice(0, 3);
  const currentIndex = all.findIndex((other) => other.slug === cs.slug);
  const prev = currentIndex > 0 ? all[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < all.length - 1 ? all[currentIndex + 1] : null;

  const caseStudyLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.summary,
    about: cs.sector,
    articleSection: cs.sector,
    datePublished: cs.publishedAt ?? undefined,
    dateModified: cs.updatedAt ?? cs.publishedAt ?? undefined,
    author: { "@type": "Organization", name: theme.brand.name },
    publisher: {
      "@type": "Organization",
      name: theme.brand.name,
      logo: { "@type": "ImageObject", url: `${theme.brand.url}/assets/viewnear-logo.png` },
    },
    image: /^https?:\/\//i.test(heroImage) ? heroImage : `${theme.brand.url}${heroImage}`,
    mainEntityOfPage: `${theme.brand.url}/case-studies/${cs.slug}`,
  };

  return (
    <>
      <JsonLd data={caseStudyLd} />
      {/* ── Header ──────────────────────────────────────────────── */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Case studies", href: "/case-studies" },
              { label: cs.title },
            ]}
          />

          <p className="eyebrow mt-6">Case study</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted">
            {cs.sector} · {cs.region}
          </p>
          <h1 className="knockout-text mt-3 text-balance font-display text-4xl font-bold tracking-tight md:text-5xl">
            {cs.title}
          </h1>
          <p className="mt-6 text-lg text-muted">{cs.summary}</p>
          <p className="mt-4 text-sm text-muted">
            {"A real engagement; the client's name is withheld at their request."}
          </p>
        </div>
      </Section>

      {/* ── Full-bleed hero image (F2 cutout reveal) ────────────── */}
      <div className="container-page">
        <MaskReveal>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border shadow-xl">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/15" />
            <Image
              src={heroImage}
              alt={`${cs.title}: ${cs.sector}`}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        </MaskReveal>
      </div>

      {/* ── Outcome metrics (dark band for punch) ───────────────── */}
      <Section>
        <div className="panel-dark relative overflow-hidden rounded-3xl p-10 shadow-xl md:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="eyebrow mb-8 text-center">What changed</p>
            <MetricBand metrics={metrics} />
          </div>
        </div>
        {/* Anonymization flipped into a strength: the client stays unnamed,
            the people who delivered don't. */}
        <LeadershipStrip
          label="Delivered by our team. The client's name is withheld; ours isn't."
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
              eyebrow="The engagement"
              title={`How Viewnear delivered for ${clientName}`}
            />

            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-16">
              <div className="prose-vn max-w-none">
                {cs.body ? (
                  <Markdown>{cs.body}</Markdown>
                ) : (
                  <p>
                    Viewnear partnered with {clientName} to design and deliver a
                    modern, governed data foundation: unifying sources,
                    automating pipelines, and surfacing trusted insight where the{" "}
                    {cs.sector.toLowerCase()} team works every day.
                  </p>
                )}
              </div>

              {/* Sticky image rail for variety alongside the prose. */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/10" />
                  <Image
                    src={`/assets/images/cases/${cs.slug}-detail.jpg`}
                    alt={`${cs.title} solution in action`}
                    width={720}
                    height={900}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                {cs.industry && (
                  <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
                    <p className="eyebrow">Related industry</p>
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
          eyebrow="The result"
          title={
            <>
              From raw data to{" "}
              <span className="text-gradient">confident decisions</span>
            </>
          }
          body={`With governed, AI-ready data in place, ${clientName} unlocked faster reporting, dependable pipelines, and a foundation built to scale across the ${cs.region} market.`}
          bullets={metrics.slice(0, 4).map((m) => `${m.value}: ${m.label}`)}
          image={heroImage}
          imageAlt={`${cs.title} results`}
          reverse
          cta={{ label: "Start a conversation", href: "/contact" }}
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
              eyebrow="Keep exploring"
              title={`More ${cs.sector} case studies`}
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
            aria-label="More engagements"
            className="grid gap-8 border-t border-border pt-10 sm:grid-cols-2"
          >
            <div>
              {prev && (
                <Link href={`/case-studies/${prev.slug}`} className="group inline-block">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    ← Previous engagement
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
                    Next engagement →
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
            ← Back to case studies
          </Link>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
