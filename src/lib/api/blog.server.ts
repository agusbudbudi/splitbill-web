import { unstable_cache } from "next/cache";
import { fetchBlogs } from "./blog";
import type { Blog } from "@/lib/types/blog";

// Backend caps `limit` at 50, so a single `limit: 1000` call silently
// truncates. Page through everything instead.
const PAGE_SIZE = 50;

async function fetchPage(page: number, attempt = 1) {
  try {
    // Uncached per page: the whole walk is cached once below, so every page
    // comes from the same moment and can't overlap or skip posts.
    return await fetchBlogs({ page, limit: PAGE_SIZE, cache: "no-store" });
  } catch (error) {
    if (attempt >= 2) throw error;
    return fetchPage(page, attempt + 1);
  }
}

async function walkAllBlogs(): Promise<Blog[]> {
  const first = await fetchPage(1);
  const totalPages = first.pagination?.totalPages || 1;
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
  );

  const seen = new Set<string>();
  return [first, ...rest]
    .flatMap((res) => res.data || [])
    .filter((blog) => !seen.has(blog._id) && !!seen.add(blog._id));
}

/**
 * Every published post, as one consistent snapshot shared by /blog, detail,
 * category, tag and sitemap, refreshed hourly. Throws if the backend is down:
 * ISR then keeps serving the last good page instead of caching an empty one.
 */
export const fetchAllBlogs = unstable_cache(walkAllBlogs, ["all-blogs"], {
  revalidate: 3600,
  tags: ["blogs"],
});
