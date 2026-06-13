"use client";

import React, { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

interface DropOffSurveyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  step: number;
}

export function DropOffSurveyBottomSheet({
  isOpen,
  onClose,
  onComplete,
  step,
}: DropOffSurveyBottomSheetProps) {
  const { user } = useAuthStore();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getReasonsByStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return [
          "Sulit menambah/mencari teman",
          "Ingin menggunakan kontak HP tapi tidak bisa",
          "Bingung cara menambahkan nama",
          "Lainnya",
        ];
      case 2:
        return [
          "Fitur AI Scan kurang Akurat",
          "Proses Scan AI terlalu Lama",
          "Assign Item terlalu Ribet",
          "Gak tahu cara input manual / Scan",
          "Sulit Memilih / Menambah Teman Patungan",
          "Lainnya",
        ];
      case 3:
        return [
          "Sulit menambahkan/memilih metode pembayaran",
          "Metode pembayaran saya tidak tersedia",
          "Bingung mengisi nama aktivitas",
          "Lainnya",
        ];
      case 4:
        return [
          "Perhitungan split bill kurang tepat / membingungkan",
          "Bingung cara men-share rincian tagihan",
          "Tidak ingin menyimpan history tagihan",
          "Lainnya",
        ];
      default:
        return ["Lainnya"];
    }
  };

  const reasons = getReasonsByStep(step);

  const handleCheckboxChange = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      toast.error("Pilih setidaknya satu alasan sebelum mengirim feedback.");
      return;
    }

    const hasOther = selectedReasons.includes("Lainnya");
    if (hasOther && !otherReason.trim()) {
      toast.error("Harap isi alasan Lainnya terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedText = selectedReasons
        .filter((r) => r !== "Lainnya")
        .join(", ");

      const parts = [];
      if (selectedText) parts.push(selectedText);
      if (hasOther) parts.push(`Lainnya: ${otherReason.trim()}`);

      const reviewText = `[Drop-off Survey Step ${step}] ${parts.join(" | ")}`;

      await apiClient.request(API_ENDPOINTS.REVIEWS, {
        method: "POST",
        body: JSON.stringify({
          rating: 3,
          name: user?.name || "User Drop-off Step " + step,
          review: reviewText,
          contactPermission: false,
        }),
      });

      toast.success("Terima kasih atas feedback kamu! 🙏");
      onComplete();
    } catch (error: any) {
      console.error("Failed to submit drop-off survey:", error);
      toast.error("Gagal mengirim feedback, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    onComplete();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleDismiss}
      title="Bantu kami jadi lebih baik! 🙏"
      showBackButton={false}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kami perhatikan kamu kembali dari halaman pengisian. Boleh tahu alasannya agar kami bisa meningkatkan fitur ini?
          </p>
        </div>

        <div className="space-y-4">
          {reasons.map((reason) => (
            <div key={reason} className="flex items-center gap-3 px-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={`reason-${reason}`}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-primary/20 bg-white transition-all checked:border-primary checked:bg-primary"
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleCheckboxChange(reason)}
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <label
                htmlFor={`reason-${reason}`}
                className="text-sm font-semibold cursor-pointer text-foreground/80 select-none"
              >
                {reason}
              </label>
            </div>
          ))}
        </div>

        {selectedReasons.includes("Lainnya") && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-bold text-muted-foreground px-1">
              Tulis alasan kamu di sini:
            </label>
            <textarea
              className="w-full min-h-[100px] rounded-2xl border border-foreground/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Masukan kamu sangat berharga..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-md text-sm font-bold border-primary/10 text-muted-foreground"
            onClick={handleDismiss}
            disabled={isSubmitting}
          >
            Lewati
          </Button>
          <Button
            className="flex-1 h-12 rounded-md text-sm font-bold bg-primary text-white"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedReasons.length === 0}
            loading={isSubmitting}
          >
            Kirim Feedback
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
