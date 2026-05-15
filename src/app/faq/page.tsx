// Server Component — exports metadata for this page.
// Interactive content (search, filter, accordion) is handled by FAQClientPage.

import type { Metadata } from "next";
import FAQClientPage from "./FAQClientPage";

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
  return <FAQClientPage />;
}
