import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getCaseStudyBySlug } from "@/lib/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear case study";

export default async function Image({ params }: { params: { slug: string } }) {
  const cs = await getCaseStudyBySlug(params.slug).catch(() => null);
  return renderOg({ eyebrow: cs?.sector ?? "Case study", title: cs?.title ?? "Case study" });
}
