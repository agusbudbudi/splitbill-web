import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Calculator,
  Camera,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Globe,
  HandCoins,
  Landmark,
  Percent,
  PiggyBank,
  Receipt,
  Share2,
  Target,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { faqData, type FAQItem } from "@/data/faqData";
import type { OverviewPoint } from "@/components/cara-pakai";

export interface FeatureSeoStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FeatureSeoContent {
  /** H1, split so the second part gets the brand gradient. */
  titlePrefix: string;
  titleHighlight: string;
  lead: string;
  points: OverviewPoint[];
  stepsTitleHighlight: string;
  stepsSubtitle: string;
  steps: FeatureSeoStep[];
  guideHref?: string;
  guideLabel?: string;
  featureName: string;
  faqs: FAQItem[];
  ctaTitle: string;
  ctaLabel: string;
}

const pickFaqs = (ids: string[]) =>
  ids.map((id) => faqData.find((f) => f.id === id)).filter((f): f is FAQItem => !!f);

// Server-rendered explainer copy for the interactive tool pages. Keep it in
// sync with what the tool actually does; never claim features that don't exist.
export const featureSeoContent = {
  splitBill: {
    titlePrefix: "Split Bill Online Gratis:",
    titleHighlight: "Bagi Tagihan Tanpa Ribet",
    lead: "SplitBill adalah kalkulator split bill online gratis buat bagi tagihan makan, nongkrong, atau belanja bareng teman. Tinggal masukin siapa aja yang ikut, catat siapa pesan apa, dan SplitBill langsung ngitung berapa yang harus dibayar tiap orang, lengkap sama siapa transfer ke siapa.",
    points: [
      {
        icon: Percent,
        title: "Pajak & service charge adil",
        description: "Pajak restoran (PPN), service charge, ongkir, sampai diskon bisa kamu tambahin sebagai biaya tambahan. Pilih mau dibagi rata ke semua orang atau proporsional sesuai pesanan masing-masing, jadi yang pesan lebih banyak ikut nanggung pajak lebih besar. Gak ada lagi drama selisih seribu dua ribu.",
      },
      {
        icon: Globe,
        title: "Tanpa install, tanpa wajib login",
        description: "Semuanya jalan langsung dari browser, tanpa install aplikasi dan tanpa wajib daftar akun. Mau lebih cepat? Foto struknya, AI Scan bakal baca item dan harga otomatis (cukup login gratis, paket gratisan dapat 5x kuota scan). Hasilnya bisa langsung kamu share ke grup WhatsApp dalam bentuk gambar rincian yang rapi.",
      },
      {
        icon: Users,
        title: "Cocok buat semua momen",
        description: "Cocok buat makan di restoran, patungan kos, arisan, sampai liburan bareng yang struknya numpuk. Teman kamu juga gak perlu punya akun SplitBill buat lihat rinciannya.",
      },
    ],
    stepsTitleHighlight: "dalam 4 Langkah",
    stepsSubtitle: "Dari tambah teman sampai share hasil, beres dalam hitungan menit.",
    steps: [
      { icon: UserPlus, title: "Tambah Teman", description: "Tambah nama teman yang ikut patungan." },
      { icon: Camera, title: "Input Pengeluaran", description: "Input manual, atau foto struk dan biarin AI Scan yang baca." },
      { icon: Percent, title: "Atur Pajak", description: "Atur pajak dan service charge, pilih bagi rata atau proporsional." },
      { icon: Share2, title: "Share ke WhatsApp", description: "Cek siapa bayar berapa, lalu share rinciannya ke grup." },
    ],
    guideHref: "/split-bill/cara-pakai",
    guideLabel: "Lihat panduan lengkap Split Bill",
    featureName: "Split Bill",
    faqs: pickFaqs(["2", "12", "5", "4", "7"]),
    ctaTitle: "Siap bagi tagihan tanpa drama?",
    ctaLabel: "Mulai split bill",
  },
  invoice: {
    titlePrefix: "Buat Invoice Online Gratis,",
    titleHighlight: "Rapi dan Siap Kirim",
    lead: "Butuh nagih klien, jualan online, atau minta ganti uang talangan ke teman? Invoice Builder dari SplitBill bantu kamu bikin invoice online gratis yang rapi dalam beberapa menit, tanpa install aplikasi dan tanpa harus jago desain.",
    points: [
      {
        icon: Calculator,
        title: "Total & terbilang otomatis",
        description: "Isi detail invoice, data pengirim dan penerima tagihan, lalu tambahin daftar item lengkap dengan jumlah dan harganya. Total, pajak, sampai nominal terbilang dalam bahasa Indonesia dihitung otomatis, jadi gak ada lagi salah hitung manual di kalkulator.",
      },
      {
        icon: Landmark,
        title: "Rekening & PDF siap kirim",
        description: "Cantumin rekening bank atau e-wallet tujuan pembayaran plus syarat dan ketentuan biar penerima tahu harus transfer ke mana dan kapan. Sebelum dikirim, cek dulu tampilan akhirnya, lalu download sebagai PDF dan kirim lewat WhatsApp, email, atau platform lain.",
      },
      {
        icon: BadgeCheck,
        title: "Buat freelancer sampai bendahara",
        description: "Cocok buat freelancer, usaha kecil, panitia acara, sampai kamu yang sering jadi bendahara dadakan di circle sendiri. Invoice bisa dibuat langsung tanpa harus lewat proses split bill dulu, dan data rekening yang udah kamu simpan bisa dipakai lagi buat invoice berikutnya.",
      },
    ],
    stepsTitleHighlight: "dalam 5 Langkah",
    stepsSubtitle: "Dari isi detail sampai download PDF, semua bisa dari HP.",
    steps: [
      { icon: FileText, title: "Detail Invoice", description: "Isi nomor, tanggal, dan jatuh tempo." },
      { icon: Users, title: "Pengirim & Penerima", description: "Masukin data pengirim dan penerima tagihan." },
      { icon: ClipboardList, title: "Tambah Item", description: "Isi item, jumlah, dan harga. Totalnya dihitung otomatis." },
      { icon: Wallet, title: "Metode Bayar", description: "Pilih rekening tujuan dan tulis syarat dan ketentuan." },
      { icon: Download, title: "Preview & Kirim", description: "Cek hasilnya, lalu download PDF dan kirim ke penerima." },
    ],
    featureName: "Invoice",
    faqs: pickFaqs(["16", "19", "18", "17"]),
    ctaTitle: "Siap bikin invoice pertama kamu?",
    ctaLabel: "Mulai bikin invoice",
  },
  collectMoney: {
    titlePrefix: "Collect Money:",
    titleHighlight: "Kumpulin Iuran dan Patungan Online",
    lead: "Collect Money dari SplitBill bantu kamu ngumpulin uang bareng tanpa harus nagih satu-satu di grup chat. Pas buat iuran kas kelas atau kantor, patungan kado ulang tahun, sewa lapangan futsal, sampai donasi kecil-kecilan di komunitas.",
    points: [
      {
        icon: CheckCircle2,
        title: "Tandai siapa yang udah bayar",
        description: "Bikin sesi patungan, isi judul kegiatan dan target dana (boleh juga dibiarin terbuka), lalu masukin siapa aja yang ikut. Setiap ada yang transfer, tinggal tandai lunas. Progress terkumpul dan daftar siapa yang belum bayar kelihatan jelas, jadi bendahara gak perlu bikin catatan manual lagi.",
      },
      {
        icon: Receipt,
        title: "Langsung dari hasil split bill",
        description: "Abis split bill? Hasil settlement bisa langsung diubah jadi tracker Collect Money sekali klik, biar kamu bisa pantau siapa yang udah bayar bagiannya. Status pembayaran juga bisa dibagikan ke grup WhatsApp dalam bentuk gambar, jadi semua orang lihat data yang sama dan gak ada yang merasa ketinggalan info.",
      },
      {
        icon: HandCoins,
        title: "Uang tetap di rekening kamu",
        description: "Semua jalan langsung dari browser tanpa install aplikasi. SplitBill cuma mencatat, uangnya tetap ditransfer langsung ke rekening bendahara sesuai kesepakatan, jadi gak ada dana yang nyangkut di aplikasi.",
      },
    ],
    stepsTitleHighlight: "dalam 4 Langkah",
    stepsSubtitle: "Bikin sesi, bagikan, lalu pantau sampai semua lunas.",
    steps: [
      { icon: Target, title: "Buat Sesi", description: "Buat sesi patungan baru, isi judul dan target dana." },
      { icon: UserPlus, title: "Tambah Peserta", description: "Masukin siapa aja yang ikut iuran." },
      { icon: Share2, title: "Bagikan", description: "Share rinciannya ke grup supaya semua tahu nominalnya." },
      { icon: CheckCircle2, title: "Tandai Lunas", description: "Tandai tiap ada yang transfer dan pantau progress-nya." },
    ],
    featureName: "Collect Money",
    faqs: pickFaqs(["25", "26", "27"]),
    ctaTitle: "Siap kumpulin iuran tanpa nagih satu-satu?",
    ctaLabel: "Mulai kumpulin iuran",
  },
  sharedGoals: {
    titlePrefix: "Shared Goals:",
    titleHighlight: "Nabung Bareng Teman Buat Tujuan Bersama",
    lead: "Rencana liburan bareng sering gagal karena dananya gak kekumpul? Shared Goals dari SplitBill bantu kamu dan circle nabung bareng menuju satu target, entah itu trip ke Bali, kado nikahan teman, atau makan-makan spesial akhir tahun.",
    points: [
      {
        icon: ClipboardList,
        title: "Kontribusi tercatat rapi",
        description: "Buat goal baru, tentuin nama dan target nominal, lalu ajak teman-teman gabung. Setiap anggota bisa nyatet kontribusinya masing-masing beserta tanggalnya, jadi progress tabungan kelihatan transparan buat semua orang, termasuk siapa yang udah rajin setor dan siapa yang masih ketinggalan. Gak ada lagi pertanyaan \"udah kekumpul berapa sih?\" di grup chat.",
      },
      {
        icon: PiggyBank,
        title: "Uang tetap di tangan kalian",
        description: "SplitBill cuma jadi pencatat dan pemantau progress. Uangnya tetap dipegang bendahara atau disimpan di rekening masing-masing sesuai kesepakatan, jadi kamu tetap pegang kendali penuh.",
      },
      {
        icon: Share2,
        title: "Share progress ke grup",
        description: "Progress tabungan bisa dibagikan ke grup WhatsApp dalam bentuk gambar biar semua makin semangat nabung. Kalau ada pengeluaran bareng dari dana tersebut, goal juga bisa dilanjutkan ke Split Bill buat settlement akhir. Semuanya jalan langsung dari browser, tanpa install aplikasi, dan bisa dibuka dari HP maupun laptop.",
      },
    ],
    stepsTitleHighlight: "dalam 4 Langkah",
    stepsSubtitle: "Tentuin target, ajak teman, lalu pantau progress bareng.",
    steps: [
      { icon: Target, title: "Buat Goal", description: "Isi nama dan target nominal tabungan." },
      { icon: UserPlus, title: "Ajak Teman", description: "Ajak teman yang mau ikut nabung." },
      { icon: PiggyBank, title: "Catat Setoran", description: "Catat setiap kontribusi masuk beserta tanggalnya." },
      { icon: Share2, title: "Pantau & Share", description: "Pantau progress dan share ke grup biar semua semangat." },
    ],
    guideHref: "/shared-goals/cara-pakai",
    guideLabel: "Lihat panduan lengkap Shared Goals",
    featureName: "Shared Goals",
    faqs: pickFaqs(["20", "21", "22", "24", "23"]),
    ctaTitle: "Siap wujudin goal bareng circle kamu?",
    ctaLabel: "Mulai nabung bareng",
  },
} satisfies Record<string, FeatureSeoContent>;
