import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  DatabaseIcon,
  PipelineIcon,
  ChartIcon,
  CpuIcon,
  CompassIcon,
  RocketIcon,
  SnowflakeIcon,
  CheckIcon,
  MigrationIcon,
} from "./Icons";
import { RevealGroup } from "@/components/marketing/Motion";

type Service = { slug: string; title: string; summary: string };

// Icon per service slug (matches the services page), so each card's icon fits
// its service. AI Analytics & Agents gets the chip; falls back to the Snowflake mark.
const SERVICE_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "ai-data-strategy": CompassIcon,
  "data-visualisation": CpuIcon, // AI Analytics & Agents
  "cloud-architecture": DatabaseIcon,
  "data-modernization": MigrationIcon,
  "data-engineering": PipelineIcon,
  "embedded-analytics": ChartIcon,
  "capability-development": RocketIcon,
};
const iconFor = (slug: string) => SERVICE_ICONS[slug] ?? SnowflakeIcon;

// The home grid is composed explicitly: getServices() sorts by tier (which is
// alphabetical, so it can't drive home prominence). Preferred slugs lead (AI
// Analytics is the feature card); any others backfill. Capped at 6, so when all
// services are present, Capability Development is the one that drops off here.
const HOME_ORDER = [
  "data-visualisation", // AI Analytics & Agents (lead / feature card)
  "cloud-architecture",
  "data-modernization",
  "data-engineering",
  "embedded-analytics",
  "ai-data-strategy",
];

// Subtle, persuasive company facts for the no-card filler (left column, row 2).
const FILLER_POINTS = [
  "Snowflake Premier + CoCo Preferred Partner",
  "SnowPro-certified, end to end",
  "15+ years in data & enterprise AI",
  "Most platforms live in 8–16 weeks",
];

export function ServicesGrid({ services }: { services: Service[] }) {
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const ordered = [
    ...HOME_ORDER.map((slug) => bySlug.get(slug)).filter((s): s is Service => Boolean(s)),
    ...services.filter((s) => !HOME_ORDER.includes(s.slug)),
  ];
  const cards = ordered.slice(0, 6);
  const [lead, ...rest] = cards;
  if (!lead) return null;

  const LeadIcon = iconFor(lead.slug);

  const renderCard = (svc: Service) => {
    const Icon = iconFor(svc.slug);
    return (
      <Link key={svc.slug} href="/services" className="card card-hover group flex h-full flex-col">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primaryDeep">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-foreground">{svc.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{svc.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
          <span className="link-underline">Learn more</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </Link>
    );
  };

  return (
    <section className="section section-tint">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">What we offer</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            One accountable team, the whole data stack
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            From governed foundations and trusted pipelines to Cortex-powered
            analytics and AI agents: strategy through production, on Snowflake.
          </p>
        </div>

        {/* Folding "deck": cards stand up in a staggered 3D fold-in (degrades to
            a fade below lg / under reduced-motion via the primitive).
            DOM order is interleaved so the grid lands: row1 [lead | Data Eng],
            row2 [no-card facts | Analytics], row3 [the remaining three]. */}
        <RevealGroup variant="fold" className="mt-14 grid gap-5 lg:auto-rows-fr lg:grid-cols-3">
          {/* Lead / anchor tile: its own card */}
          <Link
            href="/services"
            className="card card-hover card-feature hover-sheen group flex h-full flex-col overflow-hidden lg:col-span-2"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_6px_16px_-8px_rgb(var(--color-accent)/0.7)]">
              <LeadIcon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">{lead.title}</h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">{lead.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep">
              <span className="link-underline">Learn more</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>

          {/* Top-right tile (Data Engineering) */}
          {rest[0] && renderCard(rest[0])}

          {/* No-card filler: subtle, persuasive company facts (left column, row 2) */}
          <div className="flex flex-col justify-center py-2 lg:col-span-2 lg:pr-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60">The short version</p>
            <h3 className="mt-3 max-w-xl text-balance font-display text-lg font-semibold leading-snug text-foreground/50 md:text-xl">
              A certified Snowflake team that takes you from strategy to production.
            </h3>
            <ul className="mt-5 grid max-w-xl gap-x-8 gap-y-3 sm:grid-cols-2">
              {FILLER_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-snug text-muted/70">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary/40" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/partnership"
              className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-muted/70 transition-colors hover:text-primaryDeep"
            >
              <span className="link-underline">What sets us apart</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Right tile (Analytics) + the remaining three tiles */}
          {rest.slice(1).map((svc) => renderCard(svc))}
        </RevealGroup>
      </div>
    </section>
  );
}
