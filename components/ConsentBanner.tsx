"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { consentIsCurrent, readConsent, writeConsent } from "@/lib/consent";

/**
 * Lightweight cookie-consent banner. Records the choice via lib/consent.ts
 * and, on accept, upgrades GA Consent Mode to granted (if Analytics is
 * mounted). Provider-agnostic: it only flips consent; the Analytics
 * component reads it. Also listens for "vn-consent-open" so the footer's
 * Cookie settings control can reopen it after the initial choice.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!consentIsCurrent(readConsent())) setShow(true);

    const onOpen = () => setShow(true);
    window.addEventListener("vn-consent-open", onOpen);
    return () => window.removeEventListener("vn-consent-open", onOpen);
  }, []);

  if (!show) return null;

  const choose = (value: "granted" | "denied") => {
    writeConsent(value);
    try {
      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      if (value === "granted") {
        gtag?.("consent", "update", { analytics_storage: "granted" });
      } else {
        gtag?.("consent", "update", { analytics_storage: "denied" });
      }
    } catch {
      /* ignore */
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
