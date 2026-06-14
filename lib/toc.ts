import GithubSlugger from "github-slugger";

export type Heading = { id: string; text: string; depth: 2 | 3 };

/** Strip inline markdown so heading text matches what rehype-slug slugs on. */
function stripInline(s: string): string {
  return s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/~~(.*?)~~/g, "$2") // strikethrough
    .replace(/\s+#+\s*$/, "") // trailing ATX closers
    .trim();
}

/**
 * Extract `##`/`###` headings from a markdown body, in document order, for a
 * table of contents. IDs are generated with github-slugger, the same library
 * rehype-slug uses, so the resulting `#id`s match the rendered heading IDs.
 * Fenced code blocks are skipped so `#` inside code isn't mistaken for a heading.
 */
export function getHeadings(markdown: string): Heading[] {
  if (!markdown) return [];
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*\S)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    const text = stripInline(m[2]);
    if (!text) continue;
    out.push({ depth, text, id: slugger.slug(text) });
  }

  return out;
}
