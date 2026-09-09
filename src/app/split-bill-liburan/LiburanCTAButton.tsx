"use client";

import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackLiburanLP } from "@/lib/gtag";

interface LiburanCTAButtonProps {
  position: "hero" | "penutup";
  children: React.ReactNode;
  className?: string;
}

// Style disamakan persis dengan CTA utama HeroSection LP utama (px-7 py-4,
// rounded-md, font-black, shadow-xl, hover:scale-105 active:scale-95, icon
// leading + trailing arrow yang geser saat hover).
export function LiburanCTAButton({ position, children, className }: LiburanCTAButtonProps) {
  return (
    <Link
      href="/split-later"
      onClick={() => trackLiburanLP.ctaClick(position)}
      className={cn(
        "group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-md font-black text-base transition-all duration-200 hover:scale-105 active:scale-95",
        position === "hero"
          ? "bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary/90"
          : "bg-white text-primary shadow-xl shadow-black/10 hover:bg-white/90",
        className
      )}
    >
      <Camera className="w-5 h-5" />
      {children}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
