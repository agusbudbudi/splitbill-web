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
            "text-xs font-bold transition-colors duration-300",
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
        <p className="text-[11px] text-muted-foreground leading-relaxed">
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
    <section className="py-2 px-2 space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-foreground/80 tracking-tight">
            Pertanyaan Populer
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium">
            Mungkin yang kamu cari ada di sini
          </p>
        </div>
      </div>

      <div className="bg-white/50 border border-white backdrop-blur-sm rounded-3xl p-2 shadow-soft">
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

      <div className="flex flex-col items-center gap-4">
        <Link href="/faq">
          <button className="text-[11px] font-bold text-primary bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-all cursor-pointer">
            Lihat Semua Pertanyaan
          </button>
        </Link>
        {/* <p className="text-[10px] text-muted-foreground">
          Masih ada pertanyaan? Hubungi kami lewat{" "}
          <a
            href="https://api.whatsapp.com/send?phone=6285559496968&text=Hi%20Admin%20%F0%9F%91%8B%0AMau%20tanya%20dong%20soal%20aplikasi%20split%20bill%20%F0%9F%99%8F"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline"
          >
            Support
          </a>
        </p> */}
      </div>
    </section>
  );
};
