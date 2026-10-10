import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Masuk - SplitBill",
  description: "Masuk ke akun SplitBill untuk akses riwayat transaksi dan fitur patungan lainnya.",
  path: "/login",
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
