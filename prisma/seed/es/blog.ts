// Spanish (es) overlay. Keyed by slug. Optional — empty means the row falls back to English. Filled by the content-translation phase.
// Body comes from prisma/seed/content/blog/<slug>.es.md, NOT here.
export const blogPostsEs: Record<string, { title?: string; excerpt?: string; keyTakeaways?: string[]; seoTitle?: string; seoDescription?: string }> = {};
