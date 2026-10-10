import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import WalletClientPage from "./WalletClientPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = buildMetadata({
  title: "Wallet & Metode Pembayaran - Atur Rekening Split Bill",
  description: "Kelola metode pembayaran favoritmu (BCA, Mandiri, GoPay, OVO, dll). Tambahkan detail rekening untuk memudahkan teman mentransfer hasil split bill secara instan.",
  path: "/wallet",
  noindex: true,
});

export default function WalletPage() {
  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.splitbill.my.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Wallet",
        item: "https://www.splitbill.my.id/wallet",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProtectedRoute>
        <WalletClientPage />
      </ProtectedRoute>
    </>
  );
}
