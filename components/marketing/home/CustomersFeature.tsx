import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/marketing/Motion";
import { LogoRow } from "@/components/marketing/home/ClientLogos";
import type { BandLogo } from "@/lib/client-bands";

/**
 * "Customers" feature: a featured case-study card.
 *
 * NOTE: real, permissioned client logos now ship in <ClientLogos /> (a trust
 * strip under the hero), backed by files in /public/assets/images/clients/.
 * Case-study CLIENTS, however, remain anonymized by agreement, so this featured
 * card and the case-study grid name the sector and region, not the company.
 */

// Featured case study: insurance claims processing, financial services.
// Exported so the case-studies grid can exclude it (no duplicate).
export const FEATURED_CASE_SLUG = "insurance-claims-cortex-ai";
const FEATURED = {
  client: "A claims processing company",
  sector: "Insurance",
  region: "Americas",
  slug: FEATURED_CASE_SLUG,
  title: "Automating claims classification with Snowflake Cortex AI",
  summary:
    "Sorting documents from many insurance providers by hand caused delays, errors, and lost files. Using Snowflake Cortex AI functions like AI_EXTRACT, Viewnear automated classification and extraction, lifting accuracy from 60% to 95% and cutting per-document handling to four seconds.",
  metrics: [
    { value: "60→95%", label: "Classification accuracy" },
    { value: "4 sec", label: "Per-document classification" },
  ],
  image: "/assets/images/industries/financial-services.jpg",
};

/** Bold cyan brand swoosh that cuts into the featured photo from the left. */
function BrandSwoosh({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      <path d="M16 12 L74 60 L16 108 L48 108 L106 60 L48 12 Z" fill="rgb(var(--color-secondary))" />
    </svg>
  );
}

export function CustomersFeature({ bottomLogos }: { bottomLogos: BandLogo[] }) {
  return (
    <section className="section section-tint relative overflow-hidden">
      <div className="container-page">
        {/* heading row */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3">Customers</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.9rem] md:leading-[1.04]">
              Leading teams
              <br />
              <span className="text-gradient">build on governed, AI-ready data</span>
            </h2>
          </div>
          <Link href="/case-studies" className="btn-ghost group">
            View case studies
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* featured case-study card */}
        <Reveal className="mt-10">
          <article className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-soft-lg">
            <div className="grid items-stretch lg:grid-cols-[1.08fr_0.92fr]">
              {/* text */}
              <div className="p-8 md:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-xl font-bold text-foreground">{FEATURED.client}</span>
                  <span className="rounded-full bg-surface2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted">
                    Snowflake Cortex AI
                  </span>
                </div>
                <p className="mt-5 font-mono text-xs uppercase tracking-wider text-primaryDeep">
                  {FEATURED.sector} · {FEATURED.region}
                </p>
                <h3 className="mt-2 text-balance font-display text-2xl font-bold leading-tight text-foreground md:text-[1.8rem]">
                  {FEATURED.title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">{FEATURED.summary}</p>
                <Link
                  href={`/case-studies/${FEATURED.slug}`}
                  className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
                >
                  <span className="link-underline">Read the case study</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
                  {FEATURED.metrics.map((m) => (
                    <div key={m.label} className="border-l-2 border-secondary pl-4">
                      <div className="text-gradient-bold font-display text-3xl font-bold md:text-4xl">{m.value}</div>
                      <div className="mt-1 text-xs leading-snug text-muted">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* image + brand swoosh */}
              <div className="relative min-h-[260px] lg:min-h-full">
                <BrandSwoosh className="pointer-events-none absolute -left-7 top-10 z-10 hidden h-28 w-28 lg:block" />
                <Image
                  src={FEATURED.image}
                  alt={`${FEATURED.sector}: ${FEATURED.title}`}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </article>
        </Reveal>

        {/* Bottom frame: client logos below the featured card (admin-configurable) */}
        <LogoRow logos={bottomLogos} className="mt-12 md:mt-14" />
      </div>
    </section>
  );
}
