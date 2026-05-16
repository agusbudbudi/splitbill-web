"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Blog } from "@/lib/types/blog";
import { fetchBlogs } from "@/lib/api/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { Button } from "@/components/ui/Button";

export const BlogLatestSlider = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLatestBlogs = async () => {
      try {
        const response = await fetchBlogs({ limit: 5 });
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch latest blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLatestBlogs();
  }, []);

  if (!isLoading && blogs.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-bold text-foreground">
              Update & Tips Terbaru ✨
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Inspirasi patungan & info fitur terbaru
          </p>
        </div>

        <Link href="/blog">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary font-bold text-xs h-8 px-2 hover:bg-primary/5"
          >
            Lihat Semua
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="-mx-4 overflow-hidden pt-2">
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-4 scroll-pl-4 pb-4">
          {isLoading
            ? // Loading Skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-[280px] snap-start">
                  <BlogCardSkeleton />
                </div>
              ))
            : // Blog Cards
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex-shrink-0 w-[280px] snap-start"
                >
                  <BlogCard blog={blog} />
                </div>
              ))}

          {/* View All Card at the end */}
          {!isLoading && blogs.length >= 3 && (
            <div className="flex-shrink-0 w-[160px] snap-start pr-4">
              <Link href="/blog" className="h-full block">
                <div className="h-full border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Lihat Semua Artikel
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
