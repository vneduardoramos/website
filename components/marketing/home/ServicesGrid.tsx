import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  CheckIcon,
  ChartIcon,
  CompassIcon,
  CpuIcon,
  DataStackIcon,
  PipelineIcon,
  RocketIcon,
  type IconProps,
} from "./Icons";
import { RevealGroup } from "@/components/marketing/Motion";

type Service = { slug: string; title: string; summary: string };

/**
 * The offer, as a list a reader can scan.
 *
 * It used to interleave a double-width lead tile, a no-card facts block and
 * four smaller tiles in one grid, which read as a mixed content section rather
 * than a menu. Six equal cards in a regular grid say "these are the services"
 * without a word, and the engagement models move below the grid where they
 * stop interrupting the scan.
 *
 * Each card carries the service's own mark, inline and untinted, over a
 * hairline: enough to tell the six apart at a glance, no icon tiles.
 */

const MARKS: Record<string, (p: IconProps) => JSX.Element> = {
  "ai-data-strategy": CompassIcon,
  "cloud-architecture": DataStackIcon,
  "data-engineering": PipelineIcon,
  "data-visualisation": CpuIcon,
  "embedded-analytics": ChartIcon,
  "capability-development": RocketIcon,
};

export async function ServicesGrid({ services }: { services: Service[] }) {
  const t = await getTranslations("homeServer");
  const engagePoints = t.raw("servicesGrid.engagePoints") as string[];
  // The grid holds six; the heading no longer counts them, so adding a
  // seventh service is a change here alone.
  const cards = services.slice(0, 6);
  if (cards.length === 0) return null;

  return (
    <section className="section section-warm">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">{t("servicesGrid.chip")}</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("servicesGrid.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {t.rich("servicesGrid.body", {
              migrations: (c) => (
                <Link href="/migrations" className="link-underline font-medium text-primaryDeep">
                  {c}
                </Link>
              ),
            })}
          </p>
        </div>

        <RevealGroup
          variant="fold"
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3"
        >
          {cards.map((svc, i) => {
            const Mark = MARKS[svc.slug];
            return (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group flex h-full flex-col rounded-[10px] border border-border bg-background px-5 pb-5 pt-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between border-b border-dotted border-primary/40 pb-3 text-primaryDeep">
                  {Mark ? <Mark className="h-6 w-6" /> : <span className="h-6 w-6" />}
                  <span className="font-mono text-xs tracking-wider text-muted">
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
                  {svc.title}
                </h3>
                {/* Four lines, not three: at lg the cards are a third of the
                    container and every summary needs a fourth. The cards are
                    equal-height anyway, so the extra line costs no layout. */}
                <p className="mt-2.5 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
                  {svc.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
                  <span className="link-underline">{t("servicesGrid.learnMore")}</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            );
          })}
        </RevealGroup>

        {/* The engagement models: the one commercial fact the home page does not
            state anywhere else. Below the grid, so the six cards read as one set. */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="lg:max-w-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {t("servicesGrid.engageEyebrow")}
              </p>
              <h3 className="mt-3 text-balance font-display text-lg font-semibold leading-snug text-foreground md:text-xl">
                {t("servicesGrid.engageTitle")}
              </h3>
              <Link
                href="/pricing"
                className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-primaryDeep"
              >
                <span className="link-underline">{t("servicesGrid.pricingLink")}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
            <ul className="grid flex-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              {engagePoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-snug text-muted">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary/40" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
