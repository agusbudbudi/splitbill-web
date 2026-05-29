"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useReview, Review } from "@/hooks/useReview";

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[290px] sm:w-[360px] bg-white rounded-2xl p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] space-y-4">
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((s) => (
        <div key={s} className="h-3.5 w-3.5 rounded-sm bg-slate-100 animate-pulse" />
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
      <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse opacity-70" />
      <div className="h-3 w-3/5 rounded bg-slate-100 animate-pulse opacity-50" />
    </div>
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
      <div className="space-y-1.5">
        <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
        <div className="h-2.5 w-16 rounded bg-slate-100 animate-pulse opacity-60" />
      </div>
    </div>
  </div>
);

// Individual Testimonial Card with Expand functionality (small toggle on the right)
const TestimonialCard = ({ review }: { review: Review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = review.review.length > 85;

  return (
    <motion.div
      className="flex-shrink-0 w-[290px] sm:w-[360px] snap-start h-full"
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="h-full bg-white rounded-2xl p-6 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)] hover:shadow-[0_12px_30px_-6px_rgba(71,159,234,0.15)] hover:border-primary/20 transition-all duration-300 flex flex-col justify-between cursor-pointer">
        <div>
          {/* Rating & Expand Button Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${review.rating >= star
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200 fill-slate-200"
                    }`}
                />
              ))}
            </div>

            {isLongText && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="w-6 h-6 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all duration-200 cursor-pointer shrink-0"
                aria-label={isExpanded ? "Sembunyikan" : "Tampilkan semua"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Content wrapper */}
          <div className="relative">
            <p
              className={`text-sm font-semibold text-slate-600 leading-relaxed transition-all duration-300 ${isLongText && !isExpanded ? "line-clamp-2" : "line-clamp-none"
                }`}
            >
              "{review.review}"
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className={`flex items-center gap-3 border-t border-slate-50 pt-4 ${isLongText && !isExpanded ? "mt-4" : "mt-6"}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
            <img
              src={`https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=${encodeURIComponent(review.name || "Anonim")}`}
              alt={review.name || "Anonim"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 leading-none mb-1">
              {review.name || "Anonim"}
            </h4>
            <p className="text-xs font-semibold text-slate-400">
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(review.createdAt))}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const TestimonialsSection = () => {
  const { getReviews } = useReview();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await getReviews(12, true);
        const filteredReviews = data.filter((review) => review.showOnLanding);
        setReviews(filteredReviews);
      } catch (err) {
        console.error("TestimonialsSection: Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [getReviews]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="testimoni" className="py-16 sm:py-24 bg-[#f8f9fd] relative overflow-hidden group">
      {/* Decorative blurry gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">


          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            Kata Mereka yang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              Udah Bebas Drama
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-500 font-medium"
          >
            Udah ribuan circle nongkrong terbantu dengan SplitBill. Cek review jujur dari mereka!
          </motion.p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons - Desktop Only */}
          {!isLoading && reviews.length > 0 && (
            <div className="hidden lg:block">
              <button
                onClick={() => scroll("left")}
                className="absolute -left-6 top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(71,159,234,0.15)] border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 cursor-pointer"
                aria-label="Previous testimonials"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute -right-6 top-[40%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(71,159,234,0.15)] border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 cursor-pointer"
                aria-label="Next testimonials"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Horizontal Slider Area */}
          <div className="-mx-4 sm:-mx-8 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-4 sm:px-8 pt-2 pb-4 scroll-pl-4 sm:scroll-pl-8 scroll-smooth"
            >
              {isLoading ? (
                [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
              ) : reviews.length === 0 ? null : (
                reviews.map((review, index) => (
                  <TestimonialCard key={review.id || `testimonial-${index}`} review={review} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
