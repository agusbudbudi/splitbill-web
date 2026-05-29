export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category:
    | "umum"
    | "split-bill"
    | "invoice"
    | "privasi"
    | "akun"
    | "shared-goals"
    | "collect-money"
    | "wallet";
  showOnLanding: boolean;
}

export const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Apakah SplitBill gratis digunakan?",
    answer:
      "SplitBill tersedia dalam dua paket. Paket Gratisan (Rp 0/selamanya) sudah termasuk 5x quota scan struk AI, semua fitur split bill dasar, dan share rincian ke WhatsApp — lebih dari cukup untuk patungan sesekali. Upgrade ke Paket Premium (Rp 15K/bulan) untuk scan struk tanpa batas, OCR Pro yang lebih ngebut, invoice premium, statistik keuangan, dan bebas iklan.",
    category: "umum",
    showOnLanding: true,
  },
  {
    id: "2",
    question: "Apakah saya perlu buat akun untuk pakai?",
    answer:
      "Tidak wajib! Kamu bisa langsung pakai fitur Split Bill tanpa daftar sama sekali. Akun diperlukan hanya jika kamu ingin menyimpan riwayat transaksi secara permanen di cloud, menggunakan fitur Shared Goals, Collect Money, atau berlangganan Premium.",
    category: "akun",
    showOnLanding: true,
  },
  {
    id: "3",
    question: "Data saya disimpan di mana?",
    answer:
      "Jika kamu tidak login, data transaksi disimpan secara lokal di browsermu (LocalStorage) dan hanya bisa diakses dari perangkat tersebut. Jika kamu login, data tersimpan aman di server kami yang terenkripsi dan bisa diakses dari perangkat mana saja kapan saja.",
    category: "privasi",
    showOnLanding: true,
  },
  {
    id: "4",
    question: "Gimana kalau struk saya panjang banget?",
    answer:
      "Tenang! AI Scan kami sudah dirancang untuk membaca struk yang panjang sekalipun. Pastikan pencahayaan cukup dan tulisan pada struk terlihat jelas saat difoto. Untuk struk yang sangat panjang, coba potret dalam kondisi terbentang rata dan tidak terlipat.",
    category: "split-bill",
    showOnLanding: true,
  },
  {
    id: "5",
    question: "Bisakah saya bagi tagihan dengan jumlah beda-beda?",
    answer:
      "Pastinya! SplitBill mendukung pembagian per item (siapa makan apa), pembagian merata, hingga pembagian custom per orang. Pajak (PPN), service charge, dan diskon pun otomatis dihitung proporsional per item menu.",
    category: "split-bill",
    showOnLanding: true,
  },
  {
    id: "6",
    question: "Apa saja yang didapat di Paket Premium?",
    answer:
      "Paket Premium (Rp 15K/bulan) memberikan kamu: scan struk AI tanpa batas kuota, OCR Pro yang lebih cepat & akurat, desain link invoice premium yang bisa dikustomisasi, statistik keuangan & analisis pengeluaran bulanan, serta pengalaman bebas iklan. Cocok buat kamu yang sering nongkrong dan hobi kulineran bareng circle.",
    category: "umum",
    showOnLanding: true,
  },
  {
    id: "7",
    question: "Bagaimana cara share tagihan ke teman?",
    answer:
      "Setelah selesai menghitung, kamu akan mendapatkan ringkasan tagihan lengkap. Klik tombol 'Share ke WhatsApp' untuk kirim rincian sekaligus info rekening/e-wallet ke teman-temanmu. Mereka tinggal buka link, lihat berapa yang harus dibayar, dan langsung transfer.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "8",
    question: "Seberapa akurat AI Scan struk-nya?",
    answer:
      "Akurasi AI Scan kami sangat tinggi (di atas 95%) untuk foto struk dengan kondisi baik. Pada Paket Premium, kamu mendapatkan akses OCR Pro yang lebih canggih dengan akurasi lebih tinggi bahkan untuk struk yang agak buram atau miring. Kami selalu sarankan untuk review cepat hasil scan sebelum proses tagihan.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "9",
    question: "Berapa lama riwayat transaksi disimpan?",
    answer:
      "Jika tidak login, data tersimpan di browser selama kamu tidak menghapus data situs (cache). Jika login, semua riwayat transaksi tersimpan permanen di cloud dan tidak akan hilang meskipun kamu ganti perangkat atau hapus cache.",
    category: "privasi",
    showOnLanding: false,
  },
  {
    id: "10",
    question: "Bagaimana cara mengganti mata uang?",
    answer:
      "Saat ini SplitBill fokus pada Rupiah (IDR). Namun angka nominal tetap fleksibel sehingga kamu bisa menggunakannya untuk referensi mata uang lain jika diperlukan.",
    category: "umum",
    showOnLanding: false,
  },
  {
    id: "11",
    question: "Apakah bisa digunakan di iPhone dan Android?",
    answer:
      "Tentu! SplitBill adalah Progressive Web App (PWA) yang bisa diakses lewat browser di perangkat apa pun — iPhone, Android, maupun laptop. Kamu juga bisa 'Add to Home Screen' agar muncul seperti aplikasi native di gadgetmu.",
    category: "umum",
    showOnLanding: false,
  },
  {
    id: "12",
    question: "Bisa tambahkan pajak dan service charge?",
    answer:
      "Bisa banget. Di fitur 'Biaya Tambahan', kamu bisa input Pajak (PPN), Service Charge, maupun diskon dalam format persen (%) atau nominal rupiah. Semua akan dikalkulasi secara proporsional sesuai harga masing-masing menu.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "13",
    question: "Foto struknya harus satu per satu?",
    answer:
      "Untuk hasil terbaik, sebaiknya satu struk per foto. Jika struknya sangat panjang, AI Scan kami sudah bisa menangani foto memanjang dengan baik. Pastikan seluruh bagian struk terlihat jelas dalam satu frame.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "14",
    question: "Apakah ada aplikasi di App Store/Play Store?",
    answer:
      "Saat ini SplitBill tersedia sebagai Web App yang dioptimalkan untuk mobile. Kamu cukup buka di browser lalu pilih 'Add to Home Screen' agar muncul dan terasa seperti aplikasi biasa di layar HP-mu.",
    category: "umum",
    showOnLanding: false,
  },
  {
    id: "15",
    question: "Bagaimana cara hapus akun?",
    answer:
      "Kamu bisa menghapus akun melalui menu Pengaturan Profil. Perlu diingat bahwa semua data yang sudah dihapus tidak dapat dikembalikan, termasuk riwayat transaksi dan data langganan Premium.",
    category: "akun",
    showOnLanding: false,
  },
  {
    id: "16",
    question: "Apa itu fitur Invoice di SplitBill?",
    answer:
      "Fitur Invoice memungkinkan kamu membuat tagihan profesional yang rapi dan estetik. Kamu bisa menambahkan rincian item, pajak, informasi rekening pembayaran, dan catatan. Pengguna Premium mendapatkan akses desain invoice yang lebih premium dan bisa dikustomisasi sesuai brand.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "17",
    question: "Apakah saya bisa kustomisasi tampilan invoice?",
    answer:
      "Bisa! Khusus Paket Premium, kamu bisa mengatur nama bisnis, logo, alamat, catatan kaki, hingga tema warna sesuai brand-mu agar invoice terlihat lebih profesional dan terpercaya.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "18",
    question: "Format apa saja yang didukung untuk sharing invoice?",
    answer:
      "Kamu bisa membagikan invoice sebagai link interaktif (web view) yang bisa dibuka di browser, atau mengunduhnya sebagai gambar/PDF yang siap dikirim via WhatsApp, email, maupun platform lainnya.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "19",
    question: "Bisakah saya membuat invoice tanpa harus split bill?",
    answer:
      "Tentu saja. SplitBill menyediakan Invoice Builder mandiri untuk kamu yang ingin membuat tagihan profesional secara langsung tanpa harus melewati proses bagi tagihan kelompok terlebih dahulu.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "20",
    question: "Apa itu fitur Shared Goals?",
    answer:
      "Shared Goals adalah fitur nabung bareng untuk tujuan tertentu bersama circle-mu — misalnya liburan, beli kado, atau makan spesial. Kamu bisa pantau progress tabungan semua anggota secara real-time dan transparan.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "21",
    question: "Gimana cara mulai Shared Goals?",
    answer:
      "Klik menu 'Shared Goals', buat tujuan baru (Create Goal), tentukan nama dan target nominal, lalu ajak teman-temanmu bergabung. Setiap anggota bisa mencatat kontribusi mereka masing-masing.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "22",
    question: "Apakah uang tabungan Shared Goals disimpan di aplikasi?",
    answer:
      "Tidak. SplitBill hanya berfungsi sebagai pencatat dan pemantau progress tabungan agar transparan untuk semua anggota. Uang fisik tetap disimpan oleh bendahara atau di rekening masing-masing sesuai kesepakatan kelompok.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "23",
    question: "Bisakah saya membagikan progress tabungan ke teman?",
    answer:
      "Bisa banget! Kamu bisa membagikan ringkasan progress tabungan dalam bentuk link interaktif atau gambar yang siap dishare ke grup WhatsApp agar semua anggota bisa pantau perkembangannya.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "24",
    question: "Apa bedanya Shared Goals dengan Split Bill?",
    answer:
      "Split Bill digunakan untuk membagi tagihan yang sudah terjadi (misalnya abis makan). Shared Goals digunakan untuk mengumpulkan dana bersama menuju tujuan di masa depan (misalnya liburan bareng). Dua fitur berbeda untuk dua kebutuhan yang berbeda.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "25",
    question: "Apa itu fitur Collect Money (Patungan)?",
    answer:
      "Collect Money adalah fitur patungan praktis untuk keperluan tanpa struk fisik — seperti iuran kas, kado ulang tahun teman, atau donasi. Kamu cukup tentukan nominal target atau buat patungan terbuka, lalu bagikan link-nya ke semua peserta.",
    category: "collect-money",
    showOnLanding: false,
  },
  {
    id: "26",
    question: "Gimana cara pakai fitur Patungan?",
    answer:
      "Buka menu 'Collect Money', masukkan judul kegiatan dan target dana (boleh dikosongkan untuk patungan terbuka). Setelah itu, bagikan link patungan ke teman-teman agar mereka bisa melihat rincian dan mencatat pembayaran masing-masing.",
    category: "collect-money",
    showOnLanding: false,
  },
  {
    id: "27",
    question: "Apa bedanya Patungan dengan Shared Goals?",
    answer:
      "Patungan (Collect Money) biasanya untuk kebutuhan yang bersifat segera dan sekali jalan — seperti iuran atau beli kado. Shared Goals lebih cocok untuk nabung bersama dalam jangka waktu tertentu menuju target besar seperti liburan atau pembelian besar.",
    category: "collect-money",
    showOnLanding: false,
  },
  {
    id: "28",
    question: "Apa itu fitur Wallet di SplitBill?",
    answer:
      "Fitur Wallet adalah tempat kamu menyimpan informasi rekening dan akun e-wallet (BCA, Mandiri, GoPay, OVO, DANA, dll). Data ini otomatis ditampilkan saat kamu menagih ke teman agar transfer jadi lebih mudah dan tidak ada salah tujuan.",
    category: "wallet",
    showOnLanding: false,
  },
  {
    id: "29",
    question: "Apakah saldonya asli dan bisa ditarik?",
    answer:
      "Tidak. Wallet di sini adalah kartu nama digital untuk informasi pembayaran saja. SplitBill tidak menyimpan, mengelola, atau memproses uang riil dalam bentuk apapun.",
    category: "wallet",
    showOnLanding: false,
  },
  {
    id: "30",
    question: "Berapa banyak akun bank yang bisa saya simpan?",
    answer:
      "Kamu bisa menyimpan sebanyak yang kamu butuhkan. Saat mengirim tagihan, kamu tinggal pilih akun mana yang ingin ditampilkan kepada teman yang akan transfer.",
    category: "wallet",
    showOnLanding: false,
  },
];
