import { unstable_cache } from "next/cache";
import { fetchBlogs } from "./blog";
import type { Blog } from "@/lib/types/blog";

// Backend caps `limit` at 50, so a single `limit: 1000` call silently
// truncates. Page through everything instead.
const PAGE_SIZE = 50;

/**
 * True while `next build` prerenders pages. There is no last good page to
 * keep yet, so callers render without blog data instead of throwing (which
 * would fail the whole build whenever the backend is down).
 */
export const IS_BUILD_PHASE = process.env.NEXT_PHASE === "phase-production-build";

async function fetchPage(page: number, attempt = 1) {
  try {
    // Uncached per page: the whole walk is cached once below as one snapshot.
    return await fetchBlogs({ page, limit: PAGE_SIZE, cache: "no-store" });
  } catch (error) {
    if (attempt >= 2) throw error;
    return fetchPage(page, attempt + 1);
  }
}

async function walkPages(): Promise<{ posts: Blog[]; consistent: boolean }> {
  const first = await fetchPage(1);
  const totalPages = first.pagination?.totalPages || 1;
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
  );
  const pages = [first, ...rest];

  const seen = new Set<string>();
  const posts = pages
    .flatMap((res) => res.data || [])
    .filter((blog) => !seen.has(blog._id) && !!seen.add(blog._id));

  // The backend sorts with an _id tiebreaker, so offset pages of an unchanged
  // list can't overlap or skip. A post published or removed between the page
  // requests shifts the offsets: the totals disagree or a post goes missing.
  const total = first.pagination?.total;
  const consistent =
    total === undefined ||
    (posts.length === total && pages.every((res) => res.pagination?.total === total));
  return { posts, consistent };
}

async function walkAllBlogs(): Promise<Blog[]> {
  const snapshot = await walkPages();
  if (snapshot.consistent) return snapshot.posts;
  // The list changed mid-walk: one more walk sees it settled
  return (await walkPages()).posts;
}

/**
 * Every published post, as one snapshot shared by /blog, detail, category,
 * tag and sitemap. Refreshed hourly, or as soon as the backend revalidates the
 * "blogs" tag after a CMS save. Throws if the backend is down: ISR then keeps
 * serving the last good page instead of caching an empty one.
 */
export const fetchAllBlogs = unstable_cache(walkAllBlogs, ["all-blogs"], {
  revalidate: 3600,
  tags: ["blogs"],
});

/** Distinct categories, in snapshot order (newest post first). */
export function getBlogCategories(posts: Blog[]): string[] {
  return Array.from(new Set(posts.map((b) => b.category).filter(Boolean)));
}
