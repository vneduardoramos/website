import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
};

const LINKS: [string, string][] = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Case studies", "/case-studies"],
  ["Resources", "/resources"],
  ["Contact", "/contact"],
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="container-page py-24 text-center md:py-32">
            <div className="flex justify-center">
              <p className="eyebrow">Error 404</p>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              This page wandered off.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back on track.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-primary btn-lg">
                Back home
              </Link>
              <Link href="/contact" className="btn-ghost btn-lg">
                Contact us
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {LINKS.map(([label, href]) => (
                <Link key={href} href={href} className="pill-chip">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
