"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Share2, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { Blog } from "@/lib/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogShareButtons, copyShareLink } from "@/components/blog/BlogShareButtons";
import { BlogTableOfContents, useActiveHeading } from "@/components/blog/BlogTableOfContents";
import type { BlogHeading } from "@/lib/utils/blogContent";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { Badge, badgeVariants } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, formatDate, slugify } from "@/lib/utils/index";
import { canGoBackInApp } from "@/lib/utils/navigationHistory";

interface BlogDetailClientProps {
  /** `content` is already rewritten on the server (see prepareBlogContent). */
  blog: Blog;
  headings: BlogHeading[];
  recentBlogs?: Blog[];
}

// Page content uses the same max-w-7xl + px-4/6/8 container as the header
// bar and HomepageFooter so every section edge lines up.
const PAGE_CONTAINER = "w-full max-w-[600px] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Body grid: article text column + sticky sidebar.
const ARTICLE_GRID = "lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16";
const ARTICLE_COLUMN = "min-w-0";

const SplitBillPromo = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-sm bg-primary px-5 pt-5 shadow-glow flex flex-col gap-4",
      className,
    )}
  >
    <div className="space-y-1.5">
      <h3 className="text-lg font-bold text-white leading-tight">
        Bagi Tagihan Lebih Praktis ⚡️
      </h3>
      <p className="text-xs text-white/80 leading-relaxed">
        Scan struk & hitung nominal otomatis dengan AI. Gratis, cepat, dan
        akurat.
      </p>
    </div>
    <Button
      asChild
      size="sm"
      className="w-full bg-white text-primary shadow-sm hover:opacity-90"
    >
      <Link href="/split-bill">Coba Split Bill Sekarang</Link>
    </Button>
    <div className="relative -mx-5">
      <img
        src="/img/hero-ads-blog.png"
        alt="Ilustrasi Split Bill"
        className="block w-[85%] h-auto mx-auto"
      />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
    </div>
  </div>
);

export default function BlogDetailClient({
  blog,
  headings,
  recentBlogs = [],
}: BlogDetailClientProps) {
  const router = useRouter();
  const articleRef = useRef<HTMLDivElement>(null);
  const shareUrl = `https://www.splitbill.my.id/blog/${blog.slug}`;
  const categoryHref = `/blog/category/${slugify(blog.category)}`;
  const activeHeadingId = useActiveHeading(headings);

  const handleBack = () => {
    if (canGoBackInApp()) router.back();
    else router.push("/blog");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: blog.title, text: blog.excerpt, url: shareUrl })
        .catch(() => {});
    } else {
      copyShareLink(shareUrl);
    }
  };

  return (
    <div className="min-h-screen bg-card flex flex-col items-center">
      <ReadingProgressBar target={articleRef} />

      <Header
        sticky
        showBackButton
        onBack={handleBack}
        wide
        containerClassName={PAGE_CONTAINER}
        rightContent={
          <button
            onClick={handleShare}
            aria-label="Bagikan artikel"
            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      <article className={cn(PAGE_CONTAINER, "pt-6 lg:pt-12 pb-4")}>
        {/* Article header */}
        <header>
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-muted-foreground">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="w-3 h-3" />
                </li>
                <li>
                  <Link
                    href={categoryHref}
                    className="hover:text-primary transition-colors"
                  >
                    {blog.category}
                  </Link>
                </li>
              </ol>
            </nav>

            <Link href={categoryHref} className="w-fit">
              <Badge className="uppercase tracking-wide text-[10px] font-bold hover:bg-primary/10">
                {blog.category}
              </Badge>
            </Link>

            <h1 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground">
              {blog.title}
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>

            <div className="mt-2 py-4 border-y border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    {blog.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(blog.publishedAt || blog.createdAt)} ·{" "}
                    {blog.readTime} mnt baca
                  </span>
                </div>
              </div>
              <BlogShareButtons title={blog.title} url={shareUrl} />
            </div>
          </div>
        </header>

        {/* Body + sidebar */}
        <div className={cn(ARTICLE_GRID, "mt-8")}>
          <div ref={articleRef} className={ARTICLE_COLUMN}>
            {/* Hero image: natural aspect ratio, no crop */}
            <div className="mb-8 overflow-hidden rounded-sm bg-muted shadow-soft">
              <Image
                src={blog.thumbnail || "/img/pwa-banner.png"}
                alt={blog.thumbnailAlt || blog.title}
                width={1200}
                height={630}
                sizes="(max-width: 1024px) 100vw, 900px"
                className="w-full h-auto"
                priority
              />
            </div>

            <div className="lg:hidden mb-8">
              <BlogTableOfContents headings={headings} activeId={activeHeadingId} variant="collapsible" />
            </div>

            <BlogContent content={blog.content} />

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${slugify(tag)}`}
                    className={cn(
                      badgeVariants({ variant: "outline" }),
                      "px-3 py-1 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 focus:ring-0 focus:ring-offset-0",
                    )}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 p-5 rounded-sm border border-border bg-background flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Artikel ini bermanfaat?
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Bagikan ke teman patunganmu
                </span>
              </div>
              <BlogShareButtons title={blog.title} url={shareUrl} />
            </div>

            <SplitBillPromo className="lg:hidden mt-8" />
          </div>

          <aside className="hidden lg:flex flex-col gap-8">
            <SplitBillPromo />
            {/* Only the TOC sticks, so it never gets pushed off-screen by the
                promo when the list is long. */}
            <div className="sticky top-24">
              <BlogTableOfContents headings={headings} activeId={activeHeadingId} />
            </div>
          </aside>
        </div>
      </article>

      {recentBlogs.length > 0 && (
        <section className="w-full bg-background mt-12 py-12 lg:py-16">
          <div className={cn(PAGE_CONTAINER, "flex flex-col gap-6")}>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">
                Artikel Terkait
              </h2>
              <Link
                href="/blog"
                className="text-sm font-bold text-primary hover:opacity-80 transition-opacity"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {recentBlogs.map((recentBlog) => (
                <BlogCard key={recentBlog._id} blog={recentBlog} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogCTA />

      <HomepageFooter />

      {/* Mobile Navigation Footer */}
      <Footer />
    </div>
  );
}
