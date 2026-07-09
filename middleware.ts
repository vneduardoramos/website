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
  return intlMiddleware(req);
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
