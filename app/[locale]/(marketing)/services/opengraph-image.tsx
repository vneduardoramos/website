import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear services";

export default function Image() {
  return renderOg({ eyebrow: "Services", title: "THINK · BUILD · GROW" });
}
