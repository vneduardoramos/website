import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { theme } from "@/config/theme";
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
  sameAs: [theme.socials.linkedin],
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
  if (!routing.locales.includes(locale as "en" | "es")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  // Only ship namespaces that CLIENT components read (Nav, LocaleSwitcher, and
  // any interactive marketing components). Page copy is server-rendered via
  // getTranslations and must NOT be added here (it would bloat the client
  // bundle). If a client component needs page copy, pass it in as props.
  const clientMessages = {
    nav: (messages as Record<string, unknown>).nav,
    common: (messages as Record<string, unknown>).common,
    footer: (messages as Record<string, unknown>).footer,
  };
  return (
    <html lang={locale} className={fontVariables}>
      <body className="font-sans">
        <JsonLd data={[ORG_JSONLD, WEBSITE_JSONLD]} />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>{children}</NextIntlClientProvider>
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
