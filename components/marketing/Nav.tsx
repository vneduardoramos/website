"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { theme } from "@/config/theme";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/Logo";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { getFlavor } from "@/components/marketing/industries/flavor";
import { getServiceFlavor } from "@/components/marketing/service/flavor";
import { MODEL_PROVIDERS } from "@/lib/model-providers";
import { BookingModal } from "@/components/marketing/BookingModal";
import type { BookablePerson } from "@/components/marketing/BookingPills";

type NavChild = { key: string; label: string; href: string; group?: string };
type NavItem = {
  key: string;
  label: string;
  href?: string;
  children?: NavChild[];
};

// The featured tile href per section (fallback when no live content applies).
// Copy for these tiles lives in the `nav.featured.*` message namespace; only the
// structural href→section association stays in code.
const NAV_FEATURED_HREF: Record<string, string> = {
  Company: "/partnership",
  Services: "/data-ai",
  Industries: "/industries/financial-services",
  Resources: "/case-studies",
};

// One restrained accent per panel: a thin top rule, the featured eyebrow + CTA
// pill, and the card hover border/label. Opacities stay on 5-step multiples.
// `eb` is the raw color CSS variable used to drive --eyebrow-accent on the
// featured card (its cut-corner hairline, eyebrow tag, and accent wash all tint
// from it). The Tailwind class fields stay for the link/CTA accents.
type Accent = { text: string; bar: string; soft: string; linkHover: string; hoverBorder: string; eb: string };
const PANEL_ACCENT: Record<string, Accent> = {
  Company: { text: "text-royal", bar: "bg-royal", soft: "bg-royal/10", linkHover: "group-hover/card:text-royal", hoverBorder: "hover:border-royal/40", eb: "var(--color-royal)" },
  Industries: { text: "text-primaryDeep", bar: "bg-primaryDeep", soft: "bg-primaryDeep/10", linkHover: "group-hover/card:text-primaryDeep", hoverBorder: "hover:border-primaryDeep/40", eb: "var(--color-primary-deep)" },
  Services: { text: "text-royal", bar: "bg-royal", soft: "bg-royal/10", linkHover: "group-hover/card:text-royal", hoverBorder: "hover:border-royal/40", eb: "var(--color-royal)" },
  Resources: { text: "text-accent", bar: "bg-accent", soft: "bg-accent/10", linkHover: "group-hover/card:text-accent", hoverBorder: "hover:border-accent/40", eb: "var(--color-accent)" },
};

