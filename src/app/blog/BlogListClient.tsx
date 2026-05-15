"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { BlogCard } from "@/components/blog/BlogCard";
import { fetchBlogs } from "@/lib/api/blog";
import { Blog } from "@/lib/types/blog";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { Footer } from "@/components/layout/Footer";
import { BlogCTA } from "@/components/blog/BlogCTA";

export default function BlogListClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetchBlogs();
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-0 flex flex-col items-center">
      <Header title="Blog & Tips" showBackButton sticky />

      {/* Hero Banner Section */}
      <section className="w-full max-w-[600px] relative pt-12 pb-8 px-6">
        <div className="relative z-10 max-w-[600px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight text-foreground">
              Cerita & Tips <br />
              <span className="text-primary">Seputar Split Bill</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-md mx-auto mb-8">
              Inspirasi bagi tagihan yang adil & update fitur terbaru.
            </p>

            <div className="relative max-w-md mx-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Cari artikel menarik..."
                className="w-full bg-white border border-border/60 rounded-2xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[600px] mx-auto px-4 mt-8 relative z-20 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full rounded-[1.2rem] border border-border/40 bg-muted/10 overflow-hidden"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Thumbnail Skeleton */}
                <Skeleton className="aspect-[16/9] w-full rounded-none" />

                <div className="p-5 space-y-4">
                  {/* Metadata Skeleton */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-24 rounded-full" />
                    <Skeleton className="h-1 w-1 rounded-full" />
                    <Skeleton className="h-3 w-20 rounded-full" />
                  </div>

                  {/* Title Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full rounded-lg" />
                    <Skeleton className="h-6 w-2/3 rounded-lg" />
                  </div>

                  {/* Excerpt Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3.5 w-4/5 rounded-md" />
                  </div>

                  {/* Button Skeleton */}
                  <Skeleton className="h-4 w-32 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-border/50 mt-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-muted-foreground">
              Coba gunakan kata kunci lain atau telusuri semua artikel.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Hapus Filter
            </button>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <BlogCTA />

      {/* Site Footer */}
      <SiteFooter className="mt-0 w-full" />

      {/* Mobile Navigation Footer */}
      <Footer />
    </div>
  );
}
