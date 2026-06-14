import type { MetadataRoute } from "next";
import { theme } from "@/config/theme";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${theme.brand.url}/sitemap.xml`,
  };
}
