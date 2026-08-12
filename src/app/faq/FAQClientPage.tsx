"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { BlogCTA } from "@/components/blog/BlogCTA";
import {
  Search,
  ChevronDown,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { faqData, FAQItem as FAQItemType } from "@/data/faqData";
import { Input } from "@/components/ui/Input";
import { FAQItem } from "@/components/ui/FAQItem";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";

const getCategoryLabel = (cat: string) => {
  switch (cat) {
    case "split-bill":
      return "Split Bill";
    case "shared-goals":
      return "Shared Goals";
    case "collect-money":
      return "Collect Money";
    case "wallet":
      return "Wallet";
    default:
      return cat.charAt(0).toUpperCase() + cat.slice(1);
  }
};

export default function FAQClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    <div className="min-h-screen bg-background flex flex-col items-center relative pt-16 lg:pt-18">
      <HomepageNavbar />

      <main className="w-full max-w-[600px] lg:max-w-[1100px] px-4 pt-10 pb-10 space-y-8 relative z-10">
        {/* Search Header — mobile only, desktop title lives in content column */}
        <div className="space-y-2 text-center lg:hidden">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Ada yang bisa kami bantu?
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Banyak yang nanya hal ini juga lho.
          </p>

          <div className="pt-2 max-w-[600px] mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10" />
              <Input
                placeholder="Cari pertanyaan..."
                className="pl-11 h-14 bg-white border-primary/10 shadow-soft focus:ring-primary/20 rounded-md text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Category Filters (mobile only — desktop uses sidebar) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 lg:hidden">
            <button
              onClick={() => handleCategoryClick(null)}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-bold transition-all border cursor-pointer",
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
                  "px-4 py-2 rounded-sm text-xs font-bold transition-all border capitalize cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-muted-foreground border-primary/10 hover:border-primary/30",
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Category Sidebar — desktop only */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-1">
            <h2 className="px-3.5 pb-2 text-lg font-bold text-foreground/80">
              Kategori
            </h2>
            <button
              onClick={() => handleCategoryClick(null)}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xs text-sm font-bold transition-all cursor-pointer",
                !selectedCategory
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 rounded-xs text-sm font-bold capitalize transition-all cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}

            {/* Contact Card — desktop only */}
            <div className="mt-6 p-4 bg-primary/[0.03] border border-primary/10 rounded-xs space-y-3">
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  Masih Bingung?
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Chat admin aja kalau butuh bantuan.
                </p>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=6285559496968&text=Hi%20Admin%20%F0%9F%91%8B%0AMau%20tanya%20dong%20soal%20aplikasi%20split%20bill%20%F0%9F%99%8F"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <button className="w-full h-10 bg-white border border-primary/20 text-primary font-bold text-xs rounded-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-all cursor-pointer">
                  Hubungi Support <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>
          </aside>

          {/* FAQ List */}
          <div className="lg:col-span-9 space-y-6">
            {/* Title — desktop only, changes with selected category */}
            <div className="hidden lg:block space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {selectedCategory
                  ? getCategoryLabel(selectedCategory)
                  : "Ada yang bisa kami bantu?"}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {selectedCategory
                  ? `Pertanyaan seputar ${getCategoryLabel(selectedCategory)}.`
                  : "Banyak yang nanya hal ini juga lho."}
              </p>
            </div>

            {/* Search Bar — desktop only */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10" />
              <Input
                placeholder="Cari pertanyaan..."
                className="pl-11 h-14 bg-white border-primary/10 shadow-soft focus:ring-primary/20 rounded-md text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {paginatedFaqs.length > 0 ? (
              <div className="space-y-2">
                {paginatedFaqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openId === faq.id}
                    onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                  />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 pt-2">
                    <p className="text-xs text-muted-foreground font-medium">
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
              <IllustratedEmptyState
                illustration="/img/empty-state/empty-search-image.png"
                title="Gak nemu pertanyaannya..."
                description="Coba kata kunci lain atau hubungi support."
                ctaText="Hapus Filter"
                onCtaClick={(e) => {
                  e.preventDefault();
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              />
            )}
          </div>
        </div>

        {/* Contact Section — mobile only, desktop version lives in sidebar */}
        <div className="lg:hidden p-4 bg-primary/[0.03] border border-primary/10 rounded-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Masih Bingung?
            </h3>
            <p className="text-xs text-muted-foreground">
              Chat admin aja kalau butuh bantuan.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=6285559496968&text=Hi%20Admin%20%F0%9F%91%8B%0AMau%20tanya%20dong%20soal%20aplikasi%20split%20bill%20%F0%9F%99%8F"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <button className="w-full h-12 bg-white border border-primary/20 text-primary font-bold text-sm rounded-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-all cursor-pointer">
              Hubungi Support <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </a>
        </div>
      </main>

      {/* CTA Section */}
      <BlogCTA />

      <HomepageFooter />
      <Footer />
    </div>
  );
}
