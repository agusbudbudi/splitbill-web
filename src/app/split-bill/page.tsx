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
  title: "Split Bill Online — Bagi Tagihan Otomatis dengan AI Scan",
  description:
    "Mulai split bill online gratis sekarang! Tambah teman, scan atau input pengeluaran, dan dapatkan rincian siapa bayar berapa secara otomatis. Cepat, akurat & 100% free.",
  keywords: [
    "split bill online",
    "cara split bill",
    "bagi tagihan otomatis",
    "hitung patungan",
    "scan struk split bill",
    "aplikasi bagi tagihan gratis",
    "split bill dengan AI",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/split-bill",
  },
  openGraph: {
    title: "Split Bill Online — Bagi Tagihan Otomatis dengan AI Scan",
    description:
      "Mulai split bill online gratis! Scan struk, input pengeluaran, dan dapatkan rincian pembayaran otomatis. Cepat & 100% free.",
    url: "https://splitbill.my.id/split-bill",
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
  return <SplitBillClientPage />;
}
