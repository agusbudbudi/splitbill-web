import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { mergeWithDefaults } from "./normalize";
import type { LandingContent } from "./types";

/** Cache tag on the CMS fetch; splitbill-be hits /api/revalidate with it after every save. */
export const LANDING_CACHE_TAG = "landing-page";

const FETCH_TIMEOUT_MS = 5000;

// Local dev has no backend→web revalidate hook, so a cached response would hide
// CMS saves for up to an hour; fetch fresh there instead.
// force-cache is explicit because apiClient defaults every request to no-store.
export const CMS_FETCH_CACHE = (tag: string): RequestInit =>
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { cache: "force-cache", next: { revalidate: 3600, tags: [tag] } };
const PREVIEW_FETCH_TIMEOUT_MS = 20000;

export interface LandingContentResult {
  content: LandingContent;
  /** Last CMS save, null when serving the shipped defaults. */
  updatedAt: string | null;
}

async function fetchLandingContent(init: RequestInit, timeoutMs = FETCH_TIMEOUT_MS): Promise<LandingContentResult> {
  try {
    const json = await apiClient.request<{ data?: { content?: Partial<LandingContent>; updatedAt?: string } }>(
      "/api/landing-page",
      { skipAuth: true, ...init, signal: AbortSignal.timeout(timeoutMs) },
    );
    return {
      content: mergeWithDefaults(json?.data?.content),
      updatedAt: json?.data?.updatedAt ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch landing content, using defaults:", error);
    return { content: mergeWithDefaults(undefined), updatedAt: null };
  }
}

/**
 * CMS homepage content, ISR-cached for an hour and refreshed on demand after a
 * CMS save. Never throws: on timeout/error it returns the shipped defaults.
 * Wrapped in React cache() so generateMetadata and the page share one fetch.
 */
export const getLandingContent = cache(() =>
  fetchLandingContent(CMS_FETCH_CACHE(LANDING_CACHE_TAG)),
);

/**
 * Latest saved content, bypassing the data cache — for the CMS preview, which
 * must start from what was just saved rather than the hour-old ISR copy. Gets
 * a longer timeout than the public page: an admin-only tool should wait for a
 * slow backend instead of quietly showing defaults.
 */
export const getFreshLandingContent = () => fetchLandingContent({ cache: "no-store" }, PREVIEW_FETCH_TIMEOUT_MS);
