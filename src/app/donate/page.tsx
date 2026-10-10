import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import DonateClientPage from "./DonateClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Support Developer - Dukung Pengembangan SplitBill",
  description: "Dukung pengembangan SplitBill agar terus gratis dan bebas iklan. Donasi darimu membantu biaya operasional server dan pengembangan fitur AI Scan terbaru.",
  path: "/donate",
});

export default function DonatePage() {
  return <DonateClientPage />;
}
