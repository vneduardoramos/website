import type { Metadata } from "next";
import { AuthProvider } from "@/components/admin/SessionProvider";

export const metadata: Metadata = {
  title: "Viewnear Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
