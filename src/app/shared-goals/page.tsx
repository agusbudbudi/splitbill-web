import type { Metadata } from "next";
import SharedGoalsClientPage from "./SharedGoalsClientPage";

export const metadata: Metadata = {
  title: "Shared Goals - Patungan & Nabung Bareng Teman Online",
  description: "Wujudkan impian bareng teman! Gunakan fitur Shared Goals untuk nabung bareng, patungan kado, atau persiapan liburan kelompok. Pantau progress tabungan secara transparan.",
  keywords: [
    "shared goals online",
    "nabung bareng teman",
    "patungan online",
    "aplikasi tabungan bersama",
    "kumpul uang kado",
    "budgeting kelompok",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/shared-goals",
  },
  openGraph: {
    title: "Shared Goals - Patungan & Nabung Bareng Teman | SplitBill.my.id",
    description: "Wujudkan impian bareng teman! Nabung bareng untuk liburan, kado, atau goals lainnya dengan transparan.",
    url: "https://splitbill.my.id/shared-goals",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/feature-shared-goals.png",
        width: 1200,
        height: 630,
        alt: "Shared Goals - Nabung Bareng Teman",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function SharedGoalsPage() {
  return <SharedGoalsClientPage />;
}
