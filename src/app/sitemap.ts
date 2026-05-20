import { MetadataRoute } from "next";
import { fetchBlogs } from "@/lib/api/blog";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const routeConfigs: RouteConfig[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/split-bill", priority: 0.9, changeFrequency: "weekly" },
  { path: "/collect-money", priority: 0.8, changeFrequency: "weekly" },
  { path: "/shared-goals", priority: 0.8, changeFrequency: "weekly" },
  { path: "/split-later", priority: 0.8, changeFrequency: "weekly" },
  { path: "/wallet", priority: 0.7, changeFrequency: "monthly" },
  { path: "/history", priority: 0.6, changeFrequency: "weekly" },
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
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Dynamic Blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogsRes = await fetchBlogs({ limit: 1000 });
    if (blogsRes.success && blogsRes.data) {
      blogRoutes = blogsRes.data.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap:", error);
  }

  return [...staticRoutes, ...blogRoutes];
}
