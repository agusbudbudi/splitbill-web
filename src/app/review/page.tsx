import type { Metadata } from "next";
import ReviewClientPage from "./ReviewClientPage";

export const metadata: Metadata = {
  title: "Review & Testimoni Pengguna - SplitBill Online",
  description: "Apa kata mereka tentang SplitBill Online? Baca review dari pengguna yang sudah terbantu membagi tagihan dan struk belanja dengan AI Scan kami.",
  keywords: [
    "review splitbill online",
    "testimoni split bill",
    "ulasan aplikasi bagi tagihan",
    "split bill app review",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/review",
  },
};

export default function ReviewPage() {
  return <ReviewClientPage />;
}
