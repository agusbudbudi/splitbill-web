"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Blog } from "@/lib/types/blog";
import { fetchBlogs } from "@/lib/api/blog";
import { BlogCard } from "./BlogCard";
import { BlogCardSkeleton } from "./BlogCardSkeleton";

export const LatestBlogSlider = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  if (!isLoading && blogs.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-start px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Tips Nongkrong & Split Bill 🍜
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Inspirasi patungan & info fitur terbaru
          </p>
        </div>
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
                <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
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
