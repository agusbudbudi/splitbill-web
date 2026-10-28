import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import InvoiceClientPage from "./InvoiceClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";
import { getFaqs, resolveFaqs } from "@/lib/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, jsonLdGraph, webApplicationNode } from "@/lib/structuredData";

export const metadata: Metadata = buildMetadata({
  title: "Buat Invoice Online Gratis - Cepat & Profesional",
  description: "Buat invoice profesional secara online dan gratis. Cocok untuk freelancer, bisnis kecil, atau penagihan jasa. Mudah digunakan, bisa langsung download PDF.",
  path: "/invoice",
  socialTitle: "Buat Invoice Online Gratis | SplitBill",
  socialDescription: "Buat invoice profesional secara online dan gratis. Cepat, mudah, dan bisa langsung download PDF.",
});

export default async function InvoicePage() {
  const faqs = resolveFaqs(await getFaqs(), featureSeoContent.invoice.faqs);
  const jsonLd = jsonLdGraph(
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Invoice", path: "/invoice" },
    ]),
    webApplicationNode({
      name: "SplitBill Invoice",
      path: "/invoice",
      description:
        "Buat invoice online gratis: isi item dan metode pembayaran, total dihitung otomatis, lalu download sebagai PDF.",
    }),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* SEO explainer first in the DOM (crawlers see H1 + intro before the
          client-only tool), shown visually below the tool via order-*. */}
      <div className="flex flex-col">
        <FeatureSeoSection {...featureSeoContent.invoice} faqs={faqs} className="order-2" />
        <div className="order-1">
          <InvoiceClientPage />
        </div>
      </div>
    </>
  );
}
