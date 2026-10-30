import { getCache } from "@vercel/functions";

// Long enough to outlast any backend outage; entries are rewritten on every
// successful render, so this only matters for how long a dead backend is covered.
const LAST_GOOD_TTL_SECONDS = 60 * 60 * 24 * 30;

const lastGoodCache = () => getCache({ namespace: "cms-last-good" });

/**
 * Last successful CMS response, kept in Vercel Runtime Cache so a failed fetch
 * renders the previous content instead of the shipped defaults, which ISR would
 * otherwise hold for a full hour. Neither helper ever throws.
 *
 * Called during render, so Next's patched fetch also holds the cache client's
 * requests in the Data Cache for the page's revalidate window: a read can lag
 * the latest save by up to an hour, which is fine for an outage fallback.
 */
export async function saveLastGood<T>(key: string, value: T): Promise<void> {
  try {
    await lastGoodCache().set(key, value, { ttl: LAST_GOOD_TTL_SECONDS, name: key });
  } catch (error) {
    console.warn(`Failed to save last good CMS response for "${key}":`, error);
  }
}

export async function readLastGood<T>(key: string): Promise<T | null> {
  try {
    return ((await lastGoodCache().get(key)) as T | null | undefined) ?? null;
  } catch (error) {
    console.warn(`Failed to read last good CMS response for "${key}":`, error);
    return null;
  }
}
