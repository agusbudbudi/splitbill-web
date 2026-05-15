import type { Metadata } from "next";
import DonateClientPage from "./DonateClientPage";

export const metadata: Metadata = {
  title: "Donasi Developer - Dukung Pengembangan SplitBill Online",
  description: "Dukung pengembangan SplitBill Online agar terus gratis dan bebas iklan. Donasi darimu membantu biaya operasional server dan pengembangan fitur AI Scan terbaru.",
  keywords: [
    "donasi split bill",
    "dukung developer",
    "split bill gratis",
    "traktir kopi developer",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/donate",
  },
};

export default function DonatePage() {
  return <DonateClientPage />;
}
