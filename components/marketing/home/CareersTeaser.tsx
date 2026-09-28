import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getJobOpenings } from "@/lib/queries";
import { Reveal } from "@/components/marketing/Motion";
import { BookACall } from "@/components/marketing/BookACall";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n-content";

/**
 * "Join the team": the home page's one nod at hiring, closer to the ask than
 * a footer link deserves but well short of the full /careers hub. Up to three
 * open roles, or a quiet invitation to apply anyway when the board is empty,
 * which happens: certified people don't rotate through a big pipeline.
 *
 * The layout scales to the count rather than always assuming three: a single
 * opening in a 3-column grid left two empty slots and read like a mistake,
 * not a real listing, so one role gets a single wide featured card and two
 * get a 2-column grid; only three fills the original 3-up grid.
 *
 * Closes the page: a visitor not hiring and not ready to talk gets nothing
 * further to do, so the booking card (BookACall, "inline") lives in this same
 * section rather than a separate one after it. Two asks, one background, one
 * scroll stop, the way ServiceClose composes the same block on service pages.
 */
export async function CareersTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.careers");
  const openings = await getJobOpenings(locale);
  const roles = openings.slice(0, 3);

  return (
    <section className="section section-warm">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">{t("eyebrow")}</p>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("title")}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{t("body")}</p>
            </div>
            {roles.length > 0 && (
              <Link
                href="/careers#open-roles"
                className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep"
              >
                <span className="link-underline">{t("viewAll")}</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          {roles.length === 0 ? (
            <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-border bg-background p-8 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl leading-relaxed text-muted">{t("empty")}</p>
              <Link href="/careers" className="btn-ghost shrink-0">
                {t("emptyCta")}
              </Link>
            </div>
          ) : roles.length === 1 ? (
            // One opening: a wide featured card rather than one tile adrift
            // in a grid built for three, with room for the full description
            // and a real button in place of the text link the grid uses.
            <div className="mt-12 flex flex-col gap-6 rounded-2xl border border-border bg-background p-8 md:flex-row md:items-center md:justify-between md:gap-10">
              <div className="min-w-0">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {roles[0]!.employment}
                  {roles[0]!.location ? ` · ${roles[0]!.location}` : ""}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
                  {roles[0]!.title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">{roles[0]!.description}</p>
              </div>
              <Link href={`/careers/${roles[0]!.slug}`} className="btn-primary group shrink-0">
                {t("viewRole")}
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <div className={cn("mt-12 grid gap-5 md:auto-rows-fr", roles.length === 2 ? "sm:grid-cols-2" : "md:grid-cols-3")}>
              {roles.map((job) => (
                <Link
                  key={job.slug}
                  href={`/careers/${job.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary/50"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {job.employment}
                    {job.location ? ` · ${job.location}` : ""}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-foreground">{job.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{job.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
                    <span className="link-underline">{t("viewRole")}</span>
                    <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Reveal>

        <div className="mt-14 border-t border-border pt-10 md:mt-16 md:pt-12">
          <BookACall variant="inline" />
        </div>
      </div>
    </section>
  );
}
