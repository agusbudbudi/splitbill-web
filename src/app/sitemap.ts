import { MetadataRoute } from "next";
import { fetchAllBlogs, IS_BUILD_PHASE } from "@/lib/api/blog.server";
import { absoluteUrl } from "@/lib/seo";
import { canonicalPostSlug } from "@/lib/blogCanonical";
import { getLandingContent } from "@/lib/landing/content";

// Revalidate sitemap every 24 hours — avoids dynamic server usage warning
export const revalidate = 86400;

const BLOG_FETCH_TIMEOUT_MS = 8000;

interface RouteConfig {
  path: string;
  // Date of the last real content change on this page (update it when the
  // page copy changes). Pages that list blog posts use the newest post date
  // instead, see below.
  lastModified: string;
}

// Only public, indexable pages. Do not list anything robots.ts disallows
// (/wallet, /history, /member) or anything behind login (/split-later).
const routeConfigs: RouteConfig[] = [
  { path: "/", lastModified: "2026-10-10" },
  { path: "/blog", lastModified: "2026-10-10" },
  { path: "/all-feature", lastModified: "2026-10-10" },
  { path: "/split-bill", lastModified: "2026-10-10" },
  { path: "/split-bill/cara-pakai", lastModified: "2026-09-14" },
  { path: "/split-bill-liburan", lastModified: "2026-09-12" },
  { path: "/split-later/cara-pakai", lastModified: "2026-09-14" },
  { path: "/shared-goals", lastModified: "2026-10-10" },
  { path: "/shared-goals/cara-pakai", lastModified: "2026-09-14" },
  { path: "/collect-money", lastModified: "2026-10-10" },
  { path: "/collect-money/cara-pakai", lastModified: "2026-10-30" },
  { path: "/invoice", lastModified: "2026-10-10" },
  { path: "/invoice/cara-pakai", lastModified: "2026-10-30" },
  { path: "/subscription", lastModified: "2026-09-12" },
  { path: "/faq", lastModified: "2026-10-10" },
  { path: "/donate", lastModified: "2026-09-12" },
  { path: "/privacy", lastModified: "2026-09-12" },
  { path: "/terms", lastModified: "2026-09-12" },
];

function toDateString(value?: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamic Blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  let newestBlogDate: string | undefined;
  try {
    // Hard timeout so a slow/cold-starting backend can't hang this route
    // past the serverless function limit (Googlebot got "couldn't fetch" from
    // this). Covers the whole multi-page walk (each page retried once).
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Blog fetch timed out")), BLOG_FETCH_TIMEOUT_MS);
    });
    const posts = await Promise.race([fetchAllBlogs(), timeout]).finally(() =>
      clearTimeout(timeoutId),
    );

    blogRoutes = posts
      .filter((blog) => blog.status === "published" && blog.slug && canonicalPostSlug(blog.slug) === blog.slug)
      .map((blog) => {
        const lastModified = toDateString(blog.updatedAt || blog.publishedAt || blog.createdAt);
        if (lastModified && (!newestBlogDate || lastModified > newestBlogDate)) {
          newestBlogDate = lastModified;
        }
        return {
          url: absoluteUrl(`/blog/${blog.slug}`),
          ...(lastModified && { lastModified }),
        };
      });
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap:", error);
    // On revalidation, throw so ISR keeps serving the last good sitemap
    // instead of caching a blog-less one for a day. Only the build (no last
    // good copy yet) continues with just the static routes.
    if (!IS_BUILD_PHASE) throw error;
  }

  // Homepage copy is CMS-managed; its last save counts as a content change.
  // getLandingContent never throws and has its own fetch timeout.
  const { updatedAt: landingUpdatedAt } = await getLandingContent();
  const landingDate = toDateString(landingUpdatedAt ?? undefined);

  // YYYY-MM-DD strings compare correctly as plain strings.
  const latest = (base: string, ...dates: (string | undefined)[]) =>
    dates.reduce<string>((max, d) => (d && d > max ? d : max), base);

  const staticRoutes = routeConfigs.map(({ path, lastModified }) => ({
    url: absoluteUrl(path),
    // Blog listing and homepage show the latest posts, so they change
    // whenever a post does.
    lastModified:
      path === "/"
        ? latest(lastModified, newestBlogDate, landingDate)
        : path === "/blog"
          ? latest(lastModified, newestBlogDate)
          : lastModified,
  }));

  return [...staticRoutes, ...blogRoutes];
}
