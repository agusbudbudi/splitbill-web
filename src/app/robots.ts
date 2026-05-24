import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://splitbill.my.id";
  
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sitemap.xml"],
      disallow: [
        "/api/",       // Jangan indeks endpoint API
        "/admin/",     // Folder admin (jika ada)
        "/_next/",     // Folder internal Next.js
        "/static/",    // Static files biasanya sudah di-handle
        "/*.json$",    // File konfigurasi JSON
        "/profile",    // Protected route
        "/wallet",     // Protected route
        "/history",    // Protected route
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
