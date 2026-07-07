import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { MetricBand } from "@/components/marketing/Blocks";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";
import { LegacyContrast, CutoverTimeline } from "@/components/marketing/migrations/Crossing";

export const metadata = pageMeta({
  title: "Migrations to Snowflake: Teradata, Oracle, Redshift, Hadoop & more",
  description:
    "Viewnear moves legacy warehouses and Hadoop onto one governed foundation on Snowflake: automated code conversion, validated parity, a phased cutover your business never feels, and a handover that leaves your team running it.",
  path: "/migrations",
});

const HERO_CHIPS = ["20+ source platforms", "Automated conversion", "Validated parity", "Phased cutover"];

// The full set of source platforms, grouped. `slug` maps to an official brand
// mark in /assets/images/sources (rendered monochrome via CSS mask); platforms
// without a mark fall back to a clean wordmark.
// Only platforms with an official brand mark in /assets/images/sources are
// listed; everything else rides on the "not listed? we've seen it" line.
const SOURCE_GROUPS = [
  {
    label: "Legacy MPP & data warehouses",
    items: [
      { name: "Teradata", slug: "teradata" },
      { name: "IBM Netezza", slug: "ibm" },
      { name: "Oracle Exadata", slug: "oracle" },
      { name: "SAP BW / BW4HANA", slug: "sap" },
    ],
  },
  {
    label: "Cloud data warehouses",
    items: [
      { name: "Amazon Redshift", slug: "redshift" },
      { name: "Google BigQuery", slug: "bigquery" },
      { name: "Azure Synapse", slug: "azure" },
      { name: "Databricks", slug: "databricks" },
    ],
  },
  {
    label: "Hadoop & data lakes",
    items: [
      { name: "Cloudera / Hortonworks", slug: "cloudera" },
      { name: "Apache Hive", slug: "hive" },
      { name: "Apache Spark", slug: "spark" },
      { name: "HDFS", slug: "hadoop" },
    ],
  },
  {
    label: "Databases doing warehouse duty",
    items: [
      { name: "Oracle Database", slug: "oracle" },
      { name: "Microsoft SQL Server", slug: "sqlserver" },
      { name: "IBM Db2", slug: "ibm" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MySQL", slug: "mysql" },
    ],
  },
  {
    label: "Legacy ETL & analytics",
    items: [
      { name: "Informatica", slug: "informatica" },
      { name: "Talend", slug: "talend" },
    ],
  },
];

// The phased, de-risked method. (The "why teams move" drivers live inside
// LegacyContrast as before/after annotations.)
const PHASES = [
  {
    title: "Assess & plan",
    body: "We inventory every table, view, stored procedure, and downstream report, map the dependencies, and build the business case before anything moves.",
  },
  {
    title: "Convert",
    body: "The bulk of your SQL, stored procedures, and scripts convert automatically; our engineers remediate the edge cases by hand and review every object before it moves on.",
  },
  {
    title: "Migrate & validate",
    body: "Historical loads plus incremental CDC through Openflow and Snowpipe keep data current, while automated row, aggregate, and hash checks prove parity against the source.",
  },
  {
    title: "Parallel run & cutover",
    body: "Both systems run side by side with nightly reconciliation. We cut over in phases by business unit, never a big-bang switch, and only once the numbers match.",
  },
  {
    title: "Optimize & decommission",
    body: "We tune warehouses and pipelines on real usage, retire the legacy system, and hand over documentation and runbooks so your team runs it without us.",
  },
];

// The hard parts, handled, for the most common sources.
const HARD_PARTS = [
  { source: "Teradata", detail: "BTEQ, FastLoad, and MultiLoad scripts, macros, and stored procedures converted; primary-index logic redesigned as clustering." },
  { source: "Oracle", detail: "PL/SQL packages, triggers, and cursors translated to Snowflake Scripting; constraints moved into validated pipelines." },
  { source: "SQL Server", detail: "T-SQL and SSIS packages converted to Snowflake SQL and dbt models on a native scheduler." },
  { source: "Hadoop, Hive & Spark", detail: "Hive SQL and PySpark or Scala jobs moved to Snowflake SQL and Snowpark; Parquet landed as Iceberg." },
  { source: "Redshift & BigQuery", detail: "Dialect differences and DISTKEY, SORTKEY, or partition logic translated; cost re-modeled for elastic compute." },
  { source: "Netezza & Vertica", detail: "Appliance-specific SQL and procedures converted off end-of-life hardware onto elastic Snowflake." },
];

const METRICS = [
  { value: "20+", label: "Source platforms" },
  { value: "Automated", label: "Code conversion with SnowConvert" },
  { value: "Phased", label: "Cutover, not big-bang" },
  { value: "Parity", label: "Validated before cutover" },
];

export default function MigrationsPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <SectionDecor variant="grid" />
        <div className="relative">
          <PageHero
            eyebrow="Migrations"
            title={
              <>
                Off Teradata, Oracle, or Hadoop.{" "}
                <ScrollHighlight>Onto a data practice you keep.</ScrollHighlight>
              </>
            }
            description="A migration is won in the planning, the parity checks, and the cutover you never notice, not in the license swap. We run that whole arc as one accountable team: code converted automatically, every number validated against the source, and the business running the entire way."
          >
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_CHIPS.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </PageHero>
        </div>
      </div>

      {/* Source-platform wall */}
      <Section className="relative overflow-hidden">
        <SectionDecor variant="dots" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="Every source platform"
            title="We migrate from all of them"
            intro="Legacy appliances, cloud warehouses, Hadoop, or the database quietly doing warehouse duty. If your data lives there today, we have a path to land it on Snowflake, governed and in your team's hands."
          />
          {/* One continuous board instead of five card boxes */}
          <div className="mt-12 rounded-3xl border border-border bg-surface">
            {SOURCE_GROUPS.map((g, gi) => (
              <div
                key={g.label}
                className={`grid gap-3 p-5 md:grid-cols-[230px_1fr] md:items-baseline md:gap-6 md:px-7 ${gi > 0 ? "border-t border-border" : ""}`}
              >
                <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                  {g.label}
                </h3>
                <ul className="flex flex-wrap gap-x-2 gap-y-2">
                  {g.items.map((p) => (
                    <li
                      key={p.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground/80"
                    >
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 flex-none"
                        style={{
                          backgroundColor: "rgb(var(--color-foreground))",
                          opacity: 0.75,
                          WebkitMaskImage: `url(/assets/images/sources/${p.slug}.svg)`,
                          maskImage: `url(/assets/images/sources/${p.slug}.svg)`,
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        }}
                      />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted">
            Platform names and logos are trademarks of their respective owners, shown to indicate
            migration sources we support. On something not listed here? We have almost certainly seen
            it. Tell us your stack and we&rsquo;ll map the path.
          </p>
        </div>
      </Section>

      {/* Why teams move */}
      <Section className="section-warm relative overflow-hidden">
        <SectionHeading
          align="center"
          eyebrow="Why teams move"
          title="The case for leaving legacy behind"
          intro="The platform changes, but the reasons rhyme: cost, operational burden, and a foundation that is finally ready for AI."
        />
        <LegacyContrast />
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* How we migrate */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow="How we migrate"
          title="Automated, validated, and phased"
          intro="A repeatable arc that de-risks the move. Most of the conversion is automated; the cutover never is."
        />
        <CutoverTimeline phases={PHASES} />
      </Section>

      {/* The conviction: tools convert code; the team answers for it */}
      <Section className="section-tint relative overflow-hidden">
        <FeatureSplit
          eyebrow="Our conviction"
          title="The tools convert the code. They don't answer for your month-end close."
          body="SnowConvert and the Snowpark Migration Accelerator do the typing: the SQL, stored procedures, and Spark jobs that took years to write convert in weeks. What you actually hire us for is everything the tools can't sign off on: the edge cases remediated by hand, every object reviewed before it moves on, and row, aggregate, and hash reconciliation proving the new numbers match the old ones before anyone cuts over."
          bullets={[
            "Conversion output reviewed object by object, in Snowflake Workspaces",
            "Row, aggregate, and hash checks prove parity against the source",
            "A parallel run with nightly reconciliation before any cutover",
          ]}
          image="/assets/images/product/workspaces-build.png"
          imageAlt="Converted objects being reviewed change by change in Snowflake Workspaces"
          ratio="wide-text"
        />
        {/* One quiet, real proof point for the claim above. */}
        <p className="mt-10 text-center text-sm text-muted">
          Live example:{" "}
          <Link
            href="/case-studies/real-time-student-data-pipeline"
            className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
          >
            real-time student data across campuses, live in seven weeks &rarr;
          </Link>
        </p>
        <WaveDivider position="bottom" fill="fill-background" />
      </Section>

      {/* The hard parts, handled */}
      <Section className="section-warm">
        <SectionHeading
          align="center"
          eyebrow="The hard parts, handled"
          title="The legacy logic comes too"
          intro="Migrations stall on the procedural code and pipelines, not the tables. Here is what we carry over for the platforms we see most."
        />
        {/* Same continuous-board rhythm as the sources wall and the platform
            parts list: fixed label column, uniform hairline rows. */}
        <div className="mt-12 rounded-3xl border border-border bg-surface">
          {HARD_PARTS.map((h, i) => (
            <div
              key={h.source}
              className={`grid gap-2 p-5 md:grid-cols-[230px_1fr] md:items-baseline md:gap-8 md:px-8 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primaryDeep">
                {h.source}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{h.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Proof */}
      <Section className="text-center">
        <SectionHeading
          align="center"
          eyebrow="Backed by Snowflake"
          title="A certified team that has done this before"
          intro="Migrations run on Snowflake's own tooling, delivered by a SnowPro-certified team with a verified track record across the Americas."
        />
        <div className="mt-10">
          <MetricBand metrics={METRICS} />
        </div>
        <div className="mt-10 flex justify-center">
          <PartnerBadges variant="logos" />
        </div>
        <p className="mt-8 text-sm text-muted">
          See migrations in production in our{" "}
          <Link href="/case-studies" className="font-semibold text-primaryDeep underline-offset-4 hover:underline">
            case studies &rarr;
          </Link>
        </p>
      </Section>

      <CtaBand
        title="Plan your migration."
        subtitle="Tell us what you're running today (Teradata, Oracle, Redshift, Hadoop, or anything else) and we'll map the crossing: what converts automatically, what needs hands, and when your team takes the keys."
      />
    </>
  );
}
