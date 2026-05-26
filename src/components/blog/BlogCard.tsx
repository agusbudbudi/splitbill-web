"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Blog } from "@/lib/types/blog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/index";

interface BlogCardProps {
  blog: Blog;
  priority?: boolean;
}

export const BlogCard = ({ blog, priority = false }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full group">
        <Card className="h-full flex flex-col overflow-hidden border-none shadow-soft hover:shadow-md transition-all duration-500 bg-white group-hover:bg-accent/5">
          {/* Thumbnail Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={blog.thumbnail || "/img/pwa-banner.png"}
              alt={blog.thumbnailAlt || blog.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading={priority ? "eager" : "lazy"}
            />
            {/* Category Badge overlay */}
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-primary/90 backdrop-blur-md text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {blog.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3 font-medium">
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{blog.readTime} mnt baca</span>
              </div>
            </div>

            <h3 className="text-md font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {blog.title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>

            <div className="mt-auto flex items-center text-primary font-bold text-sm gap-1 group/btn">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
