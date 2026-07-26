import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { Section, SectionHeading, Pill, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { LedgerCard } from "@/components/marketing/Cards";
import { ApplicationForm } from "@/components/marketing/ApplicationForm";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { Link } from "@/i18n/navigation";
import { getJobOpenings } from "@/lib/queries";
import { asStringArray } from "@/lib/utils";
import type { Locale } from "@/lib/i18n-content";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "careers.meta" });
  return pageMeta({ title: t("title"), description: t("description"), path: "/careers", locale });
}

/**
 * The careers hub. Job detail pages already existed at /careers/<slug> and were
 * in the sitemap, but there was no hub to link them: the only listing lived on
 * /life-at-viewnear, a culture page. This is the recruiting-intent page (roles,
 * locations, growth) and it links out to the culture page rather than repeating
 * it.
 */
export default async function CareersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const openings = await getJobOpenings(locale as Locale);

  const heroChips = t.raw("hero.chips") as string[];
  const who = t.raw("who") as { label: string; title: string; body: string }[];
  const growth = t.raw("growth") as string[];

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <div className="container-page pt-10">
            <Breadcrumbs
              items={[
                { label: t("breadcrumb.home"), href: "/" },
                { label: t("breadcrumb.current") },
              ]}
            />
          </div>
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
          </PageHero>
        </div>
      </div>

      {/* Who we hire */}
      <Section className="section-tint relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("whoHeading.eyebrow")}
            title={t("whoHeading.title")}
            intro={t("whoHeading.intro")}
          />
          <RevealGroup
            className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-4"
            variant="pop"
          >
            {who.map(({ label, title, body }) => (
              <LedgerCard key={title} eyebrow={label} title={title}>
                {body}
              </LedgerCard>
            ))}
          </RevealGroup>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Where the work happens: the recruiting-side view of the two offices. */}
      <Section>
        <FeatureSplit
          as="h2"
          eyebrow={t("locations.eyebrow")}
          title={t.rich("locations.title", { hl: (c) => <span className="text-gradient">{c}</span> })}
          body={t("locations.body")}
          bullets={t.raw("locations.bullets") as string[]}
          image="/assets/images/life/lounge.jpg"
          imageAlt={t("locations.imageAlt")}
          cta={{ label: t("locations.cta"), href: "/nearshore/monterrey" }}
        />
      </Section>

      {/* How you grow here */}
      <Section className="section-warm relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow={t("growthHeading.eyebrow")}
            title={t("growthHeading.title")}
            intro={t("growthHeading.intro")}
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            {growth.map((g) => (
              <li key={g} className="card flex items-start gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryDeep" />
                <span className="text-foreground/90">{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Open roles */}
      <Section id="open-roles">
        <SectionHeading
          eyebrow={t("openRoles.eyebrow")}
          title={t("openRoles.title")}
          intro={t("openRoles.intro")}
        />
        {openings.length === 0 ? (
          <p className="mt-8 text-muted">{t("openRoles.empty")}</p>
        ) : (
          <div className="mt-12 grid gap-5">
            {openings.map((job) => {
              const skills = asStringArray(job.skills);
              return (
                <LedgerCard
                  key={job.slug}
                  eyebrow={job.employment}
                  title={job.title}
                  foot={job.location ? [t("openRoles.locationLabel"), job.location] : undefined}
                >
                  <p>{job.description}</p>
                  {skills.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <Pill key={s}>{s}</Pill>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-5">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-primaryDeep"
                    >
                      {t("openRoles.viewRole")}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </LedgerCard>
              );
            })}
          </div>
        )}
      </Section>

      {/* Culture lives on its own page; point at it instead of repeating it. */}
      <Section className="section-tint">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t("life.eyebrow")}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("life.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("life.body")}</p>
          <Link href="/life-at-viewnear" className="btn-ghost mt-8 inline-flex">
            {t("life.cta")}
          </Link>
        </div>
      </Section>

      {/* General application */}
      <Section id="apply">
        <div className="mx-auto max-w-2xl">
          <ApplicationForm />
        </div>
      </Section>

      <CtaBand title={t("cta.title")} subtitle={t("cta.subtitle")} />
    </>
  );
}
