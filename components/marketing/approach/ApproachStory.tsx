import { getTranslations } from "next-intl/server";
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

const BEAT_KEYS = ["beat1", "beat2", "beat3", "beat4", "beat5", "beat6"] as const;

export async function ApproachStory() {
  const t = await getTranslations("approachUi");
  return (
    <RevealGroup as="ol" variant="fade-up" className="relative mt-14 max-w-3xl">
      {/* the spine */}
      <span
        aria-hidden
        className="absolute bottom-4 left-[7px] top-2 w-px bg-border"
      />
      {BEAT_KEYS.map((key, i) => (
        <li key={key} className="relative pb-11 pl-10 last:pb-0">
          <span
            aria-hidden
            className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-primaryDeep/40 bg-background"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-primaryDeep" />
          </span>
          <span className="font-mono text-xs font-semibold tracking-widest text-muted" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-1 font-display text-xl font-bold text-foreground">{t(`story.${key}.title`)}</h3>
          <p className="mt-2 text-base leading-relaxed text-muted md:text-lg">
            {t.rich(`story.${key}.body`, { art: (c) => <P>{c}</P> })}
          </p>
        </li>
      ))}
    </RevealGroup>
  );
}
