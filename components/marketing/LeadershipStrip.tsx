import { Img as Image } from "@/components/marketing/Img";
import Link from "next/link";
import { getTeam } from "@/lib/queries";

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
  label = "Led by our leadership team",
  max = 6,
  className = "",
}: {
  label?: string;
  max?: number;
  className?: string;
}) {
  const team = await getTeam();
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
        <span className="font-medium text-foreground">{label}</span>{" "}
        <Link href="/about#team" className="font-semibold text-primaryDeep hover:underline">
          Meet the leadership team →
        </Link>
      </p>
    </div>
  );
}
