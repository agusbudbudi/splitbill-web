import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatToIDR } from "@/lib/utils";

const useCases = [
  {
    image: "/img/cara-pakai/split-bill/ai-scan-struk.png",
    tint: "from-sky-100 to-blue-50",
    feature: "AI Scan",
    title: "Makan di restoran",
    body: "Foto struknya, AI Scan baca item dan harga, lalu kamu tinggal pilih siapa makan apa. Yang pesan steak gak perlu dibayarin sama yang cuma pesan es teh, semua bayar sesuai pesanannya sendiri.",
    href: "/split-bill",
    cta: "Coba Split Bill",
  },
  {
    image: "/img/cara-pakai/split-bill/auto-track.png",
    tint: "from-emerald-100 to-teal-50",
    feature: "Collect Money",
    title: "Patungan kos dan tagihan bulanan",
    body: "Listrik, wifi, galon, sampai iuran kebersihan bisa dibagi rata ke semua penghuni dalam hitungan detik. Pakai Collect Money buat nandain siapa yang udah transfer, biar gak ada yang lupa bayar.",
    href: "/collect-money",
    cta: "Coba Collect Money",
  },
  {
    image: "/img/cara-pakai/split-later/quick-capture.png",
    tint: "from-amber-100 to-orange-50",
    feature: "Split Later",
    title: "Liburan bareng",
    body: "Struk numpuk selama trip? Kumpulin dulu pakai Split Later, hitungnya belakangan pas udah pulang. Settlement dari semua struk digabung jadi satu, jadi transfernya cukup sekali per orang.",
    href: "/split-later/cara-pakai",
    cta: "Lihat Split Later",
  },
];

// Worked example shown next to the tax copy: 4 people, Rp400.000 subtotal,
// service 5% then tax 10% on (subtotal + service). "Kamu" ordered Rp50.000.
const EXAMPLE = {
  subtotal: 400_000,
  people: 4,
  yours: 50_000,
  service: 20_000,
  tax: 42_000,
};
const extra = EXAMPLE.service + EXAMPLE.tax;
const evenShare = EXAMPLE.yours + extra / EXAMPLE.people;
const proportionalShare = EXAMPLE.yours * ((EXAMPLE.subtotal + extra) / EXAMPLE.subtotal);

/**
 * Server-rendered explainer below the feature cards: real use cases plus how
 * tax and service charge are split. Passed into HomepagePageClient as a slot
 * so the copy is plain HTML, not part of the client bundle.
 */
export function UseCasesSection() {
  return (
    <section className="relative py-16 sm:py-24 bg-[#f8f9fd] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 border border-primary/20 bg-white text-primary text-xs font-bold px-4 py-2 rounded-full mb-5">
            🍜 Nongkrong · 🏠 Kos · ✈️ Liburan
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Split bill buat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              semua momen patungan
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed text-balance">
            Patungan itu urusan sehari-hari. Masalahnya, ngitung siapa bayar berapa sering bikin
            canggung, apalagi kalau pesanannya beda-beda dan ada pajak plus service charge di struk.
            SplitBill bantu kamu beresin semuanya langsung dari browser, tanpa install aplikasi.
          </p>
        </div>

        {/* Use case cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {useCases.map((uc) => (
            <Link
              key={uc.title}
              href={uc.href}
              className="group flex md:flex-col bg-white rounded-xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.18)] hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`relative w-24 shrink-0 md:w-auto md:h-40 bg-gradient-to-br ${uc.tint} flex items-center justify-center`}>
                <span className="hidden md:inline-block absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {uc.feature}
                </span>
                <Image
                  src={uc.image}
                  alt=""
                  width={128}
                  height={128}
                  sizes="128px"
                  className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                />
              </div>
              <div className="flex flex-col flex-1 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-black text-slate-800 mb-1.5 md:mb-2">{uc.title}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-3 md:mb-5">{uc.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {uc.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Tax & service charge explainer + worked example */}
        <div className="mt-8 sm:mt-10 bg-white rounded-xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] p-6 sm:p-10 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/img/cara-pakai/split-bill/tax.png"
                alt=""
                width={56}
                height={56}
                sizes="56px"
                className="w-14 h-14 object-contain"
              />
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                Pajak dan service charge dihitung otomatis
              </h3>
            </div>
            <div className="space-y-4 text-base text-slate-600 font-medium leading-relaxed">
              <p>
                Masukin pajak restoran (PPN) dan service charge sekali aja, SplitBill yang bagi ke
                semua orang. Kamu bisa pilih dibagi rata, atau proporsional sesuai total pesanan
                masing-masing. Jadi yang pesan sedikit gak ikut nanggung pajak pesanan orang lain,
                gak ada lagi drama selisih seribu dua ribu.
              </p>
              <p>
                Hasilnya langsung bisa kamu share ke grup WhatsApp, lengkap dengan rincian per orang
                dan siapa transfer ke siapa.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/split-bill"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                Mulai split bill sekarang
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/split-bill/cara-pakai"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-primary/15 text-primary font-bold text-sm hover:bg-primary/5 transition-all"
              >
                Baca panduan cara pakainya
              </Link>
            </div>
          </div>

          {/* Worked example */}
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contoh: makan berempat
            </p>
            <dl className="space-y-2 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <dt>Subtotal pesanan</dt>
                <dd className="font-bold text-slate-800">{formatToIDR(EXAMPLE.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Service charge 5%</dt>
                <dd className="font-bold text-slate-800">{formatToIDR(EXAMPLE.service)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Pajak 10%</dt>
                <dd className="font-bold text-slate-800">{formatToIDR(EXAMPLE.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2">
                <dt>Pesanan kamu</dt>
                <dd className="font-bold text-slate-800">{formatToIDR(EXAMPLE.yours)}</dd>
              </div>
            </dl>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-md bg-white border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-400 mb-1">Bagi rata</p>
                <p className="text-lg sm:text-xl font-black text-slate-700">{formatToIDR(evenShare)}</p>
              </div>
              <div className="rounded-md bg-primary/5 border border-primary/30 p-4 relative">
                <span className="absolute -top-2.5 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  Lebih adil
                </span>
                <p className="text-xs font-bold text-primary mb-1">Proporsional</p>
                <p className="text-lg sm:text-xl font-black text-primary">{formatToIDR(proportionalShare)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3">
              Pesan paling sedikit? Dengan proporsional kamu hemat{" "}
              {formatToIDR(evenShare - proportionalShare)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
