import React from "react";
import type { LandingContent, LandingSectionKey } from "@/lib/landing/types";
import { SocialProofBar } from "./SocialProofBar";
import { FeaturesSection } from "./FeaturesSection";
import { UseCasesSection } from "./UseCasesSection";
import { ComparisonSection } from "./ComparisonSection";
import { SeoContentSection } from "./SeoContentSection";
import { CTABannerSection } from "./CTABannerSection";

export type StaticSections = Partial<Record<LandingSectionKey, React.ReactNode>>;

/** Content keys only the static sections (and page metadata) read. */
const SERVER_ONLY_CONTENT_KEYS = ["seo", "socialProof", "useCases", "comparison", "seoContent", "ctaBanner"] as const;

/** Landing content as HomepagePageClient needs it, without the server-only keys. */
export type HomepageClientContent = Omit<LandingContent, (typeof SERVER_ONLY_CONTENT_KEYS)[number]>;

/** Drops the server-only keys so that copy isn't serialized to the browser a second time. */
export function toClientContent(content: LandingContent): HomepageClientContent {
  const clientContent: Partial<LandingContent> = { ...content };
  for (const key of SERVER_ONLY_CONTENT_KEYS) delete clientContent[key];
  return clientContent as HomepageClientContent;
}

/**
 * Homepage sections with no client state. The live page renders them in
 * app/page.tsx (Server Components, so their code never ships to the browser);
 * the CMS preview renders the same nodes client-side so they follow the draft.
 * Keep these files free of "use client" and hooks.
 */
export function renderStaticSections(content: LandingContent): StaticSections {
  return {
    socialProof: <SocialProofBar content={content.socialProof} />,
    features: <FeaturesSection content={content.features} />,
    useCases: <UseCasesSection content={content.useCases} />,
    comparison: <ComparisonSection content={content.comparison} />,
    seoContent: <SeoContentSection content={content.seoContent} />,
    ctaBanner: <CTABannerSection content={content.ctaBanner} />,
  };
}
