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

// Worked example shown next to the tax copy, styled as a receipt: 4 people,
// service 5% then tax 10% on (subtotal + service). "Kamu" ordered the least.
const ORDERS = [
  { name: "Andi", amount: 150_000 },
  { name: "Budi", amount: 120_000 },
  { name: "Cici", amount: 80_000 },
  { name: "Kamu", amount: 50_000 },
];
const subtotal = ORDERS.reduce((sum, o) => sum + o.amount, 0);
const service = subtotal * 0.05;
const tax = (subtotal + service) * 0.1;
const total = subtotal + service + tax;
const yours = ORDERS.find((o) => o.name === "Kamu")!.amount;
const evenShare = yours + (service + tax) / ORDERS.length;
const proportionalShare = yours * (total / subtotal);

// Scalloped top/bottom edges for the receipt paper
const receiptEdgeMask =
  "radial-gradient(circle at 8px 0, transparent 6px, #000 6.5px) top / 16px 51% repeat-x, " +
  "radial-gradient(circle at 8px 100%, transparent 6px, #000 6.5px) bottom / 16px 51% repeat-x";

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
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Dari nongkrong, patungan kos, sampai liburan,{" "}
            <span className="text-primary font-bold">semua bisa di-split tanpa canggung</span>.
            Langsung dari browser, <span className="text-primary font-bold">tanpa install aplikasi</span>!
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

          {/* Worked example, styled as a receipt */}
          <div className="rounded-lg bg-slate-50 px-4 py-8 sm:px-10 flex justify-center">
            <div className="w-full max-w-sm drop-shadow-[0_10px_20px_rgba(15,23,42,0.10)] lg:rotate-1">
              <div
                className="bg-white px-6 pt-8 pb-9 font-mono text-[13px] text-slate-600"
                style={{ mask: receiptEdgeMask, WebkitMask: receiptEdgeMask }}
              >
                <div className="text-center">
                  <p className="font-bold text-slate-800 tracking-widest">WARUNG NONGKRONG</p>
                  <p className="text-[11px] text-slate-400">Contoh: makan berempat</p>
                </div>

                <div className="border-t border-dashed border-slate-300 my-4" />

                <dl className="space-y-1.5">
                  {ORDERS.map((o) => (
                    <div key={o.name} className="flex justify-between">
                      <dt>Pesanan {o.name}</dt>
                      <dd className={o.name === "Kamu" ? "font-bold text-slate-800" : undefined}>
                        {formatToIDR(o.amount)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="border-t border-dashed border-slate-300 my-4" />

                <dl className="space-y-1.5">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{formatToIDR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Service 5%</dt>
                    <dd>{formatToIDR(service)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Pajak 10%</dt>
                    <dd>{formatToIDR(tax)}</dd>
                  </div>
                </dl>

                <div className="border-t-4 border-double border-slate-300 my-4" />

                <div className="flex justify-between font-bold text-slate-800 text-sm">
                  <span>TOTAL</span>
                  <span>{formatToIDR(total)}</span>
                </div>

                <div className="border-t border-dashed border-slate-300 my-4" />

                <p className="text-center text-[11px] font-bold tracking-widest text-slate-400 mb-3">
                  BAGIAN KAMU
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-3 py-2 text-slate-400">
                    <span>Bagi rata</span>
                    <span className="line-through">{formatToIDR(evenShare)}</span>
                  </div>
                  <div className="relative flex justify-between items-center px-3 py-2.5 rounded-md bg-primary/5 border border-dashed border-primary/40 text-primary font-bold">
                    <span>Proporsional</span>
                    <span className="text-base">{formatToIDR(proportionalShare)}</span>
                    <span className="absolute -top-2.5 right-3 bg-emerald-500 text-white text-[10px] font-sans font-black px-2 py-0.5 rounded-full">
                      Lebih adil
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 my-4" />

                <p className="text-center text-[11px] text-slate-400 leading-relaxed">
                  Kamu hemat {formatToIDR(evenShare - proportionalShare)}
                  <br />
                  Terima kasih, sampai patungan berikutnya!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
