"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedCheckmarkProps {
  className?: string;
}

export function AnimatedCheckmark({ className }: AnimatedCheckmarkProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer Pulse Rings */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-28 h-28 bg-emerald-500/10 rounded-full"
      />

      {/* Background Circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center ring-8 ring-emerald-500/10 shadow-xl shadow-emerald-500/10"
      >
        {/* Checkmark Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 12,
            delay: 0.5,
          }}
        >
          <Check className="w-8 h-8 text-white stroke-[3px]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
