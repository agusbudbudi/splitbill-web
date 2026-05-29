"use client";

import React from "react";
import { Users, Camera, Share2, Zap, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    title: "Input Teman",
    description: "Tambah teman yang ikut patungan",
    image: "/img/step-add-friend.jpg",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    number: 2,
    title: "Foto Struk",
    description: "AI otomatis baca & hitung tagihan",
    image: "/img/step-scan.jpg",
    gradient: "from-primary to-violet-600",
    badge: "AI",
  },
  {
    number: 3,
    title: "Share ke WA",
    description: "Kirim hasil split langsung ke grup",
    image: "/img/step-share.jpg",
    gradient: "from-[#2EC866] to-[#4AD37A]",
  },
];

export const VisualFlowPreview = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col items-start px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Cara Pakai Split Bill
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            3 langkah mudah, sat-set beres!
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative -mx-4 overflow-hidden mb-0 overflow-y-hidden">
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-4 scroll-pl-4">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="flex-shrink-0 w-[180px] snap-start pb-2"
            >
              <div className="relative bg-white border border-slate-100 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 group h-full flex flex-col">
                {/* Step Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-muted">
                  <Image
                    src={step.image}
                    alt={`Panduan Split Bill Langkah ${step.number}: ${step.title} — ${step.description}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Step Number Badge Overlay on Image */}
                  <div className="absolute top-2 left-2 z-20">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-110",
                      )}
                      style={{
                        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                        backgroundImage:
                          step.number === 1
                            ? "linear-gradient(to bottom right, rgb(59 130 246), rgb(37 99 235))"
                            : step.number === 2
                              ? "linear-gradient(to bottom right, rgb(139 92 246), rgb(124 58 237))"
                              : "linear-gradient(to bottom right, rgb(16 185 129), rgb(5 150 105))",
                      }}
                    >
                      <span className="text-white text-xs font-black">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 flex flex-col items-center text-center gap-1.5 flex-grow">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-foreground tracking-tight">
                      {step.title}
                    </h3>
                    {step.badge && (
                      <div className="bg-amber-400 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2 h-2" />
                        {step.badge}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
