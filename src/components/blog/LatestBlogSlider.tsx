"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Blog } from "@/lib/types/blog";
import { fetchBlogs } from "@/lib/api/blog";
import { BlogCard } from "./BlogCard";
import { BlogCardSkeleton } from "./BlogCardSkeleton";

export const LatestBlogSlider = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    fetchBlogs({ limit: 6 })
      .then((res) => {
        if (res.success && res.data) {
          setBlogs(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [isLoading, blogs.length, updateScrollState]);

  const scroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "prev" ? -amount : amount, behavior: "smooth" });
  };

  if (!isLoading && blogs.length === 0) return null;

  const arrowClass =
    "w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none";

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Tips Nongkrong & Split Bill 🍜
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Inspirasi patungan & info fitur terbaru
          </p>
        </div>
        {!isLoading && (canScrollPrev || canScrollNext) && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("prev")}
              disabled={!canScrollPrev}
              className={arrowClass}
              aria-label="Artikel sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              disabled={!canScrollNext}
              className={arrowClass}
              aria-label="Artikel berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative -mx-4 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 pb-2 pt-2 scroll-pl-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading
            ? [1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[290px] snap-start">
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
                className="flex-shrink-0 w-[290px] snap-start"
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}

          {/* View All Card at the end */}
          {!isLoading && blogs.length >= 3 && (
            <div className="flex-shrink-0 w-[180px] snap-start pr-4 flex items-stretch">
              <Link href="/blog" className="w-full flex">
                <div className="w-full border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center p-6 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
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
