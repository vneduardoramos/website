import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Img as Image } from "@/components/marketing/Img";
import { pageMeta, breadcrumbLd, webPageLd, serviceLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { AnthropicMark } from "@/components/marketing/ProviderMark";
import { LedgerCard } from "@/components/marketing/Cards";
import { Interplay } from "@/components/marketing/data-ai/Interplay";
import { BuiltWithAnthropic } from "@/components/marketing/data-ai/BuiltWithAnthropic";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dataAi.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/data-ai", locale });
}

export default async function DataAiPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("dataAi");

  const heroChips = t.raw("heroChips") as string[];

  // What we actually ship: concrete use cases, each with its Snowflake mechanism
  // and, where one exists, the real (anonymized) engagement that proves it.
  const useCases = t.raw("useCases") as {
    eyebrow: string;
    title: string;
    body: string;
    mech: string;
    stat?: string;
    proof?: { label: string; href: string };
  }[];

  return (
    <>
      <JsonLd
        data={[
          webPageLd({
            path: "/data-ai",
            name: t("meta.title"),
            description: t("meta.description"),
            locale,
          }),
          breadcrumbLd(
            [{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }],
            locale,
          ),
          serviceLd({
            name: t("meta.title"),
            description: t("meta.description"),
            path: "/data-ai",
            serviceType: 'AI agents on Snowflake',
            locale,
          }),
        ]}
      />
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow={t("hero.eyebrow")}
            title={t.rich("hero.title", { hl: (c) => <ScrollHighlight>{c}</ScrollHighlight> })}
            description={t("hero.description")}
          >
            <div className="flex flex-wrap justify-center gap-2">
              {heroChips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </PageHero>
        </div>
      </div>

      {/* THE THESIS, SHOWN: two planes that interplay. The contrasting kick
          right after the light hero. */}
      <Section className="section-tint relative overflow-hidden">
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("how.eyebrow")}
            title={t("how.title")}
            intro={t("how.intro")}
          />
          <div className="mt-12">
            <Interplay />
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* WHAT WE SHIP: the dark kick. White cards on deep indigo, real
          engagement numbers on the proven ones. */}
      <Section>
        <div className="panel-dark relative overflow-hidden rounded-3xl p-7 shadow-soft-lg md:p-12">
          <div className="relative">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">{t("ship.eyebrow")}</p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.08]">
                {t("ship.title")}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {t("ship.intro")}
              </p>
            </div>
            <RevealGroup className="mt-10 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
              {useCases.map((u) => (
                <LedgerCard key={u.title} eyebrow={u.eyebrow} title={u.title} foot={[t("runsOn"), u.mech]}>
                  <p>{u.body}</p>
                  {u.stat && (
                    <p className="mt-3 font-mono text-[0.78rem] font-semibold text-primaryDeep">
                      {u.stat}
                    </p>
                  )}
                  {u.proof && (
                    <p className="mt-1.5">
                      <Link
                        href={u.proof.href}
                        className="text-sm font-semibold text-primaryDeep underline-offset-4 hover:underline"
                      >
                        {u.proof.label}
                      </Link>
                    </p>
                  )}
                </LedgerCard>
              ))}
            </RevealGroup>
            <p className="mt-8 text-center text-sm text-muted">
              {t.rich("useCasesFootnote", {
                link: (c) => (
                  <Link href="/contact" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
                    {c}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </Section>

      {/* Governed by default: the governance that spans both planes */}
      <Section className="section-warm relative overflow-hidden">
        <FeatureSplit
          eyebrow={t("governed.eyebrow")}
          title={t("governed.title")}
          body={t("governed.body")}
          bullets={t.raw("governed.bullets") as string[]}
          ratio="wide-visual"
          visual={
            /* Real product screen, in the ProductShots browser-frame treatment. */
            <figure>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                <div aria-hidden className="flex items-center gap-1.5 border-b border-border bg-surface2 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-red/70" />
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <span className="h-2 w-2 rounded-full bg-success/80" />
                </div>
                <Image
                  src="/assets/images/product/cowork-home.webp"
                  alt={t("governed.imageAlt")}
                  width={1920}
                  height={860}
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="w-full"
                />
              </div>
              <figcaption className="mt-3 px-1 text-sm text-muted">
                {t("governed.figcaption")}
              </figcaption>
            </figure>
          }
        />
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The Anthropic moment: partner + Claude as default, on both planes */}
      <Section>
        <BuiltWithAnthropic />
      </Section>

      {/* Proof */}
      <Section className="text-center">
        <SectionHeading
          align="center"
          eyebrow={t("credentials.eyebrow")}
          title={t("credentials.title")}
          intro={t("credentials.intro")}
        />
        <div className="mt-12 flex justify-center">
          <PartnerBadges variant="logos" />
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted">
          <AnthropicMark size={16} />
          {t("credentials.anthropicLine")}
        </p>
      </Section>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
