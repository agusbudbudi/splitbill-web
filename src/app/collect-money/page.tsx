import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import CollectMoneyClientPage from "./CollectMoneyClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, jsonLdGraph, webApplicationNode } from "@/lib/structuredData";

export const metadata: Metadata = buildMetadata({
  title: "Collect Money - Kumpulkan Iuran & Kas Online Mudah",
  description: "Kumpulkan uang iuran kas, dana sosial, atau biaya acara dengan praktis. Pantau siapa yang sudah bayar dan bagikan status pembayaran ke teman.",
  path: "/collect-money",
  socialTitle: "Collect Money - Kumpulkan Iuran Online | SplitBill",
  socialDescription: "Kumpulkan uang iuran kas atau dana sosial dengan praktis. Transparan dan otomatis!",
});

export default function CollectMoneyPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Collect Money", path: "/collect-money" },
    ]),
    webApplicationNode({
      name: "SplitBill Collect Money",
      path: "/collect-money",
      description:
        "Kumpulkan iuran dan patungan online: tandai siapa yang sudah bayar dan pantau progress dana terkumpul.",
    }),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* SEO explainer first in the DOM (crawlers see H1 + intro before the
          client-only tool), shown visually below the tool via order-*. */}
      <div className="flex flex-col">
        <FeatureSeoSection {...featureSeoContent.collectMoney} className="order-2" />
        <div className="order-1">
          <CollectMoneyClientPage />
        </div>
      </div>
    </>
  );
}
