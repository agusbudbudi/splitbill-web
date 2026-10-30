/**
 * Invoice "Cara Pakai" Page (Server Component)
 *
 * Halaman edukasi fitur Invoice: overview dan cara pakai step-by-step.
 * Section-section-nya reusable, lihat src/components/cara-pakai/ — dipakai
 * bareng di semua halaman "/[fitur]/cara-pakai", cuma beda konten.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  Calculator,
  Landmark,
  BadgeCheck,
  FileText,
  Users,
  ClipboardList,
  Wallet,
  ScrollText,
  Download,
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

const PAGE_URL = "https://www.splitbill.my.id/invoice/cara-pakai";
const OG_IMAGE = "/img/cara-pakai/split-bill/hero-split-bill-cara-pakai-new.png";

export const metadata: Metadata = buildMetadata({
  title: "Cara Buat Invoice Online Gratis: Panduan Lengkap | SplitBill",
  description: "Panduan cara buat invoice online gratis: isi detail, data penagih, item, metode bayar, sampai download PDF. Total dan terbilang dihitung otomatis.",
  path: "/invoice/cara-pakai",
  socialTitle: "Cara Buat Invoice Online Gratis: Panduan Lengkap",
  socialDescription: "Isi detail, tambah item, pilih metode bayar, lalu download PDF. Semua langkah bikin invoice dijelaskan lengkap di sini.",
  image: {
    url: OG_IMAGE,
    width: 1920,
    height: 900,
    alt: "Cara buat invoice online gratis di SplitBill",
  },
});

const stepIconClass = "h-5 w-5 text-primary";

const overviewPoints: OverviewPoint[] = [
  {
    icon: Calculator,
    title: "Total & terbilang otomatis",
    description: "Isi item, jumlah, dan harga. Subtotal, diskon, total, sampai nominal terbilang dihitung otomatis.",
  },
  {
    icon: Landmark,
    title: "Rekening & PDF siap kirim",
    description: "Cantumin rekening bank atau e-wallet tujuan, lalu download invoice sebagai PDF buat dikirim ke penerima.",
  },
  {
    icon: BadgeCheck,
    title: "Buat freelancer sampai bendahara",
    description: "Cocok buat freelancer, usaha kecil, sampai panitia acara. Bisa dibuat tanpa harus lewat split bill dulu.",
  },
];

const steps: CaraPakaiStep[] = [
  {
    number: "1",
    icon: <FileText className={stepIconClass} />,
    title: "Isi Detail Invoice",
    description: "Nomor invoice dibuat otomatis. Atur tanggal invoice, jatuh tempo, dan upload logo kalau ada.",
    image: "/img/cara-pakai/invoice/1.png",
  },
  {
    number: "2",
    icon: <Users className={stepIconClass} />,
    title: "Isi Penagih & Penerima",
    description: "Tambah data Billed By dan Billed To, lalu pilih yang dipakai. Datanya tersimpan buat invoice berikutnya.",
    image: "/img/cara-pakai/invoice/2.png",
  },
  {
    number: "3",
    icon: <ClipboardList className={stepIconClass} />,
    title: "Tambah Item",
    description: "Isi nama item, jumlah, dan harga, plus deskripsi kalau perlu. Totalnya langsung kehitung.",
    image: "/img/cara-pakai/invoice/3.png",
  },
  {
    number: "4",
    icon: <Wallet className={stepIconClass} />,
    title: "Pilih Metode Bayar",
    description: "Pilih rekening bank atau e-wallet tujuan. Metode yang dipilih tampil di bagian bawah invoice.",
    image: "/img/cara-pakai/invoice/4.png",
  },
  {
    number: "5",
    icon: <ScrollText className={stepIconClass} />,
    title: "Tulis Syarat & Ketentuan",
    description: "Opsional: tambahkan syarat pembayaran dan catatan penutup di footer invoice.",
    image: "/img/cara-pakai/invoice/5.png",
  },
  {
    number: "6",
    icon: <Download className={stepIconClass} />,
    title: "Preview & Download PDF",
    description: "Cek tampilan akhirnya, download PDF, lalu finalize supaya invoice tersimpan.",
    image: "/img/cara-pakai/invoice/6.png",
  },
];

export default async function InvoiceCaraPakaiPage() {
  const invoiceFaqs = (await getFaqs()).filter((item) => item.category === "invoice");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Invoice", item: "https://www.splitbill.my.id/invoice" },
      { "@type": "ListItem", position: 3, name: "Cara Pakai", item: PAGE_URL },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Buat Invoice Online Gratis",
    description: "Panduan membuat invoice online di SplitBill, dari isi detail sampai download PDF.",
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
    name: "SplitBill Invoice",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://www.splitbill.my.id/invoice",
    description: "Buat invoice online gratis: total dan terbilang dihitung otomatis, lalu download sebagai PDF.",
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
        <HomepageNavbar ctaHref="/invoice/create" />

        <main>
          <section className="pt-[calc(4rem+env(safe-area-inset-top))] lg:pt-[calc(4.5rem+env(safe-area-inset-top))] bg-white">
            <h1 className="sr-only">Cara Buat Invoice Online Gratis</h1>
            <CaraPakaiHero
              feature="invoice"
              imageSrc={OG_IMAGE}
              imageAlt="Ilustrasi pengguna SplitBill memegang HP"
              titleLine1="Bikin Invoice Rapi,"
              titleHighlight="Siap Kirim dalam Menit!"
              description="Isi detail, tambah item, pilih metode bayar, lalu download PDF. Gratis dan langsung dari browser."
              ctaText="Buat Invoice Sekarang"
              ctaHref="/invoice/create"
            />
          </section>

          <CaraPakaiOverview
            titlePrefix="Apa itu"
            titleHighlight="Invoice SplitBill?"
            description="Fitur buat bikin tagihan yang rapi buat klien, pelanggan, atau teman, tanpa perlu template atau hitung manual."
            points={overviewPoints}
          />

          <CaraPakaiStepsSection
            titleHighlight="dalam 6 Langkah"
            subtitle="Dari isi detail sampai download PDF, semua bisa dari HP."
            steps={steps}
            imagePadding={false}
          />

          <FAQSectionHomepage
            faqs={invoiceFaqs}
            title={
              <>
                Pertanyaan Seputar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Invoice
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
