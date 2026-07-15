import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getIndustrySlugs, getIndustries } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { asObjectArray, asStringArray, parseJson } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionHeading,
  Pill,
  CtaBand,
} from "@/components/marketing/ui";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { ShowcaseBand } from "@/components/marketing/ShowcaseBand";
import { MetricBand } from "@/components/marketing/Blocks";
import { PlateCard } from "@/components/marketing/Cards";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { HeroBackground } from "@/components/marketing/HeroBackground";
import { MaskReveal } from "@/components/marketing/Motion";
import { getFlavor, getFlavorText, INDUSTRY_FLAVOR } from "@/components/marketing/industries/flavor";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getIndustrySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const industry = await getIndustryBySlug(slug, locale as Locale);
  if (!industry) {
    const t = await getTranslations({ locale, namespace: "industryDetail.meta" });
    return { title: t("fallbackTitle"), robots: { index: false, follow: false } };
  }
  return pageMeta({
    title: industry.name,
    description: industry.headline ?? industry.intro,
    path: `/industries/${slug}`,
    image: `/assets/images/industries/${slug}.jpg`,
    locale,
    ownOgFile: true,
  });
}

export default async function IndustryDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const t = await getTranslations("industryDetail");

  const industry = await getIndustryBySlug(slug, locale as Locale);
  if (!industry) notFound();

  const challenges = asObjectArray<{ problem: string; response: string }>(
    industry.challenges
  );
  const deliverables = asObjectArray<{ title: string; description: string }>(
    industry.deliverables
  );
  const tools = asStringArray(industry.tools);

  const all = await getIndustries(locale as Locale);
  const others = all.filter((i) => i.slug !== industry.slug);

  const flavor = getFlavor(industry.slug);
  // Non-text visual identity (icon/tile/glow/etc.) comes from getFlavor; the
  // localized sector copy (pattern, compliance, capabilities, bullets) is read
  // from the contentData catalog via getFlavorText.
  const flavorText = getFlavorText(industry.slug, await getTranslations("contentData"));
  const Icon = flavor.icon;
  const sectorImage = `/assets/images/industries/${industry.slug}.jpg`;
  // Short sector reference code for the compliance plate (e.g. "FIN", "EDU").
  const sectorCode = industry.slug.slice(0, 3).toUpperCase();

  // The one case study for this industry, showcased prominently below.
  const story = industry.caseStudies?.[0];
  const storyMetrics = story
    ? asObjectArray<{ value: string; label: string }>(story.metrics)
        .filter((m) => m.value && m.label)
        .slice(0, 4)
    : [];
  const storyQuote = story
    ? parseJson<{ text?: string; author?: string; role?: string } | null>(story.quote, null)
    : null;
  const storyImage = story?.heroImage || sectorImage;
  // Render a generic, sector-derived headline rather than the case study's
  // title so the spotlight focuses on the problem and solution, while client
  // names stay anonymized.
  const storyTitle = story
    ? t("featured.storyTitle", { industry: industry.name.toLowerCase() })
    : "";

  return (
    <div style={{ "--eyebrow-accent": `var(${flavor.accentVar})` } as CSSProperties}>
      {/* Hero - sector icon + accent glow give each page its own flavor */}
      <section className="relative overflow-hidden">
        <HeroBackground compact />
        <div
          className={`pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full blur-3xl ${flavor.glow}`}
          aria-hidden="true"
        />
        <div className="container-page relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: t("breadcrumb.home"), href: "/" },
                  { label: t("breadcrumb.industries"), href: "/industries" },
                  { label: industry.name },
                ]}
              />
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${flavor.tile}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <p className="eyebrow">{flavorText.pattern}</p>
            </div>
            <h1 className="mt-7 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-[3.3rem]">
              <span className="knockout-text">{industry.headline}</span>
            </h1>
            {industry.intro && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                {industry.intro}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                {t("hero.discussCta", { industry: industry.name.toLowerCase() })}
              </Link>
              {industry.caseStudies?.length > 0 && (
                <Link href="/case-studies" className="btn-ghost">
                  {t("hero.seeWork")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement overview - bullets tailored to the sector */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant={flavor.decor} />
        <div className="relative">
          <FeatureSplit
            eyebrow={t("engagement.eyebrow")}
            title={t.rich("engagement.title", {
              name: industry.name,
              hl: (c) => <span className="text-gradient">{c}</span>,
            })}
            body={t("engagement.body", { industry: industry.name.toLowerCase() })}
            bullets={flavorText.bullets}
            image={`/assets/images/industries/${industry.slug}-2.jpg`}
            imageAlt={t("engagement.imageAlt", { industry: industry.name })}
            cta={{ label: t("engagement.cta"), href: "/contact" }}
          />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* What we stand up in this sector: always-true capability facts, not
          outcome numbers. Measured client results live only in the attributed
          Featured-engagement spotlight below, never dressed as sector-wide. */}
      <Section>
        <SectionHeading
          eyebrow={t("foundation.eyebrow")}
          title={t("foundation.title", { industry: industry.name.toLowerCase() })}
          intro={
            story
              ? t("foundation.introWithStory", { industry: industry.name.toLowerCase() })
              : t("foundation.introNoStory")
          }
        />
        <div className="mt-12">
          <MetricBand metrics={flavorText.capabilities} />
        </div>
      </Section>

      {/* Challenges */}
      {challenges.length > 0 ? (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow={t("challenges.eyebrow")}
            title={t("challenges.title", { industry: industry.name })}
            intro={t("challenges.intro")}
          />
          <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c, i) => (
              <div key={i} className="card flex h-full flex-col">
                <span className={`h-1 w-10 rounded-full ${flavor.bar}`} />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {c.problem}
                </h3>
                <p className="mt-3 text-muted">{c.response}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Deliverables */}
      {deliverables.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow={t("deliverables.eyebrow")}
            title={t("deliverables.title")}
            intro={t("deliverables.intro")}
          />
          <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((d, i) => (
              <div key={i} className="card card-hover flex h-full gap-4">
                <span className={`mt-1 shrink-0 ${flavor.text}`} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l4 4 10-11" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-muted">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Tools */}
      {tools.length > 0 ? (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow={t("tools.eyebrow")}
            title={t("tools.title")}
            intro={t("tools.intro")}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {tools.map((tool) => (
              <Pill key={tool}>{tool}</Pill>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Sector showcase - full-bleed sector photo, per-industry hue tint */}
      <ShowcaseBand
        image={sectorImage}
        imageAlt={t("showcase.imageAlt", { industry: industry.name })}
        eyebrow={flavorText.pattern}
        title={t.rich("showcase.title", {
          name: industry.name,
          hl: (c) => <span className="text-secondary">{c}</span>,
        })}
        cta={{
          label: t("showcase.cta", { industry: industry.name.toLowerCase() }),
          href: "/contact",
        }}
        tintClass={flavor.glow}
      />

      {/* Governance & compliance - CXO trust signal */}
      <Section>
        <div className="max-w-xl">
          <PlateCard
            label={t("compliance.label")}
            refCode={sectorCode}
            title={t("compliance.title")}
            stamp
          >
            {flavorText.compliance}{" "}
            <Link
              href="/security"
              className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
            >
              {t("compliance.link")}
            </Link>
          </PlateCard>
        </div>
      </Section>

      {/* Featured case study - the prominent proof point for this industry */}
      {story ? (
        <Section>
          <SectionHeading
            eyebrow={t("featured.eyebrow")}
            title={t("featured.title", { industry: industry.name })}
            intro={t("featured.intro")}
          />
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
            <div className="grid lg:grid-cols-2">
              {/* Image side (F2 cutout reveal) */}
              <MaskReveal className="relative min-h-[280px] lg:min-h-full">
                <div className="relative h-full min-h-[280px] overflow-hidden lg:min-h-full">
                  <Image
                    src={storyImage}
                    alt={storyTitle}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 mix-blend-multiply ${flavor.glow}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 font-mono text-xs uppercase tracking-wider shadow-sm ${flavor.text}`}
                  >
                    <Icon className="h-4 w-4" />
                    {story.sector}
                  </span>
                </div>
              </MaskReveal>

              {/* Content side */}
              <div className="flex flex-col gap-7 p-8 md:p-10 lg:p-12">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">
                    {t("featured.orgLabel", { industry: industry.name.toLowerCase() })} · {story.region}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
                    {storyTitle}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">{story.summary}</p>
                </div>

                {storyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                    {storyMetrics.map((m, i) => (
                      <div key={i} className="bg-surface p-4">
                        <p className={`font-display text-2xl font-bold ${flavor.text}`}>
                          {m.value}
                        </p>
                        <p className="mt-1 text-xs leading-snug text-muted">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {storyQuote?.text && (
                  <figure className="rounded-2xl bg-background p-5">
                    <span className={`block h-1 w-10 rounded-full ${flavor.bar}`} aria-hidden="true" />
                    <blockquote className="mt-3 font-display text-lg font-semibold leading-snug text-foreground">
                      &ldquo;{storyQuote.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-sm text-muted">
                      {t("featured.quoteCaption", { industry: industry.name.toLowerCase() })}
                    </figcaption>
                  </figure>
                )}

                <Link
                  href={`/case-studies/${story.slug}`}
                  className="btn-primary mt-auto self-start"
                >
                  {t("featured.readCase")}
                </Link>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Other industries - each chip carries its own sector icon */}
      {others.length > 0 ? (
        <Section className="bg-surface">
          <SectionHeading eyebrow={t("other.eyebrow")} title={t("other.title")} />
          <div className="mt-8 flex flex-wrap gap-3">
            {others.map((i) => {
              const f = INDUSTRY_FLAVOR[i.slug];
              const OtherIcon = f?.icon;
              return (
                <Link
                  key={i.slug}
                  href={`/industries/${i.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primaryDeep"
                >
                  {OtherIcon && (
                    <span className={f?.text}>
                      <OtherIcon className="h-4 w-4" />
                    </span>
                  )}
                  {i.name}
                  <span className="text-muted transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </div>
  );
}
