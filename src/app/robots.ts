import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /_next/ dan /static/ sengaja TIDAK di-block: Googlebot butuh JS, CSS
      // dan /_next/image buat render halaman. /wallet tetap di-block karena
      // cuma app yang butuh login (gak ada versi marketing-nya).
      disallow: ["/api/", "/admin/", "/history", "/member", "/wallet"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
