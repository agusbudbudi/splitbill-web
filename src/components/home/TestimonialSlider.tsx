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
      <section className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 px-1">
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded-md bg-muted animate-pulse" />
            <div className="h-3 w-52 rounded-md bg-muted animate-pulse opacity-60" />
          </div>
        </div>

        {/* Card skeletons */}
        <div className="relative -mx-4 overflow-hidden pt-2">
          <div className="flex gap-4 px-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-3"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="h-3 w-3 rounded-sm bg-muted animate-pulse"
                    />
                  ))}
                </div>
                {/* Review text lines */}
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-muted animate-pulse opacity-70" />
                  <div className="h-3 w-3/5 rounded bg-muted animate-pulse opacity-50" />
                </div>
                {/* Avatar + name */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                    <div className="h-2.5 w-14 rounded bg-muted animate-pulse opacity-60" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
            ⭐ 4.9/5 rating dan 200+ split bill dibuat
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
