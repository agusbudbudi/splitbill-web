"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BlogContentProps {
  content: string;
  className?: string;
}

// The page already renders the post title as its only H1, so any H1 inside
// the CMS body is demoted to H2.
const demoteH1 = (html: string) => html.replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2");

export const BlogContent = ({ content, className }: BlogContentProps) => {
  return (
    <div
      className={cn(
        "prose prose-blue max-w-none dark:prose-invert",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-img:rounded-md prose-img:shadow-lg",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "blog-content-container",
        className
      )}
      dangerouslySetInnerHTML={{ __html: demoteH1(content) }}
    />
  );
};
