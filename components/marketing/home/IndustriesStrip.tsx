import Link from "next/link";
import { RevealGroup } from "@/components/marketing/Motion";
import { getFlavor } from "@/components/marketing/industries/flavor";
import { cn } from "@/lib/utils";

/**
 * Compact breadth strip: the seven industries Viewnear serves, each tile reusing
 * the per-sector icon + accent tint from `industries/flavor.tsx` (so the row is
 * naturally multi-hue, not all-blue) and linking to its detail page. Enterprise
 * signal: shows relevant sector depth, not just generic services.
 */
export const INDUSTRIES: { slug: string; name: string }[] = [
  { slug: "financial-services", name: "Financial Services" },
  { slug: "technology-telco", name: "Technology & Telco" },
  { slug: "manufacturing", name: "Manufacturing" },
  { slug: "retail-cpg", name: "Retail & CPG" },
  { slug: "media-entertainment-advertising", name: "Media & Entertainment" },
  { slug: "construction-real-estate", name: "Construction & Real Estate" },
  { slug: "education", name: "Education" },
];

/**
 * The multi-hue industry tiles (icon + per-sector accent), shared by the home
 * IndustriesStrip and the Solutions "Tuned to your industry" section so both
 * read the same.
 */
export function IndustryTiles({ className }: { className?: string }) {
  return (
    <RevealGroup className={cn("flex flex-wrap justify-center gap-4", className)} variant="fade-up">
      {INDUSTRIES.map(({ slug, name }) => {
        const f = getFlavor(slug);
        const Icon = f.icon;
        return (
          <Link
            key={slug}
            href={`/industries/${slug}`}
            className="card card-hover group flex w-[calc((100%_-_1rem)/2)] items-center gap-3 p-4 sm:w-[calc((100%_-_2rem)/3)] lg:w-[calc((100%_-_3rem)/4)]"
          >
            {/* Tint via the sector's accent var (inline so it never depends on a
                non-standard Tailwind opacity step); f.text gives the icon color. */}
            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.text}`}
              style={{ backgroundColor: `rgb(var(${f.accentVar}) / 0.22)` }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-bold leading-tight text-foreground">{name}</span>
            <span className="ml-auto text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
          </Link>
        );
      })}
    </RevealGroup>
  );
}

export function IndustriesStrip() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Industries</p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.1]">
              Depth in the sectors you operate in
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              Sector-specific data models, governance, and compliance, built in
              from day one across seven industries.
            </p>
          </div>
          <Link
            href="/industries"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
          >
            <span className="link-underline">All industries</span>
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
          </Link>
        </div>
        <IndustryTiles className="mt-10" />
      </div>
    </section>
  );
}
