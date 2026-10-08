"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

// Scoped to this one event: a future banner for a different show gets its own
// key, so dismissing this one never silently suppresses the next.
const DISMISS_KEY = "vn-event-banner-dismissed:swt-cdmx-2026";

export function EventAnnouncementBarClient({
  href,
  message,
  cta,
  closeLabel,
}: {
  href: string;
  message: string;
  cta: string;
  closeLabel: string;
}) {
  // Starts true (rendered) to match the server, which has no access to
  // localStorage; an effect below hides it client-side if already dismissed,
  // so a returning visitor doesn't see it flash before disappearing.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") setVisible(false);
    } catch {
      // Storage-hostile environment: the banner just stays visible for this visit.
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore persistence failure; it still dismisses for this pageview.
    }
  };

  return (
    <div role="region" aria-label={message} className="relative bg-accent text-accent-fg">
      <div className="container-page flex items-center justify-center gap-3 py-2.5 pr-10 text-center text-sm font-semibold">
        <Link href={href} className="group inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span>{message}</span>
          <span className="inline-flex items-center gap-1 underline underline-offset-2">
            {cta}
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
          </span>
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label={closeLabel}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-accent-fg/70 transition-colors hover:bg-accent-fg/10 hover:text-accent-fg"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
