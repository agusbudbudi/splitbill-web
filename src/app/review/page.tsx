import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ReviewClientPage from "./ReviewClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Review & Testimoni Pengguna - SplitBill",
  description: "Apa kata mereka tentang SplitBill? Kirim review dan masukan kamu soal pengalaman membagi tagihan dan scan struk dengan AI.",
  path: "/review",
  noindex: true,
});

export default function ReviewPage() {
  return <ReviewClientPage />;
}
