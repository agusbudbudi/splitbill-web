import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PrivacyClientPage from "./PrivacyClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Kebijakan Privasi - Komitmen Perlindungan Data SplitBill",
  description: "Pelajari bagaimana SplitBill melindungi data pribadi Anda sesuai UU PDP. Kami berkomitmen menjaga keamanan informasi tagihan dan privasi pengguna.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyClientPage />;
}
