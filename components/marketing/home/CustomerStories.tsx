"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Img as Image } from "@/components/marketing/Img";
import { cn } from "@/lib/utils";

/**
 * Featured customer stories: one contained split card inside the page
 * container, the photograph on one side with the card's rounded corners, and
 * on the other the company (its logo when it may be shown, its description
 * when it stays anonymous), the headline, two stat blocks at display size and
 * a "read the story" link. The arrows flank the card at mid-height on wide
 * screens and sit over the photograph below that; the section header keeps the
 * title on the left and the view-all link on the right.
 *
 * No autoplay. Content that moves before a reader is ready is the most common
 * carousel complaint, so a story stays up until the reader asks for the next
 * one, by arrow, arrow key or swipe. Slides share one grid cell and crossfade
 * in place, so the card never changes height between stories and the same
 * code behaves identically in WebKit. The fade is short: a crossfade shows
 * both stories at once for half its length, and 300ms keeps that under the
 * threshold where two headlines read as a double exposure.
 *
 * Keyboard and assistive tech. The region is named by the section heading.
 * Both arrow pairs live outside the slides, so activating one never unmounts
 * the control that had focus. Paging from inside a slide moves focus back to
 * the region, so it never rests inside the slide that just went transparent;
 * the inactive slide's link is also out of the tab order. The live region
 * announces which story is up, not only a count.
 */
export type CustomerStory = {
  client: string;
  /** Shown instead of the client name when the customer agreed to be named. */
  logo?: { src: string; alt: string; w: number; h: number };
  badge: string;
  sector: string;
  region: string;
  title: string;
  summary: string;
  href: string;
  image: string;
  imageAlt: string;
  metrics: { value: string; label: string }[];
};

export type CustomerStoriesLabels = {
  prev: string;
  next: string;
  /** "{i}" and "{n}" are replaced with the current and total counts. */
  counter: string;
  readCaseStudy: string;
  viewAll: string;
};

const SWIPE_PX = 48;

const fill = (s: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), s);

