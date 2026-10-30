import type { Metadata } from "next";
import { buildMetadata, SITE_NAME } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structuredData";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { fetchBlogBySlug } from "@/lib/api/blog";
import { fetchAllBlogs } from "@/lib/api/blog.server";
import { prepareBlogContent } from "@/lib/utils/blogContent";
import { canonicalPostSlug } from "@/lib/blogCanonical";
import { Blog } from "@/lib/types/blog";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const blog = await fetchBlogBySlug(slug);

    return buildMetadata({
      title: blog.metaTitle || `${blog.title} | Blog SplitBill`,
      description: blog.metaDescription || blog.excerpt,
      path: `/blog/${canonicalPostSlug(blog.slug)}`,
      // Ignores the CMS canonicalUrl: some posts carry the bare homepage, which
      // would tell Google the article is a duplicate of /.
      socialTitle: blog.title,
      socialDescription: blog.excerpt,
      image: blog.thumbnail
        ? { url: blog.thumbnail, width: 1200, height: 630, alt: blog.thumbnailAlt || blog.title }
        : undefined,
      type: "article",
      article: {
        publishedTime: blog.publishedAt || blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: blog.author ? [blog.author] : undefined,
      },
    });
  } catch (error) {
    return {
      title: "Artikel Tidak Ditemukan | Blog SplitBill",
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const [blog, allBlogs] = await Promise.all([
      fetchBlogBySlug(slug),
      // Related posts are optional: a failed list fetch must not 404 the article.
      fetchAllBlogs().catch((error) => {
        console.error("Failed to fetch related blogs:", error);
        return [] as Blog[];
      }),
    ]);
    // Rewrite the body once on the server (heading ids for the TOC) and
    // ship only the rewritten HTML to the client.
    const { html, headings } = prepareBlogContent(blog.content);

    const otherBlogs = allBlogs.filter((b: Blog) => b.slug !== slug);
    const sameCategory = otherBlogs.filter((b) => b.category === blog.category);
    const relatedBlogs = [
      ...sameCategory,
      ...otherBlogs.filter((b) => !sameCategory.includes(b)),
    ].slice(0, 4);

    // JSON-LD for SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.thumbnail || "https://www.splitbill.my.id/img/pwa-banner.png",
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
      author: [
        {
          "@type": "Person",
          name: blog.author || "Tim SplitBill",
          url: "https://www.splitbill.my.id",
        },
      ],
      publisher: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: "https://www.splitbill.my.id/img/split-bill-icon.png",
        },
      },
      description: blog.excerpt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.splitbill.my.id/blog/${blog.slug}`,
      },
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.splitbill.my.id" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.splitbill.my.id/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: blog.title,
          item: `https://www.splitbill.my.id/blog/${blog.slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <BlogDetailClient
          blog={{ ...blog, content: html }}
          headings={headings}
          recentBlogs={relatedBlogs}
        />
      </>
    );
  } catch (error) {
    notFound();
  }
}
