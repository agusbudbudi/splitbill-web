import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BlogHeroProps {
  /** Small uppercase label above the title; rendered as a back link when `backHref` is set. */
  eyebrow: string;
  backHref?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

// Shared header for /blog, /blog/category/* and /blog/tag/*. Server-safe and
// not animated: the H1 is the LCP element and must paint from server HTML.
export const BlogHero = ({ eyebrow, backHref, title, description, children }: BlogHeroProps) => (
  <section className="w-full max-w-[600px] lg:max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8 lg:pt-14 lg:pb-10">
    <div className="flex flex-col items-center text-center gap-3">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {eyebrow}
        </Link>
      ) : (
        <span className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</span>
      )}
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
          {description}
        </p>
      )}
    </div>
    {children && <div className="mt-8">{children}</div>}
  </section>
);
