/**
 * Split Bill "Cara Pakai" Page (Server Component)
 *
 * Halaman edukasi fitur Split Bill: overview, killer feature highlight, dan
 * cara pakai step-by-step. Section-section-nya reusable, lihat
 * src/components/cara-pakai/ — dipakai bareng di semua halaman
 * "/[fitur]/cara-pakai" (mis. /shared-goals/cara-pakai), cuma beda konten.
 * Semua section di-render sebagai Server Component biar crawler dapat
 * konten penuh; interaktivitas (CTA click tracking, step slider) diisolasi
 * ke client island kecil di dalam komponen shared tsb.
 */

import type { Metadata } from "next";
import {
  Users2,
  Calculator,
  ShieldCheck,
  Camera,
  Receipt,
  Share2,
  Users,
  MessageCircle,
  CheckCircle2,
  UserPlus,
  ListChecks,
  Wallet,
} from "lucide-react";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import {
  CaraPakaiHero,
  CaraPakaiOverview,
  CaraPakaiKillerFeatures,
  CaraPakaiStepsSection,
  type OverviewPoint,
  type KillerFeature,
  type CaraPakaiStep,
} from "@/components/cara-pakai";
import { faqData } from "@/data/faqData";
import { FAQSectionHomepage } from "@/components/homepage/FAQSectionHomepage";

const PAGE_URL = "https://www.splitbill.my.id/split-bill/cara-pakai";
const OG_IMAGE = "/img/cara-pakai/split-bill/hero-split-bill-cara-pakai-new.png";

export const metadata: Metadata = {
  title: "Cara Pakai Split Bill: Panduan Lengkap Bagi Tagihan | SplitBill",
  description:
    "Panduan lengkap cara pakai fitur Split Bill: tambah teman, scan struk pakai AI, assign item, atur pajak, sampai share hasil ke WhatsApp. Gratis & tanpa login.",
  keywords: [
    "cara pakai split bill",
    "cara split bill online",
    "tutorial split bill",
    "panduan split bill",
    "cara bagi tagihan online",
    "cara scan struk split bill",
    "cara hitung patungan",
    "cara split bill dengan AI",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cara Pakai Split Bill: Panduan Lengkap Bagi Tagihan",
    description:
      "Tambah teman, scan struk, assign item, atur pajak, lalu share ke WhatsApp. Semua langkah split bill dijelaskan lengkap di sini.",
    url: PAGE_URL,
    siteName: "Split Bill App",
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 900,
        alt: "Cara pakai Split Bill, scan struk lalu bagi tagihan otomatis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cara Pakai Split Bill: Panduan Lengkap Bagi Tagihan",
    description:
      "Tambah teman, scan struk, assign item, atur pajak, lalu share ke WhatsApp. Semua langkah split bill dijelaskan lengkap di sini.",
    images: [OG_IMAGE],
  },
};

const splitBillFaqs = faqData.filter((item) => item.category === "split-bill");

const overviewPoints: OverviewPoint[] = [
  {
    icon: Users2,
    title: "Buat siapa aja",
    description: "Patungan makan bareng temen, urunan kado, sampai nginep bareng, semua bisa di-split di sini.",
  },
  {
    icon: Calculator,
    title: "Gak perlu hitung manual",
    description: "Cukup masukin siapa pesan apa, sisanya dihitung otomatis, termasuk pajak dan service charge.",
  },
  {
    icon: ShieldCheck,
    title: "Gratis & tanpa login",
    description: "Langsung pakai dari browser, tanpa install aplikasi. Login opsional kalau mau simpan riwayat.",
  },
];

const killerFeatureIconClass = "w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0";

const killerFeatures: KillerFeature[] = [
  {
    icon: <Camera className={killerFeatureIconClass} />,
    title: "AI Scan Struk",
    description: "Foto struk, item & harga auto-kedetect. Gak perlu ketik manual satu-satu.",
    image: "/img/cara-pakai/split-bill/ai-scan-struk.png",
  },
  {
    icon: <Receipt className={killerFeatureIconClass} />,
    title: "Auto-baca Pajak & Service Charge",
    description: "Pajak & service charge di struk otomatis kedetect dan dibagi rata atau proporsional.",
    image: "/img/cara-pakai/split-bill/tax.png",
  },
  {
    icon: <Share2 className={killerFeatureIconClass} />,
    title: "Share ke WhatsApp",
    description: "Hasil split langsung dibagi ke grup WA dalam bentuk gambar, tinggal kirim.",
    image: "/img/cara-pakai/split-bill/share.png",
  },
  {
    icon: <Users className={killerFeatureIconClass} />,
    title: "Settlement Pairwise & Per-Transaksi",
    description: "Lihat siapa-bayar-siapa ringkas per-pasangan, atau rincian lengkap per-transaksi.",
    image: "/img/cara-pakai/split-bill/settlement.png",
    isNew: true,
  },
  {
    icon: <MessageCircle className={killerFeatureIconClass} />,
    title: "Chat Bareng Agent Billy",
    description: "Bingung mulai dari mana? Tinggal chat, Agent Billy pandu dari tambah teman sampai selesai.",
    image: "/img/cara-pakai/split-bill/agent-billy.png",
    isNew: true,
  },
  {
    icon: <CheckCircle2 className={killerFeatureIconClass} />,
    title: "Auto-track Pembayaran",
    description: "Sekali klik dari hasil settlement, langsung jadi tracker Collect Money buat pantau siapa udah bayar.",
    image: "/img/cara-pakai/split-bill/Auto-track.png",
  },
];

