import React from "react";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/Badge";
import { cn, slugify } from "@/lib/utils/index";

interface BlogCategoryNavProps {
  categories: string[];
  /** Slug of the current category; omit on /blog to highlight "Semua". */
  activeSlug?: string;
}

// Category pills link to the crawlable /blog/category/* pages instead of
// filtering client-side, so every list stays complete and indexable.
export const BlogCategoryNav = ({ categories, activeSlug }: BlogCategoryNavProps) => {
  if (categories.length === 0) return null;

  const items = [
    { label: "Semua", href: "/blog", active: !activeSlug },
    ...categories.map((category) => {
      const slug = slugify(category);
      return { label: category, href: `/blog/category/${slug}`, active: slug === activeSlug };
    }),
  ];

  return (
    <nav aria-label="Kategori artikel" className="-mx-4 sm:mx-0">
      <ul className="flex gap-2 overflow-x-auto px-4 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                badgeVariants({ variant: item.active ? "default" : "outline" }),
                "px-4 py-1.5 text-sm font-semibold transition-all active:scale-95 focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/30",
                item.active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground hover:text-primary hover:border-primary/30",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
