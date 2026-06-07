"use client";

import React, { useRef, useState, useEffect } from "react";
import { SocialSplitBillReceipt } from "./SocialSplitBillReceipt";
import {
  BillBalances,
  SettlementInstruction,
} from "@/hooks/useBillCalculations";
import { Share2, Copy } from "lucide-react";
import { PaymentMethod } from "@/store/useWalletStore";

interface SocialReceiptPreviewBannerProps {
  activityName: string;
  people: string[];
  totalSpent: number;
  settlementInstructions: SettlementInstruction[];
  balances: BillBalances;
  badges: Record<string, string[]>;
  selectedMethods?: PaymentMethod[];
  expenses?: any[];
  additionalExpenses?: any[];
  onShareClick?: () => void;
  onCopyLink?: () => void;
  isSharing?: boolean;
}

export const SocialReceiptPreviewBanner = ({
  activityName,
  people,
  totalSpent,
  settlementInstructions,
  balances,
  badges,
  selectedMethods = [],
  expenses = [],
  additionalExpenses = [],
  onShareClick,
  onCopyLink,
  isSharing = false,
}: SocialReceiptPreviewBannerProps) => {
  const RECEIPT_WIDTH = 1080;
  const PREVIEW_HEIGHT = 260;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0); // 0 = not measured yet

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        if (w > 0) setScale(w / RECEIPT_WIDTH);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // How tall the receipt content should be before fade (unscaled)
  const visibleReceiptHeight = scale > 0 ? PREVIEW_HEIGHT / scale : 0;

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
      {/* Measurement anchor + scaled receipt */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: `${PREVIEW_HEIGHT}px` }}
      >
        {scale > 0 && (
          <>
            {/* Scaled-down receipt — display only, no pointer events */}
            <div
              style={{
                width: `${RECEIPT_WIDTH}px`,
                height: `${visibleReceiptHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                overflow: "hidden",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <SocialSplitBillReceipt
                data={{
                  people,
                  activityName,
                  totalSpent,
                  settlementInstructions,
                  balances,
                  badges,
                  selectedMethods,
                  expenses,
                  additionalExpenses,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Action buttons row */}
      <div className="border-t border-primary/5 p-3 grid grid-cols-2 gap-2 bg-white">
        <button
          onClick={onShareClick}
          disabled={isSharing}
          className="h-11 rounded-lg font-bold text-sm transition-all active:scale-[0.98] bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          <Share2
            className={`w-4 h-4 ${isSharing ? "animate-pulse" : "group-hover:rotate-12 transition-transform"}`}
          />
          {isSharing ? "..." : "Bagikan"}
        </button>

        <button
          onClick={onCopyLink}
          className="h-11 rounded-lg font-bold text-sm transition-all active:scale-[0.98] bg-white border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Copy className="w-4 h-4 transition-transform" />
          Salin Link
        </button>
      </div>
    </div>
  );
};
