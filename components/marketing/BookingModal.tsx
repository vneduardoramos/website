"use client";

import { useEffect, useId, useRef } from "react";
import { BookingPills, type BookablePerson } from "@/components/marketing/BookingPills";

/**
 * The "Let's talk" surface: every button on the site with that label opens
 * this instead of navigating to /contact, so a visitor picks a calendar in
 * one click from wherever they already are rather than landing on a form.
 *
 * Renders the same `BookingPills` used elsewhere (Customers-adjacent
 * booking cards, the service-page close), so the loading, the Calendly
 * popup wiring, and the render-nothing-without-a-URL guard all live in one
 * place. This component only adds the dialog chrome around it: a backdrop,
 * Escape to close, scroll lock while open, and focus returned to whatever
 * opened it.
 */
export function BookingModal({
  open,
  onClose,
  people,
  fallbackUrl,
  title,
  body,
  pillsLabel,
  fallbackCta,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  people: BookablePerson[];
  fallbackUrl: string;
  title: string;
  body: string;
  pillsLabel: string;
  fallbackCta: string;
  closeLabel: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run on open/close, not on every onClose identity change
  }, [open]);

  if (!open || !fallbackUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-soft-lg outline-none sm:rounded-3xl"
      >
        {/* The panel's one warm moment: the same sunset treatment CtaBand
            closes the page with, here opening the conversation instead.
            The roster below stays on a plain surface, so the cards (the
            actual decision) read as calm and legible against it. */}
        <div className="panel-sunset panel-editorial relative shrink-0 overflow-hidden p-6 sm:p-8">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-gold/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-red/15 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-balance font-display text-xl font-bold text-foreground md:text-2xl">
                {title}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground/70">{body}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="shrink-0 rounded-full p-1.5 text-foreground/60 transition-colors hover:bg-white/40 hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <BookingPills
            people={people}
            fallbackUrl={fallbackUrl}
            label={pillsLabel}
            fallbackLabel={fallbackCta}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
