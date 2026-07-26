/**
 * When each legal document was last revised.
 *
 * Kept as data rather than baked into a translated sentence. The dates were
 * previously written into four message strings ("Last updated: June 6, 2026" and
 * its Spanish twin, times two documents), which meant the date a reader relies on
 * lived in the same place as its label, in two languages, with nothing tying them
 * together. Editing one and forgetting the other silently disagreed about when
 * the policy changed.
 *
 * ISO here, formatted for display by FormattedDate, which also emits the
 * machine-readable <time dateTime>.
 */
export const LEGAL_UPDATED: Record<string, string> = {
  "/privacy": "2026-06-06",
  "/terms": "2026-06-07",
};
