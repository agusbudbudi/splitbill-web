"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogHeading } from "@/lib/utils/blogContent";

interface BlogTableOfContentsProps {
  headings: BlogHeading[];
  /** From `useActiveHeading`, owned by the page so mobile + sidebar share one scroll listener. */
  activeId: string | null;
  /** `collapsible` renders a closed-by-default disclosure for mobile. */
  variant?: "sidebar" | "collapsible";
}

// A heading is "current" once its top has scrolled past this line (just
// below the sticky header), matching the h2/h3 scroll-margin in globals.css.
const ACTIVE_OFFSET = 120;

export const useActiveHeading = (headings: BlogHeading[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Last heading above the line wins, so the section being read stays
      // highlighted in both scroll directions, not just as a heading passes.
      let current: string | null = null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET <= 0) current = el.id;
        else break;
      }
      // At the very bottom the last short sections may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = elements[elements.length - 1].id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  return activeId;
};

export const BlogTableOfContents = ({ headings, activeId, variant = "sidebar" }: BlogTableOfContentsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the active entry visible when the sidebar list is taller than its
  // box. Scrolls only the list, never the page.
  useEffect(() => {
    const box = scrollRef.current;
    if (!box || !activeId) return;
    const link = box.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`);
    if (!link) return;
    // `box` is position:relative, so offsetTop is already box-relative.
    const top = link.offsetTop;
    if (top < box.scrollTop || top + link.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTo({ top: top - box.clientHeight / 3, behavior: "smooth" });
    }
  }, [activeId]);

  if (headings.length < 2) return null;

  const list = (
    <ol className="flex flex-col border-l border-border">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors",
                heading.level === 3 ? "pl-7" : "pl-4",
                isActive
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "collapsible") {
    return (
      <details className="group rounded-sm border border-border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            Daftar Isi
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <nav aria-label="Daftar isi" className="px-4 pb-4">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="Daftar isi" className="flex flex-col gap-3 min-h-0">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Daftar Isi
      </span>
      <div ref={scrollRef} className="relative overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-hide">
        {list}
      </div>
    </nav>
  );
};
