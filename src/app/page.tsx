import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { HomepagePageClient } from "@/components/homepage/HomepagePageClient";
import { apiClient } from "@/lib/api/client";
import { fetchBlogs } from "@/lib/api/blog";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Review } from "@/hooks/useReview";
import type { Blog } from "@/lib/types/blog";

// ISR: testimonials and latest posts are server-rendered for crawlers and
// refreshed hourly.
export const revalidate = 3600;

const FETCH_TIMEOUT_MS = 5000;

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

export const metadata: Metadata = buildMetadata({
  title: "Split Bill Online - Aplikasi Bagi Tagihan & Patungan Gratis",
  description:
    "Split bill online gratis: scan struk pakai AI, hitung pajak dan service charge otomatis, lalu bagi tagihan ke teman lewat WhatsApp. Tanpa install aplikasi.",
  path: "/",
  socialTitle: "SplitBill: Split Bill Online, Bagi Tagihan Lebih Mudah",
});

export default async function HomepagePage() {
  const [initialReviews, initialBlogs] = await Promise.all([getLandingReviews(), getLatestBlogs()]);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Split Bill Online",
    alternateName: "SplitBill.my.id",
    url: "https://www.splitbill.my.id",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Split Bill Online",
    url: "https://www.splitbill.my.id",
    logo: "https://www.splitbill.my.id/icon.png",
    sameAs: ["https://www.instagram.com/splitbill.app/"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomepagePageClient initialReviews={initialReviews} initialBlogs={initialBlogs} />
    </>
  );
}
