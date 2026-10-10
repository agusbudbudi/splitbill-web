import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SubscriptionClientPage from "./SubscriptionClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Paket Langganan VIP - SplitBill",
  description: "Pilih paket langganan yang sesuai dengan kebutuhanmu. Mulai dari paket harian hingga tahunan dengan harga terjangkau untuk fitur bagi tagihan terbaik.",
  path: "/subscription",
});

export default function SubscriptionPage() {
  return <SubscriptionClientPage />;
}
