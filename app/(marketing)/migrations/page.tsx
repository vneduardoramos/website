import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeading, CtaBand } from "@/components/marketing/ui";
import { PageHero } from "@/components/marketing/PageHero";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { MetricBand } from "@/components/marketing/Blocks";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { RevealGroup, ScrollHighlight } from "@/components/marketing/Motion";
import { SectionDecor, WaveDivider } from "@/components/marketing/Decor";

export const metadata = pageMeta({
  title: "Migrations to Snowflake: Teradata, Oracle, Redshift, Hadoop & more",
  description:
    "Viewnear migrates legacy warehouses and Hadoop onto one governed Snowflake foundation: automated code conversion, validated parity, and a phased cutover.",
  path: "/migrations",
});

const HERO_CHIPS = ["20+ source platforms", "Automated conversion", "Validated parity", "Phased cutover"];

// The full set of source platforms, grouped. `slug` maps to an official brand
// mark in /assets/images/sources (rendered monochrome via CSS mask); platforms
// without a mark fall back to a clean wordmark.
const SOURCE_GROUPS = [
  {
    label: "Legacy MPP & data warehouses",
    items: [
      { name: "Teradata", slug: "teradata" },
      { name: "IBM Netezza", slug: "ibm" },
      { name: "Oracle Exadata", slug: "oracle" },
      { name: "Vertica" },
      { name: "Greenplum" },
      { name: "SAP BW / BW4HANA", slug: "sap" },
      { name: "Microsoft APS / PDW" },
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
      { name: "SSIS" },
      { name: "Talend", slug: "talend" },
      { name: "SAS" },
    ],
  },
];

// Cross-cutting reasons teams move (qualitative, no invented stats).
const DRIVERS = [
  {
    title: "Cost that flexes with use",
    body: "Pay for compute by the second and scale it independently from storage. No idle clusters, no capacity bought a year ahead.",
  },
  {
    title: "Zero infrastructure to run",
    body: "No appliances to patch, no Hadoop cluster to babysit, no capacity planning. Snowflake runs the platform so your team runs the data.",
  },
  {
    title: "End-of-life and licensing relief",
    body: "Teradata, Netezza, Exadata, and SAP BW carry rising license and support costs. Migration turns that into elastic, usage-based spend.",
  },
  {
    title: "Performance at scale",
    body: "Analytics that crawled on a row-based database or an overloaded Hadoop cluster run on right-sized warehouses, with no manual tuning.",
  },
  {
    title: "One governed foundation",
    body: "Replace scattered copies and brittle exports with one governed source of truth: access, lineage, and policy built in through Horizon.",
  },
  {
    title: "AI and Cortex ready",
    body: "Land on a foundation where Cortex and the leading models run next to governed data, so AI is the next step, not another project.",
  },
];

// The phased, de-risked method.
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
    body: "We tune warehouses and pipelines on real usage, retire the legacy system, and hand over documentation so your team owns it.",
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
                <ScrollHighlight>Onto one governed Snowflake.</ScrollHighlight>
              </>
            }
            description="We move legacy warehouses, cloud data warehouses, and Hadoop onto a single governed Snowflake foundation: code converted automatically, data validated for parity, and a phased cutover that keeps the business running the whole way."
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
            intro="Legacy appliances, cloud warehouses, Hadoop, or the database quietly doing warehouse duty. If your data lives there today, we have a path to Snowflake."
          />
          <RevealGroup className="mt-12 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3" variant="pop">
            {SOURCE_GROUPS.map((g) => (
              <div key={g.label} className="card flex h-full flex-col">
                <h3 className="font-display text-base font-bold text-foreground">{g.label}</h3>
                <ul className="mt-5 space-y-3">
                  {g.items.map((p) => (
                    <li key={p.name} className="flex items-center gap-3">
                      {p.slug ? (
                        <span
                          aria-hidden="true"
                          className="h-6 w-6 flex-none"
                          style={{
                            backgroundColor: "rgb(var(--color-foreground))",
                            opacity: 0.8,
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
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-foreground/10 font-mono text-[0.6rem] font-bold text-foreground/70"
                        >
                          {p.name.slice(0, 2)}
                        </span>
                      )}
                      <span className="text-sm text-foreground/80">{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </RevealGroup>
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
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {DRIVERS.map((d) => (
            <div key={d.title} className="card flex h-full flex-col">
              <h3 className="font-display text-lg font-bold text-foreground">{d.title}</h3>
              <p className="mt-2 text-muted">{d.body}</p>
            </div>
          ))}
        </RevealGroup>
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
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3" variant="pop">
          {PHASES.map((p, i) => (
            <div key={p.title} className="card card-pop card-editorial flex h-full flex-col">
              <span className="card-index font-display" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-3 text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* Automated where it counts, validated everywhere */}
      <Section className="section-tint relative overflow-hidden">
        <FeatureSplit
          eyebrow="Automated, then proven"
          title="Automated where it counts, validated everywhere"
          body="SnowConvert translates the SQL, stored procedures, and scripts that took years to write, with the Snowpark Migration Accelerator covering Spark, so the rebuild is measured in weeks, not a from-scratch rewrite. Then automated row, aggregate, and hash reconciliation proves the new system matches the old one, table by table, before anyone cuts over."
          bullets={[
            "Code conversion for Teradata, Oracle, SQL Server, Redshift, Hive and more",
            "Row, aggregate, and hash checks prove parity against the source",
            "A parallel run with nightly reconciliation before any cutover",
          ]}
          image="/assets/images/photos/data-foundation.jpg"
          imageAlt="A governed Snowflake foundation after migration"
          ratio="wide-text"
        />
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
        <RevealGroup className="mt-12 grid gap-6 md:auto-rows-fr md:grid-cols-2" variant="pop">
          {HARD_PARTS.map((h) => (
            <div key={h.source} className="card flex h-full gap-4">
              <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-accentDeep">
                {h.source}
              </span>
              <p className="text-sm leading-relaxed text-muted">{h.detail}</p>
            </div>
          ))}
        </RevealGroup>
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
        subtitle="Tell us what you're running today (Teradata, Oracle, Redshift, Hadoop, or anything else) and we'll map the path to Snowflake."
      />
    </>
  );
}
