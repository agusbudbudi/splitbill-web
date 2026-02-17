"use client";

import React from "react";
import { Share2, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";

export const ShareEncouragement = () => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: "SplitBill Online - Bagi Tagihan Jadi Gampang! ✨",
    text: "Guys, cobain deh SplitBill Online. Bisa scan struk otomatis pakai AI, hitung fair share, dan langsung dapet ringkasan pembayarannya. Praktis banget buat patungan! 🍱✈️",
    url: "https://splitbill.my.id",
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.log("Error sharing:", err);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareData.text} \n\nCek di sini: ${shareData.url}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Card
      onClick={handleShare}
      className="border-none shadow-soft bg-gradient-to-br from-primary/10 to-primary/5 cursor-pointer active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
    >
      <CardContent className="p-5 flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
          <Share2 className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-0.5 text-left">
          <h3 className="text-md font-bold text-foreground tracking-tight">
            Bagikan SplitBill ke Teman 🙌
          </h3>
          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
            {copied ? (
              <span className="text-primary font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Link Berhasil Di-copy!
              </span>
            ) : (
              "Bantu teman-temanmu biar gak pusing lagi bagi tagihan."
            )}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <Share2 className="w-4 h-4 text-primary/70" />
        </div>
      </CardContent>
    </Card>
  );
};
