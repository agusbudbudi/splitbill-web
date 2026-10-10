import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import TermsClientPage from "./TermsClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Syarat & Ketentuan - Aturan Penggunaan SplitBill",
  description: "Baca syarat dan ketentuan penggunaan layanan SplitBill. Pahami hak dan kewajiban Anda sebagai pengguna platform bagi tagihan kami.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsClientPage />;
}
