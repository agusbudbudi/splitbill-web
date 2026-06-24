"use client";

import React, { useState } from "react";
import { Check, ChevronRight, PenLine } from "lucide-react";
import { useSplitBillChatStore, type ChatStep } from "@/store/useSplitBillChatStore";
import { suggestEmoji } from "@/lib/emojiUtils";
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

interface ActivityInputCardProps {
  onConfirm: (activityName: string) => void;
}

export function ActivityInputCard({ onConfirm }: ActivityInputCardProps) {
  const { step, activityName } = useSplitBillChatStore();
  const [value, setValue] = useState(activityName || "");
  const [selectedQuickPick, setSelectedQuickPick] = useState<string | null>(null);
  const isCompleted =
    STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf("SET_ACTIVITY");

  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-emerald-700">Nama Kegiatan</p>
        </div>
        <div className="px-4 py-3 text-xs font-bold text-foreground">
          {activityName || "Aktivitas Tanpa Nama"}
        </div>
      </div>
    );
  }

  const handleSuggest = (pickName: string, emoji: string) => {
    const newValue = `${pickName.includes(emoji) ? "" : emoji + " "}${pickName}`;
    setValue(newValue);
    setSelectedQuickPick(pickName);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Clear quick pick selection if user types manually
    setSelectedQuickPick(null);
    const emoji = suggestEmoji(newValue);
    if (emoji && !newValue.includes(emoji)) {
      const hasEmoji = /^\p{Emoji}/u.test(newValue);
      if (!hasEmoji) {
        setValue(`${emoji} ${newValue}`);
        return;
      }
    }
    setValue(newValue);
  };

  const handleSubmit = () => {
    const finalName = value || "Aktivitas Tanpa Nama";
    trackChatBill.activityConfirmed({
      activity_name: finalName,
      used_quick_pick: !!selectedQuickPick,
      quick_pick_value: selectedQuickPick ?? undefined,
    });
    onConfirm(finalName);
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 flex items-center gap-2">
        <PenLine className="w-4 h-4 text-primary" />
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Nama Kegiatan
        </p>
      </div>

      <div className="p-4 space-y-3">
        <input
          type="text"
          placeholder="Contoh: Makan Ramen, Liburan Bali"
          value={value}
          onChange={handleTextChange}
          className="w-full h-11 border border-border rounded-sm px-3 text-sm font-bold bg-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { name: "Makan Bareng", emoji: "🍱" },
            { name: "Liburan", emoji: "✈️" },
            { name: "Patungan Kado", emoji: "🎁" },
            { name: "Tagihan", emoji: "🏠" },
            { name: "Belanja", emoji: "🛒" },
          ].map((pick) => (
            <button
              key={pick.name}
              type="button"
              onClick={() => handleSuggest(pick.name, pick.emoji)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 cursor-pointer border border-primary/10",
                value === `${pick.emoji} ${pick.name}`
                  ? "bg-primary text-white border-primary"
                  : "bg-primary/5 text-primary/70 hover:bg-primary/10"
              )}
            >
              <span>{pick.emoji}</span>
              <span>{pick.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          Lanjut <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
