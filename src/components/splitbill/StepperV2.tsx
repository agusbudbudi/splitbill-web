"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepItem {
  id: number;
  label: string;
  icon: LucideIcon;
}

interface StepperV2Props {
  steps: StepItem[];
  currentStep: number;
}

const GAP = 8; // px, must match grid gap-x-2 below

export function StepperV2({ steps, currentStep }: StepperV2Props) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const prev = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const current = steps[currentIndex];
  const next = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  const slots = [prev, current, next];

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.getBoundingClientRect().width);
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  const colWidth = (containerWidth - GAP * 2) / 3;
  const leftLine = prev && colWidth > 0 ? { left: colWidth, width: GAP } : null;
  const rightLine = next && colWidth > 0 ? { left: colWidth * 2 + GAP, width: GAP } : null;

  return (
    <div className="w-full flex justify-center px-2">
      <div ref={containerRef} className="relative w-full max-w-[360px] h-6">
        {leftLine && (
          <div
            className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-white/20"
            style={{ left: leftLine.left, width: leftLine.width }}
          />
        )}
        {rightLine && (
          <div
            className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-white/20"
            style={{ left: rightLine.left, width: rightLine.width }}
          />
        )}

        <div className="relative z-10 grid grid-cols-3 gap-x-2 h-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {slots.map((s, i) => {
              if (!s) return <div key={`empty-${i}`} />;

              const isDone = s.id < current.id;
              const isActive = s.id === current.id;

              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <div
                    className={cn(
                      "rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300",
                      isActive ? "w-6 h-6" : "w-5 h-5",
                      isActive
                        ? "bg-white border-none text-primary"
                        : "bg-white/50 border-none text-primary",
                    )}
                  >
                    {isDone ? (
                      <Check className={cn(isActive ? "w-3.5 h-3.5" : "w-3 h-3")} />
                    ) : (
                      <span className={cn("font-bold", isActive ? "text-xs" : "text-[10px]")}>
                        {s.id}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "font-semibold whitespace-nowrap transition-colors duration-300",
                      isActive ? "text-[13px]" : "text-[12px]",
                      isActive ? "text-white opacity-100" : "text-white/40",
                    )}
                  >
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
