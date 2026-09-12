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
      {/* Visually hidden H1 — client page starts straight into the wizard UI,
          so the page had no top-level heading for Google to key off. */}
      <h1 className="sr-only">
        Split Bill Online Gratis — Kalkulator Bagi Tagihan Tanpa Aplikasi
      </h1>
      <SplitBillClientPage />
    </>
  );
}
