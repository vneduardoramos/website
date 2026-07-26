import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { theme } from "@/config/theme";
import { officePlaces, primaryAddress } from "@/lib/offices";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(theme.brand.url),
  title: {
    default: `${theme.brand.name} | Data & AI Practices | Snowflake Partner`,
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

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: theme.brand.name,
  url: theme.brand.url,
  logo: `${theme.brand.url}/assets/viewnear-logo.png`,
  description: theme.brand.description,
  // Append the off-site profile URLs here once they exist (Snowflake Partner
  // Network listing, Clutch, G2, GoodFirms, Google Business Profile) so the
  // entity graph links them back to viewnear.com.
  sameAs: [theme.socials.linkedin],
  areaServed: ["United States", "Canada", "Mexico", "Latin America", "Caribbean"],
  // The entity needs a postal address, not just a service area: these were
  // previously only on /life-at-viewnear. Austin is the primary (US) address;
  // `location` carries both offices.
  address: primaryAddress(),
  location: officePlaces(),
  knowsAbout: [
    "Snowflake",
    "Snowflake data migration",
    "Data engineering",
    "Snowflake Cortex",
    "AI agents",
    "Nearshore software delivery",
    "Nearshore delivery center",
    "Monterrey, Mexico",
    "Data & AI strategy",
    "Artificial intelligence",
    "Business intelligence",
    "Data governance",
    "MLOps",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: theme.brand.email,
    ...(theme.brand.phone ? { telephone: theme.brand.phone } : {}),
    areaServed: "Americas",
    availableLanguage: ["en", "es"],
  },
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: theme.brand.name,
  url: theme.brand.url,
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
        <JsonLd data={[ORG_JSONLD, WEBSITE_JSONLD]} />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          {children}
          <ConsentBanner />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
