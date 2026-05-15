/**
 * Homepage — Server Component
 *
 * Exports page-level metadata so Next.js App Router renders proper
 * <title>, <meta description>, Open Graph, and canonical tags.
 *
 * All UI logic lives in HomePageClient (Client Component) which is still
 * SSR'd on the first request — the key difference is that its sub-components
 * no longer use `ssr: false`, so Googlebot sees the full HTML.
 */

import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Split Bill Online - Aplikasi Bagi Tagihan & Patungan Gratis",
  description:
    "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman. Aplikasi patungan terbaik yang 100% free, cepat & akurat.",
  keywords: [
    "split bill online",
    "split bill online free",
    "split bill online photo",
    "split bill online scan",
    "splitbill app",
    "split bill free",
    "split bill online with tax",
    "aplikasi bagi tagihan",
    "patungan online",
    "scan struk online",
    "cara split bill",
    "bagi tagihan restoran",
    "hitung patungan otomatis",
  ],
  authors: [{ name: "SplitBill Team" }],
  openGraph: {
    title: "Split Bill App - Bagi Tagihan Lebih Mudah",
    description:
      "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman. 100% free!",
    url: "https://splitbill.my.id",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/pwa-banner.png",
        width: 1200,
        height: 630,
        alt: "Split Bill App — Aplikasi Bagi Tagihan Online Gratis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split Bill Online - Gratis & Mudah",
    description:
      "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman.",
    images: ["/img/pwa-banner.png"],
  },
  alternates: {
    canonical: "https://splitbill.my.id",
  },
};

// Structured data schemas — injected via HomePageClient for flexibility,
// but defined here so they're co-located with the page.
export default function Home() {
  return <HomePageClient />;
}
