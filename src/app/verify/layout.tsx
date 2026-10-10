import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Verifikasi Email - SplitBill",
  description: "Verifikasi email akun SplitBill kamu untuk mulai patungan bareng teman.",
  path: "/verify",
  noindex: true,
});

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
