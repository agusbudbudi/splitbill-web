import type { Metadata } from "next";
import CollectMoneyClientPage from "./CollectMoneyClientPage";

export const metadata: Metadata = {
  title: "Collect Money - Kumpulkan Iuran & Kas Online Mudah",
  description: "Kumpulkan uang iuran kas, dana sosial, atau biaya acara dengan praktis. Pantau siapa yang sudah bayar secara real-time dan kirim pengingat otomatis ke teman.",
  keywords: [
    "kumpul uang online",
    "iuran kas online",
    "aplikasi bendahara online",
    "kumpul dana sosial",
    "collect money online",
    "atur uang kas grup",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/collect-money",
  },
  openGraph: {
    title: "Collect Money - Kumpulkan Iuran Online | SplitBill.my.id",
    description: "Kumpulkan uang iuran kas atau dana sosial dengan praktis. Transparan dan otomatis!",
    url: "https://splitbill.my.id/collect-money",
    siteName: "Split Bill App",
    images: [
      {
        url: "/img/feature-collect-money.png",
        width: 1200,
        height: 630,
        alt: "Collect Money - Kumpul Iuran Online",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function CollectMoneyPage() {
  return <CollectMoneyClientPage />;
}
