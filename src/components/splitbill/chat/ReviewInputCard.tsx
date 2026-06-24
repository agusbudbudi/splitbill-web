"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, ChevronRight } from "lucide-react";
import { useSplitBillChatStore, type ChatStep } from "@/store/useSplitBillChatStore";
import { useReview } from "@/hooks/useReview";
import { useAuthStore } from "@/lib/stores/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trackChatBill } from "@/lib/gtag";

const STEP_ORDER: ChatStep[] = [
  "GREETING",
  "ADD_FRIENDS",
  "SCAN_RECEIPT",
  "ASSIGN_ITEMS",
  "SET_TAX_METHOD",
  "SET_ACTIVITY",
  "SET_PAYMENT",
  "REVIEW",
  "GIVE_REVIEW",
  "DONE",
];

interface ReviewInputCardProps {
  onSuccess: (skipped: boolean) => void;
}

export function ReviewInputCard({ onSuccess }: ReviewInputCardProps) {
  const { step } = useSplitBillChatStore();
  const { submitReview, isSubmitting, remainingCooldown, formatCountdown, isInCooldown } = useReview();
  const { user, isAuthenticated } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name || "");
    }
  }, [isAuthenticated, user]);

  const isCompleted = step === "DONE";

  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-emerald-700">Review Dikirim</p>
        </div>
        <div className="px-4 py-3 text-xs text-muted-foreground leading-relaxed">
          Terima kasih banyak atas feedback kamu! Ulasan kamu membantu kami membuat Agent Billy jadi lebih baik lagi. ❤️
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInCooldown) {
      setSubmitted(true);
      onSuccess(true);
      return;
    }

    if (!review.trim()) {
      toast.error("Silakan tulis ulasan singkat kamu ya!");
      return;
    }

    try {
      const result = await submitReview({
        rating,
        name: name.trim() || "Anonim",
        review: review.trim(),
        contactPermission: false,
      });

      if (result.success) {
        toast.success("Review Berhasil Dikirim! 🙏");
        trackChatBill.reviewSent({
          rating,
          auth_state: isAuthenticated ? "login" : "non_login",
        });
        setSubmitted(true);
        onSuccess(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim review");
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10">
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Beri Rating & Review Agent Billy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {isInCooldown ? (
          <div className="text-center py-2 space-y-2">
            <p className="text-xs text-muted-foreground">
              Kamu sudah mengirim review baru-baru ini. Terima kasih banyak atas dukunganmu!
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
                onSuccess(true);
              }}
              className="w-full h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-primary/90 transition cursor-pointer"
            >
              Lanjut ke Summary <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform active:scale-95 hover:scale-110 cursor-pointer"
                  >
                    <Star
                      size={26}
                      className={cn(
                        "transition-colors duration-200",
                        (hoverRating || rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-200"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {rating === 5 ? "Sempurna! 🤩" : rating === 4 ? "Keren! 😊" : rating === 3 ? "Cukup baik 👍" : rating === 2 ? "Kurang memuaskan 🙁" : "Butuh perbaikan 😞"}
              </p>
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Nama kamu (opsional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 border border-border rounded-sm px-3 text-xs bg-white focus:outline-none focus:border-primary/40"
              />
              <textarea
                placeholder="Ulasan singkat tentang pengalamanmu pakai Agent Billy..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full min-h-[70px] max-h-[120px] rounded-sm border border-border bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(true);
                  onSuccess(true);
                }}
                className="flex-1 h-9 rounded-sm border border-border text-xs font-semibold text-muted-foreground hover:bg-muted/30 transition active:scale-[0.98] cursor-pointer"
              >
                Lewati
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-9 rounded-sm bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 active:scale-[0.98] transition shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Review"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
