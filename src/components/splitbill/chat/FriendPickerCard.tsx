"use client";

import React, { useState } from "react";
import { useFriendStore } from "@/lib/stores/friendStore";
import { useSplitBillChatStore, type ChatStep } from "@/store/useSplitBillChatStore";
import { Plus, X, Users, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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

interface FriendPickerCardProps {
  onConfirm: (names: string[]) => void;
}

export function FriendPickerCard({ onConfirm }: FriendPickerCardProps) {
  const { step, participants, setParticipants } = useSplitBillChatStore();
  const { friends } = useFriendStore();

  const [inputValue, setInputValue] = useState("");

  const isCompleted =
    STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf("ADD_FRIENDS");

  // ── Frozen state (already completed) ──────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-primary/15 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-primary/10">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-primary">Peserta Terpilih</p>
        </div>
        <div className="px-4 py-3 flex flex-wrap gap-2">
          {participants.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ── Sorted friends by recency / usage ──────────────────────────────────────
  const sortedFriends = [...friends].sort(
    (a, b) => (b.useCount ?? 0) - (a.useCount ?? 0)
  );

  const handleAddFriend = (text: string) => {
    // Split by comma, trim, filter out empty values
    const names = text
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) return;

    const newParticipants = [...participants];
    let addedAny = false;

    names.forEach((name) => {
      if (newParticipants.includes(name)) {
        toast.info(`${name} sudah ada dalam daftar`);
      } else {
        newParticipants.push(name);
        addedAny = true;
      }
    });
    if (addedAny) {
      setParticipants(newParticipants);
    }
  };

  const handleRemove = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddFriend(inputValue);
      setInputValue("");
    }
  };

  const handleConfirm = () => {
    if (participants.length < 2) {
      toast.error("Minimal 2 orang untuk split bill ya! 👥");
      return;
    }
    trackChatBill.friendsConfirmed({ participant_count: participants.length });
    onConfirm(participants);
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            Tambah Peserta
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Besties suggestion pills */}
        {sortedFriends.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
              Besties Kamu
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedFriends.slice(0, 8).map((f) => {
                const isSelected = participants.includes(f.name);
                return (
                  <button
                    key={f.id}
                    onClick={() =>
                      isSelected
                        ? handleRemove(f.name)
                        : handleAddFriend(f.name)
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Manual input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ketik nama lalu Enter..."
            className="flex-1 h-9 px-3 rounded-sm border border-border text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
          />
          <button
            onClick={() => {
              handleAddFriend(inputValue);
              setInputValue("");
            }}
            className="w-9 h-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Selected chips */}
        {participants.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
              {participants.length} Peserta Dipilih
            </p>
            <div className="flex flex-wrap gap-2">
              {participants.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-primary text-white text-xs font-bold"
                >
                  {name}
                  <button
                    onClick={() => handleRemove(name)}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={participants.length < 2}
          className={cn(
            "w-full h-10 rounded-sm font-bold text-sm flex items-center justify-center gap-2 transition-all",
            participants.length >= 2
              ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Lanjut
          <ChevronRight className="w-4 h-4" />
        </button>
        {participants.length < 2 && (
          <p className="text-center text-[10px] text-muted-foreground">
            Minimal 2 orang untuk split bill
          </p>
        )}
      </div>
    </div>
  );
}
