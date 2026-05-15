import type { Metadata } from "next";
import BlogListClient from "@/app/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Blog & Tips Split Bill — Kelola Keuangan & Patungan Lebih Hemat",
  description:
    "Temukan tips eksklusif seputar pengelolaan keuangan, cara split bill yang adil, update fitur SplitBill, dan panduan patungan online untuk Gen-Z dan Millennial.",
  keywords: [
    "tips split bill",
    "blog keuangan",
    "cara bagi tagihan",
    "aplikasi patungan terbaik",
    "manajemen uang grup",
    "split bill hemat",
    "tips hemat nongkrong",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/blog",
  },
  openGraph: {
    title: "Blog & Tips Split Bill — SplitBill.my.id",
    description:
      "Tips cerdas bagi tagihan dan update fitur terbaru SplitBill untuk pengalaman patungan yang lebih mudah.",
    url: "https://splitbill.my.id/blog",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/pwa-banner.png",
        width: 1200,
        height: 630,
        alt: "Blog & Tips Split Bill",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Tips Split Bill — Kelola Keuangan Lebih Hemat",
    description: "Inspirasi bagi tagihan yang adil & update fitur terbaru SplitBill.",
    images: ["/img/pwa-banner.png"],
  },
};

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog SplitBill Online",
    "description": "Tips cerdas pengelolaan keuangan dan panduan bagi tagihan adil.",
    "url": "https://splitbill.my.id/blog",
    "publisher": {
      "@type": "Organization",
      "name": "SplitBill",
      "logo": {
        "@type": "ImageObject",
        "url": "https://splitbill.my.id/img/footer-icon.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListClient />
    </>
  );
}
