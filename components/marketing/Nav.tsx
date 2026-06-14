"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { theme } from "@/config/theme";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/Logo";

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

// Optional featured tile per top-level section, keyed by section label.
type Featured = { eyebrow: string; title: string; pitch: string; href: string };
const NAV_FEATURED: Record<string, Featured> = {
  Company: {
    eyebrow: "Partnership",
    title: "Snowflake Premier Partner",
    pitch: "Premier & CoCo Catalyst: proven delivery at scale.",
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

export function Nav() {
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

            const featured = NAV_FEATURED[item.label];
            const isOpen = openMenu === item.label;

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
                    "absolute left-0 right-0 top-full z-50 px-0 pt-3 transition-all duration-200",
                    isOpen
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible translate-y-1 opacity-0"
                  )}
                >
                  <div className="rounded-2xl border border-border bg-surface/95 p-4 shadow-soft-lg backdrop-blur">
                    <div className={cn("grid gap-6", featured ? "lg:grid-cols-[1fr_18rem]" : "lg:grid-cols-1")}>
                      <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setOpenMenu(null)}
                              className="group/card block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface2"
                            >
                              <span className="block text-base font-medium text-foreground transition-colors group-hover/card:text-primaryDeep">
                                {c.label}
                              </span>
                              {NAV_DESCRIPTIONS[c.href] && (
                                <span className="mt-0.5 block text-sm text-muted">
                                  {NAV_DESCRIPTIONS[c.href]}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {featured && (
                        <Link
                          href={featured.href}
                          onClick={() => setOpenMenu(null)}
                          className="group/feat flex flex-col justify-between rounded-xl border border-border bg-surface2 p-5 transition-colors hover:bg-primary/15"
                        >
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-primaryDeep">
                              {featured.eyebrow}
                            </span>
                            <span className="mt-2 block text-lg font-semibold text-foreground">
                              {featured.title}
                            </span>
                            <span className="mt-1 block text-sm text-muted">
                              {featured.pitch}
                            </span>
                          </div>
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primaryDeep">
                            Learn more
                            <span className="transition-transform duration-200 group-hover/feat:translate-x-0.5">
                              →
                            </span>
                          </span>
                        </Link>
                      )}
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
