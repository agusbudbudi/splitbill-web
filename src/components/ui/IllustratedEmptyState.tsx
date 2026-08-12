"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface IllustratedEmptyStateProps {
  title: string;
  description?: string | React.ReactNode;
  illustration?: string;
  illustrationAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const IllustratedEmptyState = ({
  title,
  description,
  illustration = "/img/empty-state/empty-state-image.png",
  illustrationAlt = "Empty state illustration",
  ctaText,
  ctaHref = "#",
  onCtaClick,
  className,
}: IllustratedEmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-muted/40 rounded-md bg-muted/5",
        className,
      )}
    >
      <div className="w-28 h-28 mb-4">
        <Image
          src={illustration}
          alt={illustrationAlt}
          width={128}
          height={128}
          className="w-full h-full object-cover opacity-70"
        />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-[300px] mb-6">
          {description}
        </p>
      )}
      {ctaText && (
        <Link href={ctaHref}>
          <Button
            variant="outline"
            className="border-primary/50 text-primary hover:text-primary"
            onClick={onCtaClick}
          >
            {ctaText}
          </Button>
        </Link>
      )}
    </div>
  );
};
