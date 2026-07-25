"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Users } from "lucide-react";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useBillCalculations } from "@/hooks/useBillCalculations";
import { formatToIDR, cn, getFriendAvatarUrl } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/stores/authStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { useSaveChatBill } from "@/hooks/useSaveChatBill";
import { trackChatBill } from "@/lib/gtag";
import { InterstitialAdModal } from "@/components/ads/InterstitialAdModal";
import { getRandomAdCampaign, AdCampaign } from "@/lib/ads/adsConfig";

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

  const { isAuthenticated, user } = useAuthStore();
  const isVip = user?.subscriptionStatus === "active";
  const { handleSaveBill } = useSaveChatBill();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showAdModal, setShowAdModal] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdCampaign | null>(null);
  const [onAdFinishedCallback, setOnAdFinishedCallback] = useState<(() => void) | null>(null);

  const handleAdClose = () => {
    setShowAdModal(false);
    if (onAdFinishedCallback) {
      onAdFinishedCallback();
      setOnAdFinishedCallback(null);
    }
  };

  // ── Calculate using the existing engine ──────────────────────────────────────
  const { balances, totalSpent, settlementInstructions, badges } =
    useBillCalculations({ people: participants, expenses, additionalExpenses });

  // ── Commit to wizard store & navigate ───────────────────────────────────────
  const handleGoToSummary = () => {
    trackChatBill.summaryViewed({
      auth_state: isAuthenticated ? "login" : "non_login",
    });

    const proceedAction = () => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }
      handleSaveBill();
    };

    if (!isVip) {
      getRandomAdCampaign().then((selectedAd) => {
        setCurrentAd(selectedAd);
        setOnAdFinishedCallback(() => proceedAction);
        setShowAdModal(true);
      });
      return;
    }

    proceedAction();
  };


  const handleReset = () => {
    trackChatBill.restarted();
    resetChat();
  };

  return (
    <Card className="overflow-hidden relative shadow-none rounded-2xl">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

      <div className="p-4 space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-[10px] font-black text-primary uppercase tracking-wide">
              Ringkasan Pembayaran
            </p>
            <h2 className="text-base font-black text-foreground truncate">
              {activityName || "Aktivitas Tanpa Nama"}
            </h2>
          </div>
          <img
            src="/img/icon-splitbill.png"
            alt="Split Bill"
            className="w-8 h-8 object-contain shrink-0"
          />
        </div>

        {/* Consolidated Stats Display */}
        <div className="flex flex-row items-center justify-between border-t border-primary/10 pt-3">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase font-black text-primary/60 tracking-wider">
              Total Tagihan
            </p>
            <p className="text-2xl font-black text-primary tracking-tighter">
              {formatToIDR(totalSpent)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">
              Total Orang
            </p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xl font-black text-foreground tracking-tight">
                {participants.length}
              </span>
            </div>
          </div>
        </div>

        {/* Settlement Instructions */}
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
          <div className="p-3 bg-primary rounded-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-black text-white tracking-tight">
                Instruksi Transfer
              </p>
            </div>
            <div className="grid gap-2">
              {settlementInstructions.map((instr, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white border border-primary/10 rounded-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={getFriendAvatarUrl(instr.from, 48)}
                      className="w-7 h-7 rounded-full bg-white border border-primary/20 shrink-0"
                      alt={instr.from}
                    />
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      <span className="text-destructive font-bold">
                        {instr.from}
                      </span>{" "}
                      Transfer ke{" "}
                      <span className="text-emerald-600 font-bold">
                        {instr.to}
                      </span>
                    </p>
                  </div>
                  <span className="text-sm font-black text-primary shrink-0 ml-2">
                    {formatToIDR(instr.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-person balance mini summary */}
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2">
            Ringkasan Per Orang
          </p>
          <div className="grid gap-2">
            {participants.map((person) => {
              const b = balances[person];
              if (!b) return null;
              const diff = b.spent - b.paid;
              const isOwed = diff < 0;
              const badge = badges[person]?.[0];
              return (
                <div
                  key={person}
                  className="overflow-hidden rounded-sm border border-primary/10 bg-muted/5"
                >
                  {badge && (
                    <div className="w-fit rounded-br-sm px-2 py-0.5 text-[8px] font-black bg-primary/10 text-primary">
                      {badge}
                    </div>
                  )}
                  <div className="px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={getFriendAvatarUrl(person, 48)}
                        className="w-6 h-6 rounded-full border border-primary/10 shrink-0"
                        alt={person}
                      />
                      <p className="text-xs font-bold text-foreground truncate">
                        {person}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div
                        className={cn(
                          "text-[8px] font-black tracking-tight px-2 py-0.5 rounded-full inline-block whitespace-nowrap",
                          diff === 0
                            ? "bg-muted text-muted-foreground"
                            : isOwed
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {diff === 0
                          ? "Lunas"
                          : isOwed
                            ? "Akan Menerima"
                            : "Harus Bayar"}
                      </div>
                      <p
                        className={cn(
                          "text-xs font-black mt-0.5",
                          diff === 0
                            ? "text-muted-foreground"
                            : isOwed
                              ? "text-emerald-600"
                              : "text-destructive",
                        )}
                      >
                        {formatToIDR(Math.abs(diff))}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-primary/5 border-t border-primary/5 bg-white/40">
                    <div className="px-3 py-1.5">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">
                        Sudah Dibayar
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        {formatToIDR(b.paid)}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 text-right">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">
                        Tagihan Kamu
                      </p>
                      <p className="text-xs font-bold text-primary">
                        {formatToIDR(b.spent)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-4 pb-4 space-y-2 relative z-10">
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

      <InterstitialAdModal
        isOpen={showAdModal}
        ad={currentAd}
        onClose={handleAdClose}
      />
    </Card>
  );
}
