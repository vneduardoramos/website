import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/marketing/ui";
import { MetricBand, InlineCta } from "@/components/marketing/Blocks";
import { TeamCard } from "@/components/marketing/TeamCard";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { FieldStrip } from "@/components/marketing/FieldStrip";
import { TrustLogos } from "@/components/marketing/TrustBar";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { PartnershipHighlight } from "@/components/marketing/PartnershipHighlight";
import {
  CheckIcon,
  ShieldIcon,
  PipelineIcon,
  DocIcon,
  CompassIcon,
} from "@/components/marketing/home/Icons";
import { PlateCard } from "@/components/marketing/Cards";
import { getTeam } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/about", locale });
}

// Icons pair with the principles copy by index (title/body live in messages).
const principleIcons = [CheckIcon, ShieldIcon, PipelineIcon, DocIcon, CompassIcon];

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tb = await getTranslations("booking");

  const team = await getTeam(locale as Locale);

  const heroChips = t.raw("heroChips") as string[];

  // What every engagement gets: the operating model, end to end.
  const operating = t.raw("operating") as string[];

  // The firm's arc in four plates. No dates we can't verify; each line is
  // grounded in copy that already lives elsewhere on the site.
  const milestones = t.raw("milestones") as { label: string; title: string; body: string }[];

  // Verifiable credential snapshot (no vanity metrics).
  const trackRecord = t.raw("trackRecord") as { value: string; label: string }[];

  // How we operate: the principles enterprise buyers actually evaluate.
  const principles = t.raw("principles") as { title: string; body: string }[];

  // Governance & trust posture (enterprise procurement checklist).
  const governance = t.raw("governance") as string[];

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: t("breadcrumb.home"), url: "/" }, { name: t("breadcrumb.current") }], locale)} />
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
      >
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {heroChips.map((c) => (
            <span key={c} className="pill-chip">
              {c}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Snowflake partnership: Premier + CoCo Preferred Partner + Summit 2026 (lead section) */}
      <PartnershipHighlight showCta />

      {/* Who we are / how we operate (folds in a brief origin) */}
      <Section>
        <FeatureSplit
          as="h2"
          ratio="wide-text"
          eyebrow={t("whoWeAre.eyebrow")}
          title={t("whoWeAre.title")}
          body={t("whoWeAre.body")}
          bullets={operating}
          cta={{ label: t("whoWeAre.cta"), href: "/services" }}
          visual={
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-soft-lg">
              <Image
                src="/assets/images/life/about-collage.jpg"
                alt={t("whoWeAre.imageAlt")}
                width={1500}
                height={1500}
                className="aspect-square w-full object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-royal/10 via-transparent to-secondary/10" />
            </div>
          }
        />

        {/* The arc so far: a compact firm timeline under the origin story. */}
        <div className="mt-16 flex items-center gap-4">
          <p className="eyebrow">{t("arcLabel")}</p>
          <span className="h-px flex-1 bg-border" />
        </div>
        <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 md:auto-rows-fr md:grid-cols-4" variant="pop">
          {milestones.map((m, i) => (
            <PlateCard key={`T${i + 1}`} label={m.label} refCode={`T${i + 1}`} title={m.title}>
              {m.body}
            </PlateCard>
          ))}
        </RevealGroup>
      </Section>

      {/* Track record: verifiable credentials */}
      <Section className="section-tint">
        <SectionHeading
          eyebrow={t("trackRecordHeading.eyebrow")}
          title={t("trackRecordHeading.title")}
          intro={t("trackRecordHeading.intro")}
          center
        />
        <div className="mt-12">
          <MetricBand metrics={trackRecord} />
        </div>
        {/* The track record is delivered from two offices; name where. */}
        <div className="mt-10">
          <InlineCta
            title={t("monterreyLink.title")}
            href="/nearshore/monterrey"
            label={t("monterreyLink.label")}
          />
        </div>
      </Section>

      {/* How we operate: enterprise principles */}
      <Section>
        <SectionHeading
          eyebrow={t("operateHeading.eyebrow")}
          title={t("operateHeading.title")}
          intro={t("operateHeading.intro")}
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {principles.map(({ title, body }, i) => {
            const Icon = principleIcons[i];
            return (
              <div key={title} className="card card-pop flex h-full flex-col">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primaryDeep">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Governance & trust: the enterprise signal */}
      <Section>
        <div className="panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-soft-lg md:p-14">
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <p className="eyebrow eyebrow--invert mb-4">{t("governanceBlock.eyebrow")}</p>
              <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-white md:text-[2.6rem] md:leading-[1.08]">
                {t("governanceBlock.title")}
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75">
                {t("governanceBlock.body")}
              </p>
              <Link
                href="/security"
                className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white"
              >
                <span className="link-underline">{t("governanceBlock.link")}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:content-center">
              {governance.map((g) => (
                <div key={g} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-white/80">{g}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Our team, versed at every level, plus the leadership behind it */}
      <Section id="team" className="section-warm">
        <SectionHeading
          eyebrow={t("team.eyebrow")}
          title={t("team.title")}
          intro={t("team.intro")}
        />
        {team.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4">
              <p className="eyebrow">{t("team.leadershipLabel")}</p>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t("team.leadershipTitle")}
            </h3>
            <p className="mt-2 max-w-2xl text-muted">
              {t("team.leadershipBody")}
            </p>
            <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:auto-rows-fr" variant="fade-up">
              {team.map((member) => (
                <TeamCard
                  key={member.slug}
                  bookLabel={tb("teamBook")}
                  member={{
                    name: member.name,
                    title: member.title,
                    bio: member.bio,
                    photo: member.photo,
                    bookingUrl: member.bookingUrl,
                    linkedinUrl: member.linkedinUrl,
                  }}
                />
              ))}
            </RevealGroup>
          </div>
        )}
      </Section>

      {/* The candid layer under the headshots: real Snowflake events, real booth,
          real dinners. Proof the team above actually shows up in the field. */}
      <FieldStrip />

      {/* Enterprise close: talk to an architect */}
      <section className="section">
        <div className="container-page">
          <div className="panel-dark panel-editorial relative overflow-hidden rounded-3xl p-10 text-center shadow-soft md:p-16">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative">
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("close.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {t("close.body")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary btn-lg hover-sheen">
                  {t("close.primaryCta")}
                </Link>
                <Link href="/partnership" className="btn-ghost btn-lg">
                  {t("close.secondaryCta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
