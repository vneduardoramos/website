import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getJobOpenings } from "@/lib/queries";
import { Reveal } from "@/components/marketing/Motion";
import type { Locale } from "@/lib/i18n-content";

/**
 * "Join the team": the home page's one nod at hiring, closer to the ask than
 * a footer link deserves but well short of the full /careers hub. Up to three
 * open roles as plain tiles, or a quiet invitation to apply anyway when the
 * board is empty, which happens: certified people don't rotate through a big
 * pipeline.
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

          {roles.length > 0 ? (
            <div className="mt-12 grid gap-5 md:auto-rows-fr md:grid-cols-3">
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
          ) : (
            <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-border bg-background p-8 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl leading-relaxed text-muted">{t("empty")}</p>
              <Link href="/careers" className="btn-ghost shrink-0">
                {t("emptyCta")}
              </Link>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
