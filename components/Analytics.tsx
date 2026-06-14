"use client";

import Script from "next/script";

/**
 * Google Analytics 4, loaded only when NEXT_PUBLIC_GA_ID is set. Uses GA
 * Consent Mode: analytics_storage defaults to "denied" and is upgraded to
 * "granted" only after the visitor accepts in the ConsentBanner (or on later
 * loads if a prior "granted" choice is stored). To use a different provider
 * (e.g. Plausible), swap this component. The ConsentBanner is provider-agnostic.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  if (!GA_ID) return null;
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
          try {
            if (localStorage.getItem('vn-consent') === 'granted') {
              gtag('consent', 'update', { analytics_storage: 'granted' });
            }
          } catch (e) {}
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
