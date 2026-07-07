import { RevealGroup } from "@/components/marketing/Motion";

/**
 * The stack narrated as an engagement instead of drawn as an infographic:
 * six story beats walk one build from first sprint to handover, with our
 * role and the Snowflake product names woven into the prose.
 * A quiet spine (neutral hairline + dots, per the no-colored-rails rule)
 * carries the sequence; typography does the rest.
 */

// Inline product mention: mono, subtly set off, part of the sentence.
function P({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-md bg-primaryDeep/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-primaryDeep">
      {children}
    </span>
  );
}

const BEATS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Your data starts arriving",
    body: (
      <>
        In the first sprints we wire <P>Openflow</P> into the ERP, CRM, and SaaS systems you
        already run, and <P>Snowpipe Streaming</P> carries the live feeds. Nothing detours
        through a middleman: every source lands inside Snowflake, governed from the first table.
      </>
    ),
  },
  {
    title: "It gets shaped into something trustworthy",
    body: (
      <>
        Our engineers model it with <P>dbt</P> and <P>Snowpark</P>, next to the data, in code
        your team can read and one day own. <P>Dynamic Tables</P> keep the derived views fresh
        with no scheduler to babysit.
      </>
    ),
  },
  {
    title: "It lives once, in an open format",
    body: (
      <>
        The result is one governed copy on <P>Apache Iceberg</P>, readable by any engine you
        ever choose through <P>Open Catalog</P>. The foundation outlives any tool decision,
        ours included.
      </>
    ),
  },
  {
    title: "Governance runs through everything",
    body: (
      <>
        The whole way, <P>Horizon Catalog</P> is recording lineage and enforcing policy, and{" "}
        <P>Semantic Views</P> pin down what &ldquo;revenue&rdquo; actually means. It is the
        unglamorous work that makes the AI trustworthy later, and it is where our senior
        people spend real time working inside your team.
      </>
    ),
  },
  {
    title: "Then the AI has something to stand on",
    body: (
      <>
        <P>Cortex Analyst</P> answers questions against those shared definitions,{" "}
        <P>Snowflake CoWork</P> gives your teams cited answers, and agents act inside{" "}
        <P>AI Agent Identity</P> policies. The results land where people already work:
        dashboards in <P>Snowsight</P>, apps in <P>Streamlit</P>, answers flowing back into
        your tools.
      </>
    ),
  },
  {
    title: "One team answers for the whole arc",
    body: (
      <>
        Snowflake runs the platform. We design, build, and tune what runs on it with your
        team in the room, then hand over the keys: documented, and yours to extend. Most
        foundations reach production in 8&ndash;16 weeks, because discovery fixes the scope
        up front and every sprint ends with working software in a demo.
      </>
    ),
  },
];

export function StackStory() {
  return (
    <RevealGroup as="ol" variant="fade-up" className="relative mt-14 max-w-3xl">
      {/* the spine: static hairline everywhere; browsers with CSS scroll-driven
          animations (and motion allowed) also get a quiet top-to-bottom fill
          that tracks reading progress. See .spine-progress in globals.css. */}
      <span
        aria-hidden
        className="absolute bottom-4 left-[7px] top-2 w-px bg-border"
      >
        <span className="spine-progress absolute inset-0 bg-primaryDeep/40" />
      </span>
      {BEATS.map((b, i) => (
        <li key={b.title} className="relative pb-11 pl-10 last:pb-0">
          <span
            aria-hidden
            className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-primaryDeep/40 bg-background"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-primaryDeep" />
          </span>
          <span className="font-mono text-xs font-semibold tracking-widest text-muted" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-1 font-display text-xl font-bold text-foreground">{b.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-muted md:text-lg">{b.body}</p>
        </li>
      ))}
    </RevealGroup>
  );
}
