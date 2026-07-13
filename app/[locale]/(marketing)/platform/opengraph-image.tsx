import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear: the Snowflake-native stack";

export default function Image() {
  return renderOg({ eyebrow: "Platform", title: "The Snowflake-native stack" });
}
