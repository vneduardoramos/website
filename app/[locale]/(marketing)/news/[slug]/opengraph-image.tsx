import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getNewsBySlug } from "@/lib/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear news & events";

export default async function Image({ params }: { params: { slug: string } }) {
  const item = await getNewsBySlug(params.slug).catch(() => null);
  return renderOg({ eyebrow: item?.kind ?? "News", title: item?.title ?? "News & events" });
}
