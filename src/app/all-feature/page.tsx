/**
 * "Semua Fitur" Page (Server Component)
 *
 * Direktori semua fitur SplitBill, dibangun dari section reusable
 * src/components/cara-pakai/ (sama kayak halaman "/[fitur]/cara-pakai"):
 * hero, grid fitur, overview, dan banner.
 */

import { PromoBanner } from "@/components/ui/PromoBanner";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import {
  Camera,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import {
  CaraPakaiHero,
  CaraPakaiOverview,
  CaraPakaiFeatureGrid,
  type OverviewPoint,
  type FeatureGridItem,
} from "@/components/cara-pakai";

const PAGE_URL = "https://www.splitbill.my.id/all-feature";
const OG_IMAGE = "/img/cara-pakai/split-bill/hero-split-bill-cara-pakai-new.png";

export const metadata: Metadata = buildMetadata({
  title: "Semua Fitur SplitBill: Split Bill, Split Later, Invoice & Lainnya",
  description: "Jelajahi semua fitur SplitBill: Split Bill dengan AI Scan, Split Later untuk patungan trip, Invoice, Shared Goals, Collect Money, dan Wallet. Gratis & tanpa install.",
  path: "/all-feature",
  socialTitle: "Semua Fitur SplitBill: Satu Tempat Buat Kelola Duit Bareng",
  socialDescription: "Split Bill, Split Later, Invoice, Shared Goals, Collect Money, dan Wallet. Semua fitur SplitBill dalam satu halaman.",
  image: {
    url: OG_IMAGE,
    width: 1920,
    height: 900,
    alt: "Semua fitur SplitBill",
  },
});

const overviewPoints: OverviewPoint[] = [
  {
    icon: LayoutGrid,
    title: "Satu aplikasi, banyak fitur",
    description: "Dari bagi tagihan, patungan, nabung bareng, sampai kirim invoice, semua ada di satu tempat.",
  },
  {
    icon: Camera,
    title: "Dibantu AI",
    description: "Foto struk dan item & harga langsung kedetect, gak perlu ketik manual satu-satu.",
  },
  {
    icon: ShieldCheck,
    title: "Gratis & tanpa install",
    description: "Langsung pakai dari browser. Login cuma dibutuhin buat fitur yang nyimpen data kamu.",
  },
];

const features: FeatureGridItem[] = [
  {
    id: "split-bill",
    title: "Split Bill",
    description: "Foto struk biar AI hitung otomatis, atau bagi rincian secara manual. Sat-set!",
    image: "/img/menu-split-bill.png",
    href: "/split-bill",
    ctaText: "Coba Split Bill",
    caraPakaiHref: "/split-bill/cara-pakai",
    badge: "Populer",
  },
  {
    id: "split-later",
    title: "Split Later",
    description: "Nongkrong sepuasnya, kumpulin struknya, bagi tagihannya nanti pas santai.",
    image: "/img/menu-split-later.png",
    href: "/split-later",
    ctaText: "Coba Split Later",
    caraPakaiHref: "/split-later/cara-pakai",
    badge: "Baru",
    requiresLogin: true,
  },
  {
    id: "invoice",
    title: "Invoice",
    description: "Kirim rincian tagihan digital yang rapi dan transparan, langsung ke WhatsApp.",
    image: "/img/menu-invoice.png",
    href: "/invoice",
    ctaText: "Buat Invoice",
    caraPakaiHref: "/invoice/cara-pakai",
    badge: "Populer",
  },
  {
    id: "shared-goals",
    title: "Shared Goals",
    description: "Nabung bareng squad buat liburan, kado nikahan teman, atau impian bersama.",
    image: "/img/menu-shared-goal.png",
    href: "/shared-goals",
    ctaText: "Mulai Nabung",
    caraPakaiHref: "/shared-goals/cara-pakai",
  },
  {
    id: "collect-money",
    title: "Collect Money (Patungan)",
    description: "Bikin patungan uang kas, sewa lapangan futsal, atau donasi secara transparan.",
    image: "/img/menu-collect-money.png",
    href: "/collect-money",
    ctaText: "Bikin Patungan",
    caraPakaiHref: "/collect-money/cara-pakai",
  },
  {
    id: "wallet",
    title: "Wallet",
    description: "Simpan rekening bank dan e-wallet kamu biar gampang dibagi ke teman.",
    image: "/img/menu-wallet.png",
    href: "/wallet",
    ctaText: "Simpan Wallet",
    requiresLogin: true,
  },
];

export default function AllFeaturePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Semua Fitur", item: PAGE_URL },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Semua Fitur SplitBill",
    itemListElement: features.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `https://www.splitbill.my.id${item.href}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="min-h-screen bg-white">
        <HomepageNavbar ctaHref="/split-bill" />

        <main>
          <section className="pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4.5rem+env(safe-area-inset-top))] bg-white">
            <h1 className="sr-only">Semua Fitur SplitBill</h1>
            <CaraPakaiHero
              feature="all-feature"
              imageSrc={OG_IMAGE}
              imageAlt="Tampilan aplikasi SplitBill"
              titleLine1="Semua Fitur SplitBill,"
              titleHighlight="Satu Tempat!"
              description="Bagi tagihan, patungan, nabung bareng, sampai kirim invoice. Pilih yang kamu butuhin."
              ctaText="Mulai Split Bill"
              ctaHref="/split-bill"
            />
          </section>

          <CaraPakaiFeatureGrid
            feature="all-feature"
            titlePrefix="Pilih Fitur yang"
            titleHighlight="Kamu Butuhin"
            description="Tiap fitur punya cara pakai sendiri. Klik Cara Pakai buat panduan lengkapnya."
            features={features}
          />

          <section className="bg-white pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PromoBanner href="/split-bill-liburan" />
            </div>
          </section>

          <CaraPakaiOverview
            titlePrefix="Kenapa pakai"
            titleHighlight="SplitBill?"
            description="Kelola duit bareng teman jadi gampang, adil, dan tanpa drama."
            points={overviewPoints}
          />

          <section className="pb-16 sm:pb-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-md overflow-hidden">
                <Image
                  src="/img/banner-all-feature.png"
                  alt="Semua Fitur Banner"
                  width={1080}
                  height={339}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>
        </main>

        <HomepageFooter />
      </div>
    </>
  );
}
