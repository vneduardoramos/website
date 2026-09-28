import { getLocale, getTranslations } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { getTeam } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

/**
 * Compact leadership strip: a row of small overlapping headshots, a short label,
 * and a link to the full team. Drop-in async server component (fetches getTeam()),
 * for high-trust spots where the full named cards (/about#team) would be too heavy.
 */
export async function LeadershipStrip({
  label,
  max = 6,
  className = "",
}: {
  label?: string;
  max?: number;
  className?: string;
}) {
  const t = await getTranslations("strips");
  const team = await getTeam((await getLocale()) as Locale);
  if (!team || team.length === 0) return null;
  const people = team.slice(0, max);

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      <div className="flex -space-x-2.5">
        {people.map((m) =>
          m.photo ? (
            <Image
              key={m.slug}
              src={m.photo}
              alt={m.name}
              width={36}
              height={36}
              sizes="36px"
              // A blur placeholder is imperceptible at 36px and next/image's
              // own dev warning says so; the Img wrapper defaults it on.
              placeholder="empty"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
            />
          ) : (
            <span
              key={m.slug}
              aria-label={m.name}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primaryDeep ring-2 ring-background"
            >
              {initials(m.name)}
            </span>
          ),
        )}
      </div>
      <p className="text-sm text-muted">
        <span className="font-medium text-foreground">{label ?? t("leadershipStrip.label")}</span>{" "}
        <Link href="/about#team" className="font-semibold text-primaryDeep hover:underline">
          {t("leadershipStrip.link")}
        </Link>
      </p>
    </div>
  );
}

/**
 * Just the overlapping avatar row (no label, no link), for tight spots where
 * faces sit beside a CTA. `slugs` picks and orders specific people; otherwise
 * the first `max` by team order.
 */
export async function FaceStack({
  slugs,
  max = 3,
  className = "",
}: {
  slugs?: string[];
  max?: number;
  className?: string;
}) {
  const team = await getTeam((await getLocale()) as Locale);
  if (!team || team.length === 0) return null;
  const people = slugs
    ? slugs
        .map((s) => team.find((m) => m.slug === s))
        .filter((m): m is (typeof team)[number] => Boolean(m))
    : team.slice(0, max);
  if (people.length === 0) return null;

  return (
    <div className={`flex -space-x-2.5 ${className}`}>
      {people.map((m) =>
        m.photo ? (
          <Image
            key={m.slug}
            src={m.photo}
            alt={m.name}
            width={40}
            height={40}
            sizes="40px"
            placeholder="empty"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
          />
        ) : (
          <span
            key={m.slug}
            aria-label={m.name}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primaryDeep ring-2 ring-background"
          >
            {initials(m.name)}
          </span>
        ),
      )}
    </div>
  );
}
