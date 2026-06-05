import { MetadataRoute } from "next";
import { fetchBlogs } from "@/lib/api/blog";

// Revalidate sitemap every 24 hours — avoids dynamic server usage warning
export const revalidate = 86400;

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const routeConfigs: RouteConfig[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/split-bill", priority: 0.9, changeFrequency: "weekly" },
  { path: "/collect-money", priority: 0.8, changeFrequency: "weekly" },
  { path: "/shared-goals", priority: 0.8, changeFrequency: "weekly" },
  { path: "/split-later", priority: 0.8, changeFrequency: "weekly" },
  { path: "/invoice", priority: 0.8, changeFrequency: "weekly" },
  { path: "/membership", priority: 0.6, changeFrequency: "monthly" },
  { path: "/review", priority: 0.7, changeFrequency: "weekly" },
  { path: "/subscription", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/donate", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://splitbill.my.id";
  const now = new Date();

  // Static routes
  const staticRoutes = routeConfigs.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Dynamic Blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    // Add a timeout to the fetch if possible, but here we just catch the error
    const blogsRes = await fetchBlogs({ limit: 1000 });
    
    if (blogsRes && blogsRes.success && Array.isArray(blogsRes.data)) {
      blogRoutes = blogsRes.data
        .filter(blog => blog.status === "published" && blog.slug)
        .map((blog) => {
          // Ensure we have a valid date
          let lastMod = now;
          try {
            const dateStr = blog.updatedAt || blog.publishedAt || blog.createdAt;
            if (dateStr) {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                lastMod = d;
              }
            }
          } catch (e) {
            // Fallback to now
          }

          return {
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: lastMod,
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
