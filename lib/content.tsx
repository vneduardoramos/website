import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hProperties?: Record<string, unknown> };
};

/**
 * Turn blockquotes that open with a GitHub-style marker
 * (`> [!NOTE]` / `[!TIP]` / `[!WARNING]` / `[!IMPORTANT]`) into callout boxes by
 * stripping the marker and tagging the node with `data-callout` (styled in CSS).
 * Plain blockquotes are left alone and render as pull-quotes.
 */
function remarkCallouts() {
  return (tree: MdNode) => {
    const walk = (node: MdNode) => {
      if (node.type === "blockquote") {
        const para = node.children?.[0];
        const first = para?.children?.[0];
        if (
          para?.type === "paragraph" &&
          first?.type === "text" &&
          typeof first.value === "string"
        ) {
          const m = first.value.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/i);
          if (m) {
            first.value = first.value.slice(m[0].length);
            node.data = node.data ?? {};
            node.data.hProperties = {
              ...(node.data.hProperties ?? {}),
              "data-callout": m[1].toLowerCase(),
            };
          }
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

/**
 * An image whose source is an .mp4 renders as a player instead, so a post can
 * carry a clip without raw HTML in the markdown (rehype-raw is deliberately
 * not enabled):
 *
 *     ![what the clip shows](/assets/video/clip.mp4 "/assets/images/poster.jpg")
 *
 * The markdown title, where present, is the poster frame. Only metadata
 * preloads, so the file costs a reader nothing until they press play.
 */
function MarkdownMedia({
  src,
  alt,
  title,
}: {
  src?: string;
  alt?: string;
  title?: string;
}) {
  if (src && src.toLowerCase().endsWith(".mp4")) {
    return (
      <video
        src={src}
        poster={title || undefined}
        controls
        playsInline
        preload="metadata"
        aria-label={alt || undefined}
        className="my-6 w-full rounded-xl border border-border"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} title={title} />;
}

/**
 * Renders markdown body content with Viewnear prose styling. Headings get stable
 * IDs (rehype-slug) so the table of contents can link to them; blockquotes with
 * a `[!TYPE]` marker become callouts. Styling lives in `.prose-vn` (globals.css).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-vn">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCallouts]}
        rehypePlugins={[rehypeSlug]}
        components={{ img: MarkdownMedia }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
