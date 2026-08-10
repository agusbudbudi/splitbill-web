"use client";

import React from "react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export const SplitBillHeroCard = () => {
  const router = useRouter();

  return (
    <div className="w-full bg-white border border-slate-100 rounded-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center">
      {/* Text & CTA */}
      <div className="relative z-10 py-7 px-7 sm:py-7 sm:px-7 lg:py-8 lg:pl-8 lg:pr-3 flex flex-col gap-3 lg:w-1/2 lg:justify-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground leading-tight line-clamp-2">
            Split Bill <span className="font-extrabold text-primary">Tanpa Ribet</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-[420px]">
            Tinggal foto struk, biar AI yang urus hitungannya. Langsung Beres!
          </p>
        </div>

        <button
          onClick={() => router.push("/split-bill?step=1")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold rounded-sm bg-primary text-white shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Camera className="w-5 h-5" />
          Mulai Scan
        </button>
      </div>

      {/* Image — Mobile: below content, bleeds bottom */}
      <div className="lg:hidden relative -mx-5 sm:-mx-6">
        <img
          src="/img/hero-ads-blog.png"
          alt="Split Bill Hero"
          className="h-auto mx-auto block relative z-10 max-w-[300px] sm:max-w-[260px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
      </div>

      {/* Image — Desktop: right side, bleeds bottom edge */}
      <div className="hidden lg:block relative lg:w-1/2 self-stretch min-h-[200px]">
        <img
          src="/img/hero-ads-blog.png"
          alt="Split Bill Hero"
          className="absolute bottom-0 right-2 h-full w-auto object-contain object-bottom z-10"
        />
      </div>
    </div>
  );
};
