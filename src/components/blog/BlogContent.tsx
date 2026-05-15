"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BlogContentProps {
  content: string;
  className?: string;
}

export const BlogContent = ({ content, className }: BlogContentProps) => {
  return (
    <div
      className={cn(
        "prose prose-blue max-w-none dark:prose-invert",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-img:rounded-2xl prose-img:shadow-lg",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "blog-content-container",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
