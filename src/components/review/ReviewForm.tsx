"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { useReview } from "@/hooks/useReview";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InfoBanner } from "@/components/ui/InfoBanner";

export function ReviewForm() {
  const {
    submitReview,
    isSubmitting,
    remainingCooldown,
    formatCountdown,
    isInCooldown,
  } = useReview();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [contactPermission, setContactPermission] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (rating === 0) newErrors.rating = "Silakan pilih rating";
    if (!review.trim()) newErrors.review = "Silakan tulis ulasan kamu";

    if (contactPermission) {
      if (!email.trim())
        newErrors.email = "Email wajib diisi jika bersedia dihubungi";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Format email tidak valid";

      if (!phone.trim()) newErrors.phone = "Nomor WhatsApp wajib diisi";
      else if (!/^(08|62)[0-9]{8,13}$/.test(phone.replace(/\s+/g, "")))
        newErrors.phone = "Format nomor tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInCooldown) return;
    if (!validate()) return;

    try {
      const result = await submitReview({
        rating,
        name: name || "Anonim",
        review,
        contactPermission,
        email: contactPermission ? email : null,
        phone: contactPermission ? phone : null,
      });

      if (result.success) {
        toast.success(result.message);
        // Reset form
        setRating(0);
        setName("");
        setReview("");
        setContactPermission(false);
        setEmail("");
        setPhone("");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isInCooldown && (
        <div className="mb-4">
          <InfoBanner
            variant="amber"
            message={`Kamu sudah mengirim review. Tunggu ${formatCountdown(remainingCooldown)} untuk mengirim review berikutnya.`}
            className="mb-4"
          />
        </div>
      )}

      <Card className="p-6 space-y-6">
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-bold">Beri Ulasan & Feedback</h2>
          <p className="text-sm text-foreground/60">
            Masukan kamu sangat berharga untuk pengembangan aplikasi ini.
          </p>

          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform active:scale-95 hover:scale-110"
              >
                <Star
                  size={32}
                  className={cn(
                    "transition-colors duration-200",
                    (hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-foreground/20",
                  )}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <FormError message={errors.rating} className="text-center" />
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold px-1">Nama Lengkap</label>
            <Input
              placeholder="Nama kamu (opsional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold px-1">
              Ulasan & Feedback
            </label>
            <textarea
              className="w-full min-h-[120px] rounded-2xl border border-foreground/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Tuliskan ulasan dan feedback kamu di sini..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            {errors.review && <FormError message={errors.review} />}
          </div>

          <div className="flex items-center gap-3 px-1 py-1">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="contactPermission"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-primary/20 bg-white transition-all checked:border-primary checked:bg-primary"
                checked={contactPermission}
                onChange={(e) => setContactPermission(e.target.checked)}
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
              htmlFor="contactPermission"
              className="text-sm font-medium cursor-pointer text-foreground/80 select-none"
            >
              Bersedia dihubungi tim Developer
            </label>
          </div>

          {contactPermission && (
            <div className="space-y-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold px-1">Email</label>
                <Input
                  type="email"
                  placeholder="Contoh: youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <FormError message={errors.email} />}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold px-1">
                  Nomor WhatsApp
                </label>
                <Input
                  type="tel"
                  placeholder="Contoh: 085555555555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <FormError message={errors.phone} />}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Sticky CTA Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div className="w-full max-w-[480px] relative pointer-events-auto flex flex-col">
          {/* Solid background area for the actions */}
          <div className="bg-background px-4 pb-10 flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary text-white"
              disabled={isSubmitting || isInCooldown}
              loading={isSubmitting}
            >
              {isInCooldown
                ? `Tunggu ${formatCountdown(remainingCooldown)}`
                : "Kirim Review"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
