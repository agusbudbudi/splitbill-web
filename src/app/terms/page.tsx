import type { Metadata } from "next";
import TermsClientPage from "./TermsClientPage";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan - Aturan Penggunaan SplitBill Online",
  description: "Baca syarat dan ketentuan penggunaan layanan SplitBill Online. Pahami hak dan kewajiban Anda sebagai pengguna platform bagi tagihan kami.",
  alternates: {
    canonical: "https://www.splitbill.my.id/terms",
  },
};

export default function TermsPage() {
  return <TermsClientPage />;
}
