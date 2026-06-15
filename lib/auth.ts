import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// Fail fast when the production server boots with a guessable/default secret.
// Skipped during `next build` (NEXT_PHASE === "phase-production-build"), which
// runs with NODE_ENV=production but doesn't have or need the runtime secret, so
// builds don't require production env values.
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build" &&
  (!NEXTAUTH_SECRET || /change|dev-secret/i.test(NEXTAUTH_SECRET))
) {
  throw new Error(
    "NEXTAUTH_SECRET must be set to a strong, non-default value in production. Generate one with: openssl rand -base64 32"
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "EDITOR";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          (token.role as string) ?? "EDITOR";
      }
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
};
