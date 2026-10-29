import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import BlogListClient from "@/app/blog/BlogListClient";
import { fetchAllBlogs, getBlogCategories, IS_BUILD_PHASE } from "@/lib/api/blog.server";
import type { Blog } from "@/lib/types/blog";

// ISR: list is server-rendered for crawlers and refreshed hourly
export const revalidate = 3600;

// The snapshot the category/tag/detail pages use, so they all agree on which
// post is newest. The whole list goes to the client: search then covers every
// post, and "load more" just reveals more of it.
async function getPosts(): Promise<Blog[]> {
  try {
    return await fetchAllBlogs();
  } catch (error) {
    console.error("Failed to prefetch blogs for /blog:", error);
    // Throw on revalidation so ISR keeps the last good page; at build time
    // render empty and let the client fetch instead.
    if (!IS_BUILD_PHASE) throw error;
    return [];
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
  const posts = await getPosts();

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
      <BlogListClient initialBlogs={posts} categories={getBlogCategories(posts)} />
    </>
  );
}
