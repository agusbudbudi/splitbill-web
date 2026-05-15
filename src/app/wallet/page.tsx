import type { Metadata } from "next";
import WalletClientPage from "./WalletClientPage";

export const metadata: Metadata = {
  title: "Wallet & Metode Pembayaran - Atur Rekening Split Bill",
  description: "Kelola metode pembayaran favoritmu (BCA, Mandiri, GoPay, OVO, dll). Tambahkan detail rekening untuk memudahkan teman mentransfer hasil split bill secara instan.",
  keywords: [
    "metode pembayaran split bill",
    "rekening bank online",
    "dompet digital indonesia",
    "atur pembayaran patungan",
    "split bill wallet",
  ],
  alternates: {
    canonical: "https://splitbill.my.id/wallet",
  },
};

export default function WalletPage() {
  return <WalletClientPage />;
}
