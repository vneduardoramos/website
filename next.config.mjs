import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Allow next/image to optimize images served from the object-storage public
// host (Cloudflare R2 / S3). Derived from NEXT_PUBLIC_S3_PUBLIC_URL (falling
// back to S3_PUBLIC_URL) so there's a single source of truth. Set it to the
// bucket's public base URL, e.g. https://pub-xxxx.r2.dev or a custom domain
// like https://cdn.viewnear.com.
// NOTE: read at build time, so the env var must be set in the build env.
const mediaPublicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? process.env.S3_PUBLIC_URL;
const remotePatterns = [];
if (mediaPublicUrl) {
  try {
    const { protocol, hostname } = new URL(mediaPublicUrl);
    remotePatterns.push({ protocol: protocol.replace(":", ""), hostname, pathname: "/**" });
  } catch {
    // Malformed public media URL: leave remote images disallowed rather than crash the build.
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
  // Baseline security headers on every response. Enterprise security reviews
  // check for these. A strict, nonce-based CSP is deliberately deferred (it
  // would break next/script + GA without careful work); everything below is
  // safe to apply globally today.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
          },
        ],
      },
    ];
  },

  // IA consolidation: pages merged into richer ones. Preserve old links/SEO.
  async redirects() {
    return [
      // Note: /careers deliberately has NO rule here. It used to redirect to
      // /life-at-viewnear because there was no careers hub; there is one now
      // (app/[locale]/(marketing)/careers/page.tsx) so the URL serves real
      // content. That old rule was a 301, so clients which cached it will keep
      // redirecting until their cache expires.
      { source: "/solutions", destination: "/services", permanent: true },
      { source: "/team", destination: "/about", permanent: true },
      { source: "/why-viewnear", destination: "/partnership", permanent: true },
      { source: "/videos", destination: "/resources", permanent: true },
      { source: "/learning", destination: "/resources", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
