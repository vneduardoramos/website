import { withAuth } from "next-auth/middleware";

// Redirect unauthenticated users to the custom login (not NextAuth's default
// /api/auth/signin, which isn't a real page here).
export default withAuth({
  pages: { signIn: "/admin/login" },
});

// Protect all /admin routes except the login page.
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
