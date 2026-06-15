"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { theme } from "@/config/theme";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/Logo";
import { getFlavor } from "@/components/marketing/industries/flavor";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

// Concise per-link descriptions for the mega-menu, keyed by href (≤6 words).
const NAV_DESCRIPTIONS: Record<string, string> = {
  "/about": "Who we are",
  "/partnership": "Premier & CoCo, and why partner",
  "/security": "Governance & compliance",
  "/life-at-viewnear": "Culture, roles & benefits",
  "/services": "THINK · BUILD · GROW",
  "/solutions": "Migrate, AI, governance, apps",
  "/approach": "Methodology & de-risking",
  "/pricing": "Engagement models & cost",
  "/industries/construction-real-estate": "Projects, property & assets",
  "/industries/education": "Schools, universities & training",
  "/industries/financial-services": "Banking, insurance, asset mgmt",
  "/industries/manufacturing": "Production, supply & OEE",
  "/industries/media-entertainment-advertising": "Audience, content & campaigns",
  "/industries/retail-cpg": "Retail, CPG & loyalty",
  "/industries/technology-telco": "Software, platforms & networks",
  "/resources": "Everything in one place",
  "/case-studies": "Proof & outcomes",
  "/blog": "Field notes",
  "/faq": "Common questions",
};

// Static featured tile per section (fallback when no live content applies).
type Featured = { eyebrow: string; title: string; pitch: string; href: string };
const NAV_FEATURED: Record<string, Featured> = {
  Company: {
    eyebrow: "Partnership",
    title: "Snowflake Premier Partner",
    pitch: "Premier & CoCo Preferred Partner: proven delivery at scale.",
    href: "/partnership",
  },
  Services: {
    eyebrow: "Platform",
    title: "Built on Snowflake",
    pitch: "See how we deliver on a single, governed Snowflake foundation.",
    href: "/platform",
  },
  Industries: {
    eyebrow: "Financial Services",
    title: "Data for regulated industries",
    pitch: "Banking, insurance & asset management outcomes.",
    href: "/industries/financial-services",
  },
  Resources: {
    eyebrow: "Case Studies",
    title: "How we deliver",
    pitch: "Engagements that show our approach and proven delivery.",
    href: "/case-studies",
  },
};

// One restrained accent per panel: a thin top rule, the featured eyebrow + CTA
// pill, and the card hover border/label. Opacities stay on 5-step multiples.
type Accent = { text: string; bar: string; soft: string; linkHover: string; hoverBorder: string };
const PANEL_ACCENT: Record<string, Accent> = {
  Company: { text: "text-royal", bar: "bg-royal", soft: "bg-royal/10", linkHover: "group-hover/card:text-royal", hoverBorder: "hover:border-royal/40" },
  Industries: { text: "text-primaryDeep", bar: "bg-primaryDeep", soft: "bg-primaryDeep/10", linkHover: "group-hover/card:text-primaryDeep", hoverBorder: "hover:border-primaryDeep/40" },
  Services: { text: "text-purple", bar: "bg-purple", soft: "bg-purple/10", linkHover: "group-hover/card:text-purple", hoverBorder: "hover:border-purple/40" },
  Resources: { text: "text-accent", bar: "bg-accent", soft: "bg-accent/10", linkHover: "group-hover/card:text-accent", hoverBorder: "hover:border-accent/40" },
};

const SNOWFLAKE_STACK = ["Cortex", "Horizon", "Openflow", "Snowpark", "Iceberg", "dbt"];

// Live content surfaced in the featured tiles, fetched server-side in the
// marketing layout and passed in. Optional so <Nav /> still renders (with the
// static fallback tiles) where no data is provided (e.g. not-found).
export type NavData = {
  latestPost?: { title: string; slug: string; date: string } | null;
  featuredCase?: { title: string; slug: string; sector: string } | null;
};

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-3.5 w-3.5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Industries link: the sector icon in that sector's own feature color
// (from the flavor system) + label + description.
function IndustryCard({
  href,
  label,
  onNav,
}: {
  href: string;
  label: string;
  onNav: () => void;
}) {
  const flavor = getFlavor(href.replace("/industries/", ""));
  const Icon = flavor.icon;
  return (
    <li>
      <Link
        href={href}
        onClick={onNav}
        className="group/card flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface2"
      >
        <span className={cn("mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg", flavor.tile)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-medium text-foreground">{label}</span>
          {NAV_DESCRIPTIONS[href] && (
            <span className="mt-0.5 block text-sm text-muted">{NAV_DESCRIPTIONS[href]}</span>
          )}
        </span>
      </Link>
    </li>
  );
}

// Company / Services / Resources link: a bordered card (no icon) that lifts and
// picks up the panel accent on hover.
function NavCard({
  href,
  label,
  accent,
  onNav,
}: {
  href: string;
  label: string;
  accent: Accent;
  onNav: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNav}
        className={cn(
          "group/card flex h-full flex-col rounded-xl border border-border bg-background p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft",
          accent.hoverBorder
        )}
      >
        <span className={cn("block text-base font-semibold text-foreground transition-colors", accent.linkHover)}>
          {label}
        </span>
        {NAV_DESCRIPTIONS[href] && (
          <span className="mt-1 block text-sm leading-relaxed text-muted">{NAV_DESCRIPTIONS[href]}</span>
        )}
      </Link>
    </li>
  );
}

