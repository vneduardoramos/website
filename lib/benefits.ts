/**
 * Shared benefits, surfaced both on /life-at-viewnear and on each job page so
 * the two never drift. `label` is the short ledger eyebrow BenefitsGrid renders.
 *
 * i18n note: the copy moved into the `contentData` message catalog. Server
 * consumers read the localized list via `getBenefits(t)` (passing a
 * `getTranslations("contentData")` instance) and hand it to `BenefitsGrid`.
 */
export type Benefit = {
  label: string;
  title: string;
  body: string;
};

/**
 * Localized benefits, read from the `contentData` catalog. Pass a
 * `getTranslations("contentData")` (server) or `useTranslations("contentData")`
 * (client) instance.
 */
export function getBenefits(t: { raw: (key: string) => unknown }): Benefit[] {
  return t.raw("benefits") as Benefit[];
}
