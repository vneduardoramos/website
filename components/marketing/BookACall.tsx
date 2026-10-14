import { getTranslations, getLocale } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import {
  BookingPills,
  type BookablePerson,
} from "@/components/marketing/BookingPills";
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
  variant = "band",
  tone = "light",
}: {
  slugs?: string[];
  className?: string;
  /**
   * "band" is the full-bleed pitch for the three money pages. "compact" is a
   * contained card that replaces the generic CtaBand on evaluation-stage pages:
   * same booking action, a fraction of the height, and it upgrades an existing
   * slot rather than stacking a second call to action on top of it.
   * "inline" renders the heading, body and pills with NO section or panel of its
   * own, for composing into a section that already has a background (see
   * ServiceClose). Keeps the booking-URL resolution and the render-nothing
   * guard below in one place instead of copying them per host.
   */
  variant?: "band" | "compact" | "inline";
  /** Text colors for placement on a dark scrim. Applies to "inline" only. */
  tone?: "light" | "dark";
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

  if (variant === "inline") {
    const dark = tone === "dark";
    return (
      <div className={className}>
        <h2
          className={`text-balance font-display text-2xl font-bold tracking-tight md:text-[1.75rem] ${
            dark ? "text-white" : "text-foreground"
          }`}
        >
          {t("compact.title")}
        </h2>
        <p className={`mt-3 leading-relaxed ${dark ? "text-white/75" : "text-muted"}`}>
          {t("compact.body")}
        </p>
        <div className="mt-6">
          <BookingPills
            people={bookable}
            fallbackUrl={bookingUrl}
            label={t("pills.label")}
            fallbackLabel={t("cta")}
            tone={tone}
          />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <section className={`section ${className}`}>
        <div className="container-page">
          <div className="panel-warm rounded-3xl p-8 shadow-soft md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {t("compact.title")}
                </h2>
                <p className="mt-3 leading-relaxed text-muted">{t("compact.body")}</p>
              </div>
              <BookingPills
                people={bookable}
                fallbackUrl={bookingUrl}
                label={t("pills.label")}
                fallbackLabel={t("cta")}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`section panel-sunset panel-editorial relative overflow-hidden border-x-0 ${className}`}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="container-page relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t("body")}
            </p>

            {/* The strongest line on the block: worth the 30 minutes even if
                they never buy. Given weight rather than buried in the body. */}
            <p className="mt-6 border-l-2 border-accentDeep/50 pl-4 font-display text-lg font-semibold leading-snug text-foreground">
              {t("takeaway")}
            </p>

            {/* The faces, named. An unnamed avatar row proves nothing. Skipped
              when the picker renders below, which shows the same people as
              selectable options. */}
            {people.length > 0 && bookable.length === 0 && (
              <div className="mt-8">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
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
                        <span className="block text-sm font-semibold text-foreground">
                          {m.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {m.title}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          <div className="lg:pl-2">
            {/* What actually happens on the call: the part that removes hesitation. */}
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
              {t("agendaLabel")}
            </p>
            <ul className="mt-4 space-y-3">
              {agenda.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 text-foreground/90"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accentDeep"
                  />
                  <span>{a}</span>
                </li>
              ))}
            </ul>

            {/* Plain list, not a <dl>: these are three facts, not term/definition
                pairs, and the sr-only <dt> was announcing the raw message keys
                ("duration", "timezone", "who") untranslated in both locales. */}
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {(["duration", "timezone", "who"] as const).map((k) => (
                <li key={k} className="text-muted">
                  <span aria-hidden className="mr-2 text-accentDeep">
                    ·
                  </span>
                  {t(`meta.${k}`)}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-muted">
              {t("reassure")}
            </p>

            <p className="mt-5 text-sm text-muted">
              {t("fallback.prefer")}{" "}
              <Link
                href="/contact"
                className="font-semibold text-primaryDeep underline-offset-4 hover:underline"
              >
                {t("fallback.cta")}
              </Link>
            </p>
          </div>
        </div>

        {/* One pill per bookable person; the calendar opens in Calendly's modal
          rather than occupying 700px of the section for every visitor. */}
        <div className="relative mt-10 border-t border-accent/25 pt-8">
          <BookingPills
            people={bookable}
            fallbackUrl={bookingUrl}
            label={t("pills.label")}
            fallbackLabel={t("cta")}
          />
        </div>
      </div>
    </section>
  );
}
