"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { CALENDLY_CSS, CALENDLY_JS, popupUrl } from "@/lib/calendly";

export type BookablePerson = {
  slug: string;
  name: string;
  title: string;
  photo?: string | null;
  url: string;
  /** What this person can usefully talk about; optional, admin-editable. */
  topics?: string | null;
  /** Accessible name, interpolated server-side (next-intl treats {name} as ICU). */
  ariaLabel: string;
};

/**
 * One pill per bookable person; clicking opens that person's calendar in
 * Calendly's own popup modal (`initPopupWidget`) rather than embedding a 700px
 * calendar in the page for everyone who scrolls past.
 *
 * Calendly's popup is used instead of a hand-rolled dialog because it already
 * handles the overlay, the close affordance and Escape, and it is the supported
 * path for their widget.
 *
 * Progressive enhancement: every pill is a real anchor to the booking URL, so
 * before the script loads, with JS disabled, or if Calendly is blocked, it opens
 * the scheduler in a new tab. Once widget.js is ready the click is intercepted and
 * becomes a modal instead.
 *
 * widget.js loads when the section nears the viewport rather than on click, and
 * also on the first hover, touch or focus of a pill, so the first click has the
 * modal ready. A pageview that never reaches the section makes no request to
 * Calendly at all.
 *
 * Both triggers matter: with only the observer, someone scrolling fast could
 * click before the script finished, the handler would fall through to the
 * anchor, and the calendar opened in a new tab instead of the modal. It worked,
 * but inconsistently, which reads as a bug.
 *
 * Note for whoever changes a booking URL: `scripts/check-booking-urls.ts`
 * verifies each one against Calendly's event lookup. A URL pointing at a deleted
 * event still serves HTTP 200 with a normal HTML shell, so only that lookup
 * catches it. One shipped that way and visitors saw "this Calendly URL is not
 * valid" inside the modal.
 */
export function BookingPills({
  people,
  fallbackUrl,
  label,
  fallbackLabel,
  tone = "light",
  size = "sm",
}: {
  people: BookablePerson[];
  /** Used when nobody shown has a calendar of their own. */
  fallbackUrl: string;
  label: string;
  fallbackLabel: string;
  /**
   * "dark" is for placement on a dark scrim (the service closing plate): only
   * the label above the pills changes, since the pills themselves are light
   * cards either way and read as the brightest thing on a dark background.
   */
  tone?: "light" | "dark";
  /**
   * "sm" is the original compact pill, sized to sit inline beside other
   * copy. "lg" is for a surface that is only this (the booking modal): a
   * bigger photo and more room for the topics line, so the roster reads as
   * the point of the screen rather than a footer widget.
   */
  size?: "sm" | "lg";
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      // Generous margin so the script has time to load before the pills are
      // reachable. 1200px rather than 400px because at 400px someone scrolling
      // fast could reach a pill and click it before widget.js finished, and the
      // click then fell through to the anchor and opened a new tab instead of
      // the modal. That made the behavior look intermittent.
      { rootMargin: "1200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Second chance to start the script: intent signals that precede a click.
   * Hovering, focusing or touching a pill gives widget.js a head start even if
   * the observer has not fired, so the first click lands on the modal.
   */
  const warm = () => setInView(true);

  // widget.js may already be parsed (another instance on the page, or a
  // client-side navigation), in which case next/script will not fire onLoad again.
  useEffect(() => {
    if (!inView || ready) return;
    if (window.Calendly?.initPopupWidget) setReady(true);
  }, [inView, ready]);

  // Calendly posts this when a booking completes. Reported to GA4 if analytics is
  // present: `gtag` only exists once consent is granted (components/Analytics.tsx).
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { event?: string } | null;
      if (!data || typeof data !== "object" || data.event !== "calendly.event_scheduled") return;
      window.gtag?.("event", "booking_scheduled", {
        event_category: "engagement",
        event_label: "calendly",
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const open = (url: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, new window, middle click) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!window.Calendly?.initPopupWidget) return; // no JS yet: follow the href
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: popupUrl(url) });
  };

  const hasPeople = people.length > 0;

  return (
    <div
      ref={wrapper}
      onPointerEnter={warm}
      onTouchStart={warm}
      onFocusCapture={warm}
    >
      {inView && (
        <>
          <link href={CALENDLY_CSS} rel="stylesheet" />
          <Script src={CALENDLY_JS} strategy="afterInteractive" onLoad={() => setReady(true)} />
        </>
      )}

      <p
        className={[
          "font-mono text-[0.66rem] uppercase tracking-[0.14em]",
          tone === "dark" ? "text-white/70" : "text-muted",
        ].join(" ")}
      >
        {label}
      </p>

      <div className={size === "lg" ? "mt-5 flex flex-col gap-3" : "mt-4 flex flex-wrap gap-3"}>
        {hasPeople ? (
          people.map((p, i) => (
            <a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={open(p.url)}
              aria-label={p.ariaLabel}
              className={
                size === "lg"
                  ? "group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-soft-lg"
                  : [
                      "group flex items-center gap-3 border border-border bg-surface py-2 pl-2 pr-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-soft-lg",
                      // A topics line makes the pill two lines taller, so soften the
                      // radius rather than keeping a full pill shape.
                      p.topics ? "max-w-sm rounded-2xl" : "rounded-full",
                    ].join(" ")
              }
            >
              {p.photo ? (
                <Image
                  src={p.photo}
                  alt=""
                  width={size === "lg" ? 56 : 36}
                  height={size === "lg" ? 56 : 36}
                  sizes={size === "lg" ? "56px" : "36px"}
                  className={
                    size === "lg"
                      ? // The logo's own hues, one per card, round-robin: a small,
                        // repeated brand touch rather than a flat gray avatar ring.
                        `h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-offset-2 ring-offset-surface ${
                          ["ring-royal/50", "ring-primary/60", "ring-accent/60"][i % 3]
                        }`
                      : "h-9 w-9 rounded-full object-cover"
                  }
                />
              ) : null}
              <span className="min-w-0 flex-1 leading-tight">
                <span
                  className={
                    size === "lg"
                      ? "block font-display text-base font-bold text-foreground group-hover:text-primaryDeep"
                      : "block text-sm font-semibold text-foreground group-hover:text-primaryDeep"
                  }
                >
                  {p.name}
                </span>
                <span className={size === "lg" ? "block text-sm text-muted" : "block text-xs text-muted"}>
                  {p.title}
                </span>
                {p.topics && (
                  <span
                    className={
                      size === "lg"
                        ? "mt-1.5 block text-sm leading-snug text-muted/90"
                        : "mt-1 block text-xs leading-snug text-muted/90"
                    }
                  >
                    {p.topics}
                  </span>
                )}
              </span>
              <CalendarIcon large={size === "lg"} />
            </a>
          ))
        ) : (
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={open(fallbackUrl)}
            className="btn-primary group inline-flex"
          >
            {fallbackLabel}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

function CalendarIcon({ large }: { large?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={
        large
          ? "ml-1 h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-primaryDeep"
          : "ml-1 h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-primaryDeep"
      }
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  );
}
