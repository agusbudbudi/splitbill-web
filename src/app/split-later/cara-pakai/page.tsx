/**
 * Split Later "Cara Pakai" Page (Server Component)
 *
 * Halaman edukasi fitur Split Later: overview, killer feature highlight, dan
 * cara pakai step-by-step. Section-section-nya reusable, lihat
 * src/components/cara-pakai/ — dipakai bareng di semua halaman
 * "/[fitur]/cara-pakai" (mis. /split-bill/cara-pakai), cuma beda konten.
 * Beda dari /split-bill-liburan (microsite marketing panjang, punya hero +
 * banyak section conversion sendiri), halaman ini fokus tutorial ringkas.
 */

import type { Metadata } from "next";
import {
  Camera,
  ShieldCheck,
  Zap,
  Layers,
  Trophy,
  Share2,
  Sparkles,
  Briefcase,
  PenLine,
  Users,
  Receipt,
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

const PAGE_URL = "https://www.splitbill.my.id/split-later/cara-pakai";
const OG_IMAGE = "/img/cara-pakai/split-later/hero-split-later-cara-kerja.png";

export const metadata: Metadata = {
  title: "Cara Pakai Split Later: Kumpul Struk, Split Belakangan | SplitBill",
  description:
    "Panduan lengkap cara pakai fitur Split Later: buat bucket acara, kumpulkan struk kapan aja, proses tiap struk, sampai lihat settlement gabungan.",
  keywords: [
    "cara pakai split later",
    "tutorial split later",
    "panduan split later",
    "cara kumpulkan struk liburan",
    "split tagihan belakangan",
    "cara pakai split bill liburan",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cara Pakai Split Later: Kumpul Struk, Split Belakangan",
    description:
      "Buat bucket acara, kumpulkan struk kapan aja, proses tiap struk, lalu lihat settlement gabungan. Semua langkah Split Later dijelaskan lengkap di sini.",
    url: PAGE_URL,
    siteName: "Split Bill App",
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 900,
        alt: "Tampilan aplikasi Split Later — daftar bucket, struk, dan settlement",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cara Pakai Split Later: Kumpul Struk, Split Belakangan",
    description:
      "Buat bucket acara, kumpulkan struk kapan aja, proses tiap struk, lalu lihat settlement gabungan. Semua langkah Split Later dijelaskan lengkap di sini.",
    images: [OG_IMAGE],
  },
};

const splitLaterFaqs = faqData.filter((item) => item.category === "split-later");

const overviewPoints: OverviewPoint[] = [
  {
    icon: Camera,
    title: "Kumpul struk kapan aja",
    description: "Lagi liburan atau acara rame-rame, foto struknya aja dulu, gak perlu itung di tempat.",
  },
  {
    icon: Layers,
    title: "Semua struk jadi satu rangkuman",
    description: "Puluhan struk selama acara digabung, settlement-nya dihitung sekaligus, bukan satu-satu.",
  },
  {
    icon: ShieldCheck,
    title: "Tersimpan aman di akun kamu",
    description: "Login dulu biar struk & progress bucket kesimpen aman, bisa dilanjut dari device mana aja.",
  },
];

const killerFeatureIconClass = "w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0";

const killerFeatures: KillerFeature[] = [
  {
    icon: <Zap className={killerFeatureIconClass} />,
    title: "Quick Capture",
    description: "Sekali jepret, struk langsung kesimpen ke bucket yang lagi aktif, gak perlu pilih-pilih dulu.",
    image: "/img/cara-pakai/split-later/quick-capture.png",
  },
  {
    icon: <Camera className={killerFeatureIconClass} />,
    title: "AI Scan Struk",
    description: "Tiap struk diproses pakai AI, item & harga auto-kedetect, tinggal assign punya siapa.",
    image: "/img/cara-pakai/split-later/ai-scan.png",
  },
  {
    icon: <Layers className={killerFeatureIconClass} />,
    title: "Settlement Gabungan Multi-Struk",
    description: "\"Siapa bayar siapa\" dihitung otomatis dari semua struk yang udah diproses dalam satu bucket.",
    image: "/img/cara-pakai/split-later/settlement-gabungan.png",
    isNew: true,
  },
  {
    icon: <Trophy className={killerFeatureIconClass} />,
    title: "Badge Kocak Otomatis",
    description: "Si Paling Traktir, Si Paling Sultan, sampai Si Paling Hemat muncul otomatis di settlement.",
    image: "/img/cara-pakai/split-later/badge.png",
  },
  {
    icon: <Share2 className={killerFeatureIconClass} />,
    title: "Share Rangkuman ke Sosmed",
    description: "Settlement trip diexport jadi gambar kece, tinggal share ke grup WhatsApp atau story.",
    image: "/img/cara-pakai/split-later/share-sosmed.png",
  },
  {
    icon: <Sparkles className={killerFeatureIconClass} />,
    title: "Kategori Acara & Emoji",
    description: "Pilih kategori (liburan, nongkrong, kantor, dll), emoji ikut ke-set otomatis biar gampang dikenali.",
    image: "/img/cara-pakai/split-later/category-event.png",
  },
];

const stepIconClass = "h-5 w-5 text-primary";

const steps: CaraPakaiStep[] = [
  {
    number: "1",
    icon: <Briefcase className={stepIconClass} />,
    title: "Pilih Kategori Acara",
    description: "Pilih kategori trip/acara kamu (liburan, nongkrong, kantor, dll), emoji auto ke-set.",
    image: "/img/cara-pakai/split-later/1.png",
  },
  {
    number: "2",
    icon: <PenLine className={stepIconClass} />,
    title: "Kasih Nama & Emoji",
    description: "Kasih nama unik buat bucket-nya biar gampang dikenali pas mau dibagikan.",
    image: "/img/cara-pakai/split-later/2.png",
  },
  {
    number: "3",
    icon: <Users className={stepIconClass} />,
    title: "Tambah Peserta",
    description: "Masukin minimal 2 nama peserta yang ikut patungan di acara ini.",
    image: "/img/cara-pakai/split-later/3.png",
  },
  {
    number: "4",
    icon: <Camera className={stepIconClass} />,
    title: "Upload Struk, Kapan Aja",
    description: "Foto struk pertama sekarang, atau skip dulu dan nyusul belakangan lewat Quick Capture.",
    image: "/img/cara-pakai/split-later/4.png",
  },
  {
    number: "5",
    icon: <Receipt className={stepIconClass} />,
    title: "Proses Tiap Struk",
    description: "Kalau udah santai, proses tiap struk yang kekumpul, assign item punya siapa.",
    image: "/img/cara-pakai/split-later/5.png",
  },
  {
    number: "6",
    icon: <Share2 className={stepIconClass} />,
    title: "Lihat Settlement & Share",
    description: "Semua struk digabung jadi satu rangkuman siapa-bayar-siapa, tinggal share ke grup.",
    image: "/img/cara-pakai/split-later/6.png",
  },
];

export default function SplitLaterCaraPakaiPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Split Later", item: "https://www.splitbill.my.id/split-later" },
      { "@type": "ListItem", position: 3, name: "Cara Pakai", item: PAGE_URL },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Pakai Split Later",
    description:
      "Panduan lengkap kumpulkan struk selama acara/liburan lalu split belakangan pakai fitur Split Later.",
    image: `https://www.splitbill.my.id${OG_IMAGE}`,
    totalTime: "PT5M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Pilih Kategori Acara", text: "Pilih kategori trip/acara, emoji auto ke-set." },
      { "@type": "HowToStep", position: 2, name: "Kasih Nama & Emoji", text: "Kasih nama unik buat bucket-nya." },
      { "@type": "HowToStep", position: 3, name: "Tambah Peserta", text: "Masukin minimal 2 nama peserta." },
      { "@type": "HowToStep", position: 4, name: "Upload Struk, Kapan Aja", text: "Foto struk sekarang atau nyusul belakangan lewat Quick Capture." },
      { "@type": "HowToStep", position: 5, name: "Proses Tiap Struk", text: "Proses tiap struk yang kekumpul, assign item punya siapa." },
      { "@type": "HowToStep", position: 6, name: "Lihat Settlement & Share", text: "Semua struk digabung jadi satu rangkuman siapa-bayar-siapa." },
    ],
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Split Later",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://www.splitbill.my.id/split-later",
    description:
      "Fitur kumpulkan struk selama liburan/acara, split & settlement belakangan pas udah santai, semua struk digabung jadi satu rangkuman.",
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
        <HomepageNavbar ctaHref="/split-later" />

        <main>
          <section className="pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4.5rem+env(safe-area-inset-top))] bg-white">
            <h1 className="sr-only">Cara Pakai Split Later</h1>
            <CaraPakaiHero
              feature="split-later"
              imageSrc={OG_IMAGE}
              imageAlt="Dua orang foto struk buat dikumpulkan di Split Later"
              titleLine1="Kumpul Struk Dulu,"
              titleHighlight="Split-nya Belakangan!"
              description="Lagi liburan atau acara rame-rame? Foto struknya aja dulu, itung & settlement-nya nyusul kapan aja pas udah santai."
              ctaText="Mulai Split Later"
              ctaHref="/split-later"
            />
          </section>

          <CaraPakaiOverview
            titlePrefix="Apa itu"
            titleHighlight="Split Later?"
            description="Fitur buat kumpulkan struk selama liburan atau acara berhari-hari, baru diproses & disettle belakangan, semua struk dalam satu acara dihitung jadi satu rangkuman."
            points={overviewPoints}
          />

          <CaraPakaiKillerFeatures
            feature="split-later"
            titlePrefix="Fitur yang Bikin Split Later"
            titleHighlight="Beda dari yang Lain"
            description="Bukan cuma penyimpan foto struk, ini yang bikin patungan panjang jauh lebih gampang."
            features={killerFeatures}
            columns={3}
            ctaText="Coba Fitur Ini Sekarang"
            ctaHref="/split-later"
          />

          <CaraPakaiStepsSection
            titleHighlight="dalam 6 Langkah"
            subtitle="Dari buat bucket sampai lihat settlement, semua bisa dimulai dalam hitungan menit."
            steps={steps}
            imagePadding={false}
          />

          <FAQSectionHomepage
            faqs={splitLaterFaqs}
            title={
              <>
                Pertanyaan Seputar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Split Later
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
