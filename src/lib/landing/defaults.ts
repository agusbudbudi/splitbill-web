import type { LandingContent } from "./types";

// Shipped fallback, used whenever the CMS is unreachable or returns something
// malformed, so the homepage (and its H1/copy for crawlers) never renders empty.
// Mirrors DEFAULT_LANDING_CONTENT in splitbill-be lib/landingPage.js.
export const DEFAULT_LANDING_CONTENT: LandingContent = {
  seo: {
    title: "Split Bill Online - Aplikasi Bagi Tagihan & Patungan Gratis",
    description: "Split bill online gratis: scan struk pakai AI, hitung pajak dan service charge otomatis, lalu bagi tagihan ke teman lewat WhatsApp. Tanpa install aplikasi.",
    socialTitle: "SplitBill: Split Bill Online, Bagi Tagihan Lebih Mudah",
    socialDescription: "",
    ogImage: {
      url: "/img/pwa-banner.png",
      alt: "SplitBill, aplikasi split bill online gratis untuk bagi tagihan bareng teman",
      width: 1200,
      height: 630
    },
    sameAs: [
      "https://www.instagram.com/splitbill.app/"
    ]
  },
  hero: {
    eyebrow: {
      text: "⚡ Foto Struk → Tagihan Jadi",
      badge: "NEW"
    },
    title: "Split Bill Online\nGratis: Scan Struk,\nBagi Tagihan",
    titleHighlight: "dalam 5 Detik",
    description: "Foto struk, AI otomatis membaca total belanja dan langsung membagi tagihan dengan adil. Gratis tanpa login.",
    primaryCta: {
      label: "Scan Struk Gratis",
      href: "/split-bill",
      icon: "Camera"
    },
    secondaryCta: {
      label: "Lihat Cara Pakainya",
      href: "#cara-pakai"
    },
    trustItems: [
      {
        icon: "Users",
        text: "5.000+ Tagihan dibuat",
        tone: "primary"
      },
      {
        icon: "Zap",
        text: "No login needed",
        tone: "emerald"
      }
    ],
    image: {
      url: "/img/hero-mockup.webp",
      alt: "Tampilan hasil split bill di aplikasi SplitBill dengan instruksi transfer dan rincian per orang",
      width: 1440,
      height: 1440
    },
    imageMobile: null
  },
  socialProof: {
    items: [
      {
        icon: "Zap",
        title: "Cuma 3 Step",
        desc: "Bikin list, scan struk, langsung bagi.",
        tone: "amber"
      },
      {
        icon: "UserCheck",
        title: "Gak Perlu Login",
        desc: "Langsung pakai instan tanpa drama OTP.",
        tone: "blue"
      },
      {
        icon: "Sparkles",
        title: "Scan Struk AI",
        desc: "Deteksi otomatis item dan hitung presisi.",
        tone: "emerald"
      }
    ]
  },
  howItWorks: {
    title: "3 Langkah Gampang,",
    titleHighlight: "Sat-Set Beres!",
    subtitle: "Gak pake ribet instal aplikasi atau daftar akun. Langsung cobain lewat web.",
    steps: [
      {
        icon: "Camera",
        title: "Foto / Upload Struk",
        description: "Tinggal cekrek struk makan-makan lo. Gak usah repot ketik ulang menu satu-satu.",
        image: {
          url: "/img/step-scan.jpg",
          alt: "Struk restoran sedang discan AI di layar SplitBill untuk membaca item dan harga"
        },
        tone: "primary"
      },
      {
        icon: "UserPlus",
        title: "Pilih Teman & Menu",
        description: "Assign siapa aja yang makan menu apa. Biar AI yang kalkulasiin pembagian pajaknya.",
        image: {
          url: "/img/step-add-friend.jpg",
          alt: "Layar tambah teman di SplitBill dengan daftar teman yang ikut patungan"
        },
        tone: "amber"
      },
      {
        icon: "Send",
        title: "Share Link Tagihan",
        description: "Kirim link rincian tagihan ke WhatsApp grup. Temen lo tinggal bayar via e-wallet/bank.",
        image: {
          url: "/img/step-share.jpg",
          alt: "Ringkasan tagihan split bill per orang yang dibagikan ke WhatsApp"
        },
        tone: "green"
      }
    ]
  },
  features: {
    title: "Semua yang lo butuhin buat",
    titleHighlight: "split bill tanpa drama",
    subtitle: "Bagi tagihan **sat set**, hitung patungan **anti ribet & akurat**. Link pembayaran langsung spill!",
    items: [
      {
        imageUrl: "/img/menu-split-bill.png",
        image: {
          url: "/img/cara-pakai/split-bill/2.png",
          alt: "Layar SplitBill saat AI membaca foto struk restoran"
        },
        tone: "blue",
        title: "Split Bill",
        description: "Foto struk biar AI hitung otomatis (Scan AI) atau bagi rincian secara manual. Sat-set!",
        badge: "Populer",
        href: "/split-bill",
        ctaLabel: "Coba Split Bill",
        guideHref: "/split-bill/cara-pakai",
        requiresLogin: false
      },
      {
        imageUrl: "/img/menu-split-later.png",
        image: {
          url: "/img/cara-pakai/split-later/1.png",
          alt: "Layar Split Later untuk memilih kategori acara seperti liburan atau nongkrong"
        },
        tone: "violet",
        title: "Split Later",
        description: "Nongkrong sepuasnya, kumpulin struknya, bagi tagihannya nanti pas santai.",
        badge: "Baru",
        href: "/split-later",
        ctaLabel: "Coba Split Later",
        guideHref: "/split-later/cara-pakai",
        requiresLogin: true
      },
      {
        imageUrl: "/img/menu-shared-goal.png",
        image: {
          url: "/img/cara-pakai/shared-goals/1.png",
          alt: "Form membuat Shared Goal dengan nama, target nominal, dan anggota"
        },
        tone: "emerald",
        title: "Shared Goals",
        description: "Nabung bareng squad buat rencana liburan, kado nikahan teman, atau impian bersama.",
        badge: "",
        href: "/shared-goals",
        ctaLabel: "Mulai Nabung",
        guideHref: "/shared-goals/cara-pakai",
        requiresLogin: false
      },
      {
        imageUrl: "/img/menu-collect-money.png",
        image: {
          url: "/img/menu-collect-money.png",
          alt: "Ilustrasi tangan menerima koin patungan"
        },
        tone: "amber",
        title: "Collect Money (Patungan)",
        description: "Bikin link patungan uang kas, sewa lapangan futsal, atau donasi secara transparan.",
        badge: "",
        href: "/collect-money",
        ctaLabel: "Bikin Patungan",
        guideHref: "",
        requiresLogin: false
      },
      {
        imageUrl: "/img/menu-invoice.png",
        image: {
          url: "/img/menu-invoice.png",
          alt: "Ilustrasi invoice digital dan pena"
        },
        tone: "rose",
        title: "Invoice",
        description: "Kirim rincian tagihan digital yang rapi, transparan, langsung ke WhatsApp.",
        badge: "",
        href: "/invoice",
        ctaLabel: "Buat Invoice",
        guideHref: "",
        requiresLogin: false
      },
      {
        imageUrl: "/img/menu-wallet.png",
        image: {
          url: "/img/menu-wallet.png",
          alt: "Ilustrasi dompet berisi kartu"
        },
        tone: "purple",
        title: "Wallet",
        description: "Kelola dana masuk dari teman, pantau saldo patungan squad, dan catat pengeluaran grup.",
        badge: "",
        href: "/wallet",
        ctaLabel: "Simpan Wallet",
        guideHref: "",
        requiresLogin: false
      }
    ]
  },
  featureShowcase: {
    title: "Satu aplikasi buat",
    titleHighlight: "semua urusan patungan",
    subtitle: "Dari bagi tagihan makan sampai nabung bareng, semua ada di SplitBill."
  },
  useCases: {
    eyebrow: "🍜 Nongkrong · 🏠 Kos · ✈️ Liburan",
    title: "Split bill buat",
    titleHighlight: "semua momen patungan",
    subtitle: "Dari nongkrong, patungan kos, sampai liburan, **semua bisa di-split tanpa canggung**. Langsung dari browser, **tanpa install aplikasi**!",
    cards: [
      {
        imageUrl: "/img/cara-pakai/split-bill/ai-scan-struk.png",
        tone: "blue",
        feature: "AI Scan",
        title: "Makan di restoran",
        body: "Foto struknya, AI Scan baca item dan harga, lalu kamu tinggal pilih siapa makan apa. Yang pesan steak gak perlu dibayarin sama yang cuma pesan es teh, semua bayar sesuai pesanannya sendiri.",
        href: "/split-bill",
        ctaLabel: "Coba Split Bill"
      },
      {
        imageUrl: "/img/cara-pakai/split-bill/settlement.png",
        tone: "emerald",
        feature: "Collect Money",
        title: "Patungan kos dan tagihan bulanan",
        body: "Listrik, wifi, galon, sampai iuran kebersihan bisa dibagi rata ke semua penghuni dalam hitungan detik. Pakai Collect Money buat nandain siapa yang udah transfer, biar gak ada yang lupa bayar.",
        href: "/collect-money",
        ctaLabel: "Coba Collect Money"
      },
      {
        imageUrl: "/img/cara-pakai/split-later/quick-capture.png",
        tone: "amber",
        feature: "Split Later",
        title: "Liburan bareng",
        body: "Struk numpuk selama trip? Kumpulin dulu pakai Split Later, hitungnya belakangan pas udah pulang. Settlement dari semua struk digabung jadi satu, jadi transfernya cukup sekali per orang.",
        href: "/split-bill-liburan",
        ctaLabel: "Lihat Split Bill Liburan"
      }
    ]
  },
  comparison: {
    title: "Kenapa Harus Pakai",
    titleHighlight: "SplitBill?",
    subtitle: "Udah gak zaman ribet bagi tagihan. Liat bedanya kehidupan lo sebelum vs sesudah pakai SplitBill.",
    before: {
      emoji: "😩",
      title: "Sebelum pake SplitBill",
      points: [
        "Pusing hitung manual pake kalkulator HP pas kasir udah nungguin",
        "Bingung bagi nominal pajak, service charge, sama diskon persenan",
        "Sungkan atau canggung buat nagih temen yang belum bayar",
        "Salah transfer gara-gara gak ada rincian rekening/e-wallet",
        "Catatan patungan hilang karena nyampur di chat WhatsApp"
      ]
    },
    after: {
      emoji: "😎",
      title: "Setelah pake SplitBill",
      badge: "Solusi Terbaik ✨",
      points: [
        "Cukup foto struk belanjaan, AI kelar hitung dalam 5 detik!",
        "Pajak & service charge otomatis kebagi presisi per item menu",
        "Link tagihan transparan dikirim ke grup, otomatis pada sadar diri",
        "Info rekening & e-wallet langsung tertera, tinggal salin & transfer",
        "History patungan tersimpan aman, rapi, dan mudah diakses kapan aja"
      ]
    }
  },
  testimonials: {
    title: "Kata Mereka yang Udah Bebas Drama",
    titleHighlight: "",
    subtitle: "Udah ribuan circle nongkrong terbantu dengan SplitBill. Cek review jujur dari mereka!"
  },
  blog: {
    title: "Tips Nongkrong &",
    titleHighlight: "Split Bill",
    subtitle: "Inspirasi patungan biar circle nongkrong lo tetap harmonis tanpa drama tagihan."
  },
  faq: {
    title: "Paling Sering",
    titleHighlight: "Ditanyain",
    subtitle: "Punya pertanyaan lain? Tenang, semuanya sudah kami rangkum di sini."
  },
  promoSlider: {
    showAiScanCard: true,
    slides: [
      {
        title: "Bayar Dulu, Bagi Kemudian dengan Split Later! 🕒",
        imageUrl: "/img/menu-split-later.png",
        href: "/split-later",
        ctaLabel: "Coba Split Later",
        badge: "NEW",
        badgeIcon: "",
        tone: "primary"
      },
      {
        title: "Kasih Review Pertama & Dapetin Rewards Spesial! 🎁",
        imageUrl: "/img/icon-rewards.jpg",
        href: "/review",
        ctaLabel: "Tulis Review Sekarang",
        badge: "REWARDS",
        badgeIcon: "Sparkles",
        tone: "amber"
      }
    ]
  },
  promoBanner: {
    titleText: "Fokus healing dulu,",
    titleHighlight: "split bill belakangan!",
    description: "Tinggal catat pengeluaran, bagi rata pas udah santai. Anti ribet!",
    ctaLabel: "Coba Sekarang",
    href: "/split-bill-liburan",
    image: {
      url: "/img/promoBanner-split-later.jpg",
      alt: "SplitBill Promo Banner"
    },
    tone: "blue"
  },
  seoContent: {
    title: "",
    titleHighlight: "",
    body: ""
  },
  layout: {
    sections: [
      {
        key: "socialProof",
        visible: true
      },
      {
        key: "promoSlider",
        visible: true
      },
      {
        key: "featureShowcase",
        visible: true
      },
      {
        key: "features",
        visible: true
      },
      {
        key: "useCases",
        visible: true
      },
      {
        key: "howItWorks",
        visible: true
      },
      {
        key: "promoBanner",
        visible: true
      },
      {
        key: "marketingBanner",
        visible: true
      },
      {
        key: "comparison",
        visible: true
      },
      {
        key: "testimonials",
        visible: true
      },
      {
        key: "blog",
        visible: true
      },
      {
        key: "seoContent",
        visible: false
      },
      {
        key: "faq",
        visible: true
      },
      {
        key: "ctaBanner",
        visible: true
      }
    ]
  },
  ctaBanner: {
    title: "Mulai Split Bill",
    titleHighlight: "Sat-Set & No Drama",
    titleSuffix: "Sekarang!",
    description: "Nongkrong seru tanpa drama bayar-bayar. AI scan struk siap bantu hitungin semua pengeluaran geng lo.",
    primaryCta: {
      label: "Coba Gratis Sekarang",
      href: "/split-bill",
      icon: "Camera"
    },
    secondaryCta: {
      label: "Buat Akun Baru",
      href: "/register"
    },
    footnote: "Gak perlu kartu kredit · Langsung pakai · Gak wajib bikin akun",
    cards: [
      {
        title: "Privacy First",
        desc: "Data kamu tersimpan aman di server kami, bisa diakses kapan saja dari perangkat mana saja.",
        imageUrl: "/img/icon-privacy.png",
        tone: "emerald"
      },
      {
        title: "No Login Required",
        desc: "Bisa langsung pakai tanpa ribet daftar. Cocok buat yang mau sat-set!",
        imageUrl: "/img/icon-no-login.png",
        tone: "blue"
      },
      {
        title: "AI Powered",
        desc: "Gak perlu ngetik manual satu-satu, cukup jepret & biar AI yang hitung.",
        imageUrl: "/img/icon-ai-powered.png",
        tone: "purple"
      }
    ]
  }
};
