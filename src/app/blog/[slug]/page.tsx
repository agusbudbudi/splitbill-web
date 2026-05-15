import type { Metadata, ResolvingMetadata } from "next";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/api/blog";
import { Blog } from "@/lib/types/blog";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const blog = await fetchBlogBySlug(slug);
    
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: blog.metaTitle || `${blog.title} — Blog SplitBill`,
      description: blog.metaDescription || blog.excerpt,
      keywords: blog.tags,
      alternates: {
        canonical: blog.canonicalUrl || `https://splitbill.my.id/blog/${blog.slug}`,
      },
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        url: `https://splitbill.my.id/blog/${blog.slug}`,
        siteName: "Split Bill App",
        locale: "id_ID",
        type: "article",
        publishedTime: blog.publishedAt || blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author],
        images: [
          {
            url: blog.thumbnail || "/img/pwa-banner.png",
            width: 1200,
            height: 630,
            alt: blog.thumbnailAlt || blog.title,
          },
          ...previousImages,
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
        images: [blog.thumbnail || "/img/pwa-banner.png"],
      },
    };
  } catch (error) {
    return {
      title: "Artikel Tidak Ditemukan — Blog SplitBill",
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const [blog, recentBlogsRes] = await Promise.all([
      fetchBlogBySlug(slug),
      fetchBlogs({ limit: 4 })
    ]);

    const recentBlogs = (recentBlogsRes.data || [])
      .filter((b: Blog) => b.slug !== slug)
      .slice(0, 3);
    
    // JSON-LD for SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.thumbnail || "https://splitbill.my.id/img/pwa-banner.png",
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
      author: [
        {
          "@type": "Person",
          name: blog.author || "Tim SplitBill",
          url: "https://splitbill.my.id",
        },
      ],
      publisher: {
        "@type": "Organization",
        name: "SplitBill Online",
        logo: {
          "@type": "ImageObject",
          url: "https://splitbill.my.id/img/footer-icon.png",
        },
      },
      description: blog.excerpt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://splitbill.my.id/blog/${blog.slug}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogDetailClient blog={blog} recentBlogs={recentBlogs} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
