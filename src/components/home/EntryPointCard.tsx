"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EntryPointCardData } from "@/lib/types/entryPoint";

interface EntryPointCardProps {
  data: EntryPointCardData;
  className?: string;
}

export const EntryPointCard = ({ data, className }: EntryPointCardProps) => {
  const {
    imageUrl,
    imageAlt,
    title,
    subtitle,
    ctaText,
    url,
    footerText,
    footerIconUrl,
    ribbonText,
  } = data;

  const isExternal = !!url && url.startsWith("http");

  const cardBody = (
    <div
      className={cn(
        "group flex flex-col w-full overflow-hidden rounded-md bg-white border border-border shadow-soft transition-all duration-300",
        url && "cursor-pointer hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Image
          src={imageUrl || "/img/pwa-banner.png"}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {ribbonText && (
          <span className="absolute bottom-0 left-0 rounded-tr-sm bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 px-2.5 py-1.5 text-[10px] font-black uppercase leading-none tracking-wide text-white shadow-sm">
            {ribbonText}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5 lg:p-4 lg:gap-1.5">
        <h3 className="text-sm lg:text-sm font-bold text-slate-800 leading-snug line-clamp-2">
          {title}
        </h3>

        {subtitle && (
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium leading-tight line-clamp-2">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] lg:text-xs font-bold text-primary">
            {ctaText}
            <ArrowRight className="w-2.5 h-2.5 lg:w-3 lg:h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}

        {footerText && (
          <div className="mt-auto pt-1.5 flex items-center gap-1 border-t border-slate-100 text-[9.5px] lg:text-[11px] text-muted-foreground font-medium">
            {footerIconUrl && (
              <span className="relative w-4 h-4 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={footerIconUrl}
                  alt=""
                  fill
                  sizes="16px"
                  className="object-cover"
                />
              </span>
            )}
            <span className="truncate">{footerText}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!url) return cardBody;

  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {cardBody}
      </a>
    );
  }

  return (
    <Link href={url} className="block">
      {cardBody}
    </Link>
  );
};
