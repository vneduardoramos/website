import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { theme } from "@/config/theme";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${theme.brand.name}: Data & AI, Snowflake Partner`;

export default function Image() {
  return renderOg({
    eyebrow: "Data & AI · Snowflake Partner",
    title: theme.brand.tagline,
  });
}
