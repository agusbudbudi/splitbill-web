import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// Transactional page (client component, can't export metadata itself):
// give it its own title and keep it out of the index.
export const metadata: Metadata = buildMetadata({
  title: "Pembayaran Langganan - SplitBill",
  description: "Selesaikan pembayaran paket langganan SplitBill.",
  path: "/subscription/payment",
  noindex: true,
});

export default function SubscriptionPaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
