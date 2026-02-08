"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  ChevronDown,
  HelpCircle,
  SearchX,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { faqData, FAQItem as FAQItemType } from "@/data/faqData";
import { Input } from "@/components/ui/Input";

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
        className="w-full py-5 px-4 flex items-start justify-between text-left gap-4 cursor-pointer"
      >
        <span
          className={cn(
            "text-sm font-bold transition-colors duration-300 leading-snug",
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
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = Array.from(new Set(faqData.map((f) => f.category)));

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalItems = filteredFaqs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <Header
        title="FAQ & Bantuan"
        showBackButton
        onBack={() => window.history.back()}
      />

      <main className="w-full max-w-[480px] px-4 pt-10 pb-20 space-y-8 relative z-10">
        {/* Search Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Ada yang bisa kami bantu? ✨
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Banyak yang nanya hal ini juga lho.
          </p>

          <div className="pt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10" />
              <Input
                placeholder="Cari pertanyaan..."
                className="pl-11 h-14 bg-white border-primary/10 shadow-soft focus:ring-primary/20 rounded-2xl text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              onClick={() => handleCategoryClick(null)}
              className={cn(
                "px-4 py-2 rounded-sm text-[10px] font-bold transition-all border cursor-pointer",
                !selectedCategory
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-muted-foreground border-primary/10 hover:border-primary/30",
              )}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={cn(
                  "px-4 py-2 rounded-sm text-[10px] font-bold transition-all border capitalize cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-muted-foreground border-primary/10 hover:border-primary/30",
                )}
              >
                {cat === "split-bill"
                  ? "Split Bill"
                  : cat === "shared-goals"
                    ? "Shared Goals"
                    : cat === "collect-money"
                      ? "Collect Money"
                      : cat === "wallet"
                        ? "Wallet"
                        : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {paginatedFaqs.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-soft">
                {paginatedFaqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openId === faq.id}
                    onToggle={() =>
                      setOpenId(openId === faq.id ? null : faq.id)
                    }
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Halaman{" "}
                    <span className="text-foreground">{currentPage}</span> dari{" "}
                    {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg border border-primary/10 flex items-center justify-center bg-white text-muted-foreground hover:bg-primary/5 disabled:opacity-30 disabled:hover:bg-white transition-all transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="w-8 h-8 rounded-lg border border-primary/10 flex items-center justify-center bg-white text-muted-foreground hover:bg-primary/5 disabled:opacity-30 disabled:hover:bg-white transition-all transition-all cursor-pointer"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/5 flex items-center justify-center">
                <SearchX className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  Gak nemu pertanyaannya...
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Coba kata kunci lain atau hubungi support.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="p-6 bg-primary/[0.03] border border-primary/10 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Masih Bingung?
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Chat admin aja kalau butuh bantuan cepat.
              </p>
            </div>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=6285559496968&text=Hi%20Admin%20%F0%9F%91%8B%0AMau%20tanya%20dong%20soal%20aplikasi%20split%20bill%20%F0%9F%99%8F"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <button className="w-full h-12 bg-white border border-primary/20 text-primary font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all cursor-pointer">
              Hubungi Support <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
