import { RevealGroup } from "@/components/marketing/Motion";

/**
 * The engagement narrated from the sponsor's seat: six story beats walk
 * one engagement from the first scoping session to handover, in the third
 * person (the sponsor, the team), with the governance artifacts woven into
 * the prose as mono mentions. Same quiet spine as the platform StackStory (neutral hairline
 * + dots, per the no-colored-rails rule); typography does the rest.
 */

// Inline artifact mention: mono, subtly set off, part of the sentence.
function P({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-md bg-primaryDeep/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-primaryDeep">
      {children}
    </span>
  );
}

const BEATS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Week 1–2: a scope worth signing",
    body: (
      <>
        It starts with a <P>paid discovery</P>: our architects sit with the stakeholders,
        walk the sources, and rank the use cases by what they return. The sponsor comes out
        holding a <P>fixed scope</P> at a fixed price, so what goes upstairs to the board is a
        commitment, not an estimate.
      </>
    ),
  },
  {
    title: "The sprint rhythm",
    body: (
      <>
        Then the cadence sets in: every sprint closes with a <P>sprint demo</P> of something
        that works against real data, not a status deck. Something usable ships each time,
        so progress is a thing the team can click, not a percentage anyone is asked to believe.
      </>
    ),
  },
  {
    title: "Week 3 feels like this",
    body: (
      <>
        The sponsor sits in the first <P>steering review</P>, reordering a <P>shared backlog</P>{" "}
        that is genuinely theirs to reorder, with a <P>decision gate</P> ahead that waits on
        the business, not on us. Scope, budget, and priorities stay in-house the whole way
        through.
      </>
    ),
  },
  {
    title: "Proof before scale",
    body: (
      <>
        Before the full build, a focused <P>proof of concept</P> has to earn the go-ahead
        on real data and the hardest use case. The decision to scale rests on evidence the
        team watched happen, never on a slide.
      </>
    ),
  },
  {
    title: "The parallel truth",
    body: (
      <>
        When the first dashboards go live, a <P>parallel run</P> checks them against the
        numbers teams trust today, and every mismatch gets chased down and explained.
        The new figures earn their standing by reconciling, not because we vouched for them.
      </>
    ),
  },
  {
    title: "Handover, documented",
    body: (
      <>
        The build ships with <P>runbooks</P>, documentation, and <P>enablement</P> sessions,
        plus a transition plan that names who runs what when we step back. Most engagements
        reach first value in 8–16 weeks, and from there the team extends the work on its
        own terms.
      </>
    ),
  },
];

export function ApproachStory() {
  return (
    <RevealGroup as="ol" variant="fade-up" className="relative mt-14 max-w-3xl">
      {/* the spine */}
      <span
        aria-hidden
        className="absolute bottom-4 left-[7px] top-2 w-px bg-border"
      />
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
