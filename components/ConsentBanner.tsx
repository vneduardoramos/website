"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const KEY = "vn-consent";

/**
 * Lightweight cookie-consent banner. Records the choice in localStorage and,
 * on accept, upgrades GA Consent Mode to granted (if Analytics is mounted).
 * Provider-agnostic: it only flips consent; the Analytics component reads it.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage unavailable. Don't block the page */
    }
  }, []);

  if (!show) return null;

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    if (value === "granted") {
      try {
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
          "consent",
          "update",
          { analytics_storage: "granted" }
        );
      } catch {
        /* ignore */
      }
    }
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 shadow-soft-lg backdrop-blur"
    >
      <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {t.rich("body", {
            privacyLink: (chunk) => (
              <Link href="/privacy" className="font-semibold text-primaryDeep underline">
                {chunk}
              </Link>
            ),
          })}
        </p>
        <div className="flex shrink-0 gap-3">
          <button onClick={() => choose("denied")} className="btn-ghost btn-sm">
            {t("decline")}
          </button>
          <button onClick={() => choose("granted")} className="btn-primary btn-sm">
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
