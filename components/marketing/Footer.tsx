import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { theme } from "@/config/theme";
import { Logo } from "@/components/marketing/Logo";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { SnowflakeLockup } from "@/components/marketing/SnowflakeLockup";
import { CookieSettingsButton } from "@/components/marketing/CookieSettingsButton";

// `titleKey` / `linkKey` resolve against the `footer` message namespace; `label`
// stays as the English source of truth and fallback. `href` unchanged.
const groups = [
  {
    titleKey: "company",
    title: "Company",
    links: [
      { linkKey: "about", label: "About", href: "/about" },
      { linkKey: "partnership", label: "Partnership", href: "/partnership" },
      { linkKey: "lifeAtViewnear", label: "Life at Viewnear", href: "/life-at-viewnear" },
      { linkKey: "careers", label: "Careers", href: "/careers" },
      { linkKey: "security", label: "Security & Trust", href: "/security" },
      { linkKey: "contact", label: "Contact", href: "/contact" },
    ],
  },
  {
    titleKey: "services",
    title: "Services",
    links: [
      { linkKey: "servicesOverview", label: "Services", href: "/services" },
      { linkKey: "aiDataStrategy", label: "Data & AI Strategy", href: "/services/ai-data-strategy" },
      { linkKey: "cloudArchitecture", label: "Cloud Architecture & Data Foundation", href: "/services/cloud-architecture" },
      { linkKey: "dataEngineering", label: "Data Engineering & Pipelines", href: "/services/data-engineering" },
      { linkKey: "aiAnalytics", label: "AI Analytics & Agents", href: "/services/data-visualisation" },
      { linkKey: "embeddedAnalytics", label: "Embedded Analytics", href: "/services/embedded-analytics" },
      { linkKey: "capabilityDevelopment", label: "Capability Development", href: "/services/capability-development" },
      { linkKey: "migrations", label: "Migrations", href: "/migrations" },
      { linkKey: "nearshore", label: "Nearshore Advantage", href: "/nearshore" },
      { linkKey: "approach", label: "Approach", href: "/approach" },
      { linkKey: "pricing", label: "Pricing", href: "/pricing" },
      { linkKey: "platform", label: "Platform", href: "/platform" },
    ],
  },
  {
    titleKey: "industries",
    title: "Industries",
    links: [
      { linkKey: "constructionRealEstate", label: "Construction & Real Estate", href: "/industries/construction-real-estate" },
      { linkKey: "education", label: "Education", href: "/industries/education" },
      { linkKey: "financialServices", label: "Financial Services", href: "/industries/financial-services" },
      { linkKey: "manufacturing", label: "Manufacturing", href: "/industries/manufacturing" },
      { linkKey: "mediaEntertainmentAdvertising", label: "Media, Entertainment & Advertising", href: "/industries/media-entertainment-advertising" },
      { linkKey: "retailCpg", label: "Retail & CPG", href: "/industries/retail-cpg" },
      { linkKey: "technologyTelco", label: "Technology & Telco", href: "/industries/technology-telco" },
    ],
  },
  {
    titleKey: "resources",
    title: "Resources",
    links: [
      { linkKey: "allResources", label: "All resources", href: "/resources" },
      { linkKey: "caseStudies", label: "Case Studies", href: "/case-studies" },
      { linkKey: "blog", label: "Blog", href: "/blog" },
      { linkKey: "press", label: "Press", href: "/press" },
      { linkKey: "faq", label: "FAQ", href: "/faq" },
    ],
  },
];

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo variant="dark" height={32} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {theme.brand.tagline} {theme.brand.description}
            </p>
            <p className="mt-4 text-sm">
              <a href={`mailto:${theme.brand.email}`} className="font-medium text-primaryDeep hover:underline">
                {theme.brand.email}
              </a>
              {theme.brand.phone && (
                <>
                  {" · "}
                  <a
                    href={`tel:${theme.brand.phone.replace(/[^+\d]/g, "")}`}
                    className="font-medium text-primaryDeep hover:underline"
                  >
                    {theme.brand.phone}
                  </a>
                </>
              )}
            </p>
            <PartnerBadges variant="logos" size="sm" className="mt-6" />
            <SnowflakeLockup variant="default" height={24} className="mt-6" />
          </div>
          {groups.map((g) => (
            <div key={g.titleKey}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                {t(`groups.${g.titleKey}`)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-foreground/75 transition-colors hover:text-primaryDeep">
                      {t(`links.${l.linkKey}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted md:flex-row">
          <p>
            {t("copyright", {
              year: new Date().getFullYear(),
              name: theme.brand.name,
              region: theme.brand.region,
            })}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-primaryDeep">{t("privacy")}</Link>
            <CookieSettingsButton label={t("cookieSettings")} />
            <Link href="/terms" className="transition-colors hover:text-primaryDeep">{t("terms")}</Link>
            <a href={theme.socials.linkedin} className="transition-colors hover:text-primaryDeep">{t("linkedin")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
