import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Three measured results, directly under the hero.
 *
 * The hero claims Viewnear puts AI on work done by hand; this is the evidence,
 * before the reader has to scroll for it. A data and AI company whose home page
 * shows no data argues against itself.
 *
 * Deliberately not cards: a hairline above, hairlines between, no background,
 * no radius, no shadow. Each figure is the first element in its column, so the
 * three of them sit on one line across the page.
 *
 * The figures are data, not copy: they live here and stay identical in both
 * locales, and each one matches the case study it links to.
 */

const RESULTS = [
  { value: "15 to 19 hrs", href: "/case-studies/magnolia-doors-installation-scheduling" },
  { value: "60 to 95%", href: "/case-studies/insurance-claims-cortex-ai" },
  { value: "7 weeks", href: "/case-studies/real-time-student-data-pipeline" },
] as const;

export async function ProofBand() {
  const t = await getTranslations("home.results");
  const items = t.raw("items") as { label: string; source: string }[];

  return (
    <section className="pt-12 pb-4 md:pt-16 md:pb-6">
      <div className="container-page">
        <div className="grid grid-cols-1 divide-y divide-border border-t border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {RESULTS.map((r, i) => (
            <Link
              key={r.href}
              href={r.href}
              className="group block py-7 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <p className="font-display text-4xl font-bold leading-none tracking-tight text-foreground md:text-5xl">
                {r.value}
              </p>
              <p className="mt-4 font-display text-lg font-bold leading-snug text-foreground">
                {items[i]?.label}
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
                {items[i]?.source}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
                <span className="link-underline">{t("cta")}</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
