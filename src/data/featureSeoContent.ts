import { faqData } from "@/data/faqData";
import { pickFaqs, type FeatureSeoFaq } from "@/components/seo/FeatureSeoSection";

export interface FeatureSeoContent {
  title: string;
  intro: string[];
  stepsTitle: string;
  steps: string[];
  guideHref?: string;
  guideLabel?: string;
  faqs: FeatureSeoFaq[];
}

// Server-rendered explainer copy for the interactive tool pages. Keep it in
// sync with what the tool actually does; never claim features that don't exist.
export const featureSeoContent = {
  splitBill: {
    title: "Split Bill Online Gratis: Bagi Tagihan Tanpa Ribet",
    intro: [
      "SplitBill adalah kalkulator split bill online gratis buat bagi tagihan makan, nongkrong, atau belanja bareng teman. Tinggal masukin siapa aja yang ikut, catat siapa pesan apa, dan SplitBill langsung ngitung berapa yang harus dibayar tiap orang, lengkap sama siapa transfer ke siapa.",
      "Pajak restoran (PPN), service charge, ongkir, sampai diskon bisa kamu tambahin sebagai biaya tambahan. Pilih mau dibagi rata ke semua orang atau proporsional sesuai pesanan masing-masing, jadi yang pesan lebih banyak ikut nanggung pajak lebih besar. Gak ada lagi drama selisih seribu dua ribu.",
      "Semuanya jalan langsung dari browser, tanpa install aplikasi dan tanpa wajib daftar akun. Mau lebih cepat? Foto struknya, AI Scan bakal baca item dan harga otomatis (cukup login gratis, paket gratisan dapat 5x kuota scan). Hasilnya bisa langsung kamu share ke grup WhatsApp dalam bentuk gambar rincian yang rapi.",
      "Cocok buat makan di restoran, patungan kos, arisan, sampai liburan bareng yang struknya numpuk. Teman kamu juga gak perlu punya akun SplitBill buat lihat rinciannya.",
    ],
    stepsTitle: "Cara cepat split bill",
    steps: [
      "Tambah nama teman yang ikut patungan.",
      "Input pengeluaran manual, atau foto struk dan biarin AI Scan yang baca.",
      "Atur pajak dan service charge, pilih bagi rata atau proporsional.",
      "Cek ringkasan siapa bayar berapa, lalu share rinciannya ke WhatsApp.",
    ],
    guideHref: "/split-bill/cara-pakai",
    guideLabel: "Lihat cara pakai Split Bill selengkapnya",
    faqs: pickFaqs(faqData, ["1", "2", "12", "5", "7"]),
  },
  invoice: {
    title: "Buat Invoice Online Gratis, Rapi dan Siap Kirim",
    intro: [
      "Butuh nagih klien, jualan online, atau minta ganti uang talangan ke teman? Invoice Builder dari SplitBill bantu kamu bikin invoice online gratis yang rapi dalam beberapa menit, tanpa install aplikasi dan tanpa harus jago desain.",
      "Isi detail invoice, data pengirim dan penerima tagihan, lalu tambahin daftar item lengkap dengan jumlah dan harganya. Total, pajak, sampai nominal terbilang dalam bahasa Indonesia dihitung otomatis, jadi gak ada lagi salah hitung manual di kalkulator.",
      "Cantumin rekening bank atau e-wallet tujuan pembayaran plus syarat dan ketentuan biar penerima tahu harus transfer ke mana dan kapan. Sebelum dikirim, cek dulu tampilan akhirnya, lalu download sebagai PDF dan kirim lewat WhatsApp, email, atau platform lain.",
      "Cocok buat freelancer, usaha kecil, panitia acara, sampai kamu yang sering jadi bendahara dadakan di circle sendiri. Invoice bisa dibuat langsung tanpa harus lewat proses split bill dulu, dan data rekening yang udah kamu simpan bisa dipakai lagi buat invoice berikutnya.",
    ],
    stepsTitle: "Cara cepat bikin invoice",
    steps: [
      "Isi detail invoice: nomor, tanggal, dan jatuh tempo.",
      "Masukin data pengirim dan penerima tagihan.",
      "Tambah item, jumlah, dan harga. Totalnya dihitung otomatis.",
      "Pilih metode pembayaran dan tulis syarat dan ketentuan.",
      "Preview hasilnya, lalu download PDF dan kirim ke penerima.",
    ],
    faqs: pickFaqs(faqData, ["16", "19", "18", "17"]),
  },
  collectMoney: {
    title: "Collect Money: Kumpulin Iuran dan Patungan Online",
    intro: [
      "Collect Money dari SplitBill bantu kamu ngumpulin uang bareng tanpa harus nagih satu-satu di grup chat. Pas buat iuran kas kelas atau kantor, patungan kado ulang tahun, sewa lapangan futsal, sampai donasi kecil-kecilan di komunitas.",
      "Bikin sesi patungan, isi judul kegiatan dan target dana (boleh juga dibiarin terbuka), lalu masukin siapa aja yang ikut. Setiap ada yang transfer, tinggal tandai lunas. Progress terkumpul dan daftar siapa yang belum bayar kelihatan jelas, jadi bendahara gak perlu bikin catatan manual lagi.",
      "Abis split bill? Hasil settlement bisa langsung diubah jadi tracker Collect Money sekali klik, biar kamu bisa pantau siapa yang udah bayar bagiannya. Status pembayaran juga bisa dibagikan ke grup WhatsApp dalam bentuk gambar, jadi semua orang lihat data yang sama dan gak ada yang merasa ketinggalan info.",
      "Semua jalan langsung dari browser tanpa install aplikasi. SplitBill cuma mencatat, uangnya tetap ditransfer langsung ke rekening bendahara sesuai kesepakatan, jadi gak ada dana yang nyangkut di aplikasi.",
    ],
    stepsTitle: "Cara cepat bikin patungan",
    steps: [
      "Buat sesi patungan baru, isi judul dan target dana.",
      "Tambah peserta yang ikut iuran.",
      "Bagikan rinciannya ke grup supaya semua tahu nominalnya.",
      "Tandai lunas tiap ada yang transfer dan pantau progress-nya.",
    ],
    faqs: pickFaqs(faqData, ["25", "26", "27"]),
  },
  sharedGoals: {
    title: "Shared Goals: Nabung Bareng Teman Buat Tujuan Bersama",
    intro: [
      "Rencana liburan bareng sering gagal karena dananya gak kekumpul? Shared Goals dari SplitBill bantu kamu dan circle nabung bareng menuju satu target, entah itu trip ke Bali, kado nikahan teman, atau makan-makan spesial akhir tahun.",
      "Buat goal baru, tentuin nama dan target nominal, lalu ajak teman-teman gabung. Setiap anggota bisa nyatet kontribusinya masing-masing beserta tanggalnya, jadi progress tabungan kelihatan transparan buat semua orang, termasuk siapa yang udah rajin setor dan siapa yang masih ketinggalan. Gak ada lagi pertanyaan \"udah kekumpul berapa sih?\" di grup chat.",
      "SplitBill cuma jadi pencatat dan pemantau progress. Uangnya tetap dipegang bendahara atau disimpan di rekening masing-masing sesuai kesepakatan, jadi kamu tetap pegang kendali penuh.",
      "Progress tabungan bisa dibagikan ke grup WhatsApp dalam bentuk gambar biar semua makin semangat nabung. Kalau ada pengeluaran bareng dari dana tersebut, goal juga bisa dilanjutkan ke Split Bill buat settlement akhir. Semuanya jalan langsung dari browser, tanpa install aplikasi, dan bisa dibuka dari HP maupun laptop.",
    ],
    stepsTitle: "Cara cepat mulai nabung bareng",
    steps: [
      "Buat goal baru, isi nama dan target nominal.",
      "Ajak teman yang mau ikut nabung.",
      "Catat setiap kontribusi masuk beserta tanggalnya.",
      "Pantau progress dan share ke grup biar semua semangat.",
    ],
    guideHref: "/shared-goals/cara-pakai",
    guideLabel: "Lihat cara pakai Shared Goals selengkapnya",
    faqs: pickFaqs(faqData, ["20", "21", "22", "24", "23"]),
  },
} satisfies Record<string, FeatureSeoContent>;
