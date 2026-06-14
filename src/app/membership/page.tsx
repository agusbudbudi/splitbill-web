import type { Metadata } from "next";
import MembershipClientPage from "./MembershipClientPage";

export const metadata: Metadata = {
  title: "Membership VIP - Nikmati Fitur SplitBill Tanpa Batas",
  description: "Upgrade ke Membership VIP untuk akses tak terbatas ke AI Scan Struk, simpan history selamanya, dan pengalaman tanpa iklan. Cek fitur VIP kami sekarang.",
  keywords: [
    "splitbill vip",
    "membership split bill",
    "fitur vip splitbill",
    "scan struk unlimited",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/membership",
  },
};

export default function MembershipPage() {
  return <MembershipClientPage />;
}
