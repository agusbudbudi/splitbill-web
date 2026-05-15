import type { Metadata } from "next";
import MembershipClientPage from "./MembershipClientPage";

export const metadata: Metadata = {
  title: "Membership Premium - Nikmati Fitur SplitBill Tanpa Batas",
  description: "Upgrade ke Membership Premium untuk akses tak terbatas ke AI Scan Struk, simpan history selamanya, dan pengalaman tanpa iklan. Cek fitur premium kami sekarang.",
  keywords: [
    "splitbill premium",
    "membership split bill",
    "fitur premium splitbill",
    "scan struk unlimited",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/membership",
  },
};

export default function MembershipPage() {
  return <MembershipClientPage />;
}
