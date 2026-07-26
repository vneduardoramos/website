"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

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
 * widget.js loads when the section nears the viewport rather than on click, so the
 * first click opens instantly; a pageview that never reaches the section makes no
 * request to Calendly at all.
 */
export function BookingPills({
  people,
  fallbackUrl,
  label,
  fallbackLabel,
}: {
  people: BookablePerson[];
  /** Used when nobody shown has a calendar of their own. */
  fallbackUrl: string;
  label: string;
  fallbackLabel: string;
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
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <div ref={wrapper}>
      {inView && (
        <>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link href={CALENDLY_CSS} rel="stylesheet" />
          <Script src={CALENDLY_JS} strategy="afterInteractive" onLoad={() => setReady(true)} />
        </>
      )}

      <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/60">{label}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        {hasPeople ? (
          people.map((p) => (
            <a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={open(p.url)}
              aria-label={p.ariaLabel}
              className={[
                "group flex items-center gap-3 border border-white/20 bg-white/95 py-2 pl-2 pr-5 text-left shadow-soft-lg transition hover:-translate-y-0.5 hover:bg-white hover:border-white/40",
                // A topics line makes the pill two lines taller, so soften the
                // radius rather than keeping a full pill shape.
                p.topics ? "max-w-sm rounded-2xl" : "rounded-full",
              ].join(" ")}
            >
              {p.photo ? (
                <Image
                  src={p.photo}
                  alt=""
                  width={36}
                  height={36}
                  sizes="36px"
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : null}
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-foreground group-hover:text-primaryDeep">
                  {p.name}
                </span>
                <span className="block text-xs text-muted">{p.title}</span>
                {p.topics && (
                  <span className="mt-1 block text-xs leading-snug text-muted/90">{p.topics}</span>
                )}
              </span>
              <CalendarIcon />
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

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ml-1 h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-primaryDeep"
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

/**
 * `hide_gdpr_banner=1` suppresses Calendly's own cookie banner: the site runs its
 * own consent banner and the privacy policy names the scheduler, so a second
 * banner inside the modal only covers the date picker.
 *
 * `hide_event_type_details=1` drops the left pane, which the pill already states
 * (name) and the surrounding copy states (30 minutes), keeping the modal compact.
 */
function popupUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.hostname === "calendly.com" || u.hostname.endsWith(".calendly.com")) {
      u.searchParams.set("hide_event_type_details", "1");
      u.searchParams.set("hide_gdpr_banner", "1");
    }
    return u.toString();
  } catch {
    return raw;
  }
}
