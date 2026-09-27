import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Section, CtaBand } from "@/components/marketing/ui";
import { Link } from "@/i18n/navigation";
import { PRESS_HOME_QUOTE, PRIMARY_SPEAKER, getOutlet } from "@/lib/press";
import {
  PartnerHero,
  TwoWays,
  Sequence,
  InPractice,
  AroundIt,
  Leaders,
  OtherHalf,
  hl,
} from "@/components/marketing/partnership/PartnerPageBlocks";

const PATH = "/partnership/claude";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnershipClaude.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: PATH, locale });
}

export default async function ClaudePartnershipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("partnershipClaude");
  const outlet = getOutlet(PRESS_HOME_QUOTE.outlet);

  return (
    <>
      <JsonLd
        data={[
          webPageLd({ path: PATH, name: t("meta.title"), description: t("meta.description"), locale }),
          breadcrumbLd(
            [
              { name: t("breadcrumb.home"), url: "/" },
              { name: t("breadcrumb.partnership"), url: "/partnership" },
              { name: t("breadcrumb.current") },
            ],
            locale,
          ),
        ]}
      />

      <PartnerHero
        eyebrow={t("hero.eyebrow")}
        kicker={t("hero.kicker")}
        title={t.rich("hero.title", { hl })}
        description={t("hero.description")}
        ctaPrimary={t("hero.ctaPrimary")}
        ctaSecondary={t("hero.ctaSecondary")}
      />

      <TwoWays eyebrow={t("ways.eyebrow")} title={t("ways.title")} items={t.raw("ways.items") as { title: string; body: string }[]} />

      <Sequence
        eyebrow={t("gate.eyebrow")}
        title={t("gate.title")}
        intro={t("gate.intro")}
        steps={t.raw("gate.steps") as { title: string; body: string }[]}
        note={t("gate.note")}
        className="section-warm"
      />

      {/* Proof discipline: Magnolia is the one published agentic engagement, so
          the second card is the service built from it, labeled as a service. */}
      <InPractice
        eyebrow={t("practice.eyebrow")}
        title={t("practice.title")}
        slugs={["magnolia-doors-installation-scheduling"]}
        locale={locale}
        extra={{
          eyebrow: t("practice.serviceCard.eyebrow"),
          title: t("practice.serviceCard.title"),
          body: t("practice.serviceCard.body"),
          cta: t("practice.serviceCard.cta"),
          // /services/agentic-solutions does not exist on this site; /data-ai is
          // where the agentic offer actually lives.
          href: "/data-ai",
        }}
      />

      <AroundIt
        eyebrow={t("around.eyebrow")}
        title={t.rich("around.title", { hl })}
        intro={t("around.intro")}
        items={t.raw("around.items") as { title: string; body: string }[]}
      />

      {/* The one third-party line that names both Snowflake and Claude, verbatim
          and untranslated, credited to the speaker as lib/press.ts requires. */}
      <Section className="section-tint">
        <figure className="card mx-auto max-w-3xl bg-background">
          <p className="eyebrow">{t("proof.eyebrow")}</p>
          <blockquote className="mt-4 text-balance font-display text-xl font-medium leading-snug text-foreground md:text-2xl">
            &ldquo;{PRESS_HOME_QUOTE.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span>{t("proof.attribution", { name: PRIMARY_SPEAKER, outlet: outlet.name })}</span>
            <span aria-hidden="true">·</span>
            <a href={PRESS_HOME_QUOTE.url} target="_blank" rel="noopener" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
              {t("proof.sourceLabel")}
            </a>
            <span aria-hidden="true">·</span>
            <Link href="/press" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
              {t("proof.pressCta")}
            </Link>
          </figcaption>
        </figure>
      </Section>

      <Leaders eyebrow={t("leaders.eyebrow")} title={t("leaders.title")} body={t("leaders.body")} />

      <OtherHalf title={t("snowflakeLink.title")} label={t("snowflakeLink.label")} href="/partnership/snowflake" />

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primary={{ label: t("hero.ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("hero.ctaSecondary"), href: "/case-studies" }}
      />
    </>
  );
}
