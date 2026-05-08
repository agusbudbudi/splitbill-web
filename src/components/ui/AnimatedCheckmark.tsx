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
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center ring-8 ring-emerald-500/5 shadow-xl shadow-emerald-500/10"
      >
        {/* Checkmark Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.3,
          }}
        >
          <Check className="w-10 h-10 text-emerald-500 stroke-[3px]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
