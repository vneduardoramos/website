// Spanish (es) overlay. Keyed by slug. Optional — empty means the row falls back to English. Filled by the content-translation phase.
// Body comes from prisma/seed/content/case-studies/<slug>.es.md, NOT here.
export const caseStudiesEs: Record<string, { title?: string; summary?: string; challenge?: string; solution?: string; results?: string; metrics?: { value: string; label: string }[]; quote?: { text: string; author: string; role: string }; seoTitle?: string; seoDescription?: string }> = {};