// ─── Mega-menu link icons ───────────────────────────────────────────────────
// One representative line icon per Services / Company / Resources link, drawn in
// the same 24×24 / 1.8-stroke style as the industry flavor icons so every panel
// reads as one icon family. Keyed by href; tinted with the panel accent.
const ic = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Services
function LayersIcon(p: SVGProps<SVGSVGElement>) {
  // stacked tiers → THINK · BUILD · GROW
  return (
    <svg {...ic} {...p}>
      <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </svg>
  );
}
function MigrateIcon(p: SVGProps<SVGSVGElement>) {
  // arrow crossing between two stores → migration to Snowflake
  return (
    <svg {...ic} {...p}>
      <path d="M4 7h7M8 4 11 7l-3 3" />
      <path d="M20 17h-7m3-3-3 3 3 3" />
    </svg>
  );
}
function DatabaseIcon(p: SVGProps<SVGSVGElement>) {
  // stacked data cylinders → the Snowflake-native platform stack
  return (
    <svg {...ic} {...p}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}
function SparkIcon(p: SVGProps<SVGSVGElement>) {
  // four-point AI spark → Data + AI / model choice
  return (
    <svg {...ic} {...p}>
      <path d="M12 3c.6 3.6 1.8 4.8 5.4 5.4-3.6.6-4.8 1.8-5.4 5.4-.6-3.6-1.8-4.8-5.4-5.4 3.6-.6 4.8-1.8 5.4-5.4z" />
      <path d="M18.5 14.5c.3 1.6.8 2.1 2.4 2.4-1.6.3-2.1.8-2.4 2.4-.3-1.6-.8-2.1-2.4-2.4 1.6-.3 2.1-.8 2.4-2.4z" />
    </svg>
  );
}
function CompassIcon(p: SVGProps<SVGSVGElement>) {
  // compass → methodology / direction
  return (
    <svg {...ic} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8L8.5 15.5l2.2-4.8z" />
    </svg>
  );
}
function TagIcon(p: SVGProps<SVGSVGElement>) {
  // price tag → engagement models & cost
  return (
    <svg {...ic} {...p}>
      <path d="M4 13 11 6a2 2 0 0 1 1.4-.6l4.6.1a2 2 0 0 1 2 2l.1 4.6a2 2 0 0 1-.6 1.4l-7 7a2 2 0 0 1-2.8 0L4 15.8a2 2 0 0 1 0-2.8z" />
      <circle cx="15" cy="9" r="1.3" />
    </svg>
  );
}

// Company
function UsersIcon(p: SVGProps<SVGSVGElement>) {
  // two people → who we are
  return (
    <svg {...ic} {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4" />
      <path d="M17.2 14.4A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  );
}
function LinkRingsIcon(p: SVGProps<SVGSVGElement>) {
  // interlocking rings → partnership / alliance
  return (
    <svg {...ic} {...p}>
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  );
}
function MapPinIcon(p: SVGProps<SVGSVGElement>) {
  // location pin → nearshore delivery from Monterrey
  return (
    <svg {...ic} {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function SunIcon(p: SVGProps<SVGSVGElement>) {
  // sun → culture & energy of life at Viewnear
  return (
    <svg {...ic} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
  );
}
function ShieldCheckIcon(p: SVGProps<SVGSVGElement>) {
  // shield + check → security, governance & compliance
  return (
    <svg {...ic} {...p}>
      <path d="M12 3 5 6v5.5c0 4.3 3 7.4 7 8.9 4-1.5 7-4.6 7-8.9V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// Resources
function GridIcon(p: SVGProps<SVGSVGElement>) {
  // 2×2 grid → everything in one place
  return (
    <svg {...ic} {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function TrendIcon(p: SVGProps<SVGSVGElement>) {
  // upward trend chart → proof & outcomes
  return (
    <svg {...ic} {...p}>
      <path d="M4 4v16h16" />
      <path d="m7.5 14 3.2-3.6 3 2.4L20 7" />
      <path d="M16.5 7H20v3.5" />
    </svg>
  );
}
function PenIcon(p: SVGProps<SVGSVGElement>) {
  // pen → blog field notes
  return (
    <svg {...ic} {...p}>
      <path d="M16.5 4.5 19.5 7.5 9 18l-4 1 1-4 10.5-10.5z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}
function ChatQuestionIcon(p: SVGProps<SVGSVGElement>) {
  // speech bubble + ? → common questions
  return (
    <svg {...ic} {...p}>
      <path d="M5 4h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 4v-4H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M9.6 8.2a2.3 2.3 0 0 1 4.3 1c0 1.5-1.9 1.7-1.9 3.1" />
      <path d="M12 14.6h.01" />
    </svg>
  );
}

const NAV_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "/services": LayersIcon,
  "/snowflake-consulting-services": CompassIcon,
  "/migrations": MigrateIcon,
  "/data-ai": SparkIcon,
  "/platform": DatabaseIcon,
  "/approach": CompassIcon,
  "/pricing": TagIcon,
  "/about": UsersIcon,
  "/partnership": LinkRingsIcon,
  "/nearshore": MapPinIcon,
  "/life-at-viewnear": SunIcon,
  "/careers": UsersIcon,
  "/security": ShieldCheckIcon,
  "/resources": GridIcon,
  "/case-studies": TrendIcon,
  "/blog": PenIcon,
  "/faq": ChatQuestionIcon,
};

// Per-service icons come from the shared service-flavor module (getServiceFlavor),
// so the mega-menu icon and the service page's hero icon always match.

// Per-tier accent for the Services mega-menu columns (THINK/BUILD/GROW). Colors
// stay on the legible-on-white end of the palette; opacities on 5-step steps.
const TIER_ORDER = ["THINK", "BUILD", "GROW"] as const;
// `wash` is a faint tier-tinted panel fill that delimits the three phase columns
// (kept on a 5-step opacity; the panel border stays a neutral hairline).
const TIER_META: Record<string, { tile: string; text: string; dot: string; wash: string }> = {
  THINK: { tile: "bg-primaryDeep/10 text-primaryDeep", text: "text-primaryDeep", dot: "bg-primaryDeep", wash: "bg-primaryDeep/5" },
  BUILD: { tile: "bg-royal/10 text-royal", text: "text-royal", dot: "bg-royal", wash: "bg-royal/5" },
  GROW: { tile: "bg-accent/10 text-accentDeep", text: "text-accentDeep", dot: "bg-accent", wash: "bg-accent/5" },
};

// Live content surfaced in the featured tiles, fetched server-side in the
// marketing layout and passed in. Optional so <Nav /> still renders (with the
// static fallback tiles) where no data is provided (e.g. not-found).
export type NavData = {
  latestPost?: { title: string; slug: string; date: string } | null;
  featuredCase?: { title: string; slug: string; sector: string } | null;
  /** The published services, for the tier-organized Services mega-menu. */
  services?: { slug: string; title: string; tier: string }[];
  /**
   * The booking modal every "Let's talk" button opens, pre-resolved
   * server-side (roster, fallback URL, already-localized copy) so the
   * client component only ever renders it. Optional because `<Nav />` also
   * renders with no navData at all on the 404 page; without it, "Let's
   * talk" falls back to its plain /contact link.
   */
  booking?: {
    people: BookablePerson[];
    fallbackUrl: string;
    title: string;
    body: string;
    pillsLabel: string;
    fallbackCta: string;
    closeLabel: string;
  };
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

// Every mega-menu link reads the same: a representative line icon in an
// accent-tinted tile + label + description. Industries pass the sector's own
// flavor icon/tile; Services/Company/Resources pass a NAV_ICONS icon tinted with
// the panel accent (`tile` = e.g. "bg-royal/10 text-royal").
function MenuLink({
  href,
  label,
  description,
  Icon,
  tile,
  onNav,
  active,
}: {
  href: string;
  label: string;
  description?: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  tile?: string;
  onNav: () => void;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNav}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group/card flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface2",
          active && "bg-surface2"
        )}
      >
        {Icon && (
          <span className={cn("mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg", tile)}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0">
          <span className={cn("block text-base font-medium text-foreground", active && "font-semibold text-primaryDeep")}>{label}</span>
          {description && (
            <span className="mt-0.5 block text-sm text-muted">{description}</span>
          )}
        </span>
      </Link>
    </li>
  );
}

// Per-section featured tile: a premium gradient card, content-aware where live
// data exists, otherwise the static `nav.featured.*` copy for the section.
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
  const t = useTranslations("nav");
  let href: string;
  let eyebrow: string;
  let title: string;
  let sub: string | null = null;
  let cta = t("featured.learnMore");
  let extra: React.ReactNode = null;

  if (label === "Industries" && navData?.featuredCase) {
    const c = navData.featuredCase;
    href = `/case-studies/${c.slug}`;
    eyebrow = c.sector;
    title = c.title;
    sub = t("featured.caseSub");
    cta = t("featured.caseCta");
  } else if (label === "Resources" && navData?.latestPost) {
    const p = navData.latestPost;
    href = `/blog/${p.slug}`;
    eyebrow = t("featured.blogEyebrow");
    title = p.title;
    sub = p.date || null;
    cta = t("featured.blogCta");
  } else if (label === "Services") {
    href = "/data-ai";
    eyebrow = t("featured.servicesLive.eyebrow");
    title = t("featured.servicesLive.title");
    cta = t("featured.servicesLive.cta");
    extra = (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {MODEL_PROVIDERS.map((p) => (
          <span key={p.key} className="pill-chip">
            {p.family}
          </span>
        ))}
      </div>
    );
  } else {
    href = NAV_FEATURED_HREF[label];
    if (!href) return null;
    const key = label.toLowerCase();
    eyebrow = t(`featured.${key}.eyebrow`);
    title = t(`featured.${key}.title`);
    sub = t(`featured.${key}.pitch`);
  }

  return (
    <Link
      href={href}
      onClick={onNav}
      style={{
        // Drive the cut-card hairline, the eyebrow tag, and a faint diagonal
        // accent wash all from this panel's accent color.
        "--eyebrow-accent": accent.eb,
        background: `linear-gradient(135deg, rgb(${accent.eb} / 0.10), rgb(var(--color-surface)) 70%)`,
      } as React.CSSProperties}
      className="group/feat cut-card flex flex-col justify-between p-5"
    >
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <span className="mt-3 block text-lg font-semibold leading-snug text-foreground">{title}</span>
        {sub && <span className="mt-1 block text-sm text-muted">{sub}</span>}
        {extra}
      </div>
      <span
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold",
          accent.text
        )}
      >
        {cta}
        <span className="transition-transform duration-200 group-hover/feat:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}

// The Services panel, reimagined as the THINK -> BUILD -> GROW engagement arc:
// three columns, each service one click away under its phase. The two light
// columns (Strategy, Enablement) absorb the supporting cross-links so the panel
// reads as a map of how an engagement runs, not a flat list of pages.
function ServicesMega({
  services,
  support,
  onNav,
  isActiveHref,
}: {
  services: NonNullable<NavData["services"]>;
  support: NavChild[];
  onNav: () => void;
  isActiveHref: (href: string) => boolean;
}) {
  const t = useTranslations("nav");
  // Supporting links, split by group. They render UNDER the THINK / GROW columns
  // (their original places), but outside the phase boxes.
  const engage = support.filter((c) => /engage/i.test(c.group ?? ""));
  const explore = support.filter((c) => /explore/i.test(c.group ?? ""));
  const supportFor: Record<string, { label: string; items: NavChild[] }> = {
    THINK: { label: t("groups.howWeEngage"), items: engage },
    GROW: { label: t("groups.alsoExplore"), items: explore },
  };

  return (
    <div className="grid items-start gap-3 lg:grid-cols-3">
      {TIER_ORDER.map((tier) => {
        const meta = TIER_META[tier];
        const svcs = services.filter((s) => s.tier === tier);
        const sup = supportFor[tier];
        return (
          <div key={tier} className="flex flex-col">
            {/* Phase box: services only, so THINK and GROW stay compact. */}
            <div className={cn("flex flex-col rounded-2xl border border-border/70 p-2.5", meta.wash)}>
              <div className="flex items-baseline gap-2 px-3 pb-2 pt-1">
                <span className={cn("font-mono text-xs font-bold uppercase tracking-[0.18em]", meta.text)}>
                  {tier}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  · {t(`tiers.${tier}`)}
                </span>
              </div>
              <ul className="grid gap-0.5">
                {svcs.map((s) => (
                  <MenuLink
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    label={s.title}
                    // Services come from the database, so a slug added in the
                    // admin may have no message key. An unconditional lookup
                    // threw MISSING_MESSAGE and took the whole nav down, which is
                    // what `data-modernization` was doing in production.
                    description={
                      t.has(`serviceDescriptions.${s.slug}`)
                        ? t(`serviceDescriptions.${s.slug}`)
                        : undefined
                    }
                    Icon={getServiceFlavor(s.slug).icon}
                    tile={meta.tile}
                    onNav={onNav}
                    active={isActiveHref(`/services/${s.slug}`)}
                  />
                ))}
              </ul>
            </div>
            {/* Supporting links, below the box (not inside it). */}
            {sup && sup.items.length > 0 && (
              <div className="mt-5 px-2.5">
                <p className={cn("px-3 font-mono text-xs uppercase tracking-wider", meta.text)}>
                  {sup.label}
                </p>
                <ul className="mt-1.5 grid gap-0.5">
                  {sup.items.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={onNav}
                        aria-current={isActiveHref(c.href) ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-surface2 hover:text-primaryDeep",
                          isActiveHref(c.href) ? "font-semibold text-primaryDeep" : "text-foreground/80"
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 flex-none rounded-full", meta.dot)} aria-hidden="true" />
                        {t(c.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Nav({ navData }: { navData?: NavData }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const items = theme.nav as unknown as NavItem[];
  const pathname = usePathname();
  const t = useTranslations("nav");

  const booking = navData?.booking;
  // A real link to /contact underneath, so no-JS or a missing roster still
  // gets a working destination; onClick only intercepts when the modal has
  // somewhere real to send the click.
  const onCtaClick = booking?.fallbackUrl
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        setBookingOpen(true);
      }
    : undefined;

  // A nav target is "current" when the path matches exactly, or (for section
  // roots) when the path is nested under it. Home only matches exactly so it
  // isn't flagged active on every route.
  const isActiveHref = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
  // Guards against the trigger's onFocus reopening the panel while Escape is
  // restoring focus to that same trigger (see the mega-menu `<li>` onKeyDown).
  const restoringFocus = useRef(false);
  const openMega = (label: string) => {
    if (restoringFocus.current) return;
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
    <>
    <header
      className={cn(
        "sticky top-0 z-50 font-display transition-all duration-300",
        scrolled || open
          ? "glass border-b border-border shadow-soft"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-page relative z-50 flex h-[4.8rem] items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={t("homeAriaLabel", { brand: theme.brand.name })}>
          <Logo variant="dark" height={25} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            if (!item.children) {
              const active = isActiveHref(item.href!);
              return (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href!}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-base transition",
                      active
                        ? "font-semibold text-primaryDeep"
                        : "font-medium text-foreground/80 hover:bg-surface2 hover:text-primaryDeep"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            }

            const isOpen = openMenu === item.label;
            const isIndustries = item.label === "Industries";
            const accent = PANEL_ACCENT[item.label] ?? PANEL_ACCENT.Company;
            const sectionActive = item.children.some((c) => (c.href ? isActiveHref(c.href) : false));

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
                  if (e.key !== "Escape") return;
                  e.stopPropagation();
                  const trigger = e.currentTarget.querySelector<HTMLButtonElement>("button[aria-haspopup]");
                  restoringFocus.current = true;
                  trigger?.focus();
                  restoringFocus.current = false;
                  setOpenMenu(null);
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={`mega-${item.label}`}
                  aria-current={sectionActive ? "true" : undefined}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  onFocus={() => openMega(item.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-base transition",
                    isOpen
                      ? "bg-surface2 font-medium text-primaryDeep"
                      : sectionActive
                        ? "font-semibold text-primaryDeep"
                        : "font-medium text-foreground/80 hover:bg-surface2 hover:text-primaryDeep"
                  )}
                >
                  {t(item.key)}
                  <Chevron className={cn("transition-transform", isOpen && "rotate-180")} />
                </button>

                <div
                  id={`mega-${item.label}`}
                  className={cn(
                    // `fixed inset-x-0` breaks the panel out of the centered nav
                    // container so the surface runs flush to both viewport edges
                    // (full-bleed), anchored just under the 4.8rem nav bar.
                    "fixed inset-x-0 top-[4.8rem] z-50 transition-all duration-300 ease-out",
                    isOpen
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible -translate-y-2 opacity-0"
                  )}
                >
                  <div
                    style={{
                      // The big "main card" wears the brand cut-corner motif: a
                      // clipped corner + a 1px accent hairline framing the whole
                      // panel, themed to this menu's accent. Drop-shadow (not
                      // box-shadow) so the float respects the clipped silhouette.
                      "--eyebrow-accent": accent.eb,
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 1rem), calc(100% - 1rem) 100%, 0 100%)",
                      boxShadow: `inset 0 0 0 1px rgb(${accent.eb} / 0.4)`,
                      background: "rgb(var(--color-surface))",
                      filter:
                        "drop-shadow(0 10px 20px rgb(15 37 48 / 0.12)) drop-shadow(0 30px 55px rgb(15 37 48 / 0.28))",
                    } as React.CSSProperties}
                    className="relative backdrop-blur"
                  >
                    {/* Surface is full-bleed; this wrapper re-aligns the content
                        to the same max-width/gutters as the logo and nav items. */}
                    <div className="container-page py-5">
                      {item.label === "Services" && navData?.services?.length ? (
                        <ServicesMega
                          services={navData.services}
                          support={item.children as NavChild[]}
                          onNav={() => setOpenMenu(null)}
                          isActiveHref={isActiveHref}
                        />
                      ) : (
                      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
                        <ul
                          className={cn(
                            // self-start so the list keeps its natural height and
                            // doesn't stretch its rows to match the tall featured
                            // tile (which would spread the items apart).
                            "grid gap-1 self-start sm:grid-cols-2",
                            isIndustries && "lg:grid-cols-3"
                          )}
                        >
                          {(() => {
                            type Kid = NavChild;
                            // Only Industries shows per-link icons (the distinctive
                            // sector marks). Other panels are icon-free: just label
                            // + description, with group color carried by the header.
                            const renderChild = (c: Kid) => {
                              const flavor = isIndustries
                                ? getFlavor(c.href.replace("/industries/", ""))
                                : null;
                              return (
                                <MenuLink
                                  key={c.href}
                                  href={c.href}
                                  label={t(c.key)}
                                  description={t(`descriptions.${c.key}`)}
                                  Icon={flavor ? flavor.icon : undefined}
                                  tile={flavor ? flavor.tile : undefined}
                                  onNav={() => setOpenMenu(null)}
                                  active={isActiveHref(c.href)}
                                />
                              );
                            };

                            // Two-tone the grouped panel via the headers: "what we
                            // do" cool, "how we work" warm, so the groups read
                            // distinct without per-link icons. Color keys off the
                            // English `group` value; the label itself is translated.
                            const groupHeader = (name: string) =>
                              /work|explore/i.test(name) ? "text-accentDeep" : "text-royal";
                            const groupLabel = (name: string) => {
                              if (/engage/i.test(name)) return t("groups.howWeEngage");
                              if (/explore/i.test(name)) return t("groups.alsoExplore");
                              if (/how we work/i.test(name)) return t("groups.howWeWork");
                              return t("groups.whatWeDo");
                            };

                            // When children declare a `group`, render a small
                            // header per group (spanning both columns); otherwise
                            // render the flat list exactly as before.
                            const kids = item.children as ReadonlyArray<Kid>;
                            if (!kids.some((c) => c.group)) return kids.map((c) => renderChild(c));

                            const groups: { name: string; items: Kid[] }[] = [];
                            for (const c of kids) {
                              const name = c.group ?? "";
                              let bucket = groups.find((g) => g.name === name);
                              if (!bucket) {
                                bucket = { name, items: [] };
                                groups.push(bucket);
                              }
                              bucket.items.push(c);
                            }
                            return groups.map((g) => (
                              <Fragment key={g.name}>
                                <li className="mt-3 px-3 first:mt-0 sm:col-span-2">
                                  <span className={cn("font-mono text-xs uppercase tracking-wider", groupHeader(g.name))}>
                                    {groupLabel(g.name)}
                                  </span>
                                </li>
                                {g.items.map((c) => renderChild(c))}
                              </Fragment>
                            ));
                          })()}
                        </ul>

                        <MegaFeatured
                          label={item.label}
                          navData={navData}
                          accent={accent}
                          onNav={() => setOpenMenu(null)}
                        />
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link href="/contact" onClick={onCtaClick} className="btn-primary group">
            {t("cta")}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <button
          aria-label={t("toggleMenu")}
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

      {/* Scrim: when a mega-panel is open, darken + de-focus the whole page
          behind it so the bright panel reads as the single focal surface. The
          nav bar (z-50) stays crisp above it; the panel paints with the nav.
          Sits below the panel, above all page content. Closes on hover/click. */}
      <div
        aria-hidden="true"
        onMouseEnter={scheduleClose}
        onClick={() => setOpenMenu(null)}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[4.8rem] z-40 hidden bg-foreground/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out lg:block",
          openMenu ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-surface lg:hidden">
          <div className="container-page space-y-1 py-4">
            {items.map((item) => {
              const sectionActive = item.children
                ? item.children.some((c) => (c.href ? isActiveHref(c.href) : false))
                : false;
              const active = !item.children && item.href ? isActiveHref(item.href) : false;
              return (
                <div key={item.label}>
                  {item.children ? (
                    <details className="group" open={sectionActive}>
                      <summary
                        className={cn(
                          "flex cursor-pointer list-none items-center justify-between py-2 text-lg text-foreground",
                          sectionActive ? "font-semibold text-primaryDeep" : "font-medium"
                        )}
                      >
                        {t(item.key)}
                        <Chevron className="transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4">
                        {/* On mobile, the Services accordion leads with the 6
                            services themselves (the primary targets), then the
                            supporting cross-links. */}
                        {item.label === "Services" &&
                          navData?.services
                            ?.slice()
                            .sort((a, b) => TIER_ORDER.indexOf(a.tier as (typeof TIER_ORDER)[number]) - TIER_ORDER.indexOf(b.tier as (typeof TIER_ORDER)[number]))
                            .map((s) => {
                            const svcActive = isActiveHref(`/services/${s.slug}`);
                            return (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                onClick={() => setOpen(false)}
                                aria-current={svcActive ? "page" : undefined}
                                className={cn(
                                  "block py-2 text-base hover:text-primaryDeep",
                                  svcActive ? "font-semibold text-primaryDeep" : "text-foreground"
                                )}
                              >
                                {s.title}
                              </Link>
                            );
                          })}
                        {item.label === "Services" && navData?.services?.length ? (
                          <div className="my-1 h-px bg-border" />
                        ) : null}
                        {item.children.map((c) => {
                          const childActive = c.href ? isActiveHref(c.href) : false;
                          return (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setOpen(false)}
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                "block py-2 text-base hover:text-primaryDeep",
                                childActive ? "font-semibold text-primaryDeep" : "text-muted"
                              )}
                            >
                              {t(c.key)}
                            </Link>
                          );
                        })}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block py-2 text-lg hover:text-primaryDeep",
                        active ? "font-semibold text-primaryDeep" : "text-foreground"
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  )}
                </div>
              );
            })}
            <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
              <Link
                href="/contact"
                onClick={(e) => {
                  setOpen(false);
                  onCtaClick?.(e);
                }}
                className={cn("btn-primary", "flex-1")}
              >
                {t("cta")}
              </Link>
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
    {booking && (
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        people={booking.people}
        fallbackUrl={booking.fallbackUrl}
        title={booking.title}
        body={booking.body}
        pillsLabel={booking.pillsLabel}
        fallbackCta={booking.fallbackCta}
        closeLabel={booking.closeLabel}
      />
    )}
    </>
  );
}
