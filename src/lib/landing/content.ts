import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { IS_BUILD_PHASE } from "@/lib/api/blog.server";
import { mergeWithDefaults } from "./normalize";
import type { LandingContent } from "./types";

/** Cache tag on the CMS fetch; splitbill-be hits /api/revalidate with it after every save. */
export const LANDING_CACHE_TAG = "landing-page";

const FETCH_TIMEOUT_MS = 5000;
// `next build` prerenders every page at once, often against a cold-starting
// backend: a 5s timeout there once baked the defaults into a deploy.
const BUILD_FETCH_TIMEOUT_MS = 15000;
const BUILD_FETCH_ATTEMPTS = 2;

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

/**
 * Runs a cached CMS request: longer timeout and one retry during the build,
 * a single short attempt otherwise.
 */
export async function requestCms<T>(run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const attempts = IS_BUILD_PHASE ? BUILD_FETCH_ATTEMPTS : 1;
  const timeoutMs = IS_BUILD_PHASE ? BUILD_FETCH_TIMEOUT_MS : FETCH_TIMEOUT_MS;
  for (let attempt = 1; ; attempt++) {
    try {
      return await run(AbortSignal.timeout(timeoutMs));
    } catch (error) {
      if (attempt >= attempts) throw error;
    }
  }
}

async function fetchLandingContent(init: RequestInit, signal: AbortSignal): Promise<LandingContentResult> {
  const json = await apiClient.request<{ data?: { content?: Partial<LandingContent>; updatedAt?: string } }>(
    "/api/landing-page",
    { skipAuth: true, ...init, signal },
  );
  return {
    content: mergeWithDefaults(json?.data?.content),
    updatedAt: json?.data?.updatedAt ?? null,
  };
}

const defaultLandingContent = (): LandingContentResult => ({ content: mergeWithDefaults(undefined), updatedAt: null });

/**
 * CMS homepage content, ISR-cached for an hour and refreshed on demand after a
 * CMS save. Never throws: on timeout/error it returns the shipped defaults.
 * Not rethrowing on revalidation on purpose: /api/revalidate expires the page
 * immediately, so a throw there would serve a 500 instead of the last good page.
 * Wrapped in React cache() so generateMetadata and the page share one fetch.
 */
export const getLandingContent = cache(async (): Promise<LandingContentResult> => {
  try {
    return await requestCms((signal) => fetchLandingContent(CMS_FETCH_CACHE(LANDING_CACHE_TAG), signal));
  } catch (error) {
    console.error("Failed to fetch landing content, using defaults:", error);
    return defaultLandingContent();
  }
});

/**
 * Latest saved content, bypassing the data cache — for the CMS preview, which
 * must start from what was just saved rather than the hour-old ISR copy. Gets
 * a longer timeout than the public page: an admin-only tool should wait for a
 * slow backend instead of quietly showing defaults. Never throws.
 */
export const getFreshLandingContent = async (): Promise<LandingContentResult> => {
  try {
    return await fetchLandingContent({ cache: "no-store" }, AbortSignal.timeout(PREVIEW_FETCH_TIMEOUT_MS));
  } catch (error) {
    console.error("Failed to fetch landing content, using defaults:", error);
    return defaultLandingContent();
  }
};
