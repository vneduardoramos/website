// Allow next/image to optimize images served from the object-storage public
// host (Cloudflare R2 / S3). Derived from S3_PUBLIC_URL so there's a single
// source of truth — set it to the bucket's public base URL, e.g.
// https://pub-xxxx.r2.dev or a custom domain like https://cdn.viewnear.com.
// NOTE: read at build time, so S3_PUBLIC_URL must be set in the build env.
const remotePatterns = [];
if (process.env.S3_PUBLIC_URL) {
  try {
    const { protocol, hostname } = new URL(process.env.S3_PUBLIC_URL);
    remotePatterns.push({ protocol: protocol.replace(":", ""), hostname, pathname: "/**" });
  } catch {
    // Malformed S3_PUBLIC_URL: leave remote images disallowed rather than crash the build.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local placeholder assets plus the configured object-storage host (if any).
    remotePatterns,
  },
  eslint: {
    // Lint is clean; enforce it in production builds.
    ignoreDuringBuilds: false,
  },
  // IA consolidation: pages merged into richer ones. Preserve old links/SEO.
  async redirects() {
    return [
      { source: "/careers", destination: "/life-at-viewnear", permanent: true },
      { source: "/team", destination: "/about", permanent: true },
      { source: "/why-viewnear", destination: "/partnership", permanent: true },
      { source: "/videos", destination: "/resources", permanent: true },
      { source: "/learning", destination: "/resources", permanent: true },
    ];
  },
};

export default nextConfig;
