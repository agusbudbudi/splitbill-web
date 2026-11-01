"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { trackPublic } from "@/lib/gtag";

const TITLE = "Giliran kamu yang bayarin?";
const DESCRIPTION = "Bagi tagihanmu dalam 1 menit, gratis.";

interface PublicBillAcquisitionCtaProps {
  billId: string;
  people: string[];
  placement: "top" | "bottom";
}

/**
 * Acquisition CTA for viewers of a shared bill who don't own it. Participants
 * go through the store rather than the `participants` query param: names in
 * the URL would reach GA4 through page_location.
 */
export function PublicBillAcquisitionCta({
  billId,
  people,
  placement,
}: PublicBillAcquisitionCtaProps) {
  const hasOwnDraft = useSplitBillStore(
    (state) =>
      state.people.length > 0 ||
      state.expenses.length > 0 ||
      state.additionalExpenses.length > 0 ||
      state.activityName.trim().length > 0 ||
      !!state.draftId ||
      state.uploadedReceiptImages.length > 0 ||
      state.scannedReceiptImages.length > 0,
  );
  const willPrefill = !hasOwnDraft && people.length > 0;

  const handleClick = () => {
    trackPublic.acquisitionCtaClick({
      billId,
      placement,
      participantCount: people.length,
      prefilled: willPrefill,
    });
    // Never overwrite a draft the viewer already started.
    if (willPrefill) {
      useSplitBillStore.getState().setPeople(people);
    }
  };

  if (placement === "top") {
    return (
      <Link
        href="/split-bill"
        onClick={handleClick}
        className="flex items-center gap-3 rounded-md bg-card p-3 shadow-soft active:scale-[0.98] transition-all group"
      >
        <img
          src="/img/feature-splitbill-scan.png"
          alt=""
          className="w-11 h-11 object-contain shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-foreground">{TITLE}</p>
          <p className="text-xs font-medium text-muted-foreground">{DESCRIPTION}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  }

  return (
    <Link
      href="/split-bill"
      onClick={handleClick}
      className="relative block rounded-md p-5 text-white active:scale-[0.98] transition-all group cursor-pointer bg-brand-reversed"
    >
      <div className="absolute -top-1 right-4 p-1 opacity-100 transition-transform group-hover:scale-110 group-hover:rotate-6 z-20">
        <img
          src="/img/feature-splitbill-scan.png"
          alt=""
          className="w-24 h-24 object-contain drop-shadow-sm"
        />
      </div>
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          {/* Capped so this longer copy wraps instead of running under the image. */}
          <h3 className="text-xl font-black max-w-[200px]">{TITLE}</h3>
          <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-xs text-white/80 font-medium max-w-[200px]">{DESCRIPTION}</p>
      </div>
    </Link>
  );
}
