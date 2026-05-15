import type { Metadata } from "next";
import FAQClientPage from "./FAQClientPage";
import { faqData } from "@/data/faqData";

export const metadata: Metadata = {
  title: "FAQ & Bantuan Split Bill — Pertanyaan Seputar Bagi Tagihan",
  description:
    "Temukan jawaban atas pertanyaan seputar cara split bill, scan struk dengan AI, bagi tagihan online, patungan, dan semua fitur SplitBill.my.id.",
  keywords: [
    "faq split bill",
    "cara split bill",
    "cara bagi tagihan",
    "bantuan split bill",
    "panduan patungan online",
    "split bill itu apa",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/faq",
  },
  openGraph: {
    title: "FAQ & Bantuan Split Bill — SplitBill.my.id",
    description:
      "Temukan jawaban atas pertanyaan seputar cara split bill, scan struk dengan AI, dan fitur patungan online lainnya.",
    url: "https://splitbill.my.id/faq",
    siteName: "Split Bill App",
    locale: "id_ID",
    type: "website",
  },
};

export default function FAQPage() {
  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://splitbill.my.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: "https://splitbill.my.id/faq",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FAQClientPage />
    </>
  );
}
