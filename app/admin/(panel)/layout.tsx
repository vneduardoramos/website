import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ADMIN_MODELS } from "@/lib/admin/config";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { Logo } from "@/components/marketing/Logo";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:block">
        <div className="p-5">
          <Link href="/admin" className="flex items-center">
            <Logo height={24} />
          </Link>
          <p className="mt-0.5 text-xs text-muted">Content admin</p>
        </div>
        <nav className="space-y-0.5 px-3 pb-6 text-sm">
          <Link href="/admin" className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground">
            Dashboard
          </Link>
          {Object.values(ADMIN_MODELS).map((m) => (
            <Link
              key={m.key}
              href={`/admin/${m.key}`}
              className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground"
            >
              {m.plural}
            </Link>
          ))}
          <Link href="/admin/leads" className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground">
            Leads
          </Link>
          <Link href="/admin/applications" className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground">
            Applications
          </Link>
          <Link href="/admin/media" className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground">
            Media
          </Link>
          <Link href="/admin/client-logos" className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground">
            Client logos
          </Link>
          <Link href="/admin/settings" className="block rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-foreground">
            Settings
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← View site
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">{session.user?.email}</span>
            <SignOutButton />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
