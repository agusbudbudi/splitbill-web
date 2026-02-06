"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";

const REVIEW_COOLDOWN_HOURS = 1;
const REVIEW_COOLDOWN_MS = REVIEW_COOLDOWN_HOURS * 60 * 60 * 1000;
const LAST_SUBMISSION_KEY = "lastReviewSubmission";
const OFFLINE_REVIEWS_KEY = "splitBillReviews";

export interface ReviewData {
  rating: number;
  name: string;
  review: string;
  contactPermission: boolean;
  email?: string | null;
  phone?: string | null;
}

export function useReview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingCooldown, setRemainingCooldown] = useState(0);

  const getRemainingCooldownTime = useCallback(() => {
    const lastSubmission = localStorage.getItem(LAST_SUBMISSION_KEY);
    if (!lastSubmission) return 0;

    const lastSubmissionTime = new Date(lastSubmission).getTime();
    const now = new Date().getTime();
    const timeDiff = now - lastSubmissionTime;
    const remaining = REVIEW_COOLDOWN_MS - timeDiff;

    return remaining > 0 ? remaining : 0;
  }, []);

  useEffect(() => {
    // Initial check
    const initialRemaining = getRemainingCooldownTime();
    setRemainingCooldown(initialRemaining);

    const interval = setInterval(() => {
      const newRemaining = getRemainingCooldownTime();
      setRemainingCooldown(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingCooldownTime, isSubmitting]);

  const submitReview = async (data: ReviewData) => {
    if (remainingCooldown > 0) {
      throw new Error(
        `Silakan tunggu ${formatCountdown(remainingCooldown)} untuk mengirim review lagi.`,
      );
    }

    setIsSubmitting(true);

    try {
      await apiClient.request(API_ENDPOINTS.REVIEWS, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const now = new Date().toISOString();
      localStorage.setItem(LAST_SUBMISSION_KEY, now);
      setRemainingCooldown(REVIEW_COOLDOWN_MS);

      return {
        success: true,
        message: "Terima kasih! Ulasan kamu sudah tersimpan 🙏",
      };
    } catch (error) {
      console.error("Error submitting review:", error);

      // Fallback to offline storage
      try {
        const offlineReviews = JSON.parse(
          localStorage.getItem(OFFLINE_REVIEWS_KEY) || "[]",
        );
        offlineReviews.push({
          ...data,
          timestamp: new Date().toISOString(),
          synced: false,
        });
        localStorage.setItem(
          OFFLINE_REVIEWS_KEY,
          JSON.stringify(offlineReviews),
        );

        const now = new Date().toISOString();
        localStorage.setItem(LAST_SUBMISSION_KEY, now);
        setRemainingCooldown(REVIEW_COOLDOWN_MS);

        return {
          success: true,
          message:
            "Review tersimpan secara lokal. Akan disinkronkan saat koneksi tersedia.",
        };
      } catch (localError) {
        throw new Error("Gagal mengirim review. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    submitReview,
    isSubmitting,
    remainingCooldown,
    formatCountdown,
    isInCooldown: remainingCooldown > 0,
  };
}
