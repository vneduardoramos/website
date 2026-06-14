import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getIndustryBySlug } from "@/lib/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear industry";

export default async function Image({ params }: { params: { slug: string } }) {
  const industry = await getIndustryBySlug(params.slug).catch(() => null);
  return renderOg({
    eyebrow: "Industries",
    title: industry ? `${industry.name}: data & AI on Snowflake` : "Industries",
  });
}
