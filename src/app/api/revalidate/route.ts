import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "crypto";
import { LANDING_CACHE_TAG } from "@/lib/landing/content";
import { FAQ_CACHE_TAG } from "@/lib/faq";

// Only what the CMS actually changes can be revalidated — keeps a leaked
// secret from being used to churn arbitrary pages.
const ALLOWED_PATHS = new Set([
  "/",
  // Pages rendering CMS FAQs
  "/faq",
  "/split-bill",
  "/split-bill/cara-pakai",
  "/split-later/cara-pakai",
  "/split-bill-liburan",
  "/shared-goals",
  "/shared-goals/cara-pakai",
  "/collect-money",
  "/invoice",
]);
// "blogs": the all-posts snapshot (fetchAllBlogs in lib/api/blog.server.ts)
// behind /blog, category/tag pages, related posts and the sitemap.
const BLOG_CACHE_TAG = "blogs";
const ALLOWED_TAGS = new Set([LANDING_CACHE_TAG, FAQ_CACHE_TAG, BLOG_CACHE_TAG]);

function isAuthorized(provided: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * POST /api/revalidate — called by splitbill-be after a CMS save.
 * Header: x-revalidate-secret. Body: { paths?: string[], tags?: string[] }
 */
export async function POST(request: Request) {
  if (!isAuthorized(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const tags: string[] = (Array.isArray(body?.tags) ? body.tags : []).filter((t: unknown) =>
    ALLOWED_TAGS.has(t as string),
  );
  const paths: string[] = (Array.isArray(body?.paths) ? body.paths : []).filter((p: unknown) =>
    ALLOWED_PATHS.has(p as string),
  );

  // expire: 0 drops the cached CMS response immediately instead of serving it
  // stale once more; revalidatePath then re-renders the ISR page on next visit.
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ success: true, revalidated: { tags, paths } });
}
