/**
 * Collect Money "Cara Pakai" Page (Server Component)
 *
 * Halaman edukasi fitur Collect Money: overview dan cara pakai step-by-step.
 * Section-section-nya reusable, lihat src/components/cara-pakai/ — dipakai
 * bareng di semua halaman "/[fitur]/cara-pakai", cuma beda konten.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  Receipt,
  HandCoins,
  Target,
  UserPlus,
  Landmark,
  Send,
} from "lucide-react";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import {
  CaraPakaiHero,
  CaraPakaiOverview,
  CaraPakaiStepsSection,
  type OverviewPoint,
  type CaraPakaiStep,
} from "@/components/cara-pakai";
import { getFaqs } from "@/lib/faq";
import { FAQSectionHomepage } from "@/components/homepage/FAQSectionHomepage";

const PAGE_URL = "https://www.splitbill.my.id/collect-money/cara-pakai";
const OG_IMAGE = "/img/cara-pakai/split-bill/hero-split-bill-cara-pakai-new.png";

export const metadata: Metadata = buildMetadata({
  title: "Cara Pakai Collect Money: Panduan Kumpulin Iuran | SplitBill",
  description: "Panduan cara kumpulin iuran dan patungan online: buat patungan, tambah teman, tagih via WhatsApp, dan tandai siapa yang sudah lunas. Gratis dari browser.",
  path: "/collect-money/cara-pakai",
  socialTitle: "Cara Pakai Collect Money: Panduan Kumpulin Iuran",
  socialDescription: "Buat patungan, tambah teman, tagih via WhatsApp, lalu pantau siapa yang sudah bayar. Semua langkahnya dijelaskan lengkap di sini.",
  image: {
    url: OG_IMAGE,
    width: 1920,
    height: 900,
    alt: "Cara kumpulin iuran dan patungan online di SplitBill",
  },
});

const stepIconClass = "h-5 w-5 text-primary";

const overviewPoints: OverviewPoint[] = [
  {
    icon: CheckCircle2,
    title: "Kelihatan siapa yang udah bayar",
    description: "Tandai lunas tiap ada yang transfer. Dana terkumpul dan sisa yang belum bayar langsung ke-update.",
  },
  {
    icon: Receipt,
    title: "Langsung dari hasil split bill",
    description: "Abis split bill? Hasilnya bisa langsung dipantau di Collect Money, gak perlu input ulang.",
  },
  {
    icon: HandCoins,
    title: "Uang tetap di rekening kamu",
    description: "SplitBill cuma mencatat. Uangnya ditransfer langsung ke rekening bendahara, gak lewat kami.",
  },
];

const steps: CaraPakaiStep[] = [
  {
    number: "1",
    icon: <Target className={stepIconClass} />,
    title: "Buat Patungan",
    description: "Tap Buat Patungan, isi judulnya (mis. \"Kas Trip Bandung\"), lalu tap Mulai.",
    image: "/img/cara-pakai/collect-money/1.png",
  },
  {
    number: "2",
    icon: <UserPlus className={stepIconClass} />,
    title: "Tambah Teman & Nominal",
    description: "Masukin nama teman dan nominal tagihannya. Total patungan dihitung otomatis.",
    image: "/img/cara-pakai/collect-money/2.png",
  },
  {
    number: "3",
    icon: <Landmark className={stepIconClass} />,
    title: "Pilih Rekening Tujuan",
    description: "Di Informasi Transfer, pilih rekening atau e-wallet biar teman gampang bayarnya.",
    image: "/img/cara-pakai/collect-money/3.png",
  },
  {
    number: "4",
    icon: <Send className={stepIconClass} />,
    title: "Tagih via WhatsApp",
    description: "Tagih teman satu per satu lewat WhatsApp, atau salin list dan bagikan gambarnya ke grup.",
    image: "/img/cara-pakai/collect-money/4.png",
  },
  {
    number: "5",
    icon: <CheckCircle2 className={stepIconClass} />,
    title: "Tandai yang Sudah Lunas",
    description: "Tandai tiap ada yang transfer. Progress dana terkumpul ter-update sampai semua lunas.",
    image: "/img/cara-pakai/collect-money/5.png",
  },
];

export default async function CollectMoneyCaraPakaiPage() {
  const collectMoneyFaqs = (await getFaqs()).filter((item) => item.category === "collect-money");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Collect Money", item: "https://www.splitbill.my.id/collect-money" },
      { "@type": "ListItem", position: 3, name: "Cara Pakai", item: PAGE_URL },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Pakai Collect Money",
    description: "Panduan mengumpulkan iuran dan patungan online di SplitBill, dari buat patungan sampai semua lunas.",
    image: `https://www.splitbill.my.id${OG_IMAGE}`,
    totalTime: "PT5M",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SplitBill Collect Money",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://www.splitbill.my.id/collect-money",
    description: "Kumpulkan iuran dan patungan online: tandai siapa yang sudah bayar dan pantau dana terkumpul.",
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
        <HomepageNavbar ctaHref="/collect-money" />

        <main>
          <section className="pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4.5rem+env(safe-area-inset-top))] bg-white">
            <h1 className="sr-only">Cara Pakai Collect Money</h1>
            <CaraPakaiHero
              feature="collect-money"
              imageSrc={OG_IMAGE}
              imageAlt="Ilustrasi pengguna SplitBill memegang HP"
              titleLine1="Kumpulin Iuran Gampang,"
              titleHighlight="Status Bayar Jelas!"
              description="Buat patungan, tagih lewat WhatsApp, dan pantau siapa yang sudah bayar. Gratis dan langsung dari browser."
              ctaText="Mulai Kumpulin Iuran"
              ctaHref="/collect-money"
            />
          </section>

          <CaraPakaiOverview
            titlePrefix="Apa itu"
            titleHighlight="Collect Money?"
            description="Fitur buat ngumpulin uang bareng, pas buat iuran kas, patungan kado, sewa lapangan, sampai biaya trip."
            points={overviewPoints}
          />

          <CaraPakaiStepsSection
            titleHighlight="dalam 5 Langkah"
            subtitle="Bikin patungan, tagih, lalu pantau sampai semua lunas."
            steps={steps}
            imagePadding={false}
          />

          <FAQSectionHomepage
            faqs={collectMoneyFaqs}
            title={
              <>
                Pertanyaan Seputar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Collect Money
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
