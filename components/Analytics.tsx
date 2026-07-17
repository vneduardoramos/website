"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { consentIsCurrent, readConsent, type ConsentValue } from "@/lib/consent";

/**
 * Google Analytics 4, loaded only when NEXT_PUBLIC_GA_ID is set. Uses "basic"
 * Consent Mode: the gtag.js loader and the `gtag('config', ...)` call are not
 * rendered at all until the visitor has granted consent (via ConsentBanner,
 * or a prior "granted" choice stored in localStorage). Declining, or not
 * having chosen yet, means nothing is requested from googletagmanager.com.
 * To use a different provider (e.g. Plausible), swap this component. The
 * ConsentBanner is provider-agnostic.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    // SSR has no localStorage, so this only ever runs client-side; the
    // server (and first client render) always renders nothing, then this
    // effect syncs the real stored choice.
    const rec = readConsent();
    setGranted(consentIsCurrent(rec) && rec.value === "granted");

    const onChange = (e: Event) => {
      const value = (e as CustomEvent<ConsentValue>).detail;
      setGranted(value === "granted");
    };
    window.addEventListener("vn-consent-change", onChange);
    return () => window.removeEventListener("vn-consent-change", onChange);
  }, []);

  if (!GA_ID || !granted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', { analytics_storage: 'denied' });
          gtag('consent', 'update', { analytics_storage: 'granted' });
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
