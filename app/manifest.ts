import type { MetadataRoute } from "next";
import { theme } from "@/config/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${theme.brand.name}: Data & AI Practices`,
    short_name: theme.brand.name,
    description: theme.brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#29B5E8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Padded safe-zone variant so Android adaptive masks don't clip the mark.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
