import type { Heading } from "@/lib/toc";
import { TableOfContents } from "./TableOfContents";

/**
 * Two-column reading layout shared by blog and news: prose at a readable width
 * with a sticky table of contents alongside it on desktop. For short articles
 * (< 2 headings) it falls back to a single centered column (no TOC).
 *
 * The wrapper carries `id="article-body"` so <ReadingProgress> can track it.
 */
export function ArticleBody({
  headings,
  children,
}: {
  headings: Heading[];
  children: React.ReactNode;
}) {
  if (headings.length < 2) {
    return (
      <div id="article-body" className="mx-auto max-w-3xl">
        {children}
      </div>
    );
  }

  return (
    <div
      id="article-body"
      className="lg:grid lg:grid-cols-[minmax(0,720px)_15rem] lg:justify-center lg:gap-14"
    >
      {/* DOM order: TOC first so it sits on top on mobile; placed in the right
          column on desktop via explicit grid positioning. */}
      <aside className="lg:col-start-2 lg:row-start-1">
        <TableOfContents headings={headings} />
      </aside>
      <div className="max-w-3xl lg:col-start-1 lg:row-start-1">{children}</div>
    </div>
  );
}
