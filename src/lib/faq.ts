import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { faqData, faqCategoryLabels, type FAQItem } from "@/data/faqData";
import { CMS_FETCH_CACHE, requestCms } from "@/lib/landing/content";

/** Cache tag on the CMS fetch; splitbill-be hits /api/revalidate with it after every FAQ change. */
export const FAQ_CACHE_TAG = "faqs";

// Validates one CMS FAQ and coerces `showOnLanding`: pages filter on it, so a
// missing field or a stringly-typed "true" must not silently hide the FAQ.
const toFaq = (f: unknown): FAQItem | null => {
  const faq = f as Partial<Omit<FAQItem, "showOnLanding">> & { showOnLanding?: unknown };
  const valid =
    typeof faq?.id === "string" &&
    typeof faq.question === "string" &&
    faq.question.trim().length > 0 &&
    typeof faq.answer === "string" &&
    faq.answer.trim().length > 0 &&
    typeof faq.category === "string" &&
    faq.category in faqCategoryLabels;
  if (!valid) return null;
  return { ...(faq as FAQItem), showOnLanding: faq.showOnLanding === true || faq.showOnLanding === "true" };
};

/**
 * All active FAQs from the CMS, ISR-cached for an hour and refreshed on demand
 * after a CMS change. Never throws: on error — or while the CMS collection is
 * still empty (`configured` false/absent) — it returns the static faqData, so FAQ sections and their
 * FAQPage structured data never disappear.
 */
export const getFaqs = cache(async (): Promise<FAQItem[]> => {
  try {
    const json = await requestCms((signal) =>
      apiClient.request<{ data?: unknown; configured?: boolean }>("/api/faqs", {
        skipAuth: true,
        ...CMS_FETCH_CACHE(FAQ_CACHE_TAG),
        signal,
      }),
    );
    const faqs = Array.isArray(json?.data)
      ? json.data.map(toFaq).filter((f): f is FAQItem => f !== null)
      : [];
    // An empty list from a configured CMS means every FAQ was deactivated on purpose
    return faqs.length > 0 || json?.configured === true ? faqs : faqData;
  } catch (error) {
    console.error("Failed to fetch FAQs, using static data:", error);
    return faqData;
  }
});

const normalizeQuestion = (q: string) => q.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Re-resolves a hand-picked FAQ list (e.g. featureSeoContent's, built from
 * static faqData) against the CMS list, so CMS edits show up there too. Matches
 * by id, then by question text in case the CMS re-keyed the FAQ. FAQs deleted
 * or deactivated in the CMS drop out.
 */
export function resolveFaqs(all: FAQItem[], picked: FAQItem[]): FAQItem[] {
  return picked
    .map(
      (faq) =>
        all.find((f) => f.id === faq.id) ??
        all.find((f) => normalizeQuestion(f.question) === normalizeQuestion(faq.question)),
    )
    .filter((f): f is FAQItem => !!f);
}
