import { pageMeta } from "@/lib/seo";
import { getCaseStudies } from "@/lib/queries";
import { Section, CtaBand, Pill } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { CoverCard } from "@/components/marketing/CoverCard";
import { coverForSector } from "@/lib/covers";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";

export const metadata = pageMeta({
  title: "Case Studies",
  description:
    "Data and AI engagements across the Americas: real, anonymized results from the Snowflake-powered analytics and intelligent automation we deliver.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies({});

  // Feature the first 1–2 as large cards, the rest in a grid.
  const featured = caseStudies.slice(0, 2);
  const rest = caseStudies.slice(2);

  // Unique sector chips for a lightweight filter row (visual scan aid).
  const sectors = Array.from(new Set(caseStudies.map((cs) => cs.sector))).filter(
    Boolean,
  );

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={
          <>
            Case <span className="text-gradient">studies</span>.
          </>
        }
        description="Real data and AI work we deliver across the Americas. Explore how we turn complex data into a competitive advantage."
      />

      {caseStudies.length > 0 ? (
        <>
          {/* ── Featured engagements (large, image-led) ───────────── */}
          <Section className="relative overflow-hidden">
            <SectionDecor variant="dots" />
            <div className="relative">
              <p className="eyebrow mb-3">Featured work</p>
              <p className="mb-8 max-w-2xl text-sm text-muted">
                Client names are withheld at their request. All are real,
                anonymized engagements.
              </p>
              {sectors.length > 1 && (
                <div className="mb-10 flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-mono text-xs uppercase tracking-wider text-muted">
                    Sectors:
                  </span>
                  {sectors.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {featured.map((cs, i) => (
                  <CoverCard
                    key={cs.slug}
                    href={`/case-studies/${cs.slug}`}
                    image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
                    imageAlt={`${cs.title}: ${cs.sector}`}
                    kicker={`${cs.sector} · ${cs.region}`}
                    title={cs.title}
                    excerpt={cs.summary}
                    featured={i === 0}
                  />
                ))}
              </div>
            </div>
          </Section>

          {/* ── The rest, in a tinted band ────────────────────────── */}
          {rest.length > 0 && (
            <div className="relative">
              <WaveDivider position="top" fill="fill-surface2" />
              <Section className="section-warm relative overflow-hidden">
                <SectionDecor variant="grid" />
                <div className="relative">
                  <p className="eyebrow mb-8">More engagements</p>
                  <div className="grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((cs) => (
                      <CoverCard
                        key={cs.slug}
                        href={`/case-studies/${cs.slug}`}
                        image={cs.heroImage ?? coverForSector(cs.sector, cs.slug)}
                        imageAlt={`${cs.title}: ${cs.sector}`}
                        kicker={`${cs.sector} · ${cs.region}`}
                        title={cs.title}
                        excerpt={cs.summary}
                      />
                    ))}
                  </div>
                </div>
              </Section>
              <WaveDivider position="bottom" fill="fill-background" />
            </div>
          )}
        </>
      ) : (
        <Section>
          <p className="text-muted">Case studies coming soon.</p>
        </Section>
      )}

      {/* ── Real, verifiable proof (credibility rests here) ──────── */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="panel-warm relative rounded-3xl p-8 md:p-10">
          <p className="eyebrow mb-3">Verified proof</p>
          <h2 className="max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Proof you can verify today.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Viewnear is a Snowflake Premier Partner and a CoCo Preferred Partner,
            with a SnowPro-certified team. That status is verifiable today,
            independent of any single engagement.
          </p>
          <div className="mt-8">
            <PartnerBadges variant="logos" />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
