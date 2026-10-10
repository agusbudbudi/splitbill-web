import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

// Transactional page (client component, can't export metadata itself):
// give it its own title and keep it out of the index.
export const metadata: Metadata = buildMetadata({
  title: "Buat Invoice - SplitBill",
  description: "Isi detail, item, dan metode pembayaran untuk membuat invoice online gratis di SplitBill.",
  path: "/invoice/create",
  noindex: true,
});

export default function InvoiceCreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
