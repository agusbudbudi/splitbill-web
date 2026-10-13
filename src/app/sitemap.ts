import { MetadataRoute } from "next";
import { fetchAllBlogs } from "@/lib/api/blog.server";
import { absoluteUrl } from "@/lib/seo";

// Revalidate sitemap every 24 hours — avoids dynamic server usage warning
export const revalidate = 86400;

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
  { path: "/invoice", lastModified: "2026-10-10" },
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
    // past the serverless function limit (Googlebot got "couldn't fetch" from this)
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Blog fetch timed out")), 5000);
    });
    const posts = await Promise.race([fetchAllBlogs(), timeout]).finally(() =>
      clearTimeout(timeoutId),
    );

    blogRoutes = posts
      .filter((blog) => blog.status === "published" && blog.slug)
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
    // Continue with just static routes
  }

  const staticRoutes = routeConfigs.map(({ path, lastModified }) => ({
    url: absoluteUrl(path),
    // Blog listing and homepage show the latest posts, so they change
    // whenever a post does.
    lastModified:
      (path === "/blog" || path === "/") && newestBlogDate && newestBlogDate > lastModified
        ? newestBlogDate
        : lastModified,
  }));

  return [...staticRoutes, ...blogRoutes];
}
