import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",       // Jangan indeks endpoint API
        "/admin/",     // Folder admin (jika ada)
        "/_next/",     // Folder internal Next.js
        "/static/",    // Static files biasanya sudah di-handle
        "/*.json$",    // File konfigurasi JSON
      ],
    },
    sitemap: "https://splitbill.my.id/sitemap.xml",
  };
}
