"use client";

import React, { useState } from "react";
import { Check, ChevronRight, PenLine } from "lucide-react";
import { suggestEmoji } from "@/lib/emojiUtils";
import { cn, getDefaultActivityName } from "@/lib/utils";
import { trackChatBill } from "@/lib/gtag";

interface ActivityInputCardProps {
  isCompleted: boolean;
  activityName: string;
  onConfirm: (activityName: string) => void;
}

export function ActivityInputCard({
  isCompleted,
  activityName,
  onConfirm,
}: ActivityInputCardProps) {
  const [value, setValue] = useState(activityName || "");
  const [selectedQuickPick, setSelectedQuickPick] = useState<string | null>(null);

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
          {activityName || getDefaultActivityName()}
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
    const finalName = value || getDefaultActivityName();
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
          placeholder="Contoh: Makan Siang Tim"
          value={value}
          onChange={handleTextChange}
          className="w-full h-11 border border-border rounded-sm px-3 text-sm font-bold bg-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: "Makan Bareng", emoji: "🍔" },
            { label: "Kopi Santai", emoji: "☕" },
            { label: "Liburan", emoji: "✈️" },
            { label: "Patungan Kado", emoji: "🎁" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleSuggest(item.label, item.emoji)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-white text-muted-foreground transition hover:border-primary/40 hover:text-primary cursor-pointer",
                selectedQuickPick === item.label && "border-primary bg-primary/5 text-primary"
              )}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition shadow-md shadow-primary/10 cursor-pointer"
        >
          Simpan & Lanjut <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
