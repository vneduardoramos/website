/**
 * Calendly's widget.js globals, declared once.
 *
 * Both booking surfaces touch `window.Calendly` (the in-page inline embed and
 * the floating badge), and declaring the same global in two files is a TS2717
 * conflict, so the shape lives here.
 */
interface CalendlyGlobal {
  initInlineWidget?: (opts: { url: string; parentElement: HTMLElement }) => void;
  initPopupWidget?: (opts: { url: string }) => void;
  initBadgeWidget?: (opts: {
    url: string;
    text: string;
    color: string;
    textColor: string;
    branding: boolean;
  }) => void;
}

interface Window {
  Calendly?: CalendlyGlobal;
  /** Defined by components/Analytics.tsx, and only once consent is granted. */
  gtag?: (...args: unknown[]) => void;
}
