import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/**
 * The admin surface (CMS pages, NextAuth, and the admin-only APIs) exists
 * only where it's explicitly enabled: local dev always, anywhere else only
 * with ADMIN_ENABLED="true". Deployed environments that don't set the flag
 * serve a plain 404 for all of it, so the login form, session endpoints,
 * and upload/override APIs are simply not part of the public site.
 */
const ADMIN_ENABLED =
  process.env.ADMIN_ENABLED === "true" || process.env.NODE_ENV === "development";

// Redirect unauthenticated users to the custom login (not NextAuth's default
// /api/auth/signin, which isn't a real page here).
const adminAuth = withAuth({
  pages: { signIn: "/admin/login" },
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!ADMIN_ENABLED) {
    return new NextResponse(null, { status: 404 });
  }
  // Only the admin pages (minus the login form) need an authenticated session;
  // the API routes matched below enforce their own session checks server-side.
  if (/^\/admin(?!\/login)/.test(req.nextUrl.pathname)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (adminAuth as any)(req, event);
  }
  return NextResponse.next();
}

// Everything admin-shaped: the CMS pages, the auth endpoints that mint admin
// sessions, and the mutation APIs used only by the admin UI / edit overlay.
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/admin/:path*",
    "/api/upload/:path*",
    "/api/image-from-url/:path*",
    "/api/image-overrides/:path*",
    "/api/pexels/:path*",
  ],
};
