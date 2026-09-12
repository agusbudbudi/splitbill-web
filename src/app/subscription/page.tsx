import type { Metadata } from "next";
import SubscriptionClientPage from "./SubscriptionClientPage";

export const metadata: Metadata = {
  title: "Paket Langganan VIP - SplitBill Online",
  description: "Pilih paket langganan yang sesuai dengan kebutuhanmu. Mulai dari paket harian hingga tahunan dengan harga terjangkau untuk fitur bagi tagihan terbaik.",
  alternates: {
    canonical: "https://www.splitbill.my.id/subscription",
  },
};

export default function SubscriptionPage() {
  return <SubscriptionClientPage />;
}
