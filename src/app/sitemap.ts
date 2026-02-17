import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://splitbill.my.id";
  const lastModified = new Date();

  const routes = [
    "",
    "/split-bill",
    "/wallet",
    "/history",
    "/donate",
    "/faq",
    "/shared-goals",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
