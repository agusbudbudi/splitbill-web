"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { HomepageNavbar } from "@/components/homepage/HomepageNavbar";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqData, faqCategoryLabels, FAQItem as FAQItemType } from "@/data/faqData";
import { Input } from "@/components/ui/Input";
import { FAQItem } from "@/components/ui/FAQItem";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";

const getCategoryLabel = (cat: FAQItemType["category"]) => faqCategoryLabels[cat] ?? cat;

export default function FAQClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQItemType["category"] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = Array.from(new Set(faqData.map((f) => f.category)));

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // No filter active: one long page grouped by category, so every question
  // and answer is in the server HTML (no pagination hiding the rest).
  const isGrouped = !searchQuery && !selectedCategory;
  const groupedFaqs = categories.map((cat) => ({
    category: cat,
    items: faqData.filter((f) => f.category === cat),
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: FAQItemType["category"] | null) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const renderItem = (faq: FAQItemType) => (
    <FAQItem
      key={faq.id}
      question={faq.question}
      answer={faq.answer}
      isOpen={openId === faq.id}
      onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
    />
  );

  const categoryChips = (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-1 lg:hidden">
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
            "px-4 py-2 rounded-sm text-xs font-bold transition-all border cursor-pointer",
            selectedCategory === cat
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-white text-muted-foreground border-primary/10 hover:border-primary/30",
          )}
        >
          {getCategoryLabel(cat)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative pt-16 lg:pt-18">
      <HomepageNavbar />

      <main className="w-full max-w-[600px] lg:max-w-[1100px] px-4 pt-10 pb-10 space-y-8 relative z-10">
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
                  "w-full text-left px-3.5 py-2.5 rounded-xs text-sm font-bold transition-all cursor-pointer",
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
            {/* Single H1 for all breakpoints (centered on mobile) */}
            <div className="space-y-1 text-center lg:text-left">
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

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10" />
              <Input
                placeholder="Cari pertanyaan..."
                className="pl-11 h-14 bg-white border-primary/10 shadow-soft focus:ring-primary/20 rounded-md text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Category Filters (mobile only — desktop uses sidebar) */}
            {categoryChips}

            {isGrouped ? (
              <div className="space-y-8">
                {groupedFaqs.map(({ category, items }) => (
                  <section key={category} className="space-y-3">
                    <h2 className="text-lg font-bold text-foreground/80 px-1">
                      {getCategoryLabel(category)}
                    </h2>
                    <div className="space-y-2">{items.map(renderItem)}</div>
                  </section>
                ))}
              </div>
            ) : filteredFaqs.length > 0 ? (
              <div className="space-y-2">{filteredFaqs.map(renderItem)}</div>
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
