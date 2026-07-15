import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeaturedCaseStudies } from "@/components/marketing/FeaturedCaseStudies";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import type { Layer } from "@/components/marketing/platform/PlatformStack";
import { ProductIndex } from "@/components/marketing/platform/StackDiagram";
import { ProductShots } from "@/components/marketing/platform/ProductShots";
import { StackStory } from "@/components/marketing/platform/StackStory";
import { RevealGroup } from "@/components/marketing/Motion";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "platform.meta" });
  return pageMeta({
    title: t("title"),
    description: t("description"),
    path: "/platform",
    locale,
    ownOgFile: true,
  });
}

export default async function PlatformPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("platform");

  const layers = t.raw("layers") as Layer[];

  // Why-native proof points (formerly a FeatureSplit with a stock photo).
  const whyNative = t.raw("whyNative") as { title: string; body: string }[];

  return (
    <>
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

      {/* The stack, narrated as an engagement: the page's centerpiece */}
      <Section>
        <SectionHeading
          eyebrow={t("stackStory.eyebrow")}
          title={t("stackStory.title")}
          intro={t("stackStory.intro")}
        />
        <StackStory />
      </Section>

      {/* The work, on screen: real build environments, not mockups */}
      <Section className="section-tint relative overflow-hidden">
        <div className="relative">
          <SectionHeading
            eyebrow={t("onScreen.eyebrow")}
            title={t("onScreen.title")}
            intro={t("onScreen.intro")}
          />
          <ProductShots />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The conviction: our practice, not a platform pitch */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            eyebrow={t("conviction.eyebrow")}
            title={t("conviction.title")}
            intro={t("conviction.intro")}
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4" variant="fade-up">
            {whyNative.map((w) => (
              <div key={w.title} className="border-t border-border pt-4">
                <h3 className="font-display text-base font-bold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The parts list: reference, not pitch */}
      <Section>
        <SectionHeading
          eyebrow={t("partsList.eyebrow")}
          title={t("partsList.title")}
          intro={t("partsList.intro")}
        />
        <ProductIndex layers={layers} />
      </Section>

      <FeaturedCaseStudies tint title={t("featuredCaseStudies.title")} />

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
