"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Review } from "@/hooks/useReview";

interface TestimonialCardProps {
  review: Review;
  className?: string;
}

export const TestimonialCard = ({ review, className }: TestimonialCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className={cn("overflow-hidden border border-primary/10 shadow-soft h-full", className)}>
      <CardContent className="p-5 flex flex-col h-full gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {getInitials(review.name || "A")}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-foreground leading-tight">
              {review.name || "Anonim"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={cn(
                "transition-colors duration-200",
                review.rating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-foreground/10",
              )}
            />
          ))}
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed italic line-clamp-4">
          "{review.review}"
        </p>
      </CardContent>
    </Card>
  );
};
