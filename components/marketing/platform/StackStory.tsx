import { RevealGroup } from "@/components/marketing/Motion";
import { getTranslations } from "next-intl/server";

/**
 * The stack narrated as an engagement instead of drawn as an infographic:
 * six story beats walk one build from first sprint to production, with our
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

export async function StackStory() {
  const t = await getTranslations("platformUi");
  const prod = (chunks: React.ReactNode) => <P>{chunks}</P>;

  const BEATS: { key: string; title: string; body: React.ReactNode }[] = [
    {
      key: "arriving",
      title: t("stackStory.beats.arriving.title"),
      body: t.rich("stackStory.beats.arriving.body", { prod }),
    },
    {
      key: "shaped",
      title: t("stackStory.beats.shaped.title"),
      body: t.rich("stackStory.beats.shaped.body", { prod }),
    },
    {
      key: "open",
      title: t("stackStory.beats.open.title"),
      body: t.rich("stackStory.beats.open.body", { prod }),
    },
    {
      key: "governance",
      title: t("stackStory.beats.governance.title"),
      body: t.rich("stackStory.beats.governance.body", { prod }),
    },
    {
      key: "ai",
      title: t("stackStory.beats.ai.title"),
      body: t.rich("stackStory.beats.ai.body", { prod }),
    },
    {
      key: "oneTeam",
      title: t("stackStory.beats.oneTeam.title"),
      body: t.rich("stackStory.beats.oneTeam.body", { prod }),
    },
  ];

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
        <li key={b.key} className="relative pb-11 pl-10 last:pb-0">
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
