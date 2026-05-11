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
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await getReviews(10, true);
        // Filter reviews to ensure only those marked for landing page are shown
        const filteredReviews = data.filter((review) => review.showOnLanding);
        setReviews(filteredReviews);
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
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="space-y-0.5">
          <h2 className="text-md font-bold text-foreground">
            Apa Kata Mereka? ✨
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Ulasan jujur dari pengguna setia SplitBill.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container with Bleed Effect */}
      <div className="relative -mx-4 overflow-hidden pt-2">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 scroll-pl-4">
          {reviews.map((review, idx) => (
            <div
              key={review.id || `testimonial-${idx}`}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <TestimonialCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
