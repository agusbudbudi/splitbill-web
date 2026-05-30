"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Blog } from "@/lib/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogContent } from "@/components/blog/BlogContent";
import { Footer } from "@/components/layout/Footer";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { formatDate } from "@/lib/utils/index";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const shareUrl = `https://splitbill.my.id/blog/${blog.slug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link berhasil disalin! 🔗", {
        description: "Tempel di chat atau media sosialmu.",
      });
    }
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`Baca artikel menarik ini: ${blog.title}\n\n`);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, "_blank");
  };

  const shareToX = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`Baca artikel menarik ini: ${blog.title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative">
      {/* Floating Left Social Share (Desktop only) */}
      <div className="hidden lg:flex flex-col items-center gap-3.5 fixed left-8 top-1/2 -translate-y-1/2 z-40">
        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-md active:scale-95 group relative hover:scale-105"
          title="Bagikan ke WhatsApp"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
          </svg>
          <div className="absolute left-[125%] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-md">
            WhatsApp
          </div>
        </button>

        {/* X (formerly Twitter) */}
        <button
          onClick={shareToX}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-zinc-800 transition-all shadow-md active:scale-95 group relative hover:scale-105"
          title="Bagikan ke X"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <div className="absolute left-[125%] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-md">
            Twitter / X
          </div>
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:bg-[#166fe5] transition-all shadow-md active:scale-95 group relative hover:scale-105"
          title="Bagikan ke Facebook"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <div className="absolute left-[125%] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap shadow-md">
            Facebook
          </div>
        </button>
      </div>

      <Header
        sticky
        showBackButton
        wide
        rightContent={
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      {/* Main Content & Sidebar Wrapper */}
      <div className="w-full max-w-[600px] lg:max-w-7xl mx-auto px-6 pt-0 pb-8 lg:py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:mt-8">

        {/* Left Column: Hero Banner Image & Main Content */}
        <main className="w-full lg:flex-1 flex flex-col gap-6">
          {/* Article Hero */}
          <section className="relative w-[calc(100%+48px)] -mx-6 -mt-0 rounded-none lg:w-full lg:mx-0 lg:mt-0 lg:rounded-lg aspect-[4/3] md:aspect-[16/9] min-h-[300px] bg-muted overflow-hidden shadow-soft">
            <img
              src={blog.thumbnail || "/img/pwa-banner.png"}
              alt={blog.thumbnailAlt || blog.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    {blog.category}
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-black mb-4 leading-tight tracking-tight">
                    {blog.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-white/80 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
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

        {/* Right Column: Sidebar */}
        <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6">
          {/* Ads Banner CTA to /split-bill */}
          <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                Fitur Populer
              </div>
              <h3 className="font-bold text-base text-foreground leading-tight">
                Bagi Tagihan Lebih Praktis ⚡️
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scan struk belanja & hitung nominal secara otomatis dengan AI. Gratis, cepat, dan akurat.
              </p>
            </div>
            <Link href="/split-bill">
              <Button className="w-full py-2.5 text-xs font-bold rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer">
                Coba Split Bill Sekarang
              </Button>
            </Link>
          </div>

          {/* Sidebar: Read Next Section */}
          {recentBlogs.length > 0 && (
            <div className="w-full bg-gray-50/50 lg:bg-transparent lg:p-0 rounded-3xl">
              <h2 className="text-xl font-black mb-6 tracking-tight text-foreground">
                Baca Artikel Lainnya
              </h2>
              <div className="flex flex-col gap-6">
                {recentBlogs.map((recentBlog) => (
                  <BlogCard key={recentBlog._id} blog={recentBlog} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* CTA Section */}
      <BlogCTA />

      {/* Reusable Footer */}
      <HomepageFooter />

      {/* Mobile Navigation Footer */}
      <Footer />
    </div>
  );
}
