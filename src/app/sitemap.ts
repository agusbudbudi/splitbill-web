import { MetadataRoute } from "next";
interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const routeConfigs: RouteConfig[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/split-bill", priority: 0.9, changeFrequency: "weekly" },
  { path: "/collect-money", priority: 0.8, changeFrequency: "weekly" },
  { path: "/shared-goals", priority: 0.8, changeFrequency: "weekly" },
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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://splitbill.my.id";
  const now = new Date();

  return routeConfigs.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
