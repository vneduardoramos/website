import { ImageResponse } from "next/og";
import { theme } from "@/config/theme";

/**
 * Shared Open Graph image renderer (1200×630) used by the root and per-segment
 * `opengraph-image.tsx` routes. Branded, text-only (no external fonts/assets)
 * so it renders fast and never fails on a missing file.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOg({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #F6FAFD 0%, #EAF4FB 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* top accent bar */}
        <div style={{ display: "flex", width: "120px", height: "8px", background: "#29B5E8", borderRadius: "4px" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#0B6E99",
                marginBottom: "24px",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#0F2530",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: "30px", fontWeight: 700, color: "#0F2530" }}>
          <span style={{ display: "flex", width: "18px", height: "18px", background: "#FFA000", borderRadius: "50%", marginRight: "14px" }} />
          {theme.brand.name.toLowerCase()}
          <span style={{ color: "#5C7385", fontWeight: 500, marginLeft: "12px" }}>| data + ai</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
