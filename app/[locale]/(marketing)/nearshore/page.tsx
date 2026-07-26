import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { pageMeta } from "@/lib/seo";
import { officesLd } from "@/lib/offices";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { BookACall } from "@/components/marketing/BookACall";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { MetricBand } from "@/components/marketing/Blocks";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { TwoClocks } from "@/components/marketing/nearshore/TwoClocks";
import { getClientBands } from "@/lib/client-bands";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import {
  DatabaseIcon,
  CpuIcon,
  ShieldIcon,
  DataStackIcon,
} from "@/components/marketing/home/Icons";
import { LedgerCard } from "@/components/marketing/Cards";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nearshore.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/nearshore", locale });
}

export default async function NearshorePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("nearshore");

  const bands = await getClientBands();

  const heroChips = t.raw("hero.chips") as string[];

  // Why nearshore with Viewnear: the real differentiators, reframed for data + AI.
  const reasons = t.raw("reasons") as { label: string; title: string; body: string }[];

  // Verified credentials only (no vanity metrics).
  const numbers = t.raw("numbers") as { value: string; label: string }[];

  // What the nearshore team delivers, mapped to Viewnear's service areas. Icons
  // stay in code (component refs); copy comes from the message catalog by index.
  const deliverIcons = [DatabaseIcon, CpuIcon, ShieldIcon, DataStackIcon];
  const delivers = t.raw("delivers") as { title: string; body: string }[];

  const stack = t.raw("stack") as string[];

  return (
    <>
      {/* The nearshore claim is geographic, so emit the real addresses. */}
      <JsonLd data={officesLd()} />
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
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
          >
            <div className="flex flex-wrap justify-center gap-2">
              {heroChips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
            {/* The time-zone claim, proven by the actual clocks. Mexico dropped
                DST in 2022, so Monterrey holds CST while US Central moves to
                CDT from March to November: the clocks read an hour apart for
                most of the year, and the note says so instead of letting the
                widget contradict the copy. */}
            <TwoClocks />
            <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-muted">
              {t("hero.clocksNote")}
            </p>
          </PageHero>
        </div>
      </div>

      {/* Trust: real client logos */}
      <Section>
        <p className="eyebrow mb-8 text-center">{t("trust.eyebrow")}</p>
        <LogoRow logos={bands.top} />
      </Section>

      {/* Why nearshore with Viewnear */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("reasonsHeading.eyebrow")}
            title={t("reasonsHeading.title")}
            intro={t("reasonsHeading.intro")}
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
            {/* The time-zone card, carried by the actual office: a real address
                beats an icon for proving "nearshore" means a real team here. */}
            <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-border shadow-soft">
              <Image
                src="/assets/images/life/lounge.jpg"
                alt={t("monterrey.imageAlt")}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg font-bold text-white">
                  {t("monterrey.title")}
                </h3>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/75">
                  {t("monterrey.caption")}
                </p>
              </div>
            </div>
            {reasons.map(({ label, title, body }) => (
              <LedgerCard key={title} eyebrow={label} title={title}>
                {body}
              </LedgerCard>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Proximity: the part of "nearshore" that is geography, not scheduling.
          Flights, distance, and onsite cadence, which the rest of the page
          asserts ("in sync") but never actually evidences. */}
      <Section>
        <FeatureSplit
          as="h2"
          eyebrow={t("proximity.eyebrow")}
          title={t.rich("proximity.title", {
            hl: (c) => <span className="text-gradient">{c}</span>,
          })}
          body={t("proximity.body")}
          bullets={t.raw("proximity.bullets") as string[]}
          image="/assets/images/life/monterrey.jpg"
          imageAlt={t("proximity.imageAlt")}
          cta={{ label: t("proximity.cta"), href: "/nearshore/monterrey" }}
        />
      </Section>

      {/* By the numbers */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow={t("numbersHeading.eyebrow")}
          title={t("numbersHeading.title")}
        />
        <div className="mt-12">
          <MetricBand metrics={numbers} />
        </div>
      </Section>

      {/* What we deliver nearshore */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("deliverHeading.eyebrow")}
            title={t("deliverHeading.title")}
            intro={t("deliverHeading.intro")}
          />
          <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
            {delivers.map(({ title, body }, i) => {
              const Icon = deliverIcons[i];
              return (
                <div key={title} className="card card-hover flex h-full flex-col">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accentDeep">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-muted">{body}</p>
                </div>
              );
            })}
          </RevealGroup>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {stack.map((s) => (
              <span key={s} className="pill-chip">
                {s}
              </span>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The team behind it */}
      <Section>
        <FeatureSplit
          eyebrow={t("team.eyebrow")}
          title={t.rich("team.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
          body={t("team.body")}
          bullets={t.raw("team.bullets") as string[]}
          image="/assets/images/life/team-group.jpg"
          imageAlt={t("team.imageAlt")}
          reverse
          cta={{ label: t("team.cta"), href: "/approach" }}
        />
      </Section>

      {/* (Partner badges intentionally not repeated here: the credentials band
          above already carries Premier + CoCo Preferred, and the hero chips name
          both. One trust layer fewer, same claims.) */}

      {/* Booking replaces the generic CTA here: this page is evaluation-stage,
          so "talk to the person who would own it" beats "let's talk". */}
      <BookACall variant="compact" />
    </>
  );
}
