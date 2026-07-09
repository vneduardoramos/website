import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear, Snowflake partnership";

export default function Image() {
  return renderOg({ eyebrow: "Partnership", title: "A Snowflake Premier Partner" });
}
