"use client";

import React from "react";
import { Camera, Clock, ChevronRight } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { cn } from "@/lib/utils";

interface ScanChoiceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNow: () => void;
  onSelectLater: () => void;
}

const OPTIONS = [
  {
    key: "now" as const,
    icon: Camera,
    title: "Split Sekarang 📸",
    subtitle: "Foto struk, langsung lanjut split bareng temen",
  },
  {
    key: "later" as const,
    icon: Clock,
    title: "Split Later 🗂️",
    subtitle: "Simpan struk dulu, split kapan aja pas sempat",
  },
];

export const ScanChoiceBottomSheet = ({
  isOpen,
  onClose,
  onSelectNow,
  onSelectLater,
}: ScanChoiceBottomSheetProps) => {
  const handleSelect = (key: "now" | "later") => {
    onClose();
    if (key === "now") onSelectNow();
    else onSelectLater();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Mau Split Gimana?"
      showBackButton={false}
    >
      <div className="space-y-3">
        {OPTIONS.map(({ key, icon: Icon, title, subtitle }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(key)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-sm border-2 border-primary/10 bg-primary/5",
              "hover:bg-primary/10 hover:border-primary/30 active:scale-[0.98] transition-all cursor-pointer text-left",
            )}
          >
            <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-soft flex items-center justify-center text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0" />
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
