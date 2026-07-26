import { getTranslations, getLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { BookingPills, type BookablePerson } from "@/components/marketing/BookingPills";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { SnowMark } from "@/components/marketing/SnowMark";
import { getTeam } from "@/lib/queries";
import { theme } from "@/config/theme";
import type { Locale } from "@/lib/i18n-content";

/**
 * "Book time with a named human" block.
 *
 * The confidence comes from the specifics, not the button: real faces with real
 * names and roles, an agenda so the call does not read as a sales trap, the
 * duration, and who picks up (an architect, not an SDR). A bare "Book a demo"
 * button does none of that work.
 *
 * The booking URL comes from `TeamMember.bookingUrl` (editable in the admin, no
 * deploy needed) with `NEXT_PUBLIC_BOOKING_URL` as a site-wide fallback for
 * setting it once on the host. With neither set the whole block renders nothing
 * rather than shipping a dead button, so it is safe to place on pages now and
 * activate later.
 */
export async function BookACall({
  slugs = ["eduardo-ramos", "jc-rodriguez", "rene-trevino"],
  className = "",
}: {
  slugs?: string[];
  className?: string;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("booking");
  const team = await getTeam(locale);

  const people = slugs
    .map((s) => team.find((m) => m.slug === s))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  // People shown here who have a calendar of their own. With two or more, the
  // visitor picks whose calendar to open; with one (or none) we fall back to a
  // single shared URL.
  const bookable: BookablePerson[] = people
    .filter((m) => m.bookingUrl)
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      title: m.title,
      photo: m.photo,
      url: m.bookingUrl as string,
      topics: m.bookingTopics,
      ariaLabel: t("pills.aria", { name: m.name }),
    }));

  const bookingUrl =
    bookable[0]?.url ??
    team.find((m) => m.bookingUrl)?.bookingUrl ??
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    theme.brand.bookingUrl ??
    "";

  if (!bookingUrl) return null;

  const agenda = t.raw("agenda") as string[];

  return (
    <div
      className={`panel-indigo relative overflow-hidden rounded-3xl p-8 shadow-soft-lg md:p-12 ${className}`}
    >
      <SnowMark
        variant="white"
        size={190}
        className="pointer-events-none absolute -bottom-10 -left-8 opacity-[0.06]"
      />
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="eyebrow eyebrow--invert">{t("eyebrow")}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">{t("body")}</p>

          {/* The faces, named. An unnamed avatar row proves nothing. Skipped
              when the picker renders below, which shows the same people as
              selectable options. */}
          {people.length > 0 && bookable.length === 0 && (
            <div className="mt-8">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/60">
                {t("facesLabel")}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
                {people.map((m) => (
                  <li key={m.slug} className="flex items-center gap-3">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        width={44}
                        height={44}
                        sizes="44px"
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-background"
                      />
                    ) : null}
                    <span className="leading-tight">
                      <span className="block text-sm font-semibold text-white">{m.name}</span>
                      <span className="block text-xs text-white/65">{m.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <PartnerBadges size="sm" className="mt-8" />
        </div>

        <div className="lg:pl-2">
          {/* What actually happens on the call: the part that removes hesitation. */}
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/60">
            {t("agendaLabel")}
          </p>
          <ul className="mt-4 space-y-3">
            {agenda.map((a) => (
              <li key={a} className="flex items-start gap-3 text-white/90">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {(["duration", "timezone", "who"] as const).map((k) => (
              <div key={k} className="flex items-center gap-2">
                <dt className="sr-only">{k}</dt>
                <dd className="text-white/70">
                  <span aria-hidden className="mr-2 text-accent">
                    ·
                  </span>
                  {t(`meta.${k}`)}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-sm leading-relaxed text-white/70">{t("reassure")}</p>

          <p className="mt-5 text-sm text-white/70">
            {t("fallback.prefer")}{" "}
            <Link
              href="/contact"
              className="font-semibold text-white underline underline-offset-4 hover:no-underline"
            >
              {t("fallback.cta")}
            </Link>
          </p>
        </div>
      </div>

      {/* One pill per bookable person; the calendar opens in Calendly's modal
          rather than occupying 700px of the section for every visitor. */}
      <div className="relative mt-10 border-t border-white/15 pt-8">
        <BookingPills
          people={bookable}
          fallbackUrl={bookingUrl}
          label={t("pills.label")}
          fallbackLabel={t("cta")}
        />
      </div>
    </div>
  );
}
