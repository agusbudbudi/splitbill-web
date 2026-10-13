"use client";

import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";

interface BlogContentProps {
  content: string;
  className?: string;
}

// Memoised so parent re-renders (e.g. TOC active heading on scroll) don't
// re-apply innerHTML: that would swap every heading node and break anything
// holding a reference to them.
export const BlogContent = memo(function BlogContent({ content, className }: BlogContentProps) {
  const html = useMemo(() => ({ __html: content }), [content]);
  return (
    <div
      className={cn(
        "prose prose-blue max-w-none dark:prose-invert",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-img:rounded-sm prose-img:shadow-soft",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "blog-content-container",
        className
      )}
      dangerouslySetInnerHTML={html}
    />
  );
});
