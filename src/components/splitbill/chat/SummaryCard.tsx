"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useBillCalculations } from "@/hooks/useBillCalculations";
import { formatToIDR, cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { useSaveChatBill } from "@/hooks/useSaveChatBill";
import { trackChatBill } from "@/lib/gtag";

export function SummaryCard() {
  const router = useRouter();
  const {
    participants,
    expenses,
    additionalExpenses,
    activityName,
    selectedPaymentMethodIds,
    resetChat,
    closeChat,
    setStep,
  } = useSplitBillChatStore();

  const { isAuthenticated } = useAuthStore();
  const { handleSaveBill } = useSaveChatBill();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ── Calculate using the existing engine ──────────────────────────────────────
  const { balances, totalSpent, settlementInstructions, badges } =
    useBillCalculations({ people: participants, expenses, additionalExpenses });

  // ── Commit to wizard store & navigate ───────────────────────────────────────
  const handleGoToSummary = () => {
    trackChatBill.summaryViewed({
      auth_state: isAuthenticated ? "login" : "non_login",
    });
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    handleSaveBill();
  };


  const handleReset = () => {
    trackChatBill.restarted();
    resetChat();
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-violet-500/10 border-b border-primary/15">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wide">
              Ringkasan Pembayaran
            </p>
            {activityName && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {activityName}
              </p>
            )}
          </div>
          <p className="text-base font-black text-primary">
            {formatToIDR(totalSpent)}
          </p>
        </div>
      </div>

      {/* Settlement instructions */}
      <div className="p-4 space-y-3">
        {settlementInstructions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-1">🎉</p>
            <p className="text-sm font-bold text-foreground">
              Semua sudah imbang!
            </p>
            <p className="text-xs text-muted-foreground">
              Tidak ada transfer yang perlu dilakukan.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              Transfer yang Perlu Dilakukan
            </p>
            <div className="space-y-2">
              {settlementInstructions.map((instr, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-sm bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/10"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-foreground truncate">
                        {instr.from}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        bayar ke{" "}
                        <span className="font-bold text-foreground">
                          {instr.to}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-primary shrink-0 ml-2">
                    {formatToIDR(instr.amount)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Per-person balance mini summary */}
        <div className="pt-2 border-t border-border/60">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">
            Ringkasan Per Orang
          </p>
          <div className="grid grid-cols-2 gap-2">
            {participants.map((person) => {
              const b = balances[person];
              if (!b) return null;
              const net = b.paid - b.spent;
              const badge = badges[person]?.[0];
              return (
                <div
                  key={person}
                  className={cn(
                    "rounded-sm p-2.5 border",
                    net > 0.01
                      ? "border-emerald-100 bg-emerald-50/50"
                      : net < -0.01
                        ? "border-rose-100 bg-rose-50/50"
                        : "border-border bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {net > 0.01 ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : net < -0.01 ? (
                      <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                    ) : (
                      <Minus className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                    <p className="text-[11px] font-bold text-foreground truncate">
                      {person}
                    </p>
                  </div>
                  {badge && (
                    <p className="text-[9px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-full inline-block mb-1">
                      {badge}
                    </p>
                  )}
                  <p
                    className={cn(
                      "text-xs font-black",
                      net > 0.01
                        ? "text-emerald-600"
                        : net < -0.01
                          ? "text-rose-500"
                          : "text-muted-foreground"
                    )}
                  >
                    {net > 0.01
                      ? `+${formatToIDR(net)}`
                      : net < -0.01
                        ? `-${formatToIDR(Math.abs(net))}`
                        : "Imbang"}
                  </p>
                  <p className="text-[9px] text-muted-foreground">
                    Bayar {formatToIDR(b.paid)} · Habis {formatToIDR(b.spent)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-4 pb-4 space-y-2">
        <button
          onClick={handleGoToSummary}
          className="w-full h-11 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          Lihat Ringkasan Lengkap
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="w-full h-9 rounded-sm border border-border text-xs font-semibold text-muted-foreground hover:border-primary/30 hover:text-primary transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Mulai Lagi dari Awal
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectPath={typeof window !== "undefined" ? `${window.location.pathname}?finalizeChat=true` : "/member"}
        title="Simpan Hasil Split Bill"
        description="Masuk dulu yuk agar split bill kamu tersimpan dan bisa langsung dibagikan ke teman-teman."
      />
    </div>
  );
}
