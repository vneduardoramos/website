import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { HeroBackground } from "@/components/marketing/HeroBackground";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { MetricBand } from "@/components/marketing/Blocks";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { ShowcaseBand } from "@/components/marketing/ShowcaseBand";
import {
  AtAGlance,
  DeliverableGrid,
  EngagementFlow,
  FaqAccordion,
  NearshoreBand,
} from "@/components/marketing/service/ServiceSections";
import { getServiceFlavor } from "@/components/marketing/service/flavor";
import { Markdown } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { getServiceBySlug, getServiceSlugs, getServices } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { asStringArray, cn } from "@/lib/utils";
import { parseServiceBody, stripMd } from "@/lib/service-content";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug, locale as Locale);
  if (!service) {
    const t = await getTranslations({ locale, namespace: "serviceDetail.meta" });
    return { title: t("fallbackTitle"), robots: { index: false, follow: false } };
  }
  return pageMeta({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.summary,
    path: `/services/${slug}`,
    locale,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const [t, tServices] = await Promise.all([
    getTranslations("serviceDetail"),
    getTranslations("services"),
  ]);

  const service = await getServiceBySlug(slug, locale as Locale);
  if (!service) notFound();

  const tools = asStringArray(service.tools);
  const content = parseServiceBody(service.body ?? "");
  const hasStructure = Boolean(
    content.deliverables || content.engagement || content.nearshore || content.faq,
  );

  // Per-service visual identity (accent hue, texture, icon) so no two pages
  // read the same, plus the two placeholder image slots.
  const flavor = getServiceFlavor(slug);
  const FlavorIcon = flavor.icon;
  const practiceImg = `/assets/images/services/${slug}-practice.jpg`;
  const showcaseImg = `/assets/images/services/${slug}-showcase.jpg`;
  // Three short bullets for the "in practice" split, drawn from the parsed
  // deliverables (their bold lead-in, or the phrase before the first colon).
  const practiceBullets = (content.deliverables?.items ?? [])
    .map((it) => (it.term ?? it.body.split(/[:.]/)[0]).trim())
    .filter(Boolean)
    .slice(0, 3);

  // Tier eyebrow ("Strategy" / "Engineering" / "Enablement") + the canonical
  // delivery metric band, both sourced from the localized services catalog so
  // the numbers stay a single source of truth.
  const tiers = tServices.raw("tiers") as Record<string, { eyebrow: string }>;
  const phase = tiers?.[service.tier]?.eyebrow ?? "";
  const metrics = tServices.raw("impact.metrics") as { value: string; label: string }[];
  const steps = t.raw("engagement.steps") as { label: string; title: string; body: string }[];

  const glanceFacts = [
    { label: t("atAGlance.phaseLabel"), value: phase },
    { label: t("atAGlance.ttvLabel"), value: t("atAGlance.ttvValue") },
    { label: t("atAGlance.modelLabel"), value: t("atAGlance.modelValue") },
  ].filter((f) => f.value);

  // Sibling services, for the cross-link mesh at the bottom of the page.
  const all = await getServices(locale as Locale);
  const others = all.filter((s) => s.slug !== service.slug);

  const localePath = locale === "es" ? "/es" : "";
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: "Snowflake data and AI services",
    areaServed: "Americas",
    provider: {
      "@type": "Organization",
      name: theme.brand.name,
      url: theme.brand.url,
    },
    url: `${theme.brand.url}${localePath}/services/${slug}`,
  };
  const faqLd =
    content.faq && content.faq.items.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: stripMd(f.a) },
          })),
        }
      : null;

  return (
    <div style={{ "--eyebrow-accent": `var(${flavor.accentVar})` } as CSSProperties}>
      {/* Breadcrumbs (in the hero) already emit the BreadcrumbList JSON-LD, so
          only the Service (+ FAQ) entities are emitted here. */}
      <JsonLd data={faqLd ? [serviceLd, faqLd] : serviceLd} />

      {/* HERO - a per-service glow + icon give each page its own flavor; the
          tier chip anchors it in the THINK/BUILD/GROW phase; the H1 is the
          service title (the head term). */}
      <section className="relative overflow-hidden">
        <HeroBackground compact />
        <div
          aria-hidden="true"
          className={cn("pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full blur-3xl", flavor.glow)}
        />
        <div className="container-page relative py-16 md:py-24">
          <div className="mb-7">
            <Breadcrumbs
              items={[
                { label: t("breadcrumb.home"), href: "/" },
                { label: t("breadcrumb.services"), href: "/services" },
                { label: service.title },
              ]}
            />
          </div>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl shadow-soft", flavor.tile)}>
                <FlavorIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              {phase && <span className="chip">{phase}</span>}
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {t("hero.eyebrow")}
              </span>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.06] tracking-tight text-foreground md:text-[3.4rem]">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {service.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                {t("hero.primaryCta")}
              </Link>
              <Link href="/services" className="btn-ghost">
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPENING STANDFIRST - the body's lead promise, with an at-a-glance spec
          card (stack + delivery facts) alongside it. */}
      {content.lead && (
        <Section>
          <div className="grid items-start gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
            <p className="lede max-w-2xl">{content.lead}</p>
            <AtAGlance
              eyebrow={t("atAGlance.eyebrow")}
              facts={glanceFacts}
              stackLabel={t("atAGlance.stackLabel")}
              tools={tools}
            />
          </div>
        </Section>
      )}

      {/* Structured layout when the body carries the standard sections; otherwise
          fall back to rendering the raw markdown as a simple overview. */}
      {hasStructure ? (
        <>
          {/* DELIVERABLES */}
          {content.deliverables && (
            <Section className="section-warm relative overflow-hidden">
              <SectionDecor variant={flavor.decor} />
              <div className="relative">
                <SectionHeading
                  eyebrow={t("deliver.eyebrow")}
                  title={content.deliverables.heading}
                  intro={content.deliverables.intro || undefined}
                />
                <div className="mt-12">
                  <DeliverableGrid
                    items={content.deliverables.items}
                    mode={content.deliverables.mode}
                    accent={flavor.text}
                  />
                </div>
                {content.deliverables.outro && (
                  <div className="mt-8 max-w-3xl text-muted [&_p:last-child]:mb-0">
                    <Markdown>{content.deliverables.outro}</Markdown>
                  </div>
                )}
              </div>
              <WaveDivider position="bottom" fill="fill-background" />
            </Section>
          )}

          {/* IN PRACTICE - first image slot: a framed shot with the top
              deliverables as bullets and a CTA. Placeholder art for now. */}
          <Section>
            <FeatureSplit
              as="h2"
              eyebrow={t("inPractice.eyebrow")}
              title={t("inPractice.title")}
              body={t("inPractice.body")}
              bullets={practiceBullets}
              image={practiceImg}
              imageAlt={t("inPractice.imageAlt", { title: service.title })}
              cta={{ label: t("inPractice.cta"), href: "/contact" }}
            />
          </Section>

          {/* ENGAGEMENT - the fixed 4-step flow, then the service-specific prose,
              then the canonical delivery-metric band as the payoff. */}
          {content.engagement && (
            <Section className="section-tint relative overflow-hidden">
              <SectionDecor variant="grid" />
              <div className="relative">
                <SectionHeading
                  eyebrow={t("engagement.eyebrow")}
                  title={content.engagement.heading}
                  intro={t("engagement.flowIntro")}
                />
                <div className="mt-12">
                  <EngagementFlow steps={steps} />
                </div>
                <div className="mt-10 max-w-3xl [&_p:last-child]:mb-0">
                  <Markdown>{content.engagement.body}</Markdown>
                </div>
                {metrics?.length > 0 && (
                  <div className="mt-14 rounded-3xl border border-border bg-background p-8 md:p-10">
                    <p className="eyebrow mb-8">{t("proof.eyebrow")}</p>
                    <MetricBand metrics={metrics} />
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* NEARSHORE - the page's one dark authority moment. */}
          {content.nearshore && (
            <Section>
              <NearshoreBand
                eyebrow={t("nearshore.eyebrow")}
                heading={content.nearshore.heading}
                locator="Monterrey, MX · Austin, TX · US time zones"
                body={content.nearshore.body}
                ctaLabel={t("nearshore.cta")}
                ctaHref="/nearshore"
              />
            </Section>
          )}

          {/* Any additional prose sections (defensive; normally none). */}
          {content.extras.map((s) => (
            <Section key={s.heading}>
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                  {s.heading}
                </h2>
                <div className="mt-6 [&_p:last-child]:mb-0">
                  <Markdown>{s.body}</Markdown>
                </div>
              </div>
            </Section>
          ))}

          {/* FAQ */}
          {content.faq && content.faq.items.length > 0 && (
            <Section className="bg-surface">
              <SectionHeading eyebrow={t("faq.eyebrow")} title={content.faq.heading} center />
              <FaqAccordion items={content.faq.items} />
            </Section>
          )}

          {/* SHOWCASE - second image slot: the one immersive, full-bleed beat,
              tinted to the service hue, closing on a proof CTA. Placeholder
              art for now. */}
          <ShowcaseBand
            image={showcaseImg}
            imageAlt={t("showcase.imageAlt", { title: service.title })}
            eyebrow={t("showcase.eyebrow")}
            title={t("showcase.title")}
            body={t("showcase.body")}
            cta={{ label: t("showcase.cta"), href: "/case-studies" }}
            tintClass={flavor.glow}
          />
        </>
      ) : (
        service.body && (
          <Section className="section-warm relative overflow-hidden">
            <SectionDecor variant="dots" />
            <div className="relative mx-auto max-w-3xl">
              <SectionHeading eyebrow={t("overview.eyebrow")} title={t("overview.title")} />
              <div className="mt-8">
                <Markdown>{service.body}</Markdown>
              </div>
            </div>
            <WaveDivider position="bottom" fill="fill-background" />
          </Section>
        )
      )}

      {/* Cross-links into the wider practice. */}
      <Section>
        <SectionHeading eyebrow={t("related.eyebrow")} title={t("related.title")} />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {t.rich("related.body", {
            migrations: (c) => (
              <Link href="/migrations" className="font-semibold text-primaryDeep link-underline">
                {c}
              </Link>
            ),
            nearshore: (c) => (
              <Link href="/nearshore" className="font-semibold text-primaryDeep link-underline">
                {c}
              </Link>
            ),
            dataai: (c) => (
              <Link href="/data-ai" className="font-semibold text-primaryDeep link-underline">
                {c}
              </Link>
            ),
          })}{" "}
          <Link href="/industries" className="font-semibold text-primaryDeep link-underline">
            {t("related.industries")}
          </Link>
          .
        </p>
      </Section>

      {/* Other services - chip mesh linking every service page to its siblings. */}
      {others.length > 0 && (
        <Section className="bg-surface">
          <SectionHeading eyebrow={t("other.eyebrow")} title={t("other.title")} />
          <div className="mt-8 flex flex-wrap gap-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primaryDeep"
              >
                {s.title}
                <span className="text-muted transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <CtaBand title={t("cta.title", { title: service.title })} />
    </div>
  );
}
