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
 * Left: the open roles as one ruled ledger. Three layouts used to switch on
 * the count, a featured card for one opening, a stacked list for two or more,
 * a bordered box for none, so the same board looked like three different
 * sections depending on what was published. One list of hairline rows reads
 * the same at 0, 1 or 3, and stops framing a single entry of a list as a
 * featured object.
 *
 * Right: BookACall ("inline"), the same composition ServiceClose already
 * uses on service pages, with its own heading built in.
 *
 * Both columns sit on four shared rows (eyebrow, heading, body, list) via
 * subgrid, so the two headings, the two bodies and the two lists each start
 * on one y across the vertical rule, in either locale and at any heading
 * wrap.
 */
export async function CareersTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.careers");
  const openings = await getJobOpenings(locale);
  const roles = openings.slice(0, 3);

  return (
    <section className="section section-warm">
      <div className="container-page">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-16 lg:gap-y-0">
            {/* Left: the roles. Four subgrid rows: eyebrow, h2, body, ledger. */}
            <div className="lg:row-span-4 lg:grid lg:grid-rows-subgrid">
              <p className="eyebrow mb-3 lg:justify-self-start">{t("eyebrow")}</p>
              <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
                {t("title")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{t("body")}</p>

              {/* mt-14 (56px) lands the ledger's top rule on the same y as the
                  booking list on the right: mt-6 (24) + label (16) + mt-4 (16). */}
              <div className="mt-14">
                <ul className="border-t border-border">
                  {roles.length === 0 ? (
                    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-border py-5 max-sm:grid-cols-1 max-sm:gap-y-2">
                      <p className="leading-relaxed text-muted">{t("empty")}</p>
                      <Link
                        href="/careers"
                        className="group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                      >
                        <span className="link-underline">{t("emptyCta")}</span>
                        <span
                          className="transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ) : (
                    roles.map((job) => (
                      <li
                        key={job.slug}
                        className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-border py-5 max-sm:grid-cols-1 max-sm:gap-y-2"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                            {job.employment}
                            {job.location ? ` · ${job.location}` : ""}
                          </p>
                          <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-foreground">
                            <Link
                              href={`/careers/${job.slug}`}
                              className="after:absolute after:inset-0 after:content-['']"
                            >
                              {job.title}
                            </Link>
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                            {job.description}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                        >
                          <span className="link-underline">{t("viewRole")}</span>
                          <span className="transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </li>
                    ))
                  )}
                </ul>

                {roles.length > 0 && (
                  <Link
                    href="/careers#open-roles"
                    className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                  >
                    <span className="link-underline">{t("viewAll")}</span>
                    <span
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right: talk to the team, own heading built into BookACall. The
                aria-hidden span fills row 1 (the eyebrow row) so the h2s pair;
                lg:contents lets BookACall's h2, body and pills become rows 2-4. */}
            <div className="border-t border-border pt-10 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
              <span aria-hidden="true" className="hidden lg:block" />
              <BookACall variant="inline" className="lg:contents" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
