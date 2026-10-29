"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Blog } from "@/lib/types/blog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/index";

interface BlogCardProps {
  blog: Blog;
  priority?: boolean;
  /** `featured`: wide 2-column hero card. */
  variant?: "default" | "featured";
}

const FALLBACK_THUMBNAIL = "/img/pwa-banner.png";

const BlogMeta = ({ blog, className }: { blog: Blog; className?: string }) => (
  <div className={cn("flex items-center gap-2 text-xs font-medium text-muted-foreground", className)}>
    <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
    <span className="flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {blog.readTime} mnt baca
    </span>
  </div>
);

const CategoryBadge = ({ category }: { category: string }) => (
  <Badge className="border-transparent bg-white/95 text-primary uppercase tracking-wide text-[10px] font-bold shadow-sm">
    {category}
  </Badge>
);

export const BlogCard = ({ blog, priority = false, variant = "default" }: BlogCardProps) => {
  const thumbnail = blog.thumbnail || FALLBACK_THUMBNAIL;
  const alt = blog.thumbnailAlt || blog.title;

  const isFeatured = variant === "featured";

  return (
    <motion.div
      // The priority card is the LCP image: render it as-is from the server
      // HTML instead of waiting for hydration to fade it in.
      initial={priority ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link href={`/blog/${blog.slug}`} className="group/blog-card block h-full">
        <Card
          className={cn(
            "h-full flex flex-col overflow-hidden transition-all duration-300 group-hover/blog-card:shadow-lg group-hover/blog-card:border-primary/20",
            isFeatured && "lg:grid lg:grid-cols-2",
          )}
        >
          <div
            className={cn(
              "relative aspect-[16/9] overflow-hidden bg-muted",
              isFeatured && "lg:aspect-auto lg:min-h-[340px]",
            )}
          >
            <Image
              src={thumbnail}
              alt={alt}
              fill
              sizes={
                isFeatured
                  ? "(max-width: 1024px) 100vw, 640px"
                  : "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              }
              className="object-cover transition-transform duration-500 group-hover/blog-card:scale-[1.03]"
              priority={priority}
            />
            <div className="absolute top-3 left-3 z-10">
              <CategoryBadge category={blog.category} />
            </div>
          </div>

          <div className={cn("flex-1 flex flex-col p-5", isFeatured && "lg:p-10 lg:justify-center")}>
            {isFeatured && (
              <span className="text-xs font-bold uppercase tracking-wide text-primary mb-3">
                Artikel Pilihan
              </span>
            )}
            <BlogMeta blog={blog} className="mb-3" />

            <h3
              className={cn(
                "font-bold text-foreground leading-snug group-hover/blog-card:text-primary transition-colors line-clamp-2 mb-2",
                isFeatured ? "text-xl lg:text-3xl lg:leading-tight lg:mb-4" : "text-base",
              )}
            >
              {blog.title}
            </h3>

            <p
              className={cn(
                "text-sm text-muted-foreground leading-relaxed mb-6",
                isFeatured ? "line-clamp-3 lg:text-base" : "line-clamp-2",
              )}
            >
              {blog.excerpt}
            </p>

            <div className="mt-auto flex items-center gap-1 text-sm font-bold text-primary">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/blog-card:translate-x-1" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
