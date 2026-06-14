import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear solutions";

export default function Image() {
  return renderOg({ eyebrow: "Solutions", title: "Outcomes, delivered native" });
}
