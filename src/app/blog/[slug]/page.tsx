import type { Metadata } from "next";
import { buildMetadata, SITE_NAME } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structuredData";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/api/blog";
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
      path: `/blog/${blog.slug}`,
      // Always self-referencing: some posts carry a CMS canonicalUrl of the
      // bare homepage, which would tell Google the article is a duplicate of /.
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
    const [blog, allBlogsRes] = await Promise.all([
      fetchBlogBySlug(slug),
      fetchBlogs({ limit: 1000, cache: "force-cache", next: { revalidate: 86400 } }),
    ]);

    const otherBlogs = (allBlogsRes.data || []).filter((b: Blog) => b.slug !== slug);
    const sameCategory = otherBlogs.filter((b) => b.category === blog.category);
    const relatedBlogs = [
      ...sameCategory,
      ...otherBlogs.filter((b) => !sameCategory.includes(b)),
    ].slice(0, 3);

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
        <BlogDetailClient blog={blog} recentBlogs={relatedBlogs} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