const stepIconClass = "h-5 w-5 text-primary";

const steps: CaraPakaiStep[] = [
  {
    number: "1",
    icon: <UserPlus className={stepIconClass} />,
    title: "Tambah Teman",
    description: "Masukin nama orang-orang yang ikut patungan.",
    image: "/img/cara-pakai/split-bill/1.png",
  },
  {
    number: "2",
    icon: <Camera className={stepIconClass} />,
    title: "Scan Struk",
    description: "Foto struknya, AI otomatis deteksi item & harga.",
    image: "/img/cara-pakai/split-bill/2.png",
  },
  {
    number: "3",
    icon: <ListChecks className={stepIconClass} />,
    title: "Assign Item",
    description: "Tandai tiap item punya siapa, per orang atau dibagi rata.",
    image: "/img/cara-pakai/split-bill/3.png",
  },
  {
    number: "4",
    icon: <Receipt className={stepIconClass} />,
    title: "Tambah Pajak & Service Charge",
    description: "Atur pajak/service charge, bagi rata atau proporsional.",
    image: "/img/cara-pakai/split-bill/4.png",
  },
  {
    number: "5",
    icon: <Wallet className={stepIconClass} />,
    title: "Nama Aktivitas & Metode Bayar",
    description: "Isi nama kegiatan, pilih bank/e-wallet tujuan transfer.",
    image: "/img/cara-pakai/split-bill/5.png",
  },
  {
    number: "6",
    icon: <Share2 className={stepIconClass} />,
    title: "Lihat Ringkasan & Share",
    description: "Cek siapa-bayar-siapa, lalu share hasilnya ke WhatsApp.",
    image: "/img/cara-pakai/split-bill/6.png",
  },
];

export default function SplitBillCaraPakaiPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Split Bill", item: "https://www.splitbill.my.id/split-bill" },
      { "@type": "ListItem", position: 3, name: "Cara Pakai", item: PAGE_URL },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Pakai Split Bill",
    description:
      "Panduan lengkap bagi tagihan pakai fitur Split Bill, dari tambah teman sampai share hasil ke WhatsApp.",
    image: `https://www.splitbill.my.id${OG_IMAGE}`,
    totalTime: "PT5M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Tambah Teman", text: "Masukin nama orang-orang yang ikut patungan." },
      { "@type": "HowToStep", position: 2, name: "Scan Struk", text: "Foto struknya, AI otomatis deteksi item & harga." },
      { "@type": "HowToStep", position: 3, name: "Assign Item", text: "Tandai tiap item punya siapa, per orang atau dibagi rata." },
      { "@type": "HowToStep", position: 4, name: "Tambah Pajak & Service Charge", text: "Atur pajak/service charge, bagi rata atau proporsional." },
      { "@type": "HowToStep", position: 5, name: "Nama Aktivitas & Metode Bayar", text: "Isi nama kegiatan, pilih bank/e-wallet tujuan transfer." },
      { "@type": "HowToStep", position: 6, name: "Lihat Ringkasan & Share", text: "Cek siapa-bayar-siapa, lalu share hasilnya ke WhatsApp." },
    ],
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Split Bill Online",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://www.splitbill.my.id/split-bill",
    description:
      "Kalkulator split bill online gratis, scan struk pakai AI, atur pajak & service charge otomatis, langsung tahu siapa bayar berapa.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      <div className="min-h-screen bg-white">
        <HomepageNavbar ctaHref="/split-bill" />

        <main>
          <section className="pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4.5rem+env(safe-area-inset-top))] bg-white">
            <h1 className="sr-only">Cara Pakai Split Bill</h1>
            <CaraPakaiHero
              feature="split-bill"
              imageSrc={OG_IMAGE}
              imageAlt="Tampilan aplikasi Split Bill"
              titleLine1="Split Bill Jadi Gampang,"
              titleHighlight="Tinggal Scan Struk!"
              description="Foto struknya, item auto-kedetect, pajak & service charge dihitung. Langsung tahu siapa bayar berapa."
              ctaText="Mulai Split Bill"
              ctaHref="/split-bill"
            />
          </section>

          <CaraPakaiOverview
            titlePrefix="Apa itu"
            titleHighlight="Split Bill?"
            description="Fitur buat bagi tagihan patungan secara adil, mau rata atau sesuai item masing-masing, semua otomatis dihitung dari struk yang kamu scan."
            points={overviewPoints}
          />

          <CaraPakaiKillerFeatures
            feature="split-bill"
            titlePrefix="Fitur yang Bikin Split Bill"
            titleHighlight="Beda dari yang Lain"
            description="Bukan cuma kalkulator biasa, ini yang bikin patungan kamu jauh lebih gampang."
            features={killerFeatures}
            columns={3}
            ctaText="Coba Fitur Ini Sekarang"
            ctaHref="/split-bill"
          />

          <CaraPakaiStepsSection
            titleHighlight="dalam 6 Langkah"
            subtitle="Dari tambah teman sampai share hasil, semua bisa selesai dalam hitungan menit."
            steps={steps}
            imagePadding={false}
          />

          <FAQSectionHomepage
            faqs={splitBillFaqs}
            title={
              <>
                Pertanyaan Seputar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Split Bill
                </span>
              </>
            }
            subtitle="Masih ragu? Ini jawaban buat pertanyaan yang paling sering muncul."
            viewAllHref={null}
            defaultOpenFirst
          />
        </main>

        <HomepageFooter />
      </div>
    </>
  );
}
