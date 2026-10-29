import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import FAQClientPage from "./FAQClientPage";
import { getFaqs } from "@/lib/faq";

export const metadata: Metadata = buildMetadata({
  title: "FAQ & Bantuan Split Bill: Pertanyaan Seputar Bagi Tagihan",
  description: "Temukan jawaban atas pertanyaan seputar cara split bill, scan struk dengan AI, bagi tagihan online, patungan, dan semua fitur SplitBill.",
  path: "/faq",
  socialTitle: "FAQ & Bantuan Split Bill | SplitBill",
  socialDescription: "Temukan jawaban atas pertanyaan seputar cara split bill, scan struk dengan AI, dan fitur patungan online lainnya.",
});

export default async function FAQPage() {
  const faqData = await getFaqs();
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
        item: "https://www.splitbill.my.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: "https://www.splitbill.my.id/faq",
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
      <FAQClientPage faqData={faqData} />
    </>
  );
}
