import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { jsonLdGraph, organizationNode, webApplicationNode, websiteNode } from "@/lib/structuredData";
import { HomepagePageClient } from "@/components/homepage/HomepagePageClient";
import { renderStaticSections, toClientContent } from "@/components/homepage/staticSections";
import { apiClient } from "@/lib/api/client";
import { fetchBlogs } from "@/lib/api/blog";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Review } from "@/hooks/useReview";
import type { Blog } from "@/lib/types/blog";
import { getLandingContent } from "@/lib/landing/content";
import { getFaqs } from "@/lib/faq";

// ISR: testimonials and latest posts are server-rendered for crawlers and
// refreshed hourly.
export const revalidate = 3600;

// Same as the CMS fetches: hourly ISR renders tend to hit a cold backend.
const FETCH_TIMEOUT_MS = 20000;

async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getLandingReviews(): Promise<Review[]> {
  try {
    const res = await withTimeout((signal) =>
      apiClient.request<{ success: boolean; data: { reviews: Review[] } }>(
        `${API_ENDPOINTS.PUBLIC_REVIEWS}?limit=12&showOnLanding=true`,
        { method: "GET", skipAuth: true, cache: "force-cache", next: { revalidate: 3600 }, signal },
      ),
    );
    return (res.data?.reviews || []).filter((review) => review.showOnLanding);
  } catch (error) {
    console.error("Failed to prefetch landing reviews:", error);
    return [];
  }
}

async function getLatestBlogs(): Promise<Blog[]> {
  try {
    const res = await withTimeout((signal) =>
      fetchBlogs({ limit: 6, cache: "force-cache", next: { revalidate: 3600 }, signal }),
    );
    return res.data || [];
  } catch (error) {
    console.error("Failed to prefetch latest blogs:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getLandingContent();
  const { seo } = content;
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: "/",
    socialTitle: seo.socialTitle || seo.title,
    socialDescription: seo.socialDescription || seo.description,
    image: {
      url: seo.ogImage.url,
      alt: seo.ogImage.alt,
      width: seo.ogImage.width || 1200,
      height: seo.ogImage.height || 630,
    },
  });
}

export default async function HomepagePage() {
  const [initialReviews, initialBlogs, { content }, faqs] = await Promise.all([
    getLandingReviews(),
    getLatestBlogs(),
    getLandingContent(),
    getFaqs(),
  ]);

  const jsonLd = jsonLdGraph(
    // Homepage carries the CMS-managed social profiles for the brand entity
    content.seo.sameAs.length > 0 ? { ...organizationNode, sameAs: content.seo.sameAs } : organizationNode,
    websiteNode,
    webApplicationNode({
      name: "SplitBill",
      path: "/",
      description:
        "Aplikasi split bill online gratis: scan struk dengan AI, hitung pajak dan service charge otomatis, bagikan tagihan ke WhatsApp.",
    }),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomepagePageClient
        content={toClientContent(content)}
        faqs={faqs.filter((faq) => faq.showOnLanding)}
        initialReviews={initialReviews}
        initialBlogs={initialBlogs}
        staticSections={renderStaticSections(content)}
      />
    </>
  );
}
