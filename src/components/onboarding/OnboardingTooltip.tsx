"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/useOnboardingStore";

interface OnboardingTooltipProps {
  id: string;
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export const OnboardingTooltip = ({
  id,
  children,
  content,
  position = "top",
  className,
  delay = 1000,
}: OnboardingTooltipProps) => {
  const dismissedHints = useOnboardingStore((state) => state.dismissedHints);
  const dismissHint = useOnboardingStore((state) => state.dismissHint);
  const _hasHydrated = useOnboardingStore((state) => state._hasHydrated);
  
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const isDismissed = dismissedHints.includes(id);

  useEffect(() => {
    setHasMounted(true);
    // Only show if rehydrated AND not dismissed
    if (_hasHydrated && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [_hasHydrated, isDismissed, delay]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    dismissHint(id);
  };

  if (!hasMounted || !_hasHydrated) return <>{children}</>;

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-white",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-white",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-white",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-white",
  };

  return (
    <div className={cn("relative inline-block w-full", className)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "absolute z-50 px-4 py-4 bg-white rounded-md shadow-md border border-primary/10 min-w-[180px] max-w-[240px]",
              positionStyles[position]
            )}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              </div>
              <p className="text-[11px] leading-relaxed text-foreground font-medium flex-1">
                {content}
              </p>
              <button
                onClick={handleDismiss}
                className="p-1 -mr-1 -mt-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Dismiss hint"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-0 h-0 border-4",
                arrowStyles[position]
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
