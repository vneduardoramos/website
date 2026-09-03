/**
 * Brand marks for products named in a case study's `stack`.
 *
 * A stack entry that matches a key here renders as the product's own logo; every
 * other entry renders as a text chip. That keeps the data one plain list of
 * names in the seed, and means adding a logo later is a line here rather than a
 * content migration.
 *
 * The Claude assets were supplied by the customer engagement as brand stills.
 * The background was keyed out and, on the Claude Code lockup, the cream
 * asterisk recolored to the same clay used in the light-background Claude mark,
 * so both read on this site's light surfaces. Both are normalized so the
 * "Claude" wordmark is optically the same size (64px cap on a shared 160px
 * canvas), which is why a single `h-7 w-auto` renders them at matching weight
 * despite one being a horizontal lockup and the other stacked.
 */
export type ProductLogo = { src: string; alt: string; w: number; h: number };

export const PRODUCT_LOGOS: Record<string, ProductLogo> = {
  "Claude Code": {
    src: "/assets/images/products/claude-code.png",
    alt: "Claude Code",
    w: 579,
    h: 160,
  },
  "Claude for Teams": {
    src: "/assets/images/products/claude-for-teams.png",
    alt: "Claude for Teams",
    w: 367,
    h: 160,
  },
};

export function productLogo(name: string): ProductLogo | null {
  return PRODUCT_LOGOS[name] ?? null;
}
