import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Viewnear, Snowflake partnership";

const COPY = {
  en: { eyebrow: "Partnership", title: "A Snowflake Premier Partner" },
  es: { eyebrow: "Alianza", title: "Snowflake Premier Partner" },
} as const;

export default function Image({ params }: { params: { locale: string } }) {
  const copy = COPY[params.locale as keyof typeof COPY] ?? COPY.en;
  return renderOg(copy);
}
