import React from "react";
import Link from "next/link";
import type { LandingContent } from "@/lib/landing/types";
import { LandingTitle } from "./LandingTitle";

// Inline tokens: **bold** and [text](href)
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): React.ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const className = "font-semibold text-primary underline underline-offset-2 hover:text-primary/80";
      if (href.startsWith("/")) {
        return (
          <Link key={i} href={href} className={className}>
            {label}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          className={className}
          {...(href.startsWith("https://") && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {label}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/**
 * Long-form, crawlable article managed from the CMS. The body is
 * "markdown-lite": blank lines separate blocks, "## " starts a subheading,
 * lines starting "- " form a list, plus **bold** and [text](link) inline.
 * Everything renders as React elements — no HTML from the CMS is injected.
 * Links are validated by the backend on save.
 */
export function SeoContentSection({ content }: { content: LandingContent["seoContent"] }) {
  if (!content.title.trim() || !content.body.trim()) return null;

  const blocks = content.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <section data-landing-section="seoContent" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          <LandingTitle title={content.title} highlight={content.titleHighlight} />
        </h2>
        <div className="space-y-4 text-base text-slate-600 font-medium leading-relaxed">
          {blocks.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h3 key={i} className="text-xl font-black text-slate-800 pt-2">
                  {renderInline(block.slice(3))}
                </h3>
              );
            }
            const lines = block.split("\n").map((line) => line.trim());
            if (lines.every((line) => line.startsWith("- "))) {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1.5">
                  {lines.map((line, j) => (
                    <li key={j}>{renderInline(line.slice(2))}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{renderInline(lines.join(" "))}</p>;
          })}
        </div>
      </div>
    </section>
  );
}
