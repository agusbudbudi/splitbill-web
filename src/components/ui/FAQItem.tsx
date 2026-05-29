"use client";

import React from "react";
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
        "border-b border-primary/5 last:border-0 transition-all duration-300",
        isOpen ? "bg-primary/[0.02]" : "hover:bg-primary/[0.01]",
        className
      )}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 px-4 flex items-start justify-between text-left gap-4 cursor-pointer"
      >
        <span
          className={cn(
            "text-sm lg:text-lg font-bold transition-colors duration-300 leading-snug",
            isOpen ? "text-primary" : "text-foreground/80",
          )}
        >
          {question}
        </span>
        <div
          className={cn(
            "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            isOpen ? "bg-primary text-white" : "bg-primary/5 text-primary/40",
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
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-60 opacity-100 pb-6 px-4" : "max-h-0 opacity-0",
        )}
      >
        <p className="text-[12px] lg:text-base text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};
