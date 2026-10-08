import { getTranslations } from "next-intl/server";
import { EventAnnouncementBarClient } from "@/components/marketing/events/EventAnnouncementBarClient";

// Day after the show, Mexico City time (UTC-6): the banner stops rendering
// server-side entirely rather than relying on a visitor to dismiss it, so it
// can't go stale. One line to change (or remove) once there's a next event.
const EVENT_CUTOFF = new Date("2026-10-14T06:00:00Z");

/**
 * Site-wide top bar for one dated event (Snowflake World Tour Mexico City,
 * Oct 13, 2026), in the marketing layout above <Nav>. Any page could be a
 * visitor's entry point with six days to the show, so this isn't scoped to
 * the home page alone. Renders nothing after EVENT_CUTOFF or once dismissed
 * (see the client half for that).
 */
export async function EventAnnouncementBar() {
  if (Date.now() >= EVENT_CUTOFF.getTime()) return null;

  const t = await getTranslations("misc.eventBanner");
  return (
    <EventAnnouncementBarClient
      href="/snowflake-world-tour-mexico-city"
      message={t("message")}
      cta={t("cta")}
      closeLabel={t("close")}
    />
  );
}
