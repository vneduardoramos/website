"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Self-contained (no Nav/Footer) so a failure in
 * the chrome can't cascade into the fallback. Logs to the console; swap in a
 * real error reporter (Sentry, etc.) where noted.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: report to an error monitor in production.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex justify-center">
        <p className="eyebrow">Something went wrong</p>
      </div>
      <h1 className="mt-6 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        We hit a snag.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn-primary btn-lg">
          Try again
        </button>
        <Link href="/" className="btn-ghost btn-lg">
          Back home
        </Link>
      </div>
    </div>
  );
}
