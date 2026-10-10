import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import InvoiceClientPage from "./InvoiceClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";

export const metadata: Metadata = buildMetadata({
  title: "Buat Invoice Online Gratis - Cepat & Profesional",
  description: "Buat invoice profesional secara online dan gratis. Cocok untuk freelancer, bisnis kecil, atau penagihan jasa. Mudah digunakan, bisa langsung download PDF.",
  path: "/invoice",
  socialTitle: "Buat Invoice Online Gratis | SplitBill",
  socialDescription: "Buat invoice profesional secara online dan gratis. Cepat, mudah, dan bisa langsung download PDF.",
});

export default function InvoicePage() {
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
        name: "Invoice",
        item: "https://www.splitbill.my.id/invoice",
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
        <FeatureSeoSection {...featureSeoContent.invoice} className="order-2" />
        <div className="order-1">
          <InvoiceClientPage />
        </div>
      </div>
    </>
  );
}
