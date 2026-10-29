import type { NextConfig } from "next";
import { LEGACY_CATEGORY_SLUGS, LEGACY_TAG_SLUGS } from "./src/lib/blogLegacyRedirects";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    extendDefaultRuntimeCaching: true,
    runtimeCaching: [
      {
        // Manifest must never be served stale/errored from cache — a bad
        // response (e.g. transient 403) would otherwise get cached and
        // keep breaking PWA install/update checks indefinitely.
        urlPattern: /\/manifest\.webmanifest$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "manifest",
          cacheableResponse: {
            statuses: [200],
          },
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 3600,
          },
        },
      },
    ],
  },
});

// Private (login-only) areas. robots.txt blocks crawling, but a robots block
// doesn't drop an already-known URL from the index, so send noindex too.
const NOINDEX_PATHS = ["/wallet", "/history", "/member"];

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return NOINDEX_PATHS.flatMap((path) => [path, `${path}/:path*`]).map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  async redirects() {
    return [
      ...Object.entries(LEGACY_TAG_SLUGS).map(([slug, next]) => ({
        source: `/blog/tag/${slug}`,
        destination: next ? `/blog/tag/${next}` : "/blog",
        permanent: true,
      })),
      ...Object.entries(LEGACY_CATEGORY_SLUGS).map(([slug, next]) => ({
        source: `/blog/category/${slug}`,
        destination: `/blog/category/${next}`,
        permanent: true,
      })),
    ];
  },
  // Enable Gzip/Brotli compression for CSS and JS — reduces 26KB CSS to ~6-8KB
  compress: true,
  images: {
    // Serve modern formats — AVIF/WebP significantly smaller than PNG/JPG
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 30 days (default is 60s)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Device sizes tuned for mobile-first
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "splitbill.my.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.splitbill.my.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "splitbillonline.netlify.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);
