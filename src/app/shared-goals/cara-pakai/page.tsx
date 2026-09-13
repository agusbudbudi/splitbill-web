/**
 * Shared Goals "Cara Pakai" Page (Server Component)
 *
 * Halaman edukasi fitur Shared Goals: overview, killer feature highlight, dan
 * cara pakai step-by-step. Section-section-nya reusable, lihat
 * src/components/cara-pakai/ — dipakai bareng di semua halaman
 * "/[fitur]/cara-pakai" (mis. /split-bill/cara-pakai), cuma beda konten.
 */

import type { Metadata } from "next";
import {
  Users2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Trophy,
  LineChart,
  Share2,
  Target,
  UserPlus,
  PiggyBank,
  PartyPopper,
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

const PAGE_URL = "https://www.splitbill.my.id/shared-goals/cara-pakai";
const OG_IMAGE = "/img/cara-pakai/shared-goals/hero-shared-goals-cara-pakai.png";

export const metadata: Metadata = {
  title: "Cara Pakai Shared Goals: Panduan Nabung Bareng | SplitBill",
  description:
    "Panduan lengkap cara pakai fitur Shared Goals: buat goal, tambah kontributor, setor tabungan, sampai pantau progress & leaderboard. Gratis & tanpa login.",
  keywords: [
    "cara pakai shared goals",
    "cara nabung bareng online",
    "tutorial shared goals",
    "panduan nabung bareng",
    "cara patungan nabung",
    "aplikasi nabung bareng teman",
    "tabungan bersama online",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cara Pakai Shared Goals: Panduan Nabung Bareng",
    description:
      "Buat goal, tambah kontributor, setor tabungan, lalu pantau progress & leaderboard. Semua langkah nabung bareng dijelaskan lengkap di sini.",
    url: PAGE_URL,
    siteName: "Split Bill App",
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 900,
        alt: "Cara pakai Shared Goals, nabung bareng menuju satu target",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cara Pakai Shared Goals: Panduan Nabung Bareng",
    description:
      "Buat goal, tambah kontributor, setor tabungan, lalu pantau progress & leaderboard. Semua langkah nabung bareng dijelaskan lengkap di sini.",
    images: [OG_IMAGE],
  },
};

const sharedGoalsFaqs = faqData.filter((item) => item.category === "shared-goals");

const killerFeatureIconClass = "w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0";
const stepIconClass = "h-5 w-5 text-primary";

const overviewPoints: OverviewPoint[] = [
  {
    icon: Users2,
    title: "Nabung bareng siapa aja",
    description: "Patungan buat liburan, beli barang bareng, atau dana darurat, catat semua orang yang ikut nabung.",
  },
  {
    icon: TrendingUp,
    title: "Progress kelihatan jelas",
    description: "Progress bar, grafik tren, sampai estimasi kapan target tercapai, semua otomatis kehitung.",
  },
  {
    icon: ShieldCheck,
    title: "Gratis & tanpa login",
    description: "Langsung pakai dari browser, tanpa install aplikasi. Login opsional kalau mau simpan riwayat.",
  },
];

const killerFeatures: KillerFeature[] = [
  {
    icon: <Sparkles className={killerFeatureIconClass} />,
    title: "Savings Insight Otomatis",
    description: "Target bulanan & estimasi kapan goal tercapai dihitung otomatis dari tren nabung kamu.",
    image: "/img/cara-pakai/shared-goals/insight.png",
  },
  {
    icon: <Trophy className={killerFeatureIconClass} />,
    title: "Leaderboard Kontributor",
    description: "Lihat siapa \"Biggest Contributor\" dan \"Most Frequent Saver\" di goal kamu.",
    image: "/img/cara-pakai/shared-goals/leaderboard.png",
  },
  {
    icon: <LineChart className={killerFeatureIconClass} />,
    title: "Grafik Tren Tabungan",
    description: "Progress nabung divisualisasikan dalam grafik, gampang dipantau dari waktu ke waktu.",
    image: "/img/cara-pakai/shared-goals/grafik.png",
  },
  {
    icon: <Share2 className={killerFeatureIconClass} />,
    title: "Share Progress sebagai Gambar",
    description: "Goal tercapai dapat perayaan otomatis, progress bisa di-export jadi gambar buat dibagikan.",
    image: "/img/cara-pakai/shared-goals/share.png",
  },
];

const steps: CaraPakaiStep[] = [
  {
    number: "1",
    icon: <Target className={stepIconClass} />,
    title: "Buat Goal Baru",
    description: "Isi nama goal (mis. \"Liburan Bali\"), target nominal, dan deadline opsional.",
    image: "/img/cara-pakai/shared-goals/1.png",
  },
  {
    number: "2",
    icon: <UserPlus className={stepIconClass} />,
    title: "Tambah Kontributor",
    description: "Catat nama teman-teman yang ikut nabung bareng, bisa banyak sekaligus.",
    image: "/img/cara-pakai/shared-goals/2.png",
  },
  {
    number: "3",
    icon: <PiggyBank className={stepIconClass} />,
    title: "Setor Tabungan",
    description: "Pilih siapa yang setor, isi nominal & catatan opsional. Progress update otomatis.",
    image: "/img/cara-pakai/shared-goals/3.png",
  },
  {
    number: "4",
    icon: <TrendingUp className={stepIconClass} />,
    title: "Pantau Progress & Insight",
    description: "Lihat progress bar, grafik tren, target bulanan, dan estimasi kapan goal tercapai.",
    image: "/img/cara-pakai/shared-goals/4.png",
  },
  {
    number: "5",
    icon: <Trophy className={stepIconClass} />,
    title: "Cek Leaderboard Kontributor",
    description: "Lihat siapa paling rajin nabung, plus breakdown kontribusi tiap anggota.",
    image: "/img/cara-pakai/shared-goals/5.png",
  },
  {
    number: "6",
    icon: <PartyPopper className={stepIconClass} />,
    title: "Goal Tercapai, Share Progress",
    description: "Dapat perayaan otomatis pas 100%, lalu share progress ke teman sebagai gambar.",
    image: "/img/cara-pakai/shared-goals/6.png",
  },
];

export default function SharedGoalsCaraPakaiPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Shared Goals", item: "https://www.splitbill.my.id/shared-goals" },
      { "@type": "ListItem", position: 3, name: "Cara Pakai", item: PAGE_URL },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Pakai Shared Goals",
    description:
      "Panduan lengkap nabung bareng pakai fitur Shared Goals, dari buat goal sampai share progress ke teman.",
    image: `https://www.splitbill.my.id${OG_IMAGE}`,
    totalTime: "PT5M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Buat Goal Baru", text: "Isi nama goal, target nominal, dan deadline opsional." },
      { "@type": "HowToStep", position: 2, name: "Tambah Kontributor", text: "Catat nama teman-teman yang ikut nabung bareng." },
      { "@type": "HowToStep", position: 3, name: "Setor Tabungan", text: "Pilih siapa yang setor, isi nominal & catatan opsional." },
      { "@type": "HowToStep", position: 4, name: "Pantau Progress & Insight", text: "Lihat progress bar, grafik tren, dan estimasi kapan goal tercapai." },
      { "@type": "HowToStep", position: 5, name: "Cek Leaderboard Kontributor", text: "Lihat siapa paling rajin nabung dan breakdown kontribusi tiap anggota." },
      { "@type": "HowToStep", position: 6, name: "Goal Tercapai, Share Progress", text: "Dapat perayaan otomatis, lalu share progress ke teman sebagai gambar." },
    ],
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Shared Goals",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://www.splitbill.my.id/shared-goals",
    description:
      "Fitur nabung bareng gratis, catat kontribusi tiap anggota, pantau progress dan estimasi target tercapai otomatis.",
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
        <HomepageNavbar ctaHref="/shared-goals" />

        <main>
          <section className="pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4.5rem+env(safe-area-inset-top))] bg-white">
            <h1 className="sr-only">Cara Pakai Shared Goals</h1>
            <CaraPakaiHero
              feature="shared-goals"
              imageSrc={OG_IMAGE}
              imageAlt="Tampilan aplikasi Shared Goals"
              titleLine1="Nabung Bareng Jadi Seru,"
              titleHighlight="Progress Kelihatan Jelas!"
              description="Bikin goal tabungan, catat siapa aja yang ikut nabung, dan pantau progress sampai target tercapai."
              ctaText="Mulai Nabung Bareng"
              ctaHref="/shared-goals"
            />
          </section>

          <CaraPakaiOverview
            titlePrefix="Apa itu"
            titleHighlight="Shared Goals?"
            description="Fitur buat nabung bareng menuju satu target nominal, tinggal catat setoran tiap orang, progress kehitung otomatis."
            points={overviewPoints}
          />

          <CaraPakaiKillerFeatures
            feature="shared-goals"
            titlePrefix="Fitur yang Bikin Shared Goals"
            titleHighlight="Beda dari yang Lain"
            description="Bukan cuma tracker tabungan biasa, ini yang bikin nabung bareng jauh lebih seru."
            features={killerFeatures}
            columns={2}
            ctaText="Coba Fitur Ini Sekarang"
            ctaHref="/shared-goals"
          />

          <CaraPakaiStepsSection
            titleHighlight="dalam 6 Langkah"
            subtitle="Dari buat goal sampai share progress, semua bisa dimulai dalam hitungan menit."
            steps={steps}
            imagePadding={false}
          />

          <FAQSectionHomepage
            faqs={sharedGoalsFaqs}
            title={
              <>
                Pertanyaan Seputar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Shared Goals
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
