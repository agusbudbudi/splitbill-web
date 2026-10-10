import Link from "next/link";
import { Utensils, Home, Plane } from "lucide-react";

const useCases = [
  {
    icon: Utensils,
    title: "Makan di restoran",
    body: "Foto struknya, AI Scan baca item dan harga, lalu kamu tinggal pilih siapa makan apa. Yang pesan steak gak perlu dibayarin sama yang cuma pesan es teh, semua bayar sesuai pesanannya sendiri.",
  },
  {
    icon: Home,
    title: "Patungan kos dan tagihan bulanan",
    body: "Listrik, wifi, galon, sampai iuran kebersihan bisa dibagi rata ke semua penghuni dalam hitungan detik. Pakai Collect Money buat nandain siapa yang udah transfer, biar gak ada yang lupa bayar.",
  },
  {
    icon: Plane,
    title: "Liburan bareng",
    body: "Struk numpuk selama trip? Kumpulin dulu pakai Split Later, hitungnya belakangan pas udah pulang. Settlement dari semua struk digabung jadi satu, jadi transfernya cukup sekali per orang.",
  },
];

/**
 * Server-rendered explainer below the feature cards: real use cases plus how
 * tax and service charge are split. Passed into HomepagePageClient as a slot
 * so the copy is plain HTML, not part of the client bundle.
 */
export function UseCasesSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#f8f9fd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Split bill buat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              semua momen patungan
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
            Patungan itu urusan sehari-hari. Masalahnya, ngitung siapa bayar berapa sering bikin
            canggung, apalagi kalau pesanannya beda-beda dan ada pajak plus service charge di struk.
            SplitBill bantu kamu beresin semuanya langsung dari browser, tanpa install aplikasi.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {useCases.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)]"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">{title}</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 sm:mt-12 space-y-4 text-base text-slate-600 font-medium leading-relaxed">
          <h3 className="text-xl font-black text-slate-800">
            Pajak dan service charge dihitung otomatis
          </h3>
          <p>
            Masukin pajak restoran (PPN) dan service charge sekali aja, SplitBill yang bagi ke semua
            orang. Kamu bisa pilih dibagi rata, atau proporsional sesuai total pesanan masing-masing.
            Contohnya, kalau pesanan kamu Rp100.000 dari total Rp400.000, kamu nanggung seperempat dari
            pajak dan service charge-nya. Adil buat yang pesan sedikit, gak ada lagi drama selisih
            seribu dua ribu.
          </p>
          <p>
            Hasilnya langsung bisa kamu share ke grup WhatsApp, lengkap dengan rincian per orang dan
            siapa transfer ke siapa.{" "}
            <Link href="/split-bill" className="text-primary font-bold hover:underline">
              Mulai split bill sekarang
            </Link>{" "}
            atau baca dulu{" "}
            <Link href="/split-bill/cara-pakai" className="text-primary font-bold hover:underline">
              panduan cara pakainya
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