// Per-section featured tile: a premium gradient card, content-aware where live
// data exists, otherwise the static NAV_FEATURED tile.
function MegaFeatured({
  label,
  navData,
  accent,
  onNav,
}: {
  label: string;
  navData?: NavData;
  accent: Accent;
  onNav: () => void;
}) {
  let href: string;
  let eyebrow: string;
  let title: string;
  let sub: string | null = null;
  let cta = "Learn more";
  let extra: React.ReactNode = null;

  if (label === "Industries" && navData?.featuredCase) {
    const c = navData.featuredCase;
    href = `/case-studies/${c.slug}`;
    eyebrow = c.sector;
    title = c.title;
    sub = "A recent outcome we delivered.";
    cta = "Read the case study";
  } else if (label === "Resources" && navData?.latestPost) {
    const p = navData.latestPost;
    href = `/blog/${p.slug}`;
    eyebrow = "Latest from the blog";
    title = p.title;
    sub = p.date || null;
    cta = "Read post";
  } else if (label === "Services") {
    href = "/platform";
    eyebrow = "Platform";
    title = "Built on the Snowflake-native stack";
    cta = "Explore the platform";
    extra = (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SNOWFLAKE_STACK.map((s) => (
          <span key={s} className="pill-chip">
            {s}
          </span>
        ))}
      </div>
    );
  } else {
    const f = NAV_FEATURED[label];
    if (!f) return null;
    href = f.href;
    eyebrow = f.eyebrow;
    title = f.title;
    sub = f.pitch;
  }

  return (
    <Link
      href={href}
      onClick={onNav}
      className="group/feat card-pop relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface2 to-surface p-5"
    >
      <div>
        <span className={cn("text-xs font-medium uppercase tracking-wide", accent.text)}>{eyebrow}</span>
        <span className="mt-2 block text-lg font-semibold leading-snug text-foreground">{title}</span>
        {sub && <span className="mt-1 block text-sm text-muted">{sub}</span>}
        {extra}
      </div>
      <span
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-sm font-semibold",
          accent.soft,
          accent.text
        )}
      >
        {cta}
        <span className="transition-transform duration-200 group-hover/feat:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}

export function Nav({ navData }: { navData?: NavData }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const items = theme.nav as unknown as NavItem[];
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close both menus whenever the route changes (client-side nav doesn't
  // otherwise clear hover/focus state, so the panel would stay open).
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Open immediately on hover/focus, but close on a short delay so moving the
  // cursor across the gap between the trigger and the full-width panel (which
  // anchors under the whole nav, not the small button) doesn't dismiss it.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMega = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
  };
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 font-display transition-all duration-300",
        scrolled || open
          ? "glass border-b border-border shadow-soft"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-page relative flex h-[4.8rem] items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={`${theme.brand.name} home`}>
          <Logo variant="dark" height={25} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            if (!item.children) {
              return (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href!}
                    className="rounded-lg px-3 py-2 text-base font-medium text-foreground/80 transition hover:bg-surface2 hover:text-primaryDeep"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const isOpen = openMenu === item.label;
            const isIndustries = item.label === "Industries";
            const accent = PANEL_ACCENT[item.label] ?? PANEL_ACCENT.Company;

            return (
              // `static` lets the absolute mega-panel anchor to the nav
              // container (position: relative) for a full-width panel. Open
              // state is controlled (not CSS :hover) so it closes on navigation.
              <li
                key={item.label}
                className="static"
                onMouseEnter={() => openMega(item.label)}
                onMouseLeave={scheduleClose}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={`mega-${item.label}`}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  onFocus={() => openMega(item.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-base font-medium transition",
                    isOpen
                      ? "bg-surface2 text-primaryDeep"
                      : "text-foreground/80 hover:bg-surface2 hover:text-primaryDeep"
                  )}
                >
                  {item.label}
                  <Chevron className={cn("transition-transform", isOpen && "rotate-180")} />
                </button>

                <div
                  id={`mega-${item.label}`}
                  className={cn(
                    "absolute left-0 right-0 top-full z-50 px-0 pt-3 transition-all duration-300 ease-out",
                    isOpen
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible translate-y-2 opacity-0"
                  )}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/95 p-4 shadow-soft-lg backdrop-blur">
                    <span
                      className={cn("pointer-events-none absolute inset-x-0 top-0 h-0.5", accent.bar)}
                      aria-hidden="true"
                    />
                    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
                      <ul
                        className={cn(
                          "grid sm:grid-cols-2",
                          isIndustries
                            ? "gap-1 lg:grid-cols-3"
                            : "gap-2 md:auto-rows-fr lg:grid-cols-2"
                        )}
                      >
                        {item.children.map((c) =>
                          isIndustries ? (
                            <IndustryCard
                              key={c.href}
                              href={c.href}
                              label={c.label}
                              onNav={() => setOpenMenu(null)}
                            />
                          ) : (
                            <NavCard
                              key={c.href}
                              href={c.href}
                              label={c.label}
                              accent={accent}
                              onNav={() => setOpenMenu(null)}
                            />
                          )
                        )}
                      </ul>

                      <MegaFeatured
                        label={item.label}
                        navData={navData}
                        accent={accent}
                        onNav={() => setOpenMenu(null)}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="btn-primary group">
            Contact
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded-lg border border-border p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-surface lg:hidden">
          <div className="container-page space-y-1 py-4">
            {items.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-lg font-medium text-foreground">
                      {item.label}
                      <Chevron className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pl-4">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-base text-muted hover:text-primaryDeep"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-lg text-foreground hover:text-primaryDeep"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-3 border-t border-border pt-3">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={cn("btn-primary", "w-full")}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
