import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
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
