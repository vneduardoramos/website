import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { theme } from "@/config/theme";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${theme.brand.name}: Data & AI, Snowflake Partner`;

const COPY = {
  en: { eyebrow: "Data & AI · Snowflake Partner", title: theme.brand.tagline },
  es: {
    eyebrow: "Data & AI · Snowflake Partner",
    title: "Datos e IA en producción, sobre Snowflake.",
  },
} as const;

export default function Image({ params }: { params: { locale: string } }) {
  const copy = COPY[params.locale as keyof typeof COPY] ?? COPY.en;
  return renderOg(copy);
}
