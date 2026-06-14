import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getBlogPostBySlug } from "@/lib/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear blog post";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug).catch(() => null);
  return renderOg({ eyebrow: "Blog", title: post?.title ?? "Field notes" });
}
