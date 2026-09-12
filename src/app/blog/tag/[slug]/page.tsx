import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogs } from "@/lib/api/blog";
import { slugify } from "@/lib/utils/index";
import { BlogCard } from "@/components/blog/BlogCard";
import { Footer } from "@/components/layout/Footer";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://www.splitbill.my.id";

async function getTagBlogs(slug: string) {
  const res = await fetchBlogs({
    limit: 1000,
    cache: "force-cache",
    next: { revalidate: 86400 },
  });
  const posts = res.data || [];
  const tagName = posts
    .flatMap((b) => b.tags || [])
    .find((tag) => slugify(tag) === slug);
  if (!tagName) return null;
  return {
    tagName,
    posts: posts.filter((b) => (b.tags || []).some((tag) => slugify(tag) === slug)),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getTagBlogs(slug);
  if (!result) return { title: "Tag Tidak Ditemukan — Blog SplitBill" };

  const title = `#${result.tagName} — Blog SplitBill`;
  const description = `Kumpulan artikel bertag ${result.tagName} dari Blog SplitBill.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/blog/tag/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/tag/${slug}`,
      siteName: "Split Bill App",
      locale: "id_ID",
      type: "website",
    },
  };
}

export default async function BlogTagPage({ params }: Props) {
  const { slug } = await params;
  const result = await getTagBlogs(slug);
  if (!result) notFound();

  const { tagName, posts } = result;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: `#${tagName}`, item: `${BASE_URL}/blog/tag/${slug}` },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-background pb-0 flex flex-col items-center pt-16 lg:pt-18">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomepageNavbar />

      <section className="w-full max-w-[600px] lg:max-w-7xl relative pt-12 pb-8 px-6">
        <div className="relative z-10 w-full mx-auto text-center">
          <Link
            href="/blog"
            className="text-sm font-bold text-primary hover:underline mb-2 inline-block"
          >
            ← Semua Artikel
          </Link>
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight text-foreground">
            #{tagName}
          </h1>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-md mx-auto">
            {posts.length} artikel bertag ini.
          </p>
        </div>
      </section>

      <main className="w-full max-w-[600px] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex-1">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((blog, index) => (
            <BlogCard key={blog._id} blog={blog} priority={index === 0} />
          ))}
        </div>
      </main>

      <BlogCTA />
      <HomepageFooter />
      <Footer />
    </div>
  );
}
