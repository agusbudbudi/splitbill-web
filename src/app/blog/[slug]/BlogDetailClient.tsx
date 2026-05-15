"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Blog } from "@/lib/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogContent } from "@/components/blog/BlogContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Footer } from "@/components/layout/Footer";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { formatDate } from "@/lib/utils/index";
import { Badge } from "@/components/ui/Badge";
import { Clock, User, Calendar, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface BlogDetailClientProps {
  blog: Blog;
  recentBlogs?: Blog[];
}

export default function BlogDetailClient({
  blog,
  recentBlogs = [],
}: BlogDetailClientProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link berhasil disalin!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header
        sticky
        showBackButton
        rightContent={
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      {/* Article Hero */}
      <section className="relative w-full max-w-[600px] aspect-[4/3] md:aspect-[16/9] min-h-[300px] bg-muted overflow-hidden shadow-soft">
        <img
          src={blog.thumbnail || "/img/pwa-banner.png"}
          alt={blog.thumbnailAlt || blog.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="max-w-[600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                {blog.category}
              </Badge>
              <h1 className="text-3xl font-black mb-4 leading-tight tracking-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime} mnt baca</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <main className="max-w-[600px] mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Lead Paragraph / Excerpt */}
          <p className="text-lg md:text-xl font-medium text-foreground/80 leading-relaxed mb-12 border-l-4 border-primary pl-6">
            {blog.excerpt}
          </p>

          <BlogContent content={blog.content} />

          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-[6px] text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Footer / Navigation */}
          <div className="mt-8 py-6 border-t border-border flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Penulis
                </span>
                <span className="text-base font-bold text-foreground leading-none">
                  {blog.author}
                </span>
              </div>
            </div>

            <Link href="/blog">
              <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline transition-all">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Blog
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Read Next Section */}
      {recentBlogs.length > 0 && (
        <section className="w-full max-w-[600px] mx-auto flex flex-col items-center">
          <div className="w-full p-6">
            <h2 className="text-2xl font-black mb-8 tracking-tight text-foreground">
              Baca Artikel Lainnya
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {recentBlogs.map((recentBlog) => (
                <BlogCard key={recentBlog._id} blog={recentBlog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <BlogCTA />

      {/* Site Footer */}
      <SiteFooter className="mt-0 w-full" />

      {/* Mobile Navigation Footer */}
      <Footer />
    </div>
  );
}
