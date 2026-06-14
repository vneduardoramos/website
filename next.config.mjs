/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local placeholder assets only; no remote hotlinking of source site.
    remotePatterns: [],
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
