import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun — Split Bill Online Gratis",
  description:
    "Buat akun Split Bill gratis untuk simpan riwayat transaksi dan hitung patungan lebih cepat bareng teman.",
  alternates: {
    canonical: "https://www.splitbill.my.id/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
