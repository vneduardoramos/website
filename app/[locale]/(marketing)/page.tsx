import { Img as Image } from "@/components/marketing/Img";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSetting, getServices, safe } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { pageMeta } from "@/lib/seo";
import { officesLd } from "@/lib/offices";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/marketing/home/Hero";
import { ServicesGrid } from "@/components/marketing/home/ServicesGrid";
import { FoundationPhoto } from "@/components/marketing/home/SplitVisuals";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { Faq } from "@/components/marketing/Faq";
import { RevealGroup, ScrollHighlight, SectionFold } from "@/components/marketing/Motion";
import { IndustriesStrip } from "@/components/marketing/home/IndustriesStrip";
import { CustomersFeature } from "@/components/marketing/home/CustomersFeature";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import { getClientBands } from "@/lib/client-bands";
import { PlateCard } from "@/components/marketing/Cards";
import { SnowMark, SnowflakeDivider } from "@/components/marketing/SnowMark";
import { LeadershipStrip, FaceStack } from "@/components/marketing/LeadershipStrip";
import { PressStrip } from "@/components/marketing/PressStrip";

export const revalidate = 60;

type HeroSetting = { headline: string; subhead: string };
type FaqItem = { q: string; a: string };

// Official Snowflake credibility badges (real artwork; shown on white chips so
// they read on the deep indigo Proof & Trust band).
const BADGES = [
  { src: "/assets/images/certs/premier.webp", w: 460, h: 460 },
  { src: "/assets/images/certs/coco-preferred.png", w: 1910, h: 1572 },
  { src: "/assets/images/certs/snowpro-core.png", w: 487, h: 402 },
];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const base = pageMeta({ title: t("title"), description: t("description"), path: "/", locale });
  // Keep the flagship home <title> absolute (no "| Viewnear" template suffix),
  // as it was before i18n; pageMeta still supplies the locale-aware canonical,
  // hreflang alternates, and the OG/Twitter title.
  return { ...base, title: { absolute: t("title") } };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [hero, services, faqs, bands] =
    await Promise.all([
      safe(getSetting<HeroSetting>("hero", locale as Locale), null),
      safe(getServices(locale as Locale), []),
      safe(getSetting<FaqItem[]>("faqs", locale as Locale), null),
      getClientBands(),
    ]);

  const beats = t.raw("outcomes.beats") as { title: string; body: string }[];
  const derisk = t.raw("derisk.cards") as { label: string; title: string; body: string }[];
  const badgeAlts = t.raw("proof.badgeAlts") as string[];

  // The home page teases the first five questions; /faq carries the full list
  // and is the only page that emits FAQPage structured data.
  const homeFaqs = faqs?.slice(0, 5) ?? null;

  return (
    <>
      {/* The home page is the entity's main entry point, so it carries the two
          physical offices as ProfessionalService alongside the site-wide
          Organization from the layout. Geography is central to the positioning
          and this page previously asserted none of it in structured data. */}
      <JsonLd data={officesLd()} />

      {/* 1) HERO (the hero's mono line carries the credential; the badges get
          their full moment once, in the Proof & Trust band below) */}
      <Hero subhead={hero?.subhead} />

      {/* PROOF EARLY: who already trusts us, right after the hero */}
      <section className="pt-2 pb-2 md:pt-4 md:pb-3">
        <div className="container-page">
          <LogoRow logos={bands.top} />
        </div>
      </section>
      <CustomersFeature bottomLogos={bands.bottom} />

      {/* 3) THE PATH: customer-first foundation + AI */}
      <Section className="section-tint">
        <FeatureSplit
          eyebrow={t("foundation.eyebrow")}
          title={t("foundation.title")}
          body={t("foundation.body")}
          bullets={t.raw("foundation.bullets") as string[]}
          visual={<FoundationPhoto />}
          ratio="wide-visual"
          cta={{ label: t("foundation.cta"), href: "/services" }}
        />
      </Section>

      {/* IN THE PRESS: third-party validation follows the foundation split,
          a plain band between the cool foundation and the warm services grid. */}
      <PressStrip />

      {/* 3) WHAT WE DO */}
      <ServicesGrid services={services} />

      {/* 3b) WHO WE SERVE: industries */}
      <IndustriesStrip />

      {/* Ambient cue: a snowflake dinkus marks the shift from what we do to how we charge. */}
      <SnowflakeDivider className="my-4" />

      {/* 4) BUILT FOR OUTCOMES: now that the reader knows what we deliver, the
          thesis explains how we charge for it (and why that's safer for them). */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl md:leading-[1.08]">
            {t.rich("outcomes.heading", { hl: (c) => <ScrollHighlight>{c}</ScrollHighlight> })}
          </h2>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
            {t("outcomes.lede")}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* The argument */}
          <div className="lg:col-span-7">
            <RevealGroup as="ul" variant="fade-up">
              {beats.map((s, i) => (
                <li
                  key={s.title}
                  className="flex gap-5 border-t border-border py-7 first:border-t-0 first:pt-0 md:gap-7"
                >
                  <span
                    className="mt-1 font-mono text-sm font-semibold tracking-widest text-primaryDeep"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-snug text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-lg leading-relaxed text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </RevealGroup>
            <p className="mt-9 border-t border-border pt-7 text-xl font-medium leading-relaxed text-foreground/90">
              {t.rich("outcomes.closing", {
                hlCyan: (c) => <ScrollHighlight color="cyan">{c}</ScrollHighlight>,
              })}
            </p>
            {/* The accountability claim, with the accountable faces right under it. */}
            <LeadershipStrip label={t("outcomes.leadershipLabel")} className="mt-7" />
          </div>

          {/* The source: a featured read in its own column */}
          <div className="lg:col-span-5">
            <Link
              href="/blog/from-hours-to-outcomes-ai-economics-services"
              className="group block overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft-lg lg:sticky lg:top-28"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/assets/images/blog/from-hours-to-outcomes-ai-economics-services.jpg"
                  alt={t("outcomes.featured.imageAlt")}
                  width={720}
                  height={450}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-7">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primaryDeep">
                  {t("outcomes.featured.eyebrow")}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug text-foreground">
                  {t("outcomes.featured.title")}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {t("outcomes.featured.body")}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primaryDeep">
                  {t("outcomes.featured.cta")}
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Section>

      {/* 4a) DE-RISKED BY DESIGN: quiet the "big bet" fear */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow={t("derisk.heading.eyebrow")}
          title={t("derisk.heading.title")}
          intro={t("derisk.heading.intro")}
        />
        <RevealGroup className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4" variant="pop">
          {derisk.map((d, i) => (
            <PlateCard key={d.title} label={d.label} refCode={`0${i + 1}`} title={d.title}>
              {d.body}
            </PlateCard>
          ))}
        </RevealGroup>

        {/* The build-vs-buy case: same risk-reduction beat, now carrying the
            speed/cost contrast against hiring in-house, so the whole "safe bet"
            story lands in one place. */}
        <div className="panel-warm mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 shadow-soft md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-balance font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
              {t.rich("derisk.panel.headline", {
                weeks: (c) => <span className="text-primaryDeep">{c}</span>,
                months: (c) => <span className="text-red">{c}</span>,
              })}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {t.rich("derisk.panel.body", {
                nearshore: (c) => (
                  <Link href="/nearshore" className="link-underline font-medium text-primaryDeep">
                    {c}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            {/* The CTA promises a person; show the actual people. */}
            <FaceStack slugs={["eduardo-ramos", "jc-rodriguez", "rene-trevino"]} />
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">{t("derisk.panel.ctaPrimary")}</Link>
              <Link href="/partnership" className="btn-ghost">{t("derisk.panel.ctaGhost")}</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 4b) PROOF & TRUST: the deep royal-indigo authority band */}
      <Section>
        <SectionFold angle={12}>
          <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-soft-lg md:p-14">
            {/* Ambient cue: the platform is literally the backdrop. */}
            <SnowMark variant="white" size={200} className="pointer-events-none absolute -bottom-12 -left-10 opacity-[0.05]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="eyebrow eyebrow--invert mb-4">{t("proof.eyebrow")}</p>
                <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-white md:text-[2.6rem] md:leading-[1.08]">
                  {t("proof.title")}
                </h2>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75">
                  {t("proof.body")}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-6">
                  {BADGES.map((b, i) => (
                    <Image
                      key={b.src}
                      src={b.src}
                      alt={badgeAlts[i]}
                      width={b.w}
                      height={b.h}
                      className="h-14 w-auto"
                    />
                  ))}
                </div>
                <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/70">
                  {t.rich("proof.security", {
                    link: (c) => (
                      <Link
                        href="/security"
                        className="font-semibold text-white underline-offset-4 hover:underline"
                      >
                        {c}
                      </Link>
                    ),
                  })}
                </p>
              </div>
              {/* The recognition, photographed: Viewnear on Snowflake's CoCo
                  Partner Momentum wall. A badge asserts; the photo proves. */}
              <figure>
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl ring-1 ring-white/15">
                  <Image
                    src="/assets/images/life/partner-momentum.jpg"
                    alt={t("proof.figureAlt")}
                    fill
                    sizes="(max-width:1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/60">
                  {t("proof.figcaption")}
                </figcaption>
              </figure>
            </div>
          </div>
        </SectionFold>
      </Section>

      {/* 5) FAQ */}
      {homeFaqs && homeFaqs.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow={t("faq.eyebrow")}
            title={t("faq.title")}
            center
          />
          <div className="mt-12">
            <Faq items={homeFaqs} />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
            >
              <span className="link-underline">{t("faq.all")}</span>
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </Section>
      )}

      {/* CTA: restate the stakes, confident close */}
      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
      />
    </>
  );
}
