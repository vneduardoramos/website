import type { Metadata } from "next";
import { NotFoundView } from "@/components/marketing/NotFoundView";

/**
 * Static metadata, deliberately not localized.
 *
 * `generateMetadata` here would need `getTranslations()`, which reads
 * `headers()`, and doing that while rendering a 404 for a prerendered route
 * turns the page dynamic at runtime and makes Next serve a 500 instead. The page
 * is `noindex`, so a single-language title costs nothing in search; the visible
 * copy is fully localized in NotFoundView.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist or has moved.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
