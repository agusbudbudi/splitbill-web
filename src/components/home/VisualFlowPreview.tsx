"use client";

import React from "react";
import { Users, Camera, Share2, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    title: "Input Teman",
    description: "Tambah teman yang ikut patungan",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    number: 2,
    title: "Foto Struk",
    description: "AI otomatis baca & hitung tagihan",
    icon: Camera,
    color: "text-primary",
    bgColor: "bg-primary/10",
    gradient: "from-primary to-violet-600",
    badge: "AI",
  },
  {
    number: 3,
    title: "Share ke WA",
    description: "Kirim hasil split langsung ke grup",
    icon: Share2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
  },
];

export const VisualFlowPreview = () => {
  return (
    <section className="py-2 px-2 space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-foreground/80 tracking-tight">
            Cara Pakai SplitBill
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium">
            3 langkah mudah, sat-set beres!
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative pt-2 mb-0">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="flex-shrink-0 w-[180px] snap-start"
            >
              <div className="relative bg-white/50 border border-white backdrop-blur-sm rounded-3xl p-5 shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-full overflow-visible">
                {/* Step Number Badge */}
                <div className="absolute top-2 left-2 z-20">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg",
                      `from-${step.gradient.split(" ")[0].replace("from-", "")} to-${step.gradient.split(" ")[1].replace("to-", "")}`,
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

                {/* AI Badge for Step 2 */}
                {step.badge && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="bg-amber-400 text-amber-950 text-[9px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {step.badge}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-4 pt-2">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                      step.bgColor,
                    )}
                  >
                    <step.icon className={cn("w-5 h-5", step.color)} />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector (except last step) */}
                {idx < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden sm:block z-30">
                    <div className="w-8 h-8 rounded-full bg-white border border-primary/10 flex items-center justify-center shadow-soft">
                      <svg
                        className="w-4 h-4 text-primary/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center gap-1.5 sm:hidden">
        {steps.map((step) => (
          <div
            key={step.number}
            className="w-1.5 h-1.5 rounded-full bg-primary/20"
          />
        ))}
      </div>
    </section>
  );
};
