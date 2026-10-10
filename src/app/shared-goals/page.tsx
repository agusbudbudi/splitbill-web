import type { Metadata } from "next";
import SharedGoalsClientPage from "./SharedGoalsClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";

export const metadata: Metadata = {
  title: "Shared Goals - Patungan & Nabung Bareng Teman Online",
  description: "Wujudkan impian bareng teman! Gunakan fitur Shared Goals untuk nabung bareng, patungan kado, atau persiapan liburan kelompok. Pantau progress tabungan secara transparan.",
  alternates: {
    canonical: "https://www.splitbill.my.id/shared-goals",
  },
  openGraph: {
    title: "Shared Goals - Patungan & Nabung Bareng Teman | SplitBill.my.id",
    description: "Wujudkan impian bareng teman! Nabung bareng untuk liburan, kado, atau goals lainnya dengan transparan.",
    url: "https://www.splitbill.my.id/shared-goals",
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
        name: "Shared Goals",
        item: "https://www.splitbill.my.id/shared-goals",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* SEO explainer first in the DOM (crawlers see H1 + intro before the
          client-only tool), shown visually below the tool via order-*. */}
      <div className="flex flex-col">
        <FeatureSeoSection {...featureSeoContent.sharedGoals} className="order-2" />
        <div className="order-1">
          <SharedGoalsClientPage />
        </div>
      </div>
    </>
  );
}
