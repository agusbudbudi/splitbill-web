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
    question: "Apakah aplikasi ini benar-benar gratis?",
    answer:
      "Ya! SplitBill 100% gratis digunakan oleh siapa saja, kapan saja. Tidak ada biaya tersembunyi atau fitur yang dikunci di balik pembayaran.",
    category: "umum",
    showOnLanding: true,
  },
  {
    id: "2",
    question: "Apakah saya perlu buat akun untuk pakai?",
    answer:
      "Tidak wajib. Kamu bisa langsung pakai fitur Split Bill seketika. Akun hanya diperlukan jika kamu ingin menyimpan riwayat transaksi secara permanen di cloud agar tidak hilang saat hapus cache browser.",
    category: "akun",
    showOnLanding: true,
  },
  {
    id: "3",
    question: "Data saya disimpan di mana?",
    answer:
      "Secara default, semua data transaksi kamu disimpan secara lokal di browsermu (LocalStorage). Kami menjunjung tinggi privasi, sehingga kami tidak tahu apa yang kamu beli kecuali kamu login dan sengaja menyimpannya.",
    category: "privasi",
    showOnLanding: true,
  },
  {
    id: "4",
    question: "Gimana kalau struk saya panjang banget?",
    answer:
      "Tenang! Fitur AI Scan kami didesain untuk membaca struk yang panjang sekalipun. Pastikan saja pencahayaannya cukup dan tulisan di struk terlihat jelas saat difoto.",
    category: "split-bill",
    showOnLanding: true,
  },
  {
    id: "5",
    question: "Bisakah saya bagi tagihan dengan jumlah beda-beda?",
    answer:
      "Pastinya! Kami mendukung pembagian per item (Split per Item) atau pembagian merata. Kamu bahkan bisa menambahkan pajak dan biaya layanan secara proporsional.",
    category: "split-bill",
    showOnLanding: true,
  },
  {
    id: "6",
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Kamu bisa menambahkan berbagai metode pembayaran populer di Indonesia seperti GoPay, OVO, Dana, ShopeePay, serta transfer bank (BCA, Mandiri, dll).",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "7",
    question: "Bagaimana cara share tagihan ke teman?",
    answer:
      "Setelah selesai menghitung, kamu akan mendapatkan ringkasan tagihan. Kamu bisa langsung klik tombol 'Share ke WhatsApp' untuk mengirimkan rincian dan nomor rekeningmu ke teman-teman.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "8",
    question: "Apakah AI Scan selalu akurat?",
    answer:
      "Tingkat akurasi AI kami sangat tinggi (di atas 95%), namun hasil tetap bergantung pada kualitas foto. Kami menyarankan untuk selalu melakukan review cepat sebelum memproses tagihan.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "9",
    question: "Berapa lama riwayat transaksi disimpan?",
    answer:
      "Jika kamu tidak login, data disimpan selamanya di browsermu selama kamu tidak menghapus data situs (cache). Jika login, data akan tersimpan aman di cloud selamanya.",
    category: "privasi",
    showOnLanding: false,
  },
  {
    id: "10",
    question: "Bagaimana cara mengganti mata uang?",
    answer:
      "Saat ini kami fokus pada Rupiah (IDR). Namun, kamu bisa menggunakan angka nominal untuk mata uang apa pun karena sistem kami bersifat fleksibel.",
    category: "umum",
    showOnLanding: false,
  },
  {
    id: "11",
    question: "Apakah bisa digunakan di iPhone dan Android?",
    answer:
      "Tentu! SplitBill adalah Progressive Web App (PWA) yang bisa kamu akses melalui browser di perangkat apa pun, baik iOS maupun Android.",
    category: "umum",
    showOnLanding: false,
  },
  {
    id: "12",
    question: "Bisa tambahkan pajak dan service charge?",
    answer:
      "Bisa banget. Kami punya fitur 'Biaya Tambahan' di mana kamu bisa input Tax dan Service dalam persen atau nominal rupiah.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "13",
    question: "Foto struknya harus satu per satu?",
    answer:
      "Ya, untuk akurasi terbaik sebaiknya satu struk per foto. Jika struknya sangat panjang, AI Scan kami sudah cukup pintar untuk menangani foto yang memanjang.",
    category: "split-bill",
    showOnLanding: false,
  },
  {
    id: "14",
    question: "Apakah ada aplikasi di App Store/Play Store?",
    answer:
      "Saat ini kami tersedia sebagai Web App. Kamu cukup tambahkan ke Home Screen (Add to Home Screen) di gadgetmu agar muncul seperti aplikasi biasa.",
    category: "umum",
    showOnLanding: false,
  },
  {
    id: "15",
    question: "Bagaimana cara hapus akun?",
    answer:
      "Kamu bisa menghapus akun melalui menu Pengaturan Profil. Perlu diingat bahwa data yang sudah dihapus tidak dapat dikembalikan.",
    category: "akun",
    showOnLanding: false,
  },
  {
    id: "16",
    question: "Apa itu fitur Invoice di SplitBill?",
    answer:
      "Fitur Invoice memungkinkan kamu membuat rincian tagihan yang profesional. Kamu bisa menambahkan rincian item, pajak, hingga informasi rekening pembayaran dalam satu dokumen yang rapi.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "17",
    question: "Apakah saya bisa kustomisasi tampilan invoice?",
    answer:
      "Bisa! Kamu bisa mengatur nama bisnis, alamat, catatan kaki (footer), hingga memilih tema warna yang sesuai dengan brand kamu agar terlihat lebih profesional.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "18",
    question: "Format apa saja yang didukung untuk sharing invoice?",
    answer:
      "Kamu bisa membagikan invoice dalam bentuk link interaktif (web view) atau mengunduhnya sebagai gambar/PDF yang siap dikirim lewat WhatsApp atau email.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "19",
    question: "Bisakah saya membuat invoice tanpa harus split bill?",
    answer:
      "Tentu saja. Kami menyediakan 'Invoice Builder' khusus buat kamu yang ingin membuat tagihan profesional secara mandiri tanpa perlu melewati proses bagi tagihan kelompok.",
    category: "invoice",
    showOnLanding: false,
  },
  {
    id: "20",
    question: "Apa itu fitur Shared Goals?",
    answer:
      "Shared Goals adalah fitur yang membantu kamu dan teman-teman menabung bersama untuk tujuan tertentu, seperti liburan, beli kado, atau makan bersama. Kamu bisa memantau progress tabungan secara real-time.",
    category: "shared-goals",
    showOnLanding: true,
  },
  {
    id: "21",
    question: "Gimana cara mulai Shared Goals?",
    answer:
      "Kamu cukup klik menu 'Shared Goals' di halaman utama, buat tujuan baru (Create Goal), tentukan target nominal, dan ajak teman-temanmu untuk bergabung.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "22",
    question: "Apakah uang tabungan Shared Goals disimpan di aplikasi?",
    answer:
      "Tidak. SplitBill hanya berfungsi sebagai pencatat rincian tabungan agar transparan. Uang fisik tetap disimpan oleh bendahara atau di rekening masing-masing anggota sesuai kesepakatan kalian.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "23",
    question: "Bisakah saya membagikan progress tabungan ke teman?",
    answer:
      "Bisa banget! Kamu bisa membagikan ringkasan progress tabungan dalam bentuk link interaktif atau gambar estetik yang sudah kami siapkan untuk dishare ke grup WhatsApp.",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "24",
    question: "Apa bedanya Shared Goals dengan Split Bill?",
    answer:
      "Split Bill digunakan untuk membagi tagihan yang sudah dibayarkan (transaksi masa lalu), sedangkan Shared Goals digunakan untuk mengumpulkan uang demi rencana belanja atau kegiatan di masa depan (nabung bareng).",
    category: "shared-goals",
    showOnLanding: false,
  },
  {
    id: "25",
    question: "Apa itu fitur Collect Money (Patungan)?",
    answer:
      "Collect Money adalah fitur patungan praktis untuk keperluan yang tidak punya struk fisik, seperti iuran kas, kado teman, atau donasi. Kamu cukup tentukan nominal target atau buat patungan terbuka.",
    category: "collect-money",
    showOnLanding: true,
  },
  {
    id: "26",
    question: "Gimana cara pakai fitur Patungan?",
    answer:
      "Klik menu 'Collect Money', masukkan judul kegiatan dan target dana (opsional). Setelah itu, bagikan link patungan ke teman-teman agar mereka bisa melihat rincian pembayaran.",
    category: "collect-money",
    showOnLanding: false,
  },
  {
    id: "27",
    question: "Apa bedanya Patungan dengan Shared Goals?",
    answer:
      "Patungan (Collect Money) biasanya untuk iuran sekali jalan yang bersifat segera, sedangkan Shared Goals lebih untuk menabung bersama dalam jangka waktu tertentu untuk mencapai target besar.",
    category: "collect-money",
    showOnLanding: false,
  },
  {
    id: "28",
    question: "Apa itu fitur Wallet di SplitBill?",
    answer:
      "Fitur Wallet adalah tempat kamu menyimpan nomor rekening dan akun e-wallet (seperti BCA, GoPay, OVO). Data ini akan ditampilkan otomatis saat kamu menagih utang ke teman-teman.",
    category: "wallet",
    showOnLanding: true,
  },
  {
    id: "29",
    question: "Apakah saldonya asli dan bisa ditarik?",
    answer:
      "Tidak. Wallet di sini hanya sebagai kartu nama digital untuk informasi pembayaran. Kami tidak menyimpan uang atau saldo hasil patungan kamu.",
    category: "wallet",
    showOnLanding: false,
  },
  {
    id: "30",
    question: "Berapa banyak akun bank yang bisa saya simpan?",
    answer:
      "Kamu bisa menyimpan sebanyak mungkin akun bank atau e-wallet yang kamu punya. Kamu bisa memilih akun mana yang ingin ditampilkan pada setiap tagihan.",
    category: "wallet",
    showOnLanding: false,
  },
];
