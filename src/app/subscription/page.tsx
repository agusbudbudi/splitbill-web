import type { Metadata } from "next";
import SubscriptionClientPage from "./SubscriptionClientPage";

export const metadata: Metadata = {
  title: "Paket Langganan Premium - SplitBill Online",
  description: "Pilih paket langganan yang sesuai dengan kebutuhanmu. Mulai dari paket harian hingga tahunan dengan harga terjangkau untuk fitur bagi tagihan terbaik.",
  keywords: [
    "harga premium splitbill",
    "paket langganan split bill",
    "biaya upgrade splitbill",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/subscription",
  },
};

export default function SubscriptionPage() {
  return <SubscriptionClientPage />;
}
