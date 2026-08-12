import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — Split Bill Online",
  description:
    "Masuk ke akun Split Bill untuk akses riwayat transaksi dan fitur patungan lainnya.",
  alternates: {
    canonical: "https://www.splitbill.my.id/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
