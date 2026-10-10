/**
 * Split Bill Page — Server Component wrapper
 *
 * Exports metadata specific to the split-bill flow so Google can:
 * - Show the correct title/description in search results
 * - Crawl a unique canonical URL for this feature page
 *
 * All interactive UI is in SplitBillClientPage (Client Component).
 */

import type { Metadata } from "next";
import SplitBillClientPage from "./SplitBillClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";

export const metadata: Metadata = {
  title: "Split Bill Online Gratis — Kalkulator Bagi Tagihan Tanpa Aplikasi",
  description:
    "Kalkulator split bill online gratis, tanpa install aplikasi. Scan struk pakai AI, atur pajak & service charge otomatis, langsung tahu siapa bayar berapa. 100% gratis!",
  keywords: [
    "split bill online",
    "split bill online gratis",
    "split bill online free",
    "split bill online scan",
    "split bill online calculator",
    "kalkulator split bill online",
    "split bill tanpa aplikasi",
    "cara split bill",
    "bagi tagihan otomatis",
    "hitung patungan",
    "scan struk split bill",
    "aplikasi bagi tagihan gratis",
    "split bill dengan AI",
  ],
  alternates: {
    canonical: "https://www.splitbill.my.id/split-bill",
  },
  openGraph: {
    title: "Split Bill Online Gratis — Kalkulator Bagi Tagihan Tanpa Aplikasi",
    description:
      "Mulai split bill online gratis! Scan struk, input pengeluaran, dan dapatkan rincian pembayaran otomatis. Cepat & 100% free.",
    url: "https://www.splitbill.my.id/split-bill",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/feature-splitbill-scan.png",
        width: 1200,
        height: 630,
        alt: "Split Bill dengan AI Scan Struk",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function SplitBillPage() {
  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.splitbill.my.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Split Bill",
        item: "https://www.splitbill.my.id/split-bill",
      },
    ],
  };

  // Tool schema — no aggregateRating (would need real review data)
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Split Bill Online",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://www.splitbill.my.id/split-bill",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      {/* SEO explainer first in the DOM (crawlers see H1 + intro before the
          client-only tool), shown visually below the tool via order-*. */}
      <div className="flex flex-col">
        <FeatureSeoSection {...featureSeoContent.splitBill} className="order-2" />
        <div className="order-1">
          <SplitBillClientPage />
        </div>
      </div>
    </>
  );
}
