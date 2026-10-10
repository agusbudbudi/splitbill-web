import type { Metadata } from "next";
import ReviewClientPage from "./ReviewClientPage";

export const metadata: Metadata = {
  title: "Review & Testimoni Pengguna - SplitBill Online",
  description: "Apa kata mereka tentang SplitBill Online? Baca review dari pengguna yang sudah terbantu membagi tagihan dan struk belanja dengan AI Scan kami.",
  alternates: {
    canonical: "https://www.splitbill.my.id/review",
  },
  // Form-only page (no review list), not worth indexing
  robots: { index: false, follow: true },
};

export default function ReviewPage() {
  return <ReviewClientPage />;
}
