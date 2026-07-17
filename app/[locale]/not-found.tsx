import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export async function generateMetadata() {
  const t = await getTranslations("notFound");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const LINKS: [string, string][] = [
  ["services", "/services"],
  ["industries", "/industries"],
  ["caseStudies", "/case-studies"],
  ["resources", "/resources"],
  ["contactChip", "/contact"],
];

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="container-page py-24 text-center md:py-32">
            <div className="flex justify-center">
              <p className="eyebrow">{t("eyebrow")}</p>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {t("body")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-primary btn-lg">
                {t("backHome")}
              </Link>
              <Link href="/contact" className="btn-ghost btn-lg">
                {t("contact")}
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {LINKS.map(([key, href]) => (
                <Link key={href} href={href} className="pill-chip">
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
