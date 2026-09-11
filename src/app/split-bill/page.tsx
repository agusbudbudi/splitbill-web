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
import { faqData } from "@/data/faqData";

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

  // Reuse the same FAQ content bank as the homepage, scoped to split-bill
  // questions, so this page earns its own FAQ rich-result eligibility.
  const splitBillFaqs = faqData.filter((item) => item.category === "split-bill");
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: splitBillFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Visually hidden H1 — client page starts straight into the wizard UI,
          so the page had no top-level heading for Google to key off. */}
      <h1 className="sr-only">
        Split Bill Online Gratis — Kalkulator Bagi Tagihan Tanpa Aplikasi
      </h1>
      <SplitBillClientPage />
      {/* Visible FAQ backing faqSchema above — structured data must mirror
          on-page content, or Google won't grant (or may distrust) the
          FAQ rich result. Native <details> needs no client JS. */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          Pertanyaan Seputar Split Bill Online
        </h2>
        <div className="space-y-3">
          {splitBillFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-white border border-slate-100 rounded-md px-6 py-4 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.02)]"
            >
              <summary className="cursor-pointer font-bold text-slate-800 marker:content-none list-none flex items-center justify-between">
                {faq.question}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed mt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
