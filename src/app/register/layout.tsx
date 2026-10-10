import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Daftar Akun Gratis - SplitBill",
  description: "Buat akun SplitBill gratis untuk simpan riwayat transaksi dan hitung patungan lebih cepat bareng teman.",
  path: "/register",
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
