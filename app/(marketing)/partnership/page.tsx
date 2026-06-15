import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { LeadershipStrip } from "@/components/marketing/LeadershipStrip";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { PartnershipHighlight } from "@/components/marketing/PartnershipHighlight";
import { theme } from "@/config/theme";

export const metadata = pageMeta({
  title: "Snowflake Partnership",
  description:
    "Viewnear is a Snowflake Premier Partner and a CoCo Preferred Partner: SnowPro-certified, co-selling with Snowflake, and delivering the full native stack across the Americas.",
  path: "/partnership",
});

const unlocks = [
  {
    title: "Co-sell & joint go-to-market",
    body: "We work alongside your Snowflake account team on architecture, funding, and delivery: aligned incentives and one plan, not a vendor bolted on after the fact.",
  },
  {
    title: "Snowflake procurement, simplified",
    body: "Snowflake is consumption-based: you pay for the compute and storage you use. Procure your capacity through Viewnear for simpler commercial terms and account management under one accountable partner.",
  },
  {
    title: "Priority roadmap & preview access",
    body: "Early access to what's next on Snowflake (Cortex, Openflow, Horizon, CoCo) so you get emerging capabilities before they're mainstream.",
  },
  {
    title: "SnowPro-certified delivery",
    body: "Certified architects and engineers on every engagement. Snowflake is what we do, not one of ten stacks we dabble in, so you get depth, not guesswork.",
  },
];

// Build-vs-partner comparison: the question every leader weighs.
type Row = { dimension: string; inhouse: string; big3: string; viewnear: string };
const comparison: Row[] = [
  {
    dimension: "Time to production",
    inhouse: "6–12 months to hire & ramp a team",
    big3: "Slow mobilization, heavy process",
    viewnear: "8–16 weeks, value from sprint one",
  },
  {
    dimension: "Who does the work",
    inhouse: "Whoever you can hire and retain",
    big3: "Rotating bench, layered delivery pyramids",
    viewnear: "Certified, versed at every level",
  },
  {
    dimension: "Snowflake expertise",
    inhouse: "Learned on the job, on your budget",
    big3: "One of many platforms they cover",
    viewnear: "Premier Partner specialists, end to end",
  },
  {
    dimension: "Accountability",
    inhouse: "Split across internal teams",
    big3: "Spread across sub-contractors",
    viewnear: "One team, owned start to finish",
  },
  {
    dimension: "After go-live",
    inhouse: "Knowledge walks out with attrition",
    big3: "Day-rate dependency continues",
    viewnear: "Enablement & hand-over, your team runs it",
  },
];

export default function PartnershipPage() {
  return (
    <>
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Snowflake Partnership"
            title={
              <>
                A Snowflake{" "}
                <ScrollHighlight color="cyan">
                  <span className="text-gradient">Premier Partner</span>
                </ScrollHighlight>
                , and CoCo Preferred Partner.
              </>
            }
            description={`${theme.brand.name} holds two of Snowflake's highest partner recognitions. It means certified depth, co-sell alignment, and early access to what's next, all delivered by one accountable team across the Americas.`}
          />
        </div>
      </div>

      {/* Badges + CoCo Preferred Partner momentum */}
      <PartnershipHighlight title="Two recognitions, and CoCo Preferred Partner momentum to back them" />

      {/* What it unlocks */}
      <Section>
        <SectionHeading
          eyebrow="What it unlocks for you"
          title="Why the partnership matters to your business"
          intro="Certification isn't a logo on a slide; it changes how fast, how safely, and how affordably you get to value."
        />
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {unlocks.map((u) => (
            <div key={u.title} className="card card-hover flex h-full flex-col">
              <h3 className="font-display text-xl font-bold text-foreground">{u.title}</h3>
              <p className="mt-3 text-muted">{u.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* Build vs partner comparison */}
      <Section id="comparison" className="section-tint relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <SectionHeading
            eyebrow="Build vs. partner"
            title="The honest comparison"
            intro="Every leader weighs building in-house, hiring a global consultancy, or partnering with a specialist. Here's how the options actually stack up."
          />

          {/* Desktop table */}
          <div className="mt-12 hidden overflow-hidden rounded-2xl border border-border bg-background md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left">
                  <th className="px-5 py-4 font-medium text-muted">&nbsp;</th>
                  <th className="px-5 py-4 font-display font-bold text-foreground">In-house build</th>
                  <th className="px-5 py-4 font-display font-bold text-foreground">Global consultancy</th>
                  <th className="px-5 py-4 font-display font-bold text-primaryDeep">Viewnear</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.dimension} className="border-t border-border align-top">
                    <td className="px-5 py-4 font-semibold text-foreground">{r.dimension}</td>
                    <td className="px-5 py-4 text-muted">{r.inhouse}</td>
                    <td className="px-5 py-4 text-muted">{r.big3}</td>
                    <td className="bg-surface2/60 px-5 py-4 font-medium text-foreground">{r.viewnear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="mt-10 space-y-4 md:hidden">
            {comparison.map((r) => (
              <div key={r.dimension} className="card bg-background">
                <h3 className="font-display text-base font-bold text-foreground">{r.dimension}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">In-house</dt>
                    <dd className="text-right text-muted">{r.inhouse}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Consultancy</dt>
                    <dd className="text-right text-muted">{r.big3}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-border pt-2">
                    <dt className="font-semibold text-primaryDeep">Viewnear</dt>
                    <dd className="text-right font-medium text-foreground">{r.viewnear}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* Certified vs generalist */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="flow" />
        <div className="relative">
          <FeatureSplit
            eyebrow="Certified vs. generalist"
            title={
              <>
                Depth that a <span className="text-gradient">generalist can&rsquo;t match</span>
              </>
            }
            body="A Premier Partner is measured on certified people and verified outcomes, not breadth of logos. We bring Snowflake's newest capabilities, co-sell support, and certified delivery to every engagement, so you move faster with less risk than a generalist or an in-house ramp."
            bullets={[
              "SnowPro-certified architects and engineers, end to end",
              "Co-sell alignment with your Snowflake account team",
              "Early access to Cortex, Openflow, Horizon, and CoCo",
              "One accountable team: no hand-offs across a rotating bench",
            ]}
            image="/assets/images/life/team-booth.jpg"
            imageAlt="The Viewnear team demoing to attendees at a Snowflake event"
            reverse
            cta={{ label: "Explore our services", href: "/services" }}
          />
          <LeadershipStrip label="Your team, not a rotating bench." className="mt-10" />
        </div>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      <CtaBand
        title="Put a certified partner on it."
        subtitle="Tell us where you are with Snowflake (procurement, migration, or AI) and we'll bring the certified team and co-sell support to get you there."
      />
    </>
  );
}
