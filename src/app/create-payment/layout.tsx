import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// Transactional page (client component, can't export metadata itself):
// give it its own title and keep it out of the index.
export const metadata: Metadata = buildMetadata({
  title: "Buat Tagihan QR - SplitBill",
  description: "Buat tagihan pembayaran dengan link dan QR yang bisa dibayar lewat e-wallet.",
  path: "/create-payment",
  noindex: true,
});

export default function CreatePaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
