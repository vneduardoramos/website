import { unstable_cache } from "next/cache";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav, type NavData } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { safe, getBlogPosts, getCaseStudies, getServices } from "@/lib/queries";
import type { Locale } from "@/lib/i18n-content";
import { prisma } from "@/lib/db";
import type { OverrideMap } from "@/lib/image-overrides";
import { AuthProvider } from "@/components/admin/SessionProvider";
import { ImageOverrideProvider } from "@/components/marketing/ImageOverrideProvider";
import { EditModeProvider } from "@/components/marketing/EditModeProvider";
import { ChatWidget } from "@/components/marketing/ChatWidget";

// Small content-aware bits surfaced in the mega-menu featured tiles. Fetched
// here (server) and passed to the client <Nav>; each falls back gracefully.
async function getNavData(locale: Locale): Promise<NavData> {
  const [posts, cases, services] = await Promise.all([
    safe(getBlogPosts({ take: 1 }, locale), []),
    safe(getCaseStudies({ featured: true, take: 1 }, locale), []),
    safe(getServices(locale), []),
  ]);
  const fmtDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString(locale === "es" ? "es-419" : "en-US", { month: "short", year: "numeric" })
      : "";
  const post = posts[0];
  const cs = cases[0];
  return {
    latestPost: post ? { title: post.title, slug: post.slug, date: fmtDate(post.publishedAt) } : null,
    featuredCase: cs ? { title: cs.title, slug: cs.slug, sector: cs.sector } : null,
    // The 6 services, laid out by tier in the Services mega-menu.
    services: services.map((s) => ({ slug: s.slug, title: s.title, tier: s.tier })),
  };
}

const getImageOverrides = unstable_cache(
  async (): Promise<OverrideMap> => {
    const rows = await prisma.imageOverride.findMany();
    const map: OverrideMap = {};
    for (const r of rows) {
      map[r.key] = { key: r.key, mediaUrl: r.mediaUrl, focalX: r.focalX, focalY: r.focalY, zoom: r.zoom, alt: r.alt };
    }
    return map;
  },
  ["image-overrides"],
  // `revalidate` is not optional here, despite the tag.
  //
  // Without it this entry is cached indefinitely and the ONLY invalidation is
  // revalidateTag("image-overrides") from /api/image-overrides. That route sits
  // behind ADMIN_ENABLED, which is unset in production, so middleware.ts 404s
  // it: production can never invalidate this cache. Render restores a ~576MB
  // build cache (including .next/cache) on every deploy, so an entry written
  // during a build when ImageOverride happened to be empty survives every
  // subsequent deploy. That is exactly what happened: the snapshot carried six
  // overrides, the import wrote all six, and the service pages still rendered
  // their placeholders across three consecutive deploys because the layout was
  // reading a stale cache entry rather than the database.
  //
  // A short TTL means the worst case is five minutes of staleness instead of
  // forever, and production heals itself without a cache-cleared deploy.
  { tags: ["image-overrides"], revalidate: 300 },
);

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  setRequestLocale(params.locale);
  const t = await getTranslations("common");
  const navData = await getNavData(locale);
  const overrides = await getImageOverrides();
  const adminEnabled =
    process.env.ADMIN_ENABLED === "true" || process.env.NODE_ENV === "development";
  const body = (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primaryDeep focus:px-4 focus:py-2 focus:text-white focus:shadow-soft-lg"
      >
        {t("skipToContent")}
      </a>
      <Nav navData={navData} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
  return (
    <ImageOverrideProvider value={overrides}>
      {adminEnabled ? (
        <AuthProvider>
          <EditModeProvider>{body}</EditModeProvider>
        </AuthProvider>
      ) : (
        body
      )}
    </ImageOverrideProvider>
  );
}
