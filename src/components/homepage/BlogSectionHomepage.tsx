"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Blog } from "@/lib/types/blog";
import { fetchBlogs } from "@/lib/api/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";

export const BlogSectionHomepage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadLatestBlogs = async () => {
      try {
        const response = await fetchBlogs({ limit: 6 });
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch latest blogs for homepage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLatestBlogs();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!isLoading && blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden group">
      {/* Background shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"
            >
              Tips Nongkrong &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Split Bill
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-500 font-medium"
            >
              Inspirasi patungan biar circle nongkrong lo tetap harmonis tanpa drama tagihan.
            </motion.p>
          </div>

          {/* "Lihat Semua" Button in header */}
          <div className="shrink-0 hidden sm:flex items-center">
            <Link href="/blog">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-200 text-sm cursor-pointer shadow-sm shadow-slate-100/50">
                Lihat Semua
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </Link>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Centered Arrow Navigation Buttons - Desktop Only */}
          {!isLoading && blogs.length > 0 && (
            <div className="hidden lg:block">
              <button
                onClick={() => scroll("left")}
                className="absolute -left-6 top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(71,159,234,0.15)] border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 cursor-pointer"
                aria-label="Sebelumnya"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute -right-6 top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(71,159,234,0.15)] border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 cursor-pointer"
                aria-label="Selanjutnya"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Horizontal Slider Area */}
          <div className="-mx-4 sm:-mx-8 overflow-hidden pt-2">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 sm:px-8 pb-2 pt-2 scroll-pl-4 sm:scroll-pl-8 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {isLoading
                ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-[290px] sm:w-[350px] snap-start">
                    <BlogCardSkeleton />
                  </div>
                ))
                : blogs.map((blog, idx) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                    className="flex-shrink-0 w-[290px] sm:w-[350px] snap-start"
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}

              {/* View All Card at the end */}
              {!isLoading && blogs.length >= 3 && (
                <div className="flex-shrink-0 w-[180px] sm:w-[220px] snap-start pr-4 flex items-stretch">
                  <Link href="/blog" className="w-full flex">
                    <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-primary transition-colors">
                        Lihat Semua Artikel
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
