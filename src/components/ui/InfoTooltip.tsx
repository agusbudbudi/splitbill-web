"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export const InfoTooltip = ({
  content,
  position = "bottom",
  className,
  asChild,
  children,
}: InfoTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-t border-l",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-t border-r",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-b border-l",
  };

  return (
    <div 
      className={cn("relative inline-block leading-none", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {asChild ? (
        children
      ) : (
        <button 
          className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer outline-none"
          aria-label="Info"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="w-4.5 h-4.5" />
        </button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === "bottom" ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === "bottom" ? -4 : 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[100] px-3 py-2 bg-white text-foreground text-[11px] font-medium rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/40 min-w-[200px] pointer-events-none",
              positionStyles[position]
            )}
          >
            <p className="leading-snug text-center">
              {content}
            </p>
            
            {/* Arrow - Using rotated square for better border/visibility */}
            <div 
              className={cn(
                "absolute w-2 h-2 bg-white rotate-45 border-border/40",
                arrowStyles[position]
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
