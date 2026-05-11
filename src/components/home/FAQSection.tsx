"use client";

import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { faqData } from "@/data/faqData";
import Link from "next/link";

const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={cn(
        "border-b border-primary/5 last:border-0 transition-all duration-300",
        isOpen ? "bg-primary/[0.02]" : "hover:bg-primary/[0.01]",
      )}
    >
      <button
        onClick={onToggle}
        className="w-full py-4 px-2 flex items-center justify-between text-left gap-4 cursor-pointer"
      >
        <span
          className={cn(
            "text-sm font-bold transition-colors duration-300",
            isOpen ? "text-primary" : "text-foreground/80",
          )}
        >
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground/50 transition-transform duration-300 shrink-0",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-40 opacity-100 pb-4 px-2" : "max-h-0 opacity-0",
        )}
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const landingFaqs = faqData.filter((f) => f.showOnLanding);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="space-y-0.5">
          <h2 className="text-md font-bold text-foreground">
            Pertanyaan Populer
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Mungkin yang kamu cari ada di sini
          </p>
        </div>
      </div>

      <div className="bg-white border border-white backdrop-blur-sm rounded-lg p-2 shadow-soft">
        {landingFaqs.map((faq, idx) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === idx}
            onToggle={() => handleToggle(idx)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 w-full pb-4">
        <Link href="/faq" className="w-full">
          <button className="w-full text-md font-bold text-primary bg-primary/5 px-4 py-3 rounded-lg hover:bg-primary/10 transition-all cursor-pointer">
            Lihat Semua Pertanyaan
          </button>
        </Link>
      </div>
    </section>
  );
};
