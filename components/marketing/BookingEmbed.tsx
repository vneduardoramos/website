"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

/** Calendly's recommended inline sizing. */
const WIDGET_STYLE = { minWidth: 320, height: 700 } as const;

/**
 * Calendly's inline widget, rendered as part of the page (no floating badge, no
 * click to open): the calendar sits in the section's normal flow so it reads as a
 * real booking step rather than a bolted-on widget.
 *
 * It still costs nothing on page load. widget.js loads only once the section
 * scrolls near the viewport (IntersectionObserver, 400px margin), so a pageview
 * that never reaches this section makes no request to Calendly at all.
 *
 * The container carries `calendly-inline-widget` + `data-url` exactly as
 * Calendly's snippet does, so widget.js auto-initializes it on load. That covers
 * the normal case. On a client-side navigation to another page with this block,
 * however, the script is already parsed and its one-shot scan will not run again,
 * so once the script is ready we also init programmatically if the container is
 * still empty. Belt and braces, and no double-mount.
 *
 * Non-Calendly URLs (e.g. Google Calendar appointment scheduling) fall back to a
 * plain iframe, so changing provider later needs no change here.
 */
export function BookingEmbed({
  url,
  fallbackLabel,
  ariaLabel,
  embedTitle,
}: {
  url: string;
  fallbackLabel: string;
  ariaLabel: string;
  embedTitle: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const calendly = isCalendly(url);
  const dataUrl = calendly ? calendlyEmbedUrl(url) : url;

  // Only pull in the third party once the section is close to being seen.
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

  // widget.js may already be parsed from an earlier mount on this page, in which
  // case next/script will not fire onLoad again. Detect that directly.
  useEffect(() => {
    if (!inView || !calendly || ready) return;
    if (window.Calendly?.initInlineWidget) setReady(true);
  }, [inView, calendly, ready]);

  // Tracks which URL is currently mounted, so switching person re-mounts and a
  // re-render does not.
  const mountedUrl = useRef<string | null>(null);

  // Handles two cases the class-based auto-scan cannot: a client-side navigation
  // (widget.js is already parsed, so its one-shot scan never runs again) and a
  // person switch in BookingPicker (the data-url changes after mount).
  useEffect(() => {
    if (!inView || !calendly || !ready) return;
    const el = host.current;
    if (!el) return;
    // First pass with the widget already in place: the auto-scan did it, so just
    // record what is showing instead of tearing it down and refetching.
    if (mountedUrl.current === null && el.childElementCount > 0) {
      mountedUrl.current = dataUrl;
      return;
    }
    if (mountedUrl.current === dataUrl) return;
    el.innerHTML = "";
    window.Calendly?.initInlineWidget?.({ url: dataUrl, parentElement: el });
    mountedUrl.current = dataUrl;
  }, [inView, calendly, ready, dataUrl]);

  // Calendly posts this when a booking completes. Reported to GA4 if analytics is
  // present: `gtag` only exists once consent is granted (components/Analytics.tsx),
  // so this needs no consent check of its own.
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

  return (
    <div ref={wrapper}>
      {inView && calendly && (
        <Script src={CALENDLY_JS} strategy="afterInteractive" onLoad={() => setReady(true)} />
      )}

      {/* overflow-x-auto so Calendly's 320px minimum cannot break the layout
          inside the card's padding on a narrow phone. */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div className="overflow-x-auto">
          {calendly ? (
            <div
              ref={host}
              className="calendly-inline-widget"
              data-url={dataUrl}
              style={WIDGET_STYLE}
            />
          ) : (
            inView && (
              <iframe
                src={genericEmbedUrl(url)}
                title={embedTitle}
                loading="lazy"
                className="h-[700px] w-full border-0"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )
          )}
        </div>

        {/* Occupies the space until the calendar paints, and is the whole
            experience with JS off or if Calendly is unreachable. */}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface p-8 text-center">
            <p className="text-sm text-muted" role="status">
              {embedTitle}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className="btn-primary group inline-flex"
            >
              {fallbackLabel}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function isCalendly(raw: string): boolean {
  try {
    const h = new URL(raw).hostname;
    return h === "calendly.com" || h.endsWith(".calendly.com");
  } catch {
    return false;
  }
}

/**
 * Applies the embed params to whatever Calendly URL is configured, rather than
 * relying on them being typed into the CMS or theme:
 *
 * - `hide_event_type_details=1` drops Calendly's left pane (name, duration), which
 *   the surrounding copy already states, and gives the date and time panes the
 *   full width.
 * - `hide_gdpr_banner=1` suppresses Calendly's own cookie banner. The site runs
 *   its own consent banner and the privacy policy names the scheduler, so a second
 *   banner inside the iframe only covers the date picker.
 */
function calendlyEmbedUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.searchParams.set("hide_event_type_details", "1");
    u.searchParams.set("hide_gdpr_banner", "1");
    return u.toString();
  } catch {
    return raw;
  }
}

/**
 * Google's appointment scheduling links need `gv=true` to render the embeddable
 * view rather than the full Calendar UI. Anything else passes through untouched.
 */
function genericEmbedUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.hostname.endsWith("google.com") && u.pathname.includes("/appointments/")) {
      u.searchParams.set("gv", "true");
    }
    return u.toString();
  } catch {
    return raw;
  }
}
