import { Img as Image } from "@/components/marketing/Img";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Motion";
import { BookACall } from "@/components/marketing/BookACall";

export type CloseDestination = { label: string; href: string };
export type CloseService = { slug: string; title: string; current: boolean };

/**
 * The closing plate on a service detail page.
 *
 * Replaces four stacked sections that all competed for the same job: a proof
 * band, a "how this fits the wider practice" paragraph, an "other services"
 * chip row, and a booking card. Four eyebrows, four backgrounds, one actual
 * decision for the reader. This is one section with three zones and a single
 * heading:
 *
 *   proof (why believe it)  |  booking (what to do now)
 *   ------------------------------------------------
 *   wayfinding rail (where to go instead)
 *
 * Built on the site's existing immersive device (full-bleed photo under a navy
 * scrim, tinted with the per-service hue) because that beat already lived at
 * this point in the page. The booking pills are light cards, so on the scrim
 * they become the brightest thing in the section, which is correct: they are the
 * conversion.
 *
 * The services rail lists every service and marks the current one rather than
 * hiding it, so the row doubles as a position indicator ("this is one of six")
 * instead of being an undifferentiated pile of related links.
 */
export function ServiceClose({
  image,
  imageAlt,
  tintClass,
  eyebrow,
  title,
  body,
  cta,
  practiceLabel,
  practice,
  servicesLabel,
  services,
}: {
  image: string;
  imageAlt: string;
  /** Per-service accent glow, e.g. "bg-royal/15". */
  tintClass?: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: CloseDestination;
  practiceLabel: string;
  practice: CloseDestination[];
  servicesLabel: string;
  services: CloseService[];
}) {
  return (
    <section className="relative isolate w-full overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Directional scrim, darkest on the reading side, plus a flat veil over
          the whole width. Two layers rather than one because this plate carries
          text across its full width (proof left, booking right, rail beneath),
          so a purely directional gradient left the right-hand column and the
          wayfinding rail sitting on raw photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgb(var(--color-foreground) / 0.95) 0%, rgb(var(--color-foreground) / 0.88) 52%, rgb(var(--color-foreground) / 0.7) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "rgb(var(--color-foreground) / 0.25)" }}
      />
      {tintClass ? (
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full blur-3xl ${tintClass}`}
        />
      ) : null}

      <div className="container-page relative py-16 md:py-20">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Zone 1: the proof claim. The only heading in the section. */}
            <div>
              <p className="eyebrow eyebrow--invert">{eyebrow}</p>
              <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                {title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/75">{body}</p>
              <Link
                href={cta.href}
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <span className="link-underline">{cta.label}</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>

            {/* Zone 2: the action. Named humans, their calendars, on the
                brightest surface in the section. */}
            <div className="lg:border-l lg:border-white/15 lg:pl-12">
              <BookACall variant="inline" tone="dark" />
            </div>
          </div>
        </Reveal>

        {/* Zone 3: wayfinding. Two rows, one hairline, no headings: this is
            navigation, so it stays visually subordinate to the two zones above. */}
        <div className="mt-12 border-t border-white/15 pt-7">
          <Rail label={practiceLabel}>
            {practice.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {d.label}
                </Link>
              </li>
            ))}
          </Rail>

          <Rail label={servicesLabel} className="mt-5">
            {services.map((s) =>
              s.current ? (
                <li key={s.slug}>
                  {/* aria-current carries "current page" to assistive tech on
                      its own, so there is no sr-only duplicate here: both
                      together made screen readers announce it twice. */}
                  <span
                    aria-current="page"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                    {s.title}
                  </span>
                </li>
              ) : (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {s.title}
                  </Link>
                </li>
              ),
            )}
          </Rail>
        </div>
      </div>
    </section>
  );
}

/**
 * One labelled row of destinations.
 *
 * No separator between items on purpose. Border-left dividers stranded a stray
 * vertical rule at the start of every wrapped line, and punctuation separators
 * get announced by screen readers on each item. Spacing does the work instead.
 */
function Rail({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6 ${className}`}>
      <p className="shrink-0 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/50 sm:w-40">
        {label}
      </p>
      <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-2.5">{children}</ul>
    </div>
  );
}
