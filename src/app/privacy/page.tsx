import type { Metadata } from "next";
import PrivacyClientPage from "./PrivacyClientPage";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Komitmen Perlindungan Data Split Bill",
  description: "Pelajari bagaimana SplitBill Online melindungi data pribadi Anda sesuai UU PDP. Kami berkomitmen menjaga keamanan informasi tagihan dan privasi pengguna.",
  keywords: [
    "kebijakan privasi split bill",
    "perlindungan data pribadi",
    "uu pdp indonesia",
    "keamanan data splitbill",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyClientPage />;
}
