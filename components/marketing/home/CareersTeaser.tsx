import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getJobOpenings } from "@/lib/queries";
import { Reveal } from "@/components/marketing/Motion";
import { BookACall } from "@/components/marketing/BookACall";
import type { Locale } from "@/lib/i18n-content";

/**
 * The page's close, as two independent asks side by side rather than one
 * stacked under the other: hiring on the left, talking to the team on the
 * right. A label ("Talk to the team") on the second block still read as a
 * footnote to the first; two columns, each with its own heading, reads as
 * two options instead of one ask and an addendum to it.
 *
 * Left: up to three open roles, or a quiet invitation to apply anyway when
 * the board is empty, which happens: certified people don't rotate through
 * a big pipeline. The layout scales to the count rather than always
 * assuming three: one opening gets a featured card with the full
 * description and a real button; two or more become a compact stacked
 * list, which reads correctly whether there are two roles or a dozen.
 *
 * Right: BookACall ("inline"), the same composition ServiceClose already
 * uses on service pages, with its own heading built in.
 */
export async function CareersTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.careers");
  const openings = await getJobOpenings(locale);
  const roles = openings.slice(0, 3);

  return (
    <section className="section section-warm">
      <div className="container-page">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16">
            {/* Left: the roles. */}
            <div>
              <p className="eyebrow mb-3">{t("eyebrow")}</p>
              <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {t("title")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{t("body")}</p>

              {roles.length === 0 ? (
                <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-border bg-background p-6">
                  <p className="leading-relaxed text-muted">{t("empty")}</p>
                  <Link href="/careers" className="btn-ghost shrink-0">
                    {t("emptyCta")}
                  </Link>
                </div>
              ) : roles.length === 1 ? (
                // One opening: a featured card with the full description and
                // a real button, rather than one tile adrift in a grid.
                <div className="mt-8 rounded-2xl border border-border bg-background p-6">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {roles[0]!.employment}
                    {roles[0]!.location ? ` · ${roles[0]!.location}` : ""}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-foreground">
                    {roles[0]!.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{roles[0]!.description}</p>
                  <Link href={`/careers/${roles[0]!.slug}`} className="btn-primary group mt-5 inline-flex">
                    {t("viewRole")}
                    <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </Link>
                </div>
              ) : (
                // Two or more: a compact stacked list rather than a grid, so
                // it reads the same whether there are two roles or several,
                // with no per-count column math to keep matching the count.
                <div className="mt-8 space-y-3">
                  {roles.map((job) => (
                    <Link
                      key={job.slug}
                      href={`/careers/${job.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/50"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-xs uppercase tracking-[0.14em] text-muted">
                          {job.employment}
                          {job.location ? ` · ${job.location}` : ""}
                        </span>
                        <span className="mt-1 block font-display text-base font-bold leading-snug text-foreground">
                          {job.title}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primaryDeep">
                        <span className="link-underline">{t("viewRole")}</span>
                        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {roles.length > 0 && (
                <Link
                  href="/careers#open-roles"
                  className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                >
                  <span className="link-underline">{t("viewAll")}</span>
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
              )}
            </div>

            {/* Right: talk to the team, own heading built into BookACall. */}
            <div className="border-t border-border pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
              <BookACall variant="inline" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
