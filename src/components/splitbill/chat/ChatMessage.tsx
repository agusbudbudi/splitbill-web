"use client";

import React from "react";
import { type ChatMessage as ChatMessageType } from "@/store/useSplitBillChatStore";
import { FriendPickerCard } from "./FriendPickerCard";
import { ReceiptScanCard } from "./ReceiptScanCard";
import { ItemAssignCard } from "./ItemAssignCard";
import { TaxMethodCard } from "./TaxMethodCard";
import { SummaryCard } from "./SummaryCard";
import { ActivityInputCard } from "./ActivityInputCard";
import { PaymentPickerCard } from "./PaymentPickerCard";
import { ReviewInputCard } from "./ReviewInputCard";
import { cn } from "@/lib/utils";
import type { ReceiptScanResult } from "@/lib/AIService";

interface ChatMessageProps {
  message: ChatMessageType;
  // Action callbacks — only used by the interactive card messages
  onFriendsConfirmed?: (names: string[]) => void;
  onReceiptConfirmed?: (result: ReceiptScanResult, imageDataUrl: string) => void;
  onItemsAssigned?: () => void;
  onTaxMethodSet?: () => void;
  onActivityConfirmed?: (activityName: string) => void;
  onPaymentConfirmed?: (selectedIds: string[]) => void;
  onPaymentSkipped?: () => void;
  onReviewDone?: (skipped: boolean) => void;
}

export function ChatMessage({
  message,
  onFriendsConfirmed,
  onReceiptConfirmed,
  onItemsAssigned,
  onTaxMethodSet,
  onActivityConfirmed,
  onPaymentConfirmed,
  onPaymentSkipped,
  onReviewDone,
}: ChatMessageProps) {
  const isAgent = message.role === "agent";

  // ── Text-only bubbles ───────────────────────────────────────────────────────
  if (message.type === "text") {
    if (isAgent) {
      return (
        <div className="flex items-end gap-2 max-w-[88%]">
          {/* Agent avatar */}
          <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm bg-slate-100">
            <img src="/img/agent-billy.png" alt="Agent Billy" className="w-full h-full object-cover" />
          </div>
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm overflow-hidden max-w-full">
            {message.imageUrl && (
              <div className="w-full p-2 pb-0">
                <img src={message.imageUrl} alt="Banner" className="w-full h-auto object-cover rounded-sm" />
              </div>
            )}
            <div className="px-4 py-2.5">
              <p
                className="text-sm text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(message.content),
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    // User bubble
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] shadow-md shadow-primary/15">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  // ── Action cards (always agent-side, full width) ───────────────────────────
  if (isAgent) {
    return (
      <div className="flex items-start gap-2 w-full">
        {/* Agent avatar */}
        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm mt-0.5 bg-slate-100">
          <img src="/img/agent-billy.png" alt="Agent Billy" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-2">
          {/* Optional text above the card */}
          {message.content && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm overflow-hidden inline-block max-w-full">
              {message.imageUrl && (
                <div className="w-full border-b border-slate-100">
                  <img src={message.imageUrl} alt="Banner" className="w-full h-auto object-cover" />
                </div>
              )}
              <div className="px-4 py-2.5">
                <p
                  className="text-sm text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(message.content),
                  }}
                />
              </div>
            </div>
          )}

          {/* Interactive card */}
          {message.type === "friend_picker" && onFriendsConfirmed && (
            <FriendPickerCard onConfirm={onFriendsConfirmed} />
          )}
          {message.type === "receipt_scan" && onReceiptConfirmed && (
            <ReceiptScanCard onConfirm={onReceiptConfirmed} />
          )}
          {message.type === "item_assign" && onItemsAssigned && (
            <ItemAssignCard onConfirm={onItemsAssigned} />
          )}
          {message.type === "tax_method" && onTaxMethodSet && (
            <TaxMethodCard onConfirm={onTaxMethodSet} />
          )}
          {message.type === "activity_input" && onActivityConfirmed && (
            <ActivityInputCard onConfirm={onActivityConfirmed} />
          )}
          {message.type === "payment_picker" && onPaymentConfirmed && onPaymentSkipped && (
            <PaymentPickerCard onConfirm={onPaymentConfirmed} onSkip={onPaymentSkipped} />
          )}
          {message.type === "summary" && <SummaryCard />}
          {message.type === "review_input" && onReviewDone && (
            <ReviewInputCard onSuccess={onReviewDone} />
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ── Typing indicator ──────────────────────────────────────────────────────────
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[88%]">
      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm bg-slate-100">
        <img src="/img/agent-billy.png" alt="Agent Billy" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

// ── Minimal markdown → HTML ───────────────────────────────────────────────────
function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
