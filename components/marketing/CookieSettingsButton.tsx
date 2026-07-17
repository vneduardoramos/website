"use client";

import { openConsentBanner } from "@/lib/consent";

/**
 * Reopens the ConsentBanner (see lib/consent.ts + components/ConsentBanner.tsx).
 * A tiny client component so the server-rendered Footer doesn't need "use client".
 */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => openConsentBanner()}
      className="transition-colors hover:text-primaryDeep"
    >
      {label}
    </button>
  );
}
