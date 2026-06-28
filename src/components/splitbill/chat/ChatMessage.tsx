"use client";

import React from "react";
import { useSplitBillChatStore, type ChatStep } from "@/store/useSplitBillChatStore";
import { FriendPickerCard } from "./FriendPickerCard";
import { PayerPickerCard } from "./PayerPickerCard";
import { ReceiptScanCard } from "./ReceiptScanCard";
import { ItemAssignCard } from "./ItemAssignCard";
import { TaxMethodCard } from "./TaxMethodCard";
import { SummaryCard } from "./SummaryCard";
import { ActivityInputCard } from "./ActivityInputCard";
import { PaymentPickerCard } from "./PaymentPickerCard";
import { ReviewInputCard } from "./ReviewInputCard";
import { cn } from "@/lib/utils";
import type { ReceiptScanResult } from "@/lib/AIService";

const STEP_ORDER: ChatStep[] = [
  "GREETING",
  "ADD_FRIENDS",
  "SELECT_PAYER",
  "SCAN_RECEIPT",
  "ASSIGN_ITEMS",
  "SET_TAX_METHOD",
  "SET_ACTIVITY",
  "SET_PAYMENT",
  "REVIEW",
  "GIVE_REVIEW",
  "DONE",
];

interface ChatMessageProps {
  message: {
    id: string;
    role: "agent" | "user";
    type: string;
    content: string;
    imageUrl?: string;
  };
  onFriendsConfirmed?: (names: string[]) => void;
  onPayerSelected?: (payerName: string) => void;
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
  onPayerSelected,
  onReceiptConfirmed,
  onItemsAssigned,
  onTaxMethodSet,
  onActivityConfirmed,
  onPaymentConfirmed,
  onPaymentSkipped,
  onReviewDone,
}: ChatMessageProps) {
  const isAgent = message.role === "agent";

  // Read state from store to pass down to decoupled cards
  const {
    step,
    participants,
    payerName,
    scannedResult,
    expenses,
    additionalExpenses,
    activityName,
    selectedPaymentMethodIds,
    setParticipants,
    updateExpense,
    updateAdditionalExpense,
    closeChat,
  } = useSplitBillChatStore();

  // Helper to check if a step is completed
  const isStepCompleted = (targetStep: ChatStep) => {
    return STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf(targetStep);
  };

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
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden mr-6">
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
          )}

          {/* Interactive card */}
          {message.type === "friend_picker" && onFriendsConfirmed && (
            <FriendPickerCard
              participants={participants}
              isCompleted={isStepCompleted("ADD_FRIENDS")}
              setParticipants={setParticipants}
              onConfirm={onFriendsConfirmed}
            />
          )}
          {message.type === "payer_picker" && onPayerSelected && (
            <PayerPickerCard
              participants={participants}
              payerName={payerName}
              isCompleted={isStepCompleted("SELECT_PAYER")}
              onConfirm={onPayerSelected}
            />
          )}
          {message.type === "receipt_scan" && onReceiptConfirmed && (
            <ReceiptScanCard
              isCompleted={isStepCompleted("SCAN_RECEIPT")}
              scannedResult={scannedResult}
              activityName={activityName}
              onCloseChat={closeChat}
              onConfirm={onReceiptConfirmed}
            />
          )}
          {message.type === "item_assign" && onItemsAssigned && (
            <ItemAssignCard
              isCompleted={isStepCompleted("ASSIGN_ITEMS")}
              expenses={expenses}
              participants={participants}
              onUpdateExpense={updateExpense}
              onConfirm={onItemsAssigned}
            />
          )}
          {message.type === "tax_method" && onTaxMethodSet && (
            <TaxMethodCard
              isCompleted={isStepCompleted("SET_TAX_METHOD")}
              additionalExpenses={additionalExpenses}
              participants={participants}
              payerName={payerName}
              onUpdateAdditionalExpense={updateAdditionalExpense}
              onConfirm={onTaxMethodSet}
            />
          )}
          {message.type === "activity_input" && onActivityConfirmed && (
            <ActivityInputCard
              isCompleted={isStepCompleted("SET_ACTIVITY")}
              activityName={activityName}
              onConfirm={onActivityConfirmed}
            />
          )}
          {message.type === "payment_picker" && onPaymentConfirmed && onPaymentSkipped && (
            <PaymentPickerCard
              isCompleted={isStepCompleted("SET_PAYMENT")}
              selectedPaymentMethodIds={selectedPaymentMethodIds}
              onConfirm={onPaymentConfirmed}
              onSkip={onPaymentSkipped}
            />
          )}
          {message.type === "summary" && <SummaryCard />}
          {message.type === "review_input" && onReviewDone && (
            <ReviewInputCard
              isCompleted={step === "DONE"}
              onSuccess={onReviewDone}
            />
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
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm bg-slate-100">
        <img src="/img/agent-billy.png" alt="Agent Billy" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

// ── Simple Markdown Helper ───────────────────────────────────────────────────
function formatMarkdown(text: string): string {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert escaped <br> / <br /> back to HTML tag
  html = html.replace(/&lt;br\s*\/?&gt;/gi, "<br />");

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Newlines to <br />
  html = html.replace(/\n/g, "<br />");

  return html;
}
