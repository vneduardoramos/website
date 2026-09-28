/**
 * Shared Calendly plumbing: the widget asset URLs and the popup-URL
 * transform, used by every surface that opens Calendly in its own modal
 * (Calendly's, not a hand-rolled one) rather than embedding a calendar
 * inline. One copy so the three current callers (BookingPills, the site
 * chat agent, the nav's booking modal) can't drift on the query params.
 */
export const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
export const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

/**
 * `hide_gdpr_banner=1` suppresses Calendly's own cookie banner: the site runs
 * its own consent banner and the privacy policy names the scheduler, so a
 * second banner inside the popup only covers the date picker.
 *
 * `hide_event_type_details=1` drops the left pane, which the surface opening
 * this URL already states (name, duration) in its own copy, keeping the
 * popup compact.
 */
export function popupUrl(raw: string): string {
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
