"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  className,
}: FAQItemProps) => {
  return (
    <div
      className={cn(
        "bg-white border border-primary/10 rounded-md overflow-hidden shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300",
        className,
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-full px-5 py-4 flex items-center justify-between text-left font-bold gap-4 cursor-pointer transition-colors duration-200 group",
          isOpen ? "text-primary" : "text-foreground/80 hover:text-primary",
        )}
      >
        <span className="text-sm lg:text-base pr-2">{question}</span>
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
            isOpen
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-primary/5 text-primary/40 group-hover:bg-primary/10 group-hover:text-primary",
          )}
        >
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="px-5 pb-5 pt-1 text-xs lg:text-sm text-muted-foreground leading-relaxed border-t border-primary/5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
