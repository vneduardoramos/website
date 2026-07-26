import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionHeading,
  CtaBand,
} from "@/components/marketing/ui";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PlateCard } from "@/components/marketing/Cards";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "security.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/security", locale });
}

export default async function SecurityPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("security");

  // Snowflake's platform certifications that our work inherits. We're explicit
  // that these are the platform's; we build on top of them, we don't claim them.
  const platformCompliance = t.raw("platformCompliance") as { name: string; note: string }[];

  const practices = t.raw("practices") as { label: string; title: string; body: string }[];

  // The two halves of the trust story: what Snowflake's audits cover, and the
  // delivery practices we bring on top. Rendered as the inherited-vs-ours board.
  const inheritedControls = t.raw("inheritedControls") as string[];
  const ourControls = t.raw("ourControls") as string[];

  const verticals = t.raw("verticals") as { sector: string; body: string }[];

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }], locale)} />
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow={t("hero.eyebrow")}
            title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            description={t("hero.description")}
          />
        </div>
      </div>

      {/* Platform compliance inheritance */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("compliance.eyebrow")}
            title={t("compliance.title")}
            intro={t("compliance.intro")}
          />
          <div className="mt-12 grid grid-cols-2 gap-4 md:auto-rows-fr md:grid-cols-3">
            {platformCompliance.map((c) => (
              <div key={c.name} className="card flex h-full flex-col bg-background">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {c.name}
                </h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                  {c.note}
                </p>
              </div>
            ))}
          </div>

          {/* Inherited vs. ours: the platform's audits on one side, our delivery practices on the other. */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-6 md:p-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                  {t("inheritedLabel")}
                </p>
                <ul className="mt-4 divide-y divide-border">
                  {inheritedControls.map((c) => (
                    <li key={c} className="py-2.5 text-sm text-foreground/90">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 md:p-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                  {t("ourLabel")}
                </p>
                <ul className="mt-4 divide-y divide-border">
                  {ourControls.map((c) => (
                    <li key={c} className="py-2.5 text-sm text-foreground/90">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* How we build securely */}
      <Section>
        <SectionHeading
          eyebrow={t("practicesHeading.eyebrow")}
          title={t("practicesHeading.title")}
          intro={t("practicesHeading.intro")}
        />
        <div className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
          {practices.map((p, i) => (
            <PlateCard
              key={p.title}
              label={p.label}
              refCode={`CTRL-0${i + 1}`}
              title={p.title}
              stamp
            >
              {p.body}
            </PlateCard>
          ))}
        </div>
      </Section>

      {/* Governance overview split */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <FeatureSplit
            eyebrow={t("governance.eyebrow")}
            title={t.rich("governance.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            body={t("governance.body")}
            bullets={t.raw("governance.bullets") as string[]}
            image="/assets/images/photos/data-center-server-racks.jpg"
            imageAlt={t("governance.imageAlt")}
            cta={{ label: t("governance.cta"), href: "/contact" }}
          />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Vertical compliance */}
      <Section>
        <SectionHeading
          eyebrow={t("verticalsHeading.eyebrow")}
          title={t("verticalsHeading.title")}
          intro={t("verticalsHeading.intro")}
        />
        <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-3">
          {verticals.map((v) => (
            <div key={v.sector} className="card flex h-full flex-col">
              <h3 className="font-display text-lg font-bold text-foreground">{v.sector}</h3>
              <p className="mt-3 text-muted">{v.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          {t.rich("contactLine", {
            link: (c) => (
              <Link href="/contact" className="font-semibold text-primaryDeep hover:underline">
                {c}
              </Link>
            ),
          })}
        </p>
      </Section>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
