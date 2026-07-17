/**
 * Client-only consent helper. Single source of truth for reading/writing the
 * cookie-consent choice and for the events that let other components react
 * to it (Analytics injects/removes GA; ConsentBanner can be reopened from the
 * footer "Cookie settings" control).
 *
 * Storage format is versioned so future policy changes can force a re-prompt
 * by bumping CONSENT_VERSION. Legacy bare "granted"/"denied" strings (written
 * before this module existed) are read as v0 and honored indefinitely, so
 * existing visitors are not re-prompted.
 */
export type ConsentValue = "granted" | "denied";
export type ConsentRecord = { v: number; value: ConsentValue; ts: number };

const KEY = "vn-consent";
export const CONSENT_VERSION = 1;
const MAX_AGE_MS = 12 * 30 * 24 * 60 * 60 * 1000; // ~12 months, EDPB re-prompt window

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    // Storage-hostile environments (Safari private mode, strict privacy) can
    // throw on any access. Treat as "no choice recorded" rather than crashing.
    return null;
  }
  if (!raw) return null;
  if (raw === "granted" || raw === "denied") return { v: 0, value: raw, ts: 0 }; // legacy
  try {
    const rec = JSON.parse(raw) as ConsentRecord;
    if (rec.value !== "granted" && rec.value !== "denied") return null;
    return rec;
  } catch {
    return null;
  }
}

export function consentIsCurrent(rec: ConsentRecord | null): rec is ConsentRecord {
  // v0 = legacy bare-string records: honored indefinitely (do not re-prompt existing visitors)
  return !!rec && (rec.v === 0 || (rec.v >= CONSENT_VERSION && Date.now() - rec.ts < MAX_AGE_MS));
}

export function writeConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ v: CONSENT_VERSION, value, ts: Date.now() }));
  } catch {
    // Ignore persistence failure (e.g. Safari private mode) so the banner still
    // dismisses and analytics still reacts for this session via the event below.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>("vn-consent-change", { detail: value }));
}

export function openConsentBanner() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("vn-consent-open"));
}
