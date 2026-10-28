import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SharedGoalsClientPage from "./SharedGoalsClientPage";
import { FeatureSeoSection } from "@/components/seo/FeatureSeoSection";
import { featureSeoContent } from "@/data/featureSeoContent";
import { getFaqs, resolveFaqs } from "@/lib/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, jsonLdGraph, webApplicationNode } from "@/lib/structuredData";

export const metadata: Metadata = buildMetadata({
  title: "Shared Goals - Patungan & Nabung Bareng Teman Online",
  description: "Wujudkan impian bareng teman! Gunakan fitur Shared Goals untuk nabung bareng, patungan kado, atau persiapan liburan kelompok. Pantau progress tabungan secara transparan.",
  path: "/shared-goals",
  socialTitle: "Shared Goals - Patungan & Nabung Bareng Teman | SplitBill",
  socialDescription: "Wujudkan impian bareng teman! Nabung bareng untuk liburan, kado, atau goals lainnya dengan transparan.",
  image: {
    url: "/img/cara-pakai/shared-goals/hero-shared-goals-cara-pakai.png",
    width: 1920,
    height: 900,
    alt: "Shared Goals, nabung bareng teman di SplitBill",
  },
});

export default async function SharedGoalsPage() {
  const faqs = resolveFaqs(await getFaqs(), featureSeoContent.sharedGoals.faqs);
  const jsonLd = jsonLdGraph(
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Shared Goals", path: "/shared-goals" },
    ]),
    webApplicationNode({
      name: "SplitBill Shared Goals",
      path: "/shared-goals",
      description:
        "Nabung bareng teman menuju satu target: catat kontribusi tiap anggota dan pantau progress tabungan bersama.",
    }),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* SEO explainer first in the DOM (crawlers see H1 + intro before the
          client-only tool), shown visually below the tool via order-*. */}
      <div className="flex flex-col">
        <FeatureSeoSection {...featureSeoContent.sharedGoals} faqs={faqs} className="order-2" />
        <div className="order-1">
          <SharedGoalsClientPage />
        </div>
      </div>
    </>
  );
}
