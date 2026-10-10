import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// Transactional page (client component, can't export metadata itself):
// give it its own title and keep it out of the index.
export const metadata: Metadata = buildMetadata({
  title: "Bayar Tagihan - SplitBill",
  description: "Bayar tagihan SplitBill lewat GoPay, DANA, atau ShopeePay.",
  path: "/pay",
  noindex: true,
});

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
