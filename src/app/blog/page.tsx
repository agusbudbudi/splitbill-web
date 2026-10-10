import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import BlogListClient, { BLOGS_PER_PAGE } from "@/app/blog/BlogListClient";
import { fetchBlogs } from "@/lib/api/blog";
import type { Blog } from "@/lib/types/blog";

// ISR: list is server-rendered for crawlers and refreshed hourly
export const revalidate = 3600;

async function getInitialBlogs(): Promise<{ blogs: Blog[]; totalPages: number }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetchBlogs({
      page: 1,
      limit: BLOGS_PER_PAGE,
      cache: "force-cache",
      next: { revalidate: 3600 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    return { blogs: res.data || [], totalPages: res.pagination?.totalPages || 1 };
  } catch (error) {
    console.error("Failed to prefetch blogs for /blog:", error);
    return { blogs: [], totalPages: 1 };
  }
}

export const metadata: Metadata = buildMetadata({
  title: "Blog & Tips Split Bill: Kelola Keuangan & Patungan Lebih Hemat",
  description: "Temukan tips seputar pengelolaan keuangan, cara split bill yang adil, update fitur SplitBill, dan panduan patungan online untuk Gen-Z dan Millennial.",
  path: "/blog",
  socialTitle: "Blog & Tips Split Bill | SplitBill",
  socialDescription: "Tips cerdas bagi tagihan dan update fitur terbaru SplitBill untuk pengalaman patungan yang lebih mudah.",
});

export default async function BlogPage() {
  const { blogs, totalPages } = await getInitialBlogs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog SplitBill",
    "description": "Tips cerdas pengelolaan keuangan dan panduan bagi tagihan adil.",
    "url": "https://www.splitbill.my.id/blog",
    "publisher": {
      "@type": "Organization",
      "name": "SplitBill",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.splitbill.my.id/img/split-bill-icon.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListClient initialBlogs={blogs} initialTotalPages={totalPages} />
    </>
  );
}
