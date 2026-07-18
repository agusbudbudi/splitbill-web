"use client";

import React from "react";
import { useFriendStore } from "@/lib/stores/friendStore";
import { X, Users, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trackChatBill } from "@/lib/gtag";
import { FriendComboboxInput } from "@/components/splitbill/FriendComboboxInput";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface FriendPickerCardProps {
  participants: string[];
  isCompleted: boolean;
  setParticipants: (names: string[]) => void;
  onConfirm: (names: string[]) => void;
}

export function FriendPickerCard({
  participants,
  isCompleted,
  setParticipants,
  onConfirm,
}: FriendPickerCardProps) {
  const { friends, addFriend, trackFriendUsage } = useFriendStore();

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

  const handleAddName = (name: string) => {
    setParticipants([...participants, name]);
    toast.success(`${name} berhasil ditambahkan ✅`);

    const existingFriend = friends.find(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    if (!existingFriend) {
      addFriend({ name });
    } else {
      trackFriendUsage(existingFriend.id);
    }
  };

  const handleRemove = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const handleConfirm = () => {
    if (participants.length < 2) {
      toast.error("Minimal 2 teman untuk split bill ya! 👥");
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
        {/* Search / create input */}
        <FriendComboboxInput
          people={participants}
          onAdd={handleAddName}
          onDuplicate={() => toast.info("Teman sudah ditambahkan.")}
        />

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
                  className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-primary text-white text-xs font-bold"
                >
                  <img
                    src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                    alt={name}
                    className="w-5 h-5 rounded-full bg-white shrink-0"
                  />
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
            Minimal 2 teman untuk split bill
          </p>
        )}
      </div>
    </div>
  );
}
