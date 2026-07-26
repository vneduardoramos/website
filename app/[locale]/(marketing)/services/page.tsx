import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionHeading,
  CtaBand,
} from "@/components/marketing/ui";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { PlateCard, LedgerCard } from "@/components/marketing/Cards";
import { TrustLogos } from "@/components/marketing/TrustBar";
import { SnowMark } from "@/components/marketing/SnowMark";
import { MetricBand, InlineCta } from "@/components/marketing/Blocks";
import { PageHero } from "@/components/marketing/PageHero";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Markdown } from "@/lib/content";
import { getServicesByTier, getSetting } from "@/lib/queries";
import { asStringArray } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { theme } from "@/config/theme";
import type { Locale } from "@/lib/i18n-content";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return pageMeta({
    title: t("title"),
    description: t("description"),
    path: "/services",
    locale,
    ownOgFile: true,
  });
}

type TierMeta = {
  num: string; // two-digit index
  num_cls: string; // big faded index color
  bar: string; // accent bar color
  decor: "dots" | "grid" | "swoosh";
  tint: boolean; // tinted section background
};
const tierMeta: Record<string, TierMeta> = {
  THINK: {
    num: "01",
    num_cls: "text-primary/15",
    bar: "bg-primary",
    decor: "dots",
    tint: false,
  },
  BUILD: {
    num: "02",
    num_cls: "text-secondary/15",
    bar: "bg-secondary",
    decor: "grid",
    tint: true,
  },
  GROW: {
    num: "03",
    num_cls: "text-accent/15",
    bar: "bg-accent",
    decor: "swoosh",
    tint: false,
  },
};

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const [tiers, faqs] = await Promise.all([
    getServicesByTier(locale as Locale),
    getSetting<{ q: string; a: string }[]>("faqs", locale as Locale),
  ]);

  const tierText = t.raw("tiers") as Record<
    string,
    { eyebrow: string; intro: string }
  >;
  const impactMetrics = t.raw("impact.metrics") as { value: string; label: string }[];
  const impactByPhase = t.raw("impact.phases") as {
    phase: string;
    title: string;
    body: string;
  }[];
  const runPhases = t.raw("run.phases") as { label: string; title: string; body: string }[];
  const engagementModels = t.raw("engagement.models") as {
    title: string;
    body: string;
    how: string;
    includes: string[];
    bestFor: string;
  }[];
  const engagementValue = t.raw("engagement.value") as { title: string; body: string }[];

  const localePath = locale === "es" ? "/es" : "";
  // An ItemList whose members are ListItems with a position and a URL, each
  // pointing at the Service node the detail page already mints. Previously the
  // members were bare Service objects with no url and no position, so a consumer
  // could not order them or follow them, and `serviceType` leaked the internal
  // tier name (THINK / BUILD / GROW) as if it described the offering.
  const serviceItemsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${theme.brand.url}${localePath}/services#services`,
    name: `${theme.brand.name} services`,
    numberOfItems: tiers.reduce((n, t2) => n + t2.services.length, 0),
    itemListElement: tiers
      .flatMap(({ services }) => services)
      .map((service, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: service.title,
        url: `${theme.brand.url}${localePath}/services/${service.slug}`,
        item: { "@id": `${theme.brand.url}${localePath}/services/${service.slug}#service` },
      })),
  };

  return (
    <>
      <JsonLd data={[serviceItemsLd, breadcrumbLd([{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }], locale)]} />
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", {
          hl: (c) => (
            <ScrollHighlight color="cyan">
              <span className="text-gradient">{c}</span>
            </ScrollHighlight>
          ),
        })}
        description={t("hero.description")}
        footer={<TrustLogos />}
      />

      {tiers.map(({ tier, services }, tierIdx) => {
        const meta = tierMeta[tier];
        const text = tierText[tier];
        // Running two-digit index across the whole page (01…06).
        const offset = tiers
          .slice(0, tierIdx)
          .reduce((n, t) => n + t.services.length, 0);
        return (
          <Section
            key={tier}
            className={`relative overflow-hidden ${meta?.tint ? "section-tint" : ""}`}
          >
            <SectionDecor variant={meta?.decor ?? "dots"} />
            <div className="relative">
              {/* tier header */}
              <div className="flex items-end gap-5">
                <span
                  className={`font-display text-7xl font-bold leading-[0.8] ${meta?.num_cls}`}
                >
                  {meta?.num}
                </span>
                <div className="pb-1">
                  <p className="eyebrow mb-1">{text?.eyebrow}</p>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {tier}
                  </h2>
                </div>
              </div>
              <div className={`mt-5 h-1 w-16 rounded-full ${meta?.bar}`} />
              <p className="mt-5 max-w-2xl text-lg text-muted">{text?.intro}</p>

              {/* services grid */}
              <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2" variant="pop">
                {services.map((service, i) => {
                  const tools = asStringArray(service.tools);
                  return (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="block h-full"
                    >
                      <LedgerCard
                        eyebrow={text?.eyebrow ?? tier}
                        index={String(offset + i + 1).padStart(2, "0")}
                        title={service.title}
                        foot={
                          tools.length > 0
                            ? [t("toolsLabel"), tools.join(" · ")]
                            : undefined
                        }
                      >
                        <p>{service.summary}</p>
                        {/* Body convention: paragraph 1 is the standalone card
                            pitch (no headings/links); the full long-form body
                            renders only on the detail page. */}
                        {service.body && (
                          <div className="prose-vn mt-3 text-sm">
                            <Markdown>{service.body.split(/\n\s*\n/)[0]}</Markdown>
                          </div>
                        )}
                      </LedgerCard>
                    </Link>
                  );
                })}
              </RevealGroup>
            </div>
            {meta?.tint && <WaveDivider position="bottom" fill="fill-background" />}
          </Section>
        );
      })}

      {/* AGENTIC AI: the control-plane thesis + the AI we deliver on it */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            size="hero"
            eyebrow={t("agentic.eyebrow")}
            title={t.rich("agentic.title", {
              hl: (c) => (
                <ScrollHighlight color="cyan">
                  <span className="text-gradient">{c}</span>
                </ScrollHighlight>
              ),
            })}
            intro={t("agentic.intro")}
          />
          <p className="mt-6 max-w-2xl text-sm text-muted">
            {t.rich("agentic.proofLine", {
              cases: (c) => (
                <Link href="/case-studies" className="font-semibold text-primaryDeep link-underline">
                  {c}
                </Link>
              ),
              dataai: (c) => (
                <Link href="/data-ai" className="font-semibold text-primaryDeep link-underline">
                  {c}
                </Link>
              ),
            })}
          </p>
          <div className="mt-10 max-w-3xl">
            <InlineCta
              title={t("agentic.thesis.title")}
              href="/blog/snowflake-control-plane-agentic-enterprise"
              label={t("agentic.thesis.label")}
            />
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("impact.eyebrow")}
          title={t("impact.title")}
          intro={t("impact.intro")}
        />
        <div className="mt-12">
          <MetricBand metrics={impactMetrics} />
        </div>
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {impactByPhase.map((p, i) => (
            <PlateCard key={p.phase} label={p.phase} refCode={`H${i + 1}`} title={p.title}>
              {p.body}
            </PlateCard>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("run.eyebrow")}
            title={t("run.title")}
            intro={t("run.intro")}
          />
          <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
            {runPhases.map((r) => (
              <LedgerCard key={r.title} eyebrow={r.label} title={r.title}>
                {r.body}
              </LedgerCard>
            ))}
          </RevealGroup>
          <p className="mt-8 text-sm text-muted">
            {t.rich("run.securityLine", {
              link: (c) => (
                <Link href="/security" className="font-semibold text-primaryDeep hover:underline">
                  {c}
                </Link>
              ),
            })}
          </p>
        </div>
      </Section>

      {/* The stack itself lives on /platform (single source of truth); this is
          just the scent trail. */}
      {/* The head-term consulting/implementation page: buyers searching for it
          land here from nav, so give the overview an explicit route to it. */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <InlineCta
            title={t("consultingCta.title")}
            href="/snowflake-consulting-services"
            label={t("consultingCta.label")}
          />
        </div>
      </Section>

      <Section className="section-warm">
        <SectionHeading
          eyebrow={<><SnowMark size={11} />{t("stack.eyebrow")}</>}
          title={t("stack.title")}
          intro={t("stack.intro")}
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <InlineCta
            title={t("stack.cta.title")}
            href="/platform"
            label={t("stack.cta.label")}
          />
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          eyebrow={t("engagement.eyebrow")}
          title={t("engagement.title")}
          intro={t("engagement.intro")}
        />
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {engagementModels.map((m, i) => (
            <LedgerCard key={m.title} eyebrow={m.title} index={`0${i + 1}`} foot={[t("engagement.bestForLabel"), m.bestFor]}>
              <p className="text-muted">{m.body}</p>
              <p className="mt-4 leading-relaxed text-foreground/90">
                <span className="font-semibold">{t("engagement.howItWorksLabel")}</span> {m.how}
              </p>
              <ul className="mt-3 space-y-1.5">
                {m.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted">
                    <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primaryDeep/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </LedgerCard>
          ))}
        </RevealGroup>

        {/* UVP: what's constant across every model */}
        <div className="panel-warm mt-12 rounded-3xl p-8 md:p-10">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("engagement.panel.eyebrow")}</p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("engagement.panel.title")}
            </h3>
            <p className="mt-3 text-muted">
              {t("engagement.panel.body")}
            </p>
          </div>
          <RevealGroup className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3" variant="fade-up">
            {engagementValue.map((v) => (
              <div key={v.title} className="flex gap-3">
                <span className="mt-1 shrink-0 text-primaryDeep" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l4 4 10-11" />
                  </svg>
                </span>
                <div>
                  <h4 className="font-display font-bold text-foreground">{v.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{v.body}</p>
                </div>
              </div>
            ))}
          </RevealGroup>
          <LeadershipStrip label={t("engagement.leadershipLabel")} className="mt-8 border-t border-border pt-6" />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-6">
          <p className="eyebrow mb-2">{t("engagement.cost.eyebrow")}</p>
          <p className="text-muted">{t("engagement.cost.body")}</p>
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {t("engagement.footer.note")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary btn-sm">
              {t("engagement.footer.contactCta")}
            </Link>
            <Link href="/partnership#comparison" className="btn-ghost btn-sm">
              {t("engagement.footer.partnerCta")}
            </Link>
          </div>
        </div>
      </Section>

      {faqs && faqs.length > 0 && (
        <Section>
          <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
          <div className="max-w-3xl mt-12 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="card group">
                <summary className="font-display text-lg font-bold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-primary text-2xl ml-4 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-muted mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
