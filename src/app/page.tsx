import type { Metadata } from "next";
import { HomepagePageClient } from "@/components/homepage/HomepagePageClient";

export const metadata: Metadata = {
  title: "Split Bill Online - Aplikasi Bagi Tagihan & Patungan Gratis",
  description:
    "Split bill online gratis! Scan struk, hitung pajak otomatis, dan bagi tagihan praktis bareng teman. Aplikasi patungan terbaik yang 100% free, cepat & akurat.",
  keywords: [
    "split bill",
    "splitbill",
    "split bill online",
    "splitbill online",
    "split bill online free",
    "split bill online photo",
    "split bill online scan",
    "splitbill app",
    "split bill app",
    "split bill free",
    "split bill online with tax",
    "aplikasi bagi tagihan",
    "aplikasi split bill",
    "aplikasi patungan",
    "patungan online",
    "scan struk online",
    "cara split bill",
    "bagi tagihan restoran",
    "hitung patungan otomatis",
    "blu split bill",
    "split bill online calculator",
    "split bill whatsapp",
    "alternatif split bill bonapp",
    "alternatif chatgpt split bill",
    "split bill photo",
    "cara hitung split bill manual",
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

export default function HomepagePage() {
  return <HomepagePageClient />;
}
