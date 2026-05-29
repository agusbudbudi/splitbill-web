"use client";

import React from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { ChevronRight, ReceiptText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const OngoingSplitBillCard = () => {
  const router = useRouter();
  const expenses = useSplitBillStore((state) => state.expenses);
  const activityName = useSplitBillStore((state) => state.activityName);
  const people = useSplitBillStore((state) => state.people);
  const selectedPaymentMethodIds = useSplitBillStore(
    (state) => state.selectedPaymentMethodIds
  );

  // Show card if activity has started (name present, expenses exist, or people added)
  const isStarted =
    (activityName && activityName.trim().length > 0) ||
    expenses.length > 0 ||
    people.length > 0;

  if (!isStarted) return null;

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const itemCount = expenses.length;

  const hasActivity = activityName && activityName.trim().length > 0;
  const hasPeople = people.length > 0;
  const hasExpenses = expenses.length > 0;
  const hasUnassignedItems =
    hasExpenses && expenses.some((e) => !e.who || e.who.length === 0);
  const hasPaymentMethod = selectedPaymentMethodIds.length > 0;

  // All conditions met = ready to save
  const isReadyToSave =
    hasPeople &&
    hasExpenses &&
    !hasUnassignedItems &&
    hasActivity &&
    hasPaymentMethod;

  // Progress bar calculation
  let progress = 0;
  if (hasPeople) progress = 20;
  if (hasPeople && hasExpenses) progress = 40;
  if (hasPeople && hasExpenses && !hasUnassignedItems) progress = 60;
  if (hasPeople && hasExpenses && !hasUnassignedItems && hasActivity) progress = 80;
  if (isReadyToSave) progress = 100;

  // Format friend names
  const getFriendsList = () => {
    if (people.length === 0) return "Belum ada teman";
    if (people.length === 1) return people[0];
    if (people.length === 2) return `${people[0]} dan ${people[1]}`;
    if (people.length === 3)
      return `${people[0]}, ${people[1]}, dan ${people[2]}`;
    const remaining = people.length - 2;
    return `${people[0]}, ${people[1]}, dan ${remaining} lainnya`;
  };

  // Contextual CTA config based on state
  type CtaConfig = { label: string; cardHref: string; btnHref: string };
  let cta: CtaConfig;

  if (!hasExpenses) {
    // State 1: people added but no items yet → go to scan step
    cta = {
      label: "Scan Bill Sekarang 📸",
      cardHref: "/split-bill?step=2",
      btnHref: "/split-bill?step=2",
    };
  } else if (hasUnassignedItems) {
    // State 2: items exist but some not assigned to anyone
    cta = {
      label: "Item-nya belum dibagi nih, lanjut! 👀",
      cardHref: "/split-bill?step=2",
      btnHref: "/split-bill?step=2",
    };
  } else if (!hasActivity) {
    // State 3: all items assigned but no activity name
    cta = {
      label: "Kemana nih jalannya? Spill! 🗺️",
      cardHref: "/split-bill?step=3",
      btnHref: "/split-bill?step=3",
    };
  } else if (!hasPaymentMethod) {
    // State 4: activity name set but no payment method selected
    cta = {
      label: "Bayarnya kemana? Tambahin dulu 💳",
      cardHref: "/split-bill?step=3",
      btnHref: "/split-bill?step=3",
    };
  } else {
    // State 5: everything filled, just needs to be saved
    // Click card -> go to step 4 without auto-saving
    // Click CTA -> go to step 4 with auto-saving (?finalize=true)
    cta = {
      label: "Udah komplit! Gas simpan sekarang 🔥",
      cardHref: "/split-bill?step=4",
      btnHref: "/split-bill?step=4&finalize=true",
    };
  }

  const handleCardClick = () => {
    router.push(cta.cardHref);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(cta.btnHref);
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div
        onClick={handleCardClick}
        className={cn(
          "relative px-[1.5px] pt-[1.5px] pb-[4px] rounded-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-primary/70 shadow-lg shadow-pink-500/5 transition-all duration-300 overflow-hidden cursor-pointer h-full group hover:scale-[1.01] active:scale-[0.99]"
        )}
      >
        <div className="relative overflow-hidden bg-white rounded-[calc(1rem-1.5px)] z-10 p-4 space-y-3 h-full flex flex-col">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center transition-transform duration-300 overflow-hidden">
                <Image
                  src="/img/icon-splitbill.png"
                  alt="Bill Icon"
                  width={40}
                  height={40}
                  className="w-9 h-9 object-contain"
                  unoptimized
                />
              </div>

              <div className="space-y-0.5">
                <h3 className="text-foreground font-bold text-sm tracking-tight">
                  {activityName || "Split Bill Berjalan"}
                </h3>
                <p className="text-muted-foreground text-[11px] font-medium">
                  {itemCount} item • Rp {totalAmount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-primary/5 text-primary flex items-center justify-center transition-transform duration-300 shrink-0 border border-primary/10">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Friends List */}
          {people.length > 0 && (
            <div className="relative z-10 flex items-center gap-2 pl-1">
              <p className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {getFriendsList()}
                </span>{" "}
                sedang menunggu dihitung...
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="relative z-10 space-y-1.5 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-primary/60 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-[10px] font-bold text-primary">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Contextual CTA Button */}
          <div className="relative z-10 pt-1">
            <Button
              onClick={handleButtonClick}
              className={cn(
                "w-full text-xs font-bold gap-2 rounded-md shadow-lg shadow-primary/20 transition-all duration-300",
                isReadyToSave
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-r from-primary to-violet-600 text-white shadow-primary/20"
              )}
            >
              {cta.label}
              <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
