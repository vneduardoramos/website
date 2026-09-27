import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { theme } from "@/config/theme";
import { PARTNERS, SNOWFLAKE, ANTHROPIC } from "@/config/partners";
import { officePlaces, primaryAddress } from "@/lib/offices";
import { ORG_ID, SITE_ID, ORG_REF, AREA_SERVED } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(theme.brand.url),
  title: {
    default: `${theme.brand.name} | Data & AI Practices | Snowflake & Anthropic Partner`,
    template: `%s | ${theme.brand.name}`,
  },
  description: theme.brand.description,
  openGraph: {
    title: `${theme.brand.name} | Data & AI Practices`,
    description: theme.brand.description,
    url: theme.brand.url,
    siteName: theme.brand.name,
    type: "website",
    images: [{ url: "/assets/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${theme.brand.name} | Data & AI Practices`,
    description: theme.brand.description,
    images: ["/assets/og-default.jpg"],
  },
  // Search-console ownership. Real once the tokens are set in the env; omitted
  // (no empty tags) until then.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#29B5E8",
};

const orgJsonLd = (locale: string) => ({
  "@context": "https://schema.org",
  // Organization rather than a narrower type: the company also has two
  // ProfessionalService locations, emitted separately via officesLd().
  "@type": "Organization",
  // Stable identity every other node on the site points at. See lib/seo.ts.
  "@id": ORG_ID,
  name: theme.brand.name,
  url: theme.brand.url,
  logo: `${theme.brand.url}/assets/viewnear-logo.png`,
  description: locale === "es" ? theme.brand.descriptionEs : theme.brand.description,
  inLanguage: locale,
  // Off-site profiles that let a consumer confirm two mentions are this same
  // company. The Snowflake listing is the one that corroborates the Premier and
  // CoCo Preferred claims the site makes on five pages, and it is verified live:
  // it returns "Viewnear - Partner | Snowflake Partners" and names the tier,
  // while an unknown slug on that path returns a 404 page.
  // Add Crunchbase, a Google Business Profile and any review-directory listing
  // here as they come into existence. Do not add a profile that does not exist.
  // No Anthropic partner listing is published for Viewnear, so there is nothing
  // to add here for that partnership: the membership below carries it instead.
  sameAs: [theme.socials.linkedin, SNOWFLAKE.directoryUrl, ANTHROPIC.directoryUrl].filter(Boolean),
  areaServed: AREA_SERVED,
  // The entity needs a postal address, not just a service area: these were
  // previously only on /life-at-viewnear. Austin is the primary (US) address;
  // `location` carries both offices.
  address: primaryAddress(),
  location: officePlaces(),
  // Supplied by the owner, 2026-07-26. These correct the record: third-party
  // directories publish "Founded 2024, 1-10 employees", which is wrong on both
  // counts, and an assistant asked how old or how large Viewnear is will quote
  // whatever it can find.
  // The contracting entity. The Mexican entity is deliberately not published:
  // the owner asked to keep it off the site, and it is not the party that
  // contracts with clients.
  legalName: "Viewnear LLC",
  foundingDate: "2022",
  // Both cities: the company started in Austin and Monterrey at once, which is
  // also why the nearshore model is not something bolted on later. Same source as
  // `location` and `address`, so the three can never disagree.
  foundingLocation: officePlaces(),
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 20, maxValue: 50 },
  slogan: theme.brand.tagline,
  email: theme.brand.email,
  knowsLanguage: ["en", "es"],
  // Both partner statuses the site asserts, as resolvable memberships rather
  // than only as prose, built from config/partners.ts so a change of tier is
  // one edit. hostingOrganization carries each company's own Wikidata id, so
  // the programme resolves to the real company. Verified against the Wikidata
  // API on 2026-09-27: Snowflake Inc. is Q22078063, not Q65141064, which the
  // site asserted until today and which is a granitic complex in Australia.
  memberOf: PARTNERS.map((p) => ({
    "@type": "ProgramMembership",
    programName: p.network,
    ...(p.level ? { membershipNumber: p.level } : {}),
    hostingOrganization: {
      "@type": "Organization",
      name: p.org.name,
      url: p.org.url,
      sameAs: p.org.wikidata,
    },
  })),
  // Topics, with a canonical URI wherever one exists. A bare string leaves
  // "Snowflake" ambiguous between the company, the product and the weather;
  // sameAs removes the ambiguity. Entries with no stable public entity stay
  // strings rather than getting a guessed identifier.
  knowsAbout: [
    { "@type": "Thing", name: "Snowflake", sameAs: "https://www.wikidata.org/wiki/Q22078063" },
    {
      "@type": "Thing",
      name: "Artificial intelligence",
      sameAs: "https://www.wikidata.org/wiki/Q11660",
    },
    // The agentic half of the offer. Every id here was resolved against the
    // Wikidata API on 2026-09-27 and returns the intended entity.
    { "@type": "Thing", name: "Anthropic", sameAs: "https://www.wikidata.org/wiki/Q116758847" },
    { "@type": "Thing", name: "Claude", sameAs: "https://www.wikidata.org/wiki/Q118876059" },
    {
      "@type": "Thing",
      name: "Model Context Protocol",
      sameAs: "https://www.wikidata.org/wiki/Q133436854",
    },
    { "@type": "Thing", name: "AI agents", sameAs: "https://www.wikidata.org/wiki/Q132451509" },
    { "@type": "Thing", name: "Data warehouse", sameAs: "https://www.wikidata.org/wiki/Q193351" },
    {
      "@type": "Thing",
      name: "Business intelligence",
      sameAs: "https://www.wikidata.org/wiki/Q171240",
    },
    { "@type": "Thing", name: "Data governance", sameAs: "https://www.wikidata.org/wiki/Q5227230" },
    {
      "@type": "Thing",
      name: "Monterrey",
      sameAs: "https://www.wikidata.org/wiki/Q81033",
    },
    "Snowflake data migration",
    "Snowflake Cortex",
    "Data engineering",
    // No canonical public entity for these, so they stay strings. "Claude Code"
    // is a product name rather than a Wikidata topic, and "agentic AI" has no
    // distinct item (the closest is the AI agents entity used above).
    "Claude Code",
    "Agentic AI",
    "Human in the loop AI",
    "Nearshore software delivery",
    "Nearshore delivery center",
    "Data & AI strategy",
    "MLOps",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: theme.brand.email,
    ...(theme.brand.phone ? { telephone: theme.brand.phone } : {}),
    areaServed: AREA_SERVED,
    availableLanguage: ["en", "es"],
  },
});

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  name: theme.brand.name,
  url: theme.brand.url,
  publisher: ORG_REF,
  inLanguage: ["en", "es"],
  // No potentialAction/SearchAction: the site has no search feature, and
  // declaring one would describe a capability that does not exist.
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  // An unknown first segment ("/favicon.ico", "/opensearch.xml", "/PRICING")
  // lands here as `locale`. Pin the request to the default locale BEFORE
  // notFound(), because app/[locale]/not-found.tsx reads translations: without a
  // resolvable locale it threw while rendering the 404, and Next served a bare
  // 500 instead. Any path containing a dot also bypasses the middleware
  // (see its matcher), so this is the only place that runs for those URLs.
  if (!routing.locales.includes(locale as "en" | "es")) {
    setRequestLocale(routing.defaultLocale);
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  // Ship only the namespaces CLIENT components read: shared chrome (nav/footer),
  // common microcopy, and the small shared-component namespaces. Large PAGE
  // namespaces (home, about, security, ...) are server-rendered via
  // getTranslations and deliberately kept OUT of the client bundle.
  const CLIENT_NS = [
    "nav", "common", "footer",
    "sharedUi", "strips", "homeServer", "partnershipUi", "dataAiUi",
    "platformUi", "approachUi", "migrationsUi", "contentData", "articleUi",
    "heroUi", "methodology", "forms", "misc", "consent", "errorPage",
    // The 404 body localizes on the client so it can render inside prerendered
    // routes without reading request headers (see NotFoundView).
    "notFound",
  ];
  const all = messages as Record<string, unknown>;
  const clientMessages = Object.fromEntries(
    CLIENT_NS.filter((ns) => all[ns] !== undefined).map((ns) => [ns, all[ns]]),
  );
  return (
    <html lang={locale} className={fontVariables}>
      <body className="font-sans">
        <JsonLd data={[orgJsonLd(locale), WEBSITE_JSONLD]} />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          {children}
          <ConsentBanner />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
