"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Nav } from "@/components/marketing/Nav";

const LINKS: [string, string][] = [
  ["services", "/services"],
  ["industries", "/industries"],
  ["caseStudies", "/case-studies"],
  ["resources", "/resources"],
  ["contactChip", "/contact"],
];

/**
 * The 404 body, localized through the client provider rather than on the server.
 *
 * This is a client component on purpose. `notFound()` can be thrown from a
 * statically prerendered route (any `/blog/<unknown-slug>`, since the real slugs
 * come from generateStaticParams), and a server-side `getTranslations()` there
 * reads `headers()`, which flips a static page to dynamic at runtime. Next
 * treats that as an error and serves a 500 instead of the 404. Reading messages
 * from NextIntlClientProvider needs no request headers, so this renders whether
 * the route was prerendered or rendered on demand.
 *
 * Known limitation, verified in a production build: this body arrives in the RSC
 * payload and paints after hydration, not in the streamed HTML. The site uses
 * per-locale root layouts (`app/[locale]/layout.tsx` owns `<html lang>`), so
 * `app/layout.tsx` is a passthrough that renders no document shell. Next has
 * nothing to render a not-found document into and falls back to its internal
 * `__next_error__` shell with an empty body. Making `app/layout.tsx` the single
 * root layout would fix the paint but would leave `<html lang>` unable to follow
 * the locale on 62 indexable Spanish URLs, which is the worse trade for a page
 * that is `noindex` either way. The status code, title and `noindex` are all
 * correct, which is what search engines act on.
 *
 * No `<Footer />`: it is a server component that reads translations the same
 * way, which would reintroduce the 500. Recovery is covered by the nav, the two
 * buttons, and the section links below.
 */
export function NotFoundView() {
  const t = useTranslations("notFound");
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
    </div>
  );
}
