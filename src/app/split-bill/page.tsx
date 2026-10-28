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
import { getFaqs, resolveFaqs } from "@/lib/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, jsonLdGraph, webApplicationNode } from "@/lib/structuredData";

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

export default async function SplitBillPage() {
  const faqs = resolveFaqs(await getFaqs(), featureSeoContent.splitBill.faqs);
  const jsonLd = jsonLdGraph(
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Split Bill", path: "/split-bill" },
    ]),
    webApplicationNode({
      name: "SplitBill Split Bill",
      path: "/split-bill",
      description:
        "Kalkulator split bill online gratis: scan struk dengan AI, hitung pajak dan service charge otomatis, lalu bagikan rincian tagihan ke WhatsApp.",
    }),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* SEO explainer first in the DOM (crawlers see H1 + intro before the
          client-only tool), shown visually below the tool via order-*. */}
      <div className="flex flex-col">
        <FeatureSeoSection {...featureSeoContent.splitBill} faqs={faqs} className="order-2" />
        <div className="order-1">
          <SplitBillClientPage />
        </div>
      </div>
    </>
  );
}
