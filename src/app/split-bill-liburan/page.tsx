/**
 * Split Bill Liburan Landing Page — Server Component
 *
 * Dedicated microsite untuk keyword "split bill liburan" / "split later".
 * Semua section di-render sebagai Server Component (bukan client-rendered)
 * supaya crawler dapat konten penuh, bukan cuma shell kosong — beda dari
 * pola /split-later yang full "use client" dan cuma nampilin "Memuat...".
 * Interaktivitas (CTA click tracking, page view, scroll depth) diisolasi
 * ke client island kecil (LiburanCTAButton, LiburanPageTracker).
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  ListChecks,
  Share2,
  Frown,
  Calculator,
  Star,
  UserX,
  MessageCircle,
  Sparkles,
  Users,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { faqData } from "@/data/faqData";
import { LiburanCTAButton } from "./LiburanCTAButton";
import { LiburanPageTracker } from "./LiburanPageTracker";
import { HeroSplitCardCarousel } from "./HeroSplitCardCarousel";
import { HeroBackground } from "./HeroBackground";
import { PenutupPromoBanner } from "./PenutupPromoBanner";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { FAQSectionHomepage } from "@/components/homepage/FAQSectionHomepage";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";

const PAGE_PATH = "/split-bill-liburan";
const PAGE_URL = "https://www.splitbill.my.id/split-bill-liburan";
const OG_IMAGE = "/img/promoBanner-split-later-new.jpg";

export const metadata: Metadata = {
  title: "Split Bill Liburan - Kumpulin Struk, Bagi Nanti Aja | SplitBill",
  description:
    "Liburan bareng temen gak usah ribet itung-itung di tempat. Kumpulin struk selama trip, split tagihannya belakangan pas udah santai. Gratis & tanpa login.",
  keywords: [
    "split bill liburan",
    "split later",
    "patungan liburan",
    "bagi tagihan trip",
    "split bill online",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Liburan Dulu. Urusan Patungan, Biar SplitBill",
    description:
      "Kumpulin struk selama liburan, split tagihannya nanti pas udah santai. Gratis, tanpa login, langsung dari HP.",
    url: PAGE_URL,
    siteName: "Split Bill App",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Split Bill Liburan, kumpulin struk selama trip lalu bagi tagihan belakangan",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liburan Dulu. Urusan Patungan, Biar SplitBill",
    description:
      "Kumpulin struk selama liburan, split tagihannya nanti pas udah santai. Gratis, tanpa login.",
    images: [OG_IMAGE],
  },
};

const liburanFaqs = faqData.filter((item) => item.category === "split-bill-liburan");

export default function SplitBillLiburanPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
      { "@type": "ListItem", position: 2, name: "Split Bill Liburan", item: PAGE_URL },
    ],
  };

  // Tool schema — no aggregateRating (would need real review data), pola sama dengan /split-bill
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Split Later",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: PAGE_URL,
    description:
      "Kumpulin struk selama liburan, split tagihannya belakangan pas udah santai. Gratis dan tanpa login.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cara Kerja Split Bill Liburan Tanpa Ribet",
    description:
      "Ala Split Later, kumpulin struk dulu, itung-itungnya belakangan.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Foto atau upload struk kapan aja",
        text: "Selama liburan berlangsung, gak perlu langsung diitung di tempat. Simpan dulu, lanjut nongkrong.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Assign siapa bayar apa, atau split rata",
        text: "Fleksibel, mau dibagi per item atau rata aja, tinggal pilih pas udah siap diitung.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Generate rincian, share ke grup WA",
        text: "Pas udah santai di rumah, tinggal generate rincian dan share link. Temen tinggal transfer.",
      },
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {/* FAQPage JSON-LD emitted by FAQSectionHomepage itself, scoped to liburanFaqs passed below */}

      <Suspense fallback={null}>
        <LiburanPageTracker />
      </Suspense>

      <div className="min-h-screen bg-white">
        {/* Header sama persis seperti LP utama (Fitur, Cara Pakai, Testimoni, Member), CTA di-override ke /split-later */}
        <HomepageNavbar ctaHref="/split-later" scrollPath={PAGE_PATH} />

        <main>
          {/* 6.1 Hero — dimensi container disamakan persis dengan HeroSection LP utama (max-w-7xl, min-h-screen, padding, gap) */}
          <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
            <HeroBackground />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 lg:pt-28 lg:pb-16 w-full">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                    Liburan Dulu.
                    <br />
                    Urusan Patungan, Biar{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#2563eb]">
                      SplitBill
                    </span>
                  </h1>
                  <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Kumpulin semua struk selama liburan, bagi tagihan otomatis, dan tahu siapa
                    bayar berapa. Nggak perlu ribet ngitung manual.
                  </p>

                  <div className="mt-8">
                    <LiburanCTAButton position="hero" className="w-full sm:w-auto">
                      Mulai Kumpulin Struk
                    </LiburanCTAButton>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mt-8">
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span>4.9/5 rating</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="text-slate-600 text-sm font-semibold">
                      5.000+ Tagihan dibuat
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full flex justify-center lg:justify-end">
                  <HeroSplitCardCarousel />
                </div>
              </div>
            </div>
          </section>

          {/* 6.2 Problem/relate section — bg + bento card pola sama persis FeaturesSection LP utama */}
          <section className="py-16 sm:py-24 bg-[#f8f9fd] relative overflow-hidden">
            {/* Decorative blurry gradients — sama seperti FeaturesSection */}
            <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  Liburan Kelar,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    Drama Split Bill-nya Baru Mulai
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  Kalau ini kerasa relate, kamu <span className="text-primary font-bold">gak sendirian</span>.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {[
                  {
                    icon: UserX,
                    quote: "Gue nombokin dulu ya.",
                    bodyLine1: "Semua bilang nanti transfer.",
                    bodyLine2: "Besoknya tinggal jadi kenangan.",
                  },
                  {
                    icon: Frown,
                    quote: "Eh, yang kemarin berapa?",
                    bodyLine1: "Liburan sudah selesai,",
                    bodyLine2: "urusan tagihan malah baru dimulai.",
                  },
                  {
                    icon: Calculator,
                    quote: "Ini struk siapa?",
                    bodyLine1: "Puluhan struk, banyak transaksi,",
                    bodyLine2: "ujung-ujungnya dihitung pakai kalkulator.",
                  },
                ].map((item) => (
                  <div
                    key={item.quote}
                    className="bg-white rounded-md p-4 sm:p-6 lg:p-8 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] transition-all duration-300"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-md flex items-center justify-center p-2 sm:p-2.5 mb-4 sm:mb-6">
                      <item.icon className="w-full h-full text-primary" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-base sm:text-xl font-extrabold italic text-slate-800 mb-1.5 sm:mb-2.5">
                      &ldquo;{item.quote}&rdquo;
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      {item.bodyLine1}
                      <br />
                      {item.bodyLine2}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Cases — perluas mental model: liburan ada banyak jenis pengeluaran, bukan cuma makan */}
          <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f8f9fd] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  Mau patungan apa aja,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    tinggal masukin.
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  Satu liburan, banyak jenis pengeluaran, semua bisa langsung dicatat di sini.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                {[
                  {
                    emoji: "🚗",
                    title: "Sewa Kendaraan",
                    subtitle: "Mobil, motor, sepeda",
                    image: "/img/split-bill-liburan/sewa-mobil.png",
                    imageAlt: "Sewa mobil buat mobilitas selama liburan",
                  },
                  {
                    emoji: "⛽",
                    title: "Bensin & Tol",
                    subtitle: "Bensin, tol, parkir",
                    image: "/img/split-bill-liburan/isi-bensin.png",
                    imageAlt: "Isi bensin mobil sewaan",
                  },
                  {
                    emoji: "🏨",
                    title: "Penginapan",
                    subtitle: "Villa, hotel, Airbnb",
                    image: "/img/split-bill-liburan/villa-seminyak.png",
                    imageAlt: "Villa di Seminyak buat nginep squad liburan",
                  },
                  {
                    emoji: "🛍️",
                    title: "Oleh-oleh",
                    subtitle: "Souvenir, snack, titipan",
                    image: "/img/split-bill-liburan/oleh-oleh.png",
                    imageAlt: "Belanja oleh-oleh dan souvenir liburan",
                  },
                  {
                    emoji: "🍜",
                    title: "Makan Besar",
                    subtitle: "Dinner, lunch, brunch",
                    image: "/img/split-bill-liburan/makan-siang.png",
                    imageAlt: "Makan siang bareng squad liburan",
                  },
                  {
                    emoji: "☕",
                    title: "Nongkrong",
                    subtitle: "Cafe, kopi, jajan",
                    image: "/img/split-bill-liburan/cafe-canggu.png",
                    imageAlt: "Nongkrong brunch di cafe kekinian daerah Canggu",
                  },
                  {
                    emoji: "🎟️",
                    title: "Tiket & Wisata",
                    subtitle: "Tiket masuk, wahana",
                    image: "/img/split-bill-liburan/pantai-melasti.png",
                    imageAlt: "Tiket masuk Pantai Melasti Bali",
                  },
                  {
                    emoji: "🤿",
                    title: "Aktivitas Air",
                    subtitle: "Snorkeling, diving",
                    image: "/img/split-bill-liburan/aktivitas-air.png",
                    imageAlt: "Snorkeling dan aktivitas air selama liburan",
                  },
                ].map((useCase, index) => (
                  <div
                    key={useCase.title}
                    className="relative aspect-square rounded-md overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={useCase.image}
                      alt={useCase.imageAlt}
                      fill
                      loading={index < 4 ? "eager" : "lazy"}
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 23vw, 280px"
                    />
                    <span className="absolute top-2.5 left-2.5 text-lg sm:text-xl drop-shadow" aria-hidden="true">
                      {useCase.emoji}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-3.5 px-3">
                      <h3 className="text-white font-black text-lg sm:text-2xl leading-tight">
                        {useCase.title}
                      </h3>
                      <p className="text-white/85 text-sm sm:text-base font-semibold leading-tight mt-1">
                        {useCase.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Before vs After — transformasi visual, section baru khusus buat conversion */}
          <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
            {/* Decorative blurry gradients — rose di sisi "sebelum", biru di sisi "setelah" */}
            <div className="absolute top-1/3 left-0 w-72 h-72 bg-rose-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  Dulu Ribet.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    Sekarang Tinggal Share.
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  Gak perlu lagi ribet catat manual, semua otomatis kehitung dari struk yang kamu upload.
                </p>
              </div>

              <div className="relative grid md:grid-cols-2 gap-8 md:gap-6 lg:gap-10">
                {/* Connector — cuma muncul di desktop, di tengah dua kartu */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-lg bg-white border-2 border-slate-100 shadow-lg items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-primary" strokeWidth={2.5} />
                </div>

                {/* Sebelum */}
                <div className="rounded-md border border-rose-100 bg-gradient-to-b from-rose-50/60 to-white p-6 sm:p-8">
                  <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-rose-500">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    Sebelum SplitBill
                  </h3>
                  <div className="mt-6 space-y-4">
                    {[
                      { icon: Camera, label: "17 foto struk numpuk di galeri" },
                      { icon: Calculator, label: "Ngitung manual pakai kalkulator" },
                      { icon: MessageCircle, label: "23 chat WhatsApp bolak-balik nagih" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-white border border-rose-100 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-rose-400" strokeWidth={2} />
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-slate-600">
                          {item.label}
                        </p>
                      </div>
                    ))}
                    <div className="rounded-md bg-white border border-rose-100 px-4 py-3 mt-2">
                      <p className="text-sm italic font-semibold text-slate-500">
                        &ldquo;Bro, gue kurang transfer berapa?&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wide pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      30+ menit buang waktu
                    </div>
                  </div>
                </div>

                {/* Setelah */}
                <div className="rounded-md border-2 border-primary/25 bg-gradient-to-b from-primary/5 to-white shadow-[0_4px_20px_-4px_rgba(71,159,234,0.12)] p-6 sm:p-8">
                  <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-primary">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    Setelah SplitBill
                  </h3>
                  <div className="mt-6">
                    {[
                      { icon: Camera, label: "Upload struk" },
                      { icon: Sparkles, label: "Otomatis dihitung" },
                      { icon: Users, label: "Pilih siapa yang ikut" },
                      { icon: Share2, label: "Share ke WhatsApp" },
                    ].map((step) => (
                      <div key={step.label}>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                            <step.icon className="w-4 h-4 text-white" strokeWidth={2} />
                          </div>
                          <p className="text-sm sm:text-base font-bold text-slate-800">
                            {step.label}
                          </p>
                        </div>
                        <div className="w-10 flex justify-center my-1">
                          <ArrowDown className="w-4 h-4 text-primary/30" strokeWidth={2.5} />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 bg-success/10 rounded-md px-4 py-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <p className="text-sm sm:text-base font-black text-success">Beres!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6.3 Cara kerja — layout beda dari LP utama (list vertikal), tapi text sizing ikutin skala LP utama */}
          <section id="cara-pakai" className="py-16 sm:py-24 scroll-mt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                  Cara Kerja Split Bill{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-primary">
                    Tanpa Ribet
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  Ala Split Later, kumpulin struk dulu, itung-itungnya belakangan.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-black text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Foto atau upload struk kapan aja
                    </h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mt-2">
                      Selama liburan berlangsung, gak perlu langsung diitung di tempat. Simpan
                      dulu, lanjut nongkrong.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-black text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-primary" />
                      Assign siapa bayar apa, atau split rata
                    </h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mt-2">
                      Fleksibel, mau dibagi per item atau rata aja, tinggal pilih pas udah siap
                      diitung.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-black text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-primary" />
                      Generate rincian, share ke grup WA
                    </h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mt-2">
                      Pas udah santai di rumah, tinggal generate rincian dan share link. Temen
                      tinggal transfer.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 font-medium text-center mt-10">
                Butuh split di tempat, bukan belakangan?{" "}
                <Link href="/split-bill" className="text-primary font-bold underline underline-offset-2">
                  Coba fitur split bill biasa
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 6.4 Social proof — reuse existing testimonials (client-fetched, generic) */}
          <TestimonialsSection />

          {/* 6.6 FAQ — reuse komponen yang sama dengan LP utama, scoped ke FAQ liburan */}
          <FAQSectionHomepage
            faqs={liburanFaqs}
            title={
              <>
                Pertanyaan Seputar{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Split Bill Liburan
                </span>
              </>
            }
            subtitle="Masih ragu? Ini jawaban buat pertanyaan yang paling sering muncul."
            viewAllHref={null}
            defaultOpenFirst
          />

          {/* 6.7 CTA penutup — full-width promo banner nempel footer, reuse komponen PromoBanner yang sama dipakai /split-later dkk */}
          <PenutupPromoBanner />
        </main>

        <HomepageFooter />
      </div>
    </>
  );
}
