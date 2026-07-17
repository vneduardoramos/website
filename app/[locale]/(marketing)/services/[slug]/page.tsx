import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { PageHero } from "@/components/marketing/PageHero";
import { Section, SectionHeading, Pill, CtaBand } from "@/components/marketing/ui";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { getServiceBySlug, getServiceSlugs, getServices } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { asStringArray } from "@/lib/utils";
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
  const t = await getTranslations("serviceDetail");

  const service = await getServiceBySlug(slug, locale as Locale);
  if (!service) notFound();

  const tools = asStringArray(service.tools);

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

  return (
    <>
      {/* Breadcrumbs (below) already emits the page's BreadcrumbList JSON-LD,
          so only the Service entity is emitted here to avoid a duplicate
          structured-data block. */}
      <JsonLd data={serviceLd} />

      <div className="container-page pt-8 md:pt-10">
        <Breadcrumbs
          items={[
            { label: t("breadcrumb.home"), href: "/" },
            { label: t("breadcrumb.services"), href: "/services" },
            { label: service.title },
          ]}
        />
      </div>

      {/* Hero - H1 is the service title itself (the head term), with an
          eyebrow that anchors it in the Snowflake context. */}
      <PageHero align="left" eyebrow={t("hero.eyebrow")} title={service.title} description={service.summary}>
        <div className="flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary">
            {t("hero.primaryCta")}
          </Link>
          <Link href="/services" className="btn-ghost">
            {t("hero.secondaryCta")}
          </Link>
        </div>
      </PageHero>

      {/* Overview - the seeded body copy, rendered as markdown. */}
      {service.body && (
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
      )}

      {/* Tools & products - only for services that carry a stack list. */}
      {tools.length > 0 && (
        <Section>
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
      )}

      {/* Cross-links into the wider practice: migrations, nearshore, data & AI, industries. */}
      <Section className="bg-surface">
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
        <Section>
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
    </>
  );
}
