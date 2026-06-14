"use client";

import React from "react";
import { Logo } from "idn-finlogos/react";
import { cn } from "@/lib/utils";

interface DynamicFinLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  slug: string;
  className?: string;
  alt?: string;
}

export const DynamicFinLogo = ({ slug, className, ...props }: DynamicFinLogoProps) => {
  return (
    <span 
      className={cn("inline-flex items-center justify-center w-full h-full [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto [&_svg]:block", className)} 
      {...props}
    >
      <Logo slug={slug} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }} />
    </span>
  );
};
