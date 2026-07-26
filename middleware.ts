import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const ADMIN_ENABLED =
  process.env.ADMIN_ENABLED === "true" || process.env.NODE_ENV === "development";
const adminAuth = withAuth({ pages: { signIn: "/admin/login" } });
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  // Admin surface + admin-only APIs: gate, never localize.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) {
    if (!ADMIN_ENABLED) return new NextResponse(null, { status: 404 });
    if (/^\/admin(?!\/login)/.test(pathname)) return (adminAuth as any)(req, event);
    return NextResponse.next();
  }

  // Marketing → locale routing.
  const res = intlMiddleware(req);

  // next-intl redirects the redundant default-locale prefix ("/en/pricing" →
  // "/pricing") with a 307. Those URLs never exist under
  // localePrefix: "as-needed", so the honest signal is a permanent redirect;
  // 307 tells crawlers the original might come back and splits consolidation.
  // Only the default-locale prefix is upgraded: "/es/..." is a real URL, and
  // locale-detection redirects (disabled here) would not be permanent.
  if (res.status === 307) {
    const location = res.headers.get("location");
    const { pathname } = req.nextUrl;
    const prefix = `/${routing.defaultLocale}`;
    if (location && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return NextResponse.redirect(new URL(location, req.url), 308);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/api/auth/:path*",
    "/api/admin/:path*",
    "/api/upload/:path*",
    "/api/image-from-url/:path*",
    "/api/image-overrides/:path*",
    "/api/pexels/:path*",
  ],
};
