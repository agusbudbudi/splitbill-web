"use client";

import React, { useEffect, useState } from "react";
import { useReview, Review } from "@/hooks/useReview";
import { TestimonialCard } from "./TestimonialCard";
import { Sparkles } from "lucide-react";

export const TestimonialSlider = () => {
  const { getReviews } = useReview();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("TestimonialSlider: Fetching reviews...");
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await getReviews(5);
        console.log("TestimonialSlider: Fetched reviews:", data);
        setReviews(data);
      } catch (err) {
        console.error("TestimonialSlider: Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [getReviews]);

  if (isLoading) {
    return (
      <div className="w-full py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    console.log("TestimonialSlider: No reviews, showing placeholder.");
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground/80 tracking-tight">
              Apa Kata Mereka? ✨
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium">
              Ulasan jujur dari pengguna setia SplitBill.
            </p>
          </div>
        </div>
        <div className="px-1 text-center py-6 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/50 shadow-soft italic text-[11px] text-muted-foreground">
          Belum ada ulasan saat ini. Jadilah yang pertama memberikan ulasan! 😊
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-foreground/80 tracking-tight">
            Apa Kata Mereka? ✨
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium">
            Ulasan jujur dari pengguna setia SplitBill.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container with Bleed Effect */}
      <div className="relative -mx-4 overflow-hidden pt-2">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 scroll-pl-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <TestimonialCard review={review} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center gap-1.5 sm:hidden">
        {reviews.map((_, idx) => (
          <div
            key={idx}
            className="w-1.5 h-1.5 rounded-full bg-primary/20"
          />
        ))}
      </div>
    </section>
  );
};
