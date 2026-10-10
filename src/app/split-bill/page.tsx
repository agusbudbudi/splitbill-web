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
import { buildMetadata } from "@/lib/seo";
import SplitBillClientPage from "./SplitBillClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";

export const metadata: Metadata = buildMetadata({
  title: "Split Bill Online Gratis: Kalkulator Bagi Tagihan Tanpa Aplikasi",
  description: "Kalkulator split bill online gratis, tanpa install aplikasi. Scan struk pakai AI, atur pajak & service charge otomatis, langsung tahu siapa bayar berapa.",
  path: "/split-bill",
  socialDescription: "Mulai split bill online gratis! Scan struk, input pengeluaran, dan dapatkan rincian pembayaran otomatis. Cepat dan tanpa install.",
  image: {
    url: "/img/cara-pakai/split-bill/hero-split-bill-cara-pakai-new.png",
    width: 1920,
    height: 900,
    alt: "Split bill dengan AI scan struk di SplitBill",
  },
});

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