export function CustomerStories({
  eyebrow,
  title,
  stories,
  labels,
  viewAllHref = "/case-studies",
  belowHeader,
}: {
  /** Optional: this section dropped its label when the heading said it twice. */
  eyebrow?: string;
  title: React.ReactNode;
  stories: CustomerStory[];
  labels: CustomerStoriesLabels;
  viewAllHref?: string;
  /** Rendered between the header and the card: the upper client-logo band. */
  belowHeader?: React.ReactNode;
}) {
  const n = stories.length;
  const [index, setIndex] = useState(0);
  const pointerX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const regionId = useId();

  const go = useCallback((i: number) => n > 0 && setIndex(((i % n) + n) % n), [n]);

  // If focus was inside the slide that just faded out, bring it back to the
  // region. Otherwise a keyboard reader is left on an invisible link. Only a
  // hidden slide triggers this: the arrows sit inside the region too, and a
  // reader who paged with one should stay on it.
  useEffect(() => {
    const region = regionRef.current;
    const active = document.activeElement;
    if (!region || !active || !region.contains(active)) return;
    if (active.closest('[role="group"][aria-hidden="true"]')) region.focus();
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") pointerX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerX.current == null) return;
    const dx = e.clientX - pointerX.current;
    pointerX.current = null;
    if (Math.abs(dx) >= SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  };

  const announcement = `${fill(labels.counter, { i: index + 1, n })}: ${stories[index]?.title ?? ""}`;

  // Focus rings at full strength: a 40% ring measured 1.4:1 against white,
  // under the 3:1 a focus indicator needs.
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDeep focus-visible:ring-offset-2";
  const arrowBase = cn(
    "inline-flex h-12 w-12 items-center justify-center rounded-full text-foreground shadow-soft-lg transition",
    focusRing,
  );
  const arrowLight = cn(arrowBase, "border border-border bg-background hover:bg-surface2");
  const arrowPhoto = cn(arrowBase, "bg-white/90 backdrop-blur-sm hover:bg-white");

  return (
    <div>
      {/* Header: title left, controls right. A two-column grid from md up, so a
          long title wraps inside its column instead of pushing the controls
          onto a second row. */}
      <div className="flex flex-col gap-y-5 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-x-10">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {/* text-pretty rather than text-balance: balance shortens every line to
              equalize them, which is what made a two-sentence title wrap four
              deep. The column now runs to the button. */}
          <h2
            id={headingId}
            className="text-pretty font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.9rem] md:leading-[1.04]"
          >
            {title}
          </h2>
        </div>
        <Link href={viewAllHref} className="btn-ghost group">
          {labels.viewAll}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
        </Link>
      </div>

      {belowHeader && <div className="mt-14 md:mt-16">{belowHeader}</div>}

      {/* The card, with the arrows on its left and right edges at mid-height.
          One grid cell shared by every story; the active one is opaque. The
          container is px-6 and caps at 1280px, so from lg to ~1300px the card
          edge is 24px from the window: an arrow 24px outside it touched the
          edge and clipped. It sits 12px out until the container has margin. */}
      <div className="relative mt-14 md:mt-16">
        <div
          ref={regionRef}
          id={regionId}
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={headingId}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (pointerX.current = null)}
          className={cn(
            "grid grid-cols-[minmax(0,1fr)] touch-pan-y overflow-hidden rounded-3xl border border-border bg-background shadow-soft-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryDeep focus-visible:ring-offset-4",
          )}
        >
          {stories.map((s, i) => {
            const active = i === index;
            return (
              <article
                key={s.href}
                role="group"
                aria-roledescription="slide"
                aria-label={fill(labels.counter, { i: i + 1, n })}
                aria-hidden={!active}
                className={cn(
                  "grid min-w-0 grid-cols-[minmax(0,1fr)] [grid-area:1/1] transition-opacity duration-300 ease-in-out motion-reduce:transition-none lg:grid-cols-2",
                  active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                {/* Copy */}
                <div className="flex min-w-0 flex-col justify-center p-7 md:p-10 lg:p-12 xl:p-14">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    {s.logo ? (
                      <Image src={s.logo.src} alt={s.logo.alt} width={s.logo.w} height={s.logo.h} sizes="200px" className="h-7 w-auto md:h-8" />
                    ) : (
                      <span className="font-display text-xl font-bold text-foreground md:text-2xl">{s.client}</span>
                    )}
                    <span className="rounded-full bg-surface2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted">
                      {s.badge}
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-wider text-primaryDeep">
                    {s.sector} · {s.region}
                  </p>
                  <h3 className="mt-3 text-balance font-display text-2xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[2rem] xl:text-[2.4rem]">
                    {s.title}
                  </h3>
                  <p className="mt-4 hidden max-w-xl leading-relaxed text-muted md:block">{s.summary}</p>
                  <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
                    {s.metrics.map((m) => (
                      <div key={m.label} className="border-l border-border pl-4">
                        <div className="text-gradient-bold font-display text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl">{m.value}</div>
                        <div className="mt-1.5 text-xs leading-snug text-muted md:text-sm">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* The inactive slide is aria-hidden and transparent; its link
                      must not stay in the tab order. */}
                  <Link
                    href={s.href}
                    tabIndex={active ? undefined : -1}
                    className={cn("group mt-8 inline-flex items-center gap-1.5 font-semibold text-primaryDeep", focusRing)}
                  >
                    <span className="link-underline">{labels.readCaseStudy}</span>
                    <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* Photo: contained by the card, full height on desktop. */}
                <div className="relative order-first aspect-[16/10] w-full lg:order-none lg:aspect-auto lg:min-h-[30rem]">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="aspect-[16/10] object-cover"
                  />
                </div>
              </article>
            );
          })}

          {/* Below lg the photograph is the top of the card at a fixed 16:10, so
              an overlay of the same shape puts these arrows at the photo's
              mid-height for every story. They live outside the slides, so
              activating one never unmounts the control that has focus. */}
          {n > 1 && (
            <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[16/10] lg:hidden" aria-hidden="false">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label={labels.prev}
                aria-controls={regionId}
                className={cn(arrowPhoto, "pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2")}
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label={labels.next}
                aria-controls={regionId}
                className={cn(arrowPhoto, "pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2")}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={labels.prev}
              aria-controls={regionId}
              className={cn(arrowLight, "absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex min-[1360px]:-left-6")}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={labels.next}
              aria-controls={regionId}
              className={cn(arrowLight, "absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex min-[1360px]:-right-6")}
            >
              <span aria-hidden="true">→</span>
            </button>
          </>
        )}
      </div>

      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
