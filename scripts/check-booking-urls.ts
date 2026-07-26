/**
 * Validate every TeamMember.bookingUrl against Calendly's own event lookup.
 *
 * Why this exists: a booking URL can point at a deleted event and still look
 * fine to any surface-level check. Fetching the page returns HTTP 200 with a
 * normal-looking HTML shell, because the booking UI is a client-side app and the
 * "this Calendly URL is not valid" message is only rendered after the app calls
 * `/api/booking/event_types/lookup`. That is exactly how a dead URL shipped to
 * production: the HTML was 200, so it was assumed good, and visitors got the
 * error in the modal.
 *
 * This asks the same endpoint the booking app asks, which reports
 * `unavailability_reason` (e.g. `event_type_deleted`) for a URL that resolves to
 * nothing bookable.
 *
 *   npx tsx scripts/check-booking-urls.ts
 *
 * Exits non-zero if any URL is unusable, so it can gate a deploy.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

type Verdict = {
  ok: boolean;
  detail: string;
  /** Event length in minutes, so the "Book 30 minutes" copy can be checked too. */
  duration?: number;
};

/** Split a Calendly booking URL into its profile and event-type slugs. */
function parse(url: string): { profile: string; event?: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "calendly.com" && !u.hostname.endsWith(".calendly.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    return { profile: parts[0], event: parts[1] };
  } catch {
    return null;
  }
}

async function check(url: string): Promise<Verdict> {
  const parsed = parse(url);
  if (!parsed) return { ok: false, detail: "not a calendly.com URL" };
  const { profile, event } = parsed;

  // A bare profile URL (no event slug) shows the person's event list. Valid, but
  // it does not promise a duration, so flag it as worth a second look.
  if (!event) {
    return { ok: true, detail: `profile URL with no event slug (shows every event type)` };
  }

  const endpoint =
    `https://calendly.com/api/booking/event_types/lookup` +
    `?event_type_slug=${encodeURIComponent(event)}&profile_slug=${encodeURIComponent(profile)}`;

  const res = await fetch(endpoint, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) return { ok: false, detail: `lookup HTTP ${res.status}` };

  const body = (await res.json()) as {
    duration?: number;
    unavailability_reason?: { code?: string; error?: string };
  };

  // The tell: a 200 that carries an unavailability_reason instead of an event.
  const reason = body.unavailability_reason;
  if (reason) {
    return { ok: false, detail: `${reason.code ?? "unavailable"}: ${reason.error ?? "unusable"}` };
  }
  if (typeof body.duration !== "number") {
    return { ok: false, detail: "lookup returned no event (no duration)" };
  }
  return { ok: true, detail: "bookable", duration: body.duration };
}

async function main() {
  const people = await prisma.teamMember.findMany({
    where: { bookingUrl: { not: null } },
    select: { slug: true, name: true, bookingUrl: true },
    orderBy: { order: "asc" },
  });

  if (people.length === 0) {
    console.log("No team member has a bookingUrl set. Nothing to check.");
    return;
  }

  let bad = 0;
  console.log(`Checking ${people.length} booking URL(s) against Calendly\n`);
  for (const p of people) {
    const url = p.bookingUrl as string;
    let v: Verdict;
    try {
      v = await check(url);
    } catch (err) {
      v = { ok: false, detail: `request failed: ${(err as Error).message}` };
    }
    const mark = v.ok ? "ok  " : "FAIL";
    const mins = v.duration ? ` ${v.duration} min` : "";
    console.log(`  ${mark} ${p.name}\n       ${url}\n       ${v.detail}${mins}`);
    if (!v.ok) bad += 1;
  }

  if (bad > 0) {
    console.error(
      `\n${bad} booking URL(s) are not bookable. Visitors clicking those pills get ` +
        `"this Calendly URL is not valid" inside the modal.`,
    );
    process.exitCode = 1;
  } else {
    console.log("\nAll booking URLs resolve to a bookable event.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
