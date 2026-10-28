"use client";

import React from "react";
import Link from "next/link";
import { scrollBelowHeader } from "@/lib/landing/scroll";

interface LandingLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * CTA link for CMS-provided hrefs: "#anchor" smooth-scrolls in page, "/path"
 * uses client navigation, "https://" opens externally. All render a real <a href>
 * so crawlers can follow them.
 */
export const LandingLink = ({ href, className, children }: LandingLinkProps) => {
  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById(href.slice(1));
          if (target) scrollBelowHeader(target);
        }}
        className={className}
      >
        {children}
      </a>
    );
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
