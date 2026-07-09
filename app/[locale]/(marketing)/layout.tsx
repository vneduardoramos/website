import { unstable_cache } from "next/cache";
import { setRequestLocale } from "next-intl/server";
import { Nav, type NavData } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { safe, getBlogPosts, getCaseStudies } from "@/lib/queries";
import { prisma } from "@/lib/db";
import type { OverrideMap } from "@/lib/image-overrides";
import { AuthProvider } from "@/components/admin/SessionProvider";
import { ImageOverrideProvider } from "@/components/marketing/ImageOverrideProvider";
import { EditModeProvider } from "@/components/marketing/EditModeProvider";

// Small content-aware bits surfaced in the mega-menu featured tiles. Fetched
// here (server) and passed to the client <Nav>; each falls back gracefully.
async function getNavData(): Promise<NavData> {
  const [posts, cases] = await Promise.all([
    safe(getBlogPosts({ take: 1 }), []),
    safe(getCaseStudies({ featured: true, take: 1 }), []),
  ]);
  const fmtDate = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
  const post = posts[0];
  const cs = cases[0];
  return {
    latestPost: post ? { title: post.title, slug: post.slug, date: fmtDate(post.publishedAt) } : null,
    featuredCase: cs ? { title: cs.title, slug: cs.slug, sector: cs.sector } : null,
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
  { tags: ["image-overrides"] },
);

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const navData = await getNavData();
  const overrides = await getImageOverrides();
  return (
    <AuthProvider>
      <ImageOverrideProvider value={overrides}>
        <EditModeProvider>
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primaryDeep focus:px-4 focus:py-2 focus:text-white focus:shadow-soft-lg"
            >
              Skip to main content
            </a>
            <Nav navData={navData} />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </EditModeProvider>
      </ImageOverrideProvider>
    </AuthProvider>
  );
}
