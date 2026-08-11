import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifikasi Email — Split Bill Online",
  description: "Verifikasi email akun Split Bill kamu untuk mulai patungan bareng teman.",
  alternates: {
    canonical: "https://www.splitbill.my.id/verify",
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
