import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { theme } from "@/config/theme";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(theme.brand.url),
  title: {
    default: `${theme.brand.name} | Data & AI Consulting | Snowflake Partner`,
    template: `%s | ${theme.brand.name}`,
  },
  description: theme.brand.description,
  openGraph: {
    title: `${theme.brand.name} | Data & AI Consulting`,
    description: theme.brand.description,
    url: theme.brand.url,
    siteName: theme.brand.name,
    type: "website",
    images: [{ url: "/assets/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${theme.brand.name} | Data & AI Consulting`,
    description: theme.brand.description,
    images: ["/assets/og-default.jpg"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans">
        <JsonLd data={[ORG_JSONLD, WEBSITE_JSONLD]} />
        {children}
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
