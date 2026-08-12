import { MetadataRoute } from "next";
import { fetchBlogs } from "@/lib/api/blog";

// Revalidate sitemap every 24 hours — avoids dynamic server usage warning
export const revalidate = 86400;

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  // Fixed date of last real content change. Omit only for pages whose
  // content genuinely changes on every visit (home, blog listing) —
  // those fall back to today's date instead.
  lastModified?: string;
}

const routeConfigs: RouteConfig[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/split-bill", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-07-25" },
  { path: "/collect-money", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-07-25" },
  { path: "/shared-goals", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-07-25" },
  { path: "/split-later", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-07-25" },
  { path: "/invoice", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-07-25" },
  { path: "/member/membership", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-07-25" },
  { path: "/review", priority: 0.7, changeFrequency: "weekly", lastModified: "2026-07-25" },
  { path: "/subscription", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-07-25" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-25" },
  { path: "/donate", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-07-25" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-07-25" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-07-25" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.splitbill.my.id";
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Static routes
  const staticRoutes = routeConfigs.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: lastModified ?? todayStr,
    changeFrequency,
    priority,
  }));

  // Dynamic Blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    // Hard timeout so a slow/cold-starting backend can't hang this route
    // past the serverless function limit (Googlebot got "couldn't fetch" from this)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const blogsRes = await fetchBlogs({
      limit: 1000,
      cache: "force-cache",
      next: { revalidate: 86400 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    
    if (blogsRes && blogsRes.success && Array.isArray(blogsRes.data)) {
      blogRoutes = blogsRes.data
        .filter(blog => blog.status === "published" && blog.slug)
        .map((blog) => {
          // Ensure we have a valid date
          let lastModStr = todayStr;
          try {
            const dateStr = blog.updatedAt || blog.publishedAt || blog.createdAt;
            if (dateStr) {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                lastModStr = d.toISOString().split("T")[0];
              }
            }
          } catch (e) {
            // Fallback to today
          }

          return {
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: lastModStr,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          };
        });
    }
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap:", error);
    // Continue with just static routes
  }

  return [...staticRoutes, ...blogRoutes];
}
