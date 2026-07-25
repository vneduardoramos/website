import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { InlineCta } from "@/components/marketing/Blocks";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Methodology } from "@/components/marketing/home/Methodology";
import { ApproachStory } from "@/components/marketing/approach/ApproachStory";
import { PlateCard } from "@/components/marketing/Cards";
import { RevealGroup } from "@/components/marketing/Motion";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "approach.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/approach", locale });
}

export default async function ApproachPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("approach");

  const runPhases = t.raw("runPhases") as { title: string; body: string }[];
  const impactByPhase = t.raw("impactByPhase") as { phase: string; title: string; body: string }[];

  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <PageHero
            eyebrow={t("hero.eyebrow")}
            title={t.rich("hero.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
            description={t("hero.description")}
          />
        </div>
      </div>

      {/* The centerpiece: the engagement narrated from the sponsor's seat */}
      <Section>
        <SectionHeading
          eyebrow={t("experience.eyebrow")}
          title={t("experience.title")}
          intro={t("experience.intro")}
        />
        <ApproachStory />
        {/* The cadence this page promises is what the nearshore model buys. */}
        <div className="mt-12">
          <InlineCta
            title={t("nearshoreLink.title")}
            href="/nearshore"
            label={t("nearshoreLink.label")}
          />
        </div>
      </Section>

      {/* The six-step methodology (shared with home) */}
      <Methodology />

      {/* How engagements run */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("run.eyebrow")}
            title={t("run.title")}
            intro={t("run.intro")}
          />
          <div className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4">
            {runPhases.map((r) => (
              <div key={r.title} className="card flex h-full flex-col">
                <h3 className="font-display text-lg font-bold text-foreground">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-surface2" />
      </Section>

      {/* Value by horizon */}
      <Section className="section-warm">
        <SectionHeading
          eyebrow={t("impact.eyebrow")}
          title={t("impact.title")}
          intro={t("impact.intro")}
        />
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3" variant="pop">
          {impactByPhase.map((p, i) => (
            <PlateCard key={p.phase} label={p.phase} refCode={`H${i + 1}`} title={p.title}>
              {p.body}
            </PlateCard>
          ))}
        </RevealGroup>
      </Section>

      <FeaturedCaseStudies tint title={t("caseStudies.title")} />

      <CtaBand />
    </>
  );
}
