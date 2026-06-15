import Link from "next/link";
import { theme } from "@/config/theme";
import { Logo } from "@/components/marketing/Logo";
import { PartnerBadges } from "@/components/marketing/PartnerBadges";
import { SnowflakeLockup } from "@/components/marketing/SnowflakeLockup";

const groups = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Partnership", href: "/partnership" },
      { label: "Life at Viewnear", href: "/life-at-viewnear" },
      { label: "Security & Trust", href: "/security" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Services", href: "/services" },
      { label: "Solutions", href: "/solutions" },
      { label: "Approach", href: "/approach" },
      { label: "Pricing", href: "/pricing" },
      { label: "Platform", href: "/platform" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Construction and Real Estate", href: "/industries/construction-real-estate" },
      { label: "Education", href: "/industries/education" },
      { label: "Financial Services", href: "/industries/financial-services" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Media, Entertainment & Advertising", href: "/industries/media-entertainment-advertising" },
      { label: "Retail & CPG", href: "/industries/retail-cpg" },
      { label: "Technology and Telco", href: "/industries/technology-telco" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "All resources", href: "/resources" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export function Footer() {
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
            </p>
            <PartnerBadges variant="logos" size="sm" className="mt-6" />
            <SnowflakeLockup variant="default" height={24} className="mt-6" />
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted">
                {g.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-foreground/75 transition-colors hover:text-primaryDeep">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted md:flex-row">
          <p>
            © {theme.brand.name}, Snowflake Premier Partner serving {theme.brand.region}.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-primaryDeep">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-primaryDeep">Terms</Link>
            <a href={theme.socials.linkedin} className="transition-colors hover:text-primaryDeep">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
