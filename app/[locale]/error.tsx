"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
  const t = useTranslations("errorPage");
  useEffect(() => {
    // TODO: report to an error monitor in production.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex justify-center">
        <p className="eyebrow">{t("eyebrow")}</p>
      </div>
      <h1 className="mt-6 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {t("heading")}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
        {t("body")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn-primary btn-lg">
          {t("tryAgain")}
        </button>
        <Link href="/" className="btn-ghost btn-lg">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
