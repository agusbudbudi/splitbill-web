import type { LandingContent } from "./types";

// Shipped fallback, used whenever the CMS is unreachable or returns something
// malformed, so the homepage (and its H1/copy for crawlers) never renders empty.
// Snapshot of the live CMS content (saved 2026-10-30), with uploaded images
// copied to public/img/landing so it still renders when the backend is down.
// DEFAULT_LANDING_CONTENT in splitbill-be lib/landingPage.js is the older seed.
export const DEFAULT_LANDING_CONTENT: LandingContent = {
  seo: {
    title: "Split Bill Online Gratis dengan AI Scan Struk | SplitBill",
    description: "Bagi tagihan online gratis dengan AI scan struk. Hitung pesanan, pajak, dan service charge otomatis. Langsung pakai tanpa instal aplikasi.",
    socialTitle: "SplitBill - Patungan Gampang, Gak Pake Drama",
    socialDescription: "Foto struk, biar AI bantu hitung tagihan dan pajak. Bagikan rincian ke teman tanpa perlu instal aplikasi atau daftar akun.",
    ogImage: {
      url: "/img/landing/og.jpg",
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
      badge: "GRATIS"
    },
    title: "Split Bill Online\nGratis: Scan Struk,",
    titleHighlight: "Bagi Tagihan dalam 5 Detik",
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
    trustItems: [],
    image: {
      url: "/img/landing/hero.webp",
      alt: "Tampilan hasil split bill di aplikasi SplitBill dengan instruksi transfer dan rincian per orang",
      width: 2000,
      height: 2000
    },
    imageMobile: {
      url: "/img/landing/hero-mobile.webp",
      alt: "Tampilan hasil split bill di aplikasi SplitBill dengan instruksi transfer dan rincian per orang",
      width: 2000,
      height: 2000
    }
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
    titleHighlight: "Patungan Beres!",
    subtitle: "Gak perlu instal aplikasi atau daftar akun. Langsung bikin split bill lewat web.",
    steps: [
      {
        icon: "Camera",
        title: "Foto atau Upload Struk",
        description: "Foto struk, AI bantu baca menu dan harga tanpa input manual.",
        image: {
          url: "/img/step-scan.jpg",
          alt: "Struk restoran sedang discan AI di layar SplitBill untuk membaca item dan harga"
        },
        tone: "primary"
      },
      {
        icon: "UserPlus",
        title: "Atur Teman dan Pesanan",
        description: "Pilih menu tiap orang, SplitBill bantu hitung pajak dan total tagihan.",
        image: {
          url: "/img/step-add-friend.jpg",
          alt: "Layar tambah teman di SplitBill dengan daftar teman yang ikut patungan"
        },
        tone: "amber"
      },
      {
        icon: "Send",
        title: "Bagikan Link Tagihan",
        description: "Share rincian tagihan ke grup, teman tinggal cek nominal dan transfer.",
        image: {
          url: "/img/step-share.jpg",
          alt: "Ringkasan tagihan split bill per orang yang dibagikan ke WhatsApp"
        },
        tone: "green"
      }
    ]
  },
  features: {
    title: "Semua Patungan",
    titleHighlight: "Satu Aplikasi",
    subtitle: "Dari split bill sampai nabung bareng, semua bisa diatur dalam satu tempat",
    items: [
      {
        imageUrl: "/img/landing/feature-split-bill-icon.webp",
        image: {
          url: "/img/landing/feature-split-bill.webp",
          alt: "Layar SplitBill saat AI membaca foto struk restoran"
        },
        tone: "blue",
        title: "Split Bill",
        description: "Foto struk biar AI hitung otomatis (Scan AI) atau bagi rincian secara manual. Sat-set!",
        badge: "Populer",
        href: "/split-bill",
        ctaLabel: "Coba Split Bill",
        guideHref: "/split-bill/cara-pakai",
        requiresLogin: false,
        isActive: true
      },
      {
        imageUrl: "/img/landing/feature-split-later-icon.webp",
        image: {
          url: "/img/landing/feature-split-later.webp",
          alt: "Layar Split Later untuk memilih kategori acara seperti liburan atau nongkrong"
        },
        tone: "violet",
        title: "Split Later",
        description: "Nongkrong sepuasnya, kumpulin struknya, bagi tagihannya nanti pas santai.",
        badge: "Baru",
        href: "/split-later",
        ctaLabel: "Coba Split Later",
        guideHref: "/split-later/cara-pakai",
        requiresLogin: true,
        isActive: true
      },
      {
        imageUrl: "/img/landing/feature-shared-goals-icon.webp",
        image: {
          url: "/img/landing/feature-shared-goals.webp",
          alt: "Form membuat Shared Goal dengan nama, target nominal, dan anggota"
        },
        tone: "emerald",
        title: "Shared Goals",
        description: "Nabung bareng squad buat rencana liburan, kado nikahan teman, atau impian bersama.",
        badge: "",
        href: "/shared-goals",
        ctaLabel: "Mulai Nabung",
        guideHref: "/shared-goals/cara-pakai",
        requiresLogin: false,
        isActive: true
      },
      {
        imageUrl: "/img/menu-collect-money.png",
        image: {
          url: "/img/landing/feature-collect-money.webp",
          alt: "Ilustrasi tangan menerima koin patungan"
        },
        tone: "amber",
        title: "Collect Money (Patungan)",
        description: "Bikin link patungan uang kas, sewa lapangan futsal, atau donasi secara transparan.",
        badge: "",
        href: "/collect-money",
        ctaLabel: "Bikin Patungan",
        guideHref: "",
        requiresLogin: false,
        isActive: true
      },
      {
        imageUrl: "/img/landing/feature-invoice-icon.webp",
        image: {
          url: "/img/landing/feature-invoice.webp",
          alt: "Ilustrasi invoice digital dan pena"
        },
        tone: "rose",
        title: "Invoice",
        description: "Kirim rincian tagihan digital yang rapi, transparan, langsung ke WhatsApp.",
        badge: "",
        href: "/invoice",
        ctaLabel: "Buat Invoice",
        guideHref: "",
        requiresLogin: false,
        isActive: true
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
        requiresLogin: false,
        isActive: false
      }
    ]
  },
  featureShowcase: {
    title: "Semua Patungan",
    titleHighlight: "Satu Aplikasi",
    subtitle: ""
  },
  useCases: {
    eyebrow: "🍜 Nongkrong  ·  🏠 Kos  ·  ✈️ Liburan",
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
    subtitle: "Dari hitung manual sampai nagih teman, patungan jadi lebih praktis bareng SplitBill.",
    before: {
      emoji: "😩",
      title: "Sebelum Pakai SplitBill",
      points: [
        "Hitung tagihan manual pakai kalkulator, bikin antrean makin lama",
        "Bingung bagi pajak, service charge, dan diskon",
        "Sungkan nagih teman yang belum bayar",
        "Rawan salah transfer karena rincian pembayaran gak jelas",
        "Catatan patungan tercecer di chat WhatsApp"
      ]
    },
    after: {
      emoji: "😎",
      title: "Setelah pake SplitBill",
      badge: "Solusi Terbaik",
      points: [
        "Foto struk, biar AI bantu hitung item pesanan",
        "Pajak, service charge, dan diskon dibagi sesuai pesanan",
        "Bagikan link tagihan biar semua tahu bagian masing-masing",
        "Rincian tagihan dan pembayaran lebih jelas, tinggal salin",
        "Riwayat patungan lebih rapi dan mudah dicek kembali"
      ]
    }
  },
  testimonials: {
    title: "Kata Mereka tentang SplitBill",
    titleHighlight: "",
    subtitle: "Simak pengalaman mereka patungan tanpa drama!"
  },
  blog: {
    title: "Tips Nongkrong &",
    titleHighlight: "Split Bill Paling Mudah",
    subtitle: "Tips patungan, keuangan, dan nongkrong bareng biar makin praktis."
  },
  faq: {
    title: "Paling Sering",
    titleHighlight: "Ditanyain",
    subtitle: "Temukan jawaban seputar SplitBill dan cara pakainya."
  },
  promoSlider: {
    showAiScanCard: true,
    slides: [
      {
        title: "Bayar Dulu, Bagi Kemudian dengan Split Later! 🕒",
        imageUrl: "/img/landing/promo-slide-1.webp",
        href: "/split-later",
        ctaLabel: "Coba Split Later",
        badge: "NEW",
        badgeIcon: "",
        tone: "primary"
      },
      {
        title: "Kasih Review Pertama & Dapetin Rewards Spesial! 🎁",
        imageUrl: "/img/landing/promo-slide-2.webp",
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
      url: "/img/landing/promo-banner.webp",
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
        visible: false
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
        visible: false
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
        key: "comparison",
        visible: true
      },
      {
        key: "testimonials",
        visible: true
      },
      {
        key: "promoBanner",
        visible: true
      },
      {
        key: "marketingBanner",
        visible: false
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
    title: "Patungan Gampang,",
    titleHighlight: "Nongkrong Tenang!",
    titleSuffix: "",
    description: "Foto struk, biar AI bantu hitung tagihanmu.",
    primaryCta: {
      label: "Coba Split Bill Gratis",
      href: "/split-bill",
      icon: "Camera"
    },
    secondaryCta: {
      label: "Buat Akun Baru",
      href: "/register"
    },
    footnote: "Gratis dicoba · Tanpa login · Langsung pakai",
    cards: [
      {
        title: "Privasi Tetap Terjaga",
        desc: "Data tersimpan di browser kamu. Login untuk menyinkronkan data antarperangkat.",
        imageUrl: "/img/landing/cta-privasi-tetap-terjaga.webp",
        tone: "emerald"
      },
      {
        title: "Langsung Tanpa Daftar",
        desc: "Buka SplitBill dan mulai bagi tagihan tanpa bikin akun.",
        imageUrl: "/img/landing/cta-langsung-tanpa-daftar.webp",
        tone: "blue"
      },
      {
        title: "AI Scan Struk",
        desc: "Foto struk, AI baca item dan harga otomatis. Gak perlu input satu-satu.",
        imageUrl: "/img/landing/cta-ai-scan-struk.webp",
        tone: "purple"
      }
    ]
  }
};
