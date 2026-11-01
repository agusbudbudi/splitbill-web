"use client";

import React from "react";
import { X } from "lucide-react";
import { cn, getFriendAvatarUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { FriendComboboxInput } from "./FriendComboboxInput";

interface ParticipantsFormCardProps {
  /** Currently selected participant names */
  people: string[];
  /** Called with the resolved name (existing friend or brand new) to add */
  onAdd: (name: string) => void;
  /** Called when a submitted name is already in `people` */
  onDuplicate?: (name: string) => void;
  onRemove: (name: string) => void;
  minCount?: number;
  addLabel?: string;
  participantsLabel?: string;
  suggestions?: string[];
  inputPlaceholder?: string;
}

export const ParticipantsFormCard = ({
  people,
  onAdd,
  onDuplicate,
  onRemove,
  minCount = 2,
  addLabel = "Tambah Teman",
  participantsLabel = "Peserta Split Bill",
  suggestions = ["Gua", "Temen 1", "Temen 2"],
  inputPlaceholder = "Cari teman atau tambah teman baru...",
}: ParticipantsFormCardProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* 1. Tambah teman (Primary Action) */}
      <Card id="onboarding-people-list" className="shadow-md">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground px-1">{addLabel}</label>
            <FriendComboboxInput
              people={people}
              onAdd={onAdd}
              onDuplicate={onDuplicate}
              placeholder={inputPlaceholder}
            />
          </div>

          {people.length < minCount && (
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions
                .filter((name) => !people.includes(name))
                .map((suggest) => (
                  <button
                    key={suggest}
                    onClick={() => onAdd(suggest)}
                    className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary/80 hover:bg-primary/10 border border-primary/10 transition-all active:scale-95 shadow-soft cursor-pointer"
                  >
                    <img
                      src={getFriendAvatarUrl(suggest)}
                      alt={suggest}
                      className="w-6 h-6 rounded-full border-1 border-white bg-white shadow-sm"
                    />
                    <span>+ {suggest}</span>
                  </button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Selected People Grid (Live Feedback) */}
      {people.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-foreground">{participantsLabel}</label>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-black transition-all",
                people.length >= minCount
                  ? "bg-green-100 text-green-700"
                  : "bg-primary/10 text-primary",
              )}
            >
              {people.length} Teman / min. {minCount}
            </span>
          </div>

          <div
            className={cn(
              "p-4 rounded-sm border-1 border-dashed transition-all duration-500 min-h-[140px] flex flex-col items-center justify-center gap-4",
              people.length === 1
                ? "bg-amber-50/30 border-amber-200"
                : "bg-primary/5 border-primary/20 shadow-soft",
            )}
          >
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-y-6 gap-x-2 w-full">
              {people.map((name) => (
                <div
                  key={name}
                  className="relative flex flex-col items-center gap-2 group animate-in zoom-in-50 fade-in duration-300"
                >
                  <button
                    onClick={() => onRemove(name)}
                    className="absolute -top-1 -right-1 z-10 bg-destructive text-white rounded-full p-1 hover:scale-110 active:scale-90 transition-all border-2 border-white shadow-sm cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                  <div className="w-14 h-14 rounded-full border-2 border-white shadow-soft overflow-hidden bg-white ring-2 ring-primary/5 transition-all">
                    <img
                      src={getFriendAvatarUrl(name)}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-foreground/70 truncate w-full text-center px-1">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
