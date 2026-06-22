"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useWalletStore } from "@/store/useWalletStore";
import { Button } from "@/components/ui/Button";
import { BillSummary, BillSummaryHandle } from "@/components/splitbill/BillSummary";
import { ChevronRight, Loader2, ReceiptText } from "lucide-react";
import { ReviewBanner } from "@/components/splitbill/ReviewBanner";
import { AnimatePresence } from "framer-motion";
import { SocialReceiptPreviewBanner } from "@/components/splitbill/SocialReceiptPreviewBanner";
import { useBillCalculations } from "@/hooks/useBillCalculations";
import confetti from "canvas-confetti";

import { useAuthStore } from "@/lib/stores/authStore";
import { trackPublic, trackSplitBill } from "@/lib/gtag";

function SplitBillDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { savedBills } = useWalletStore();
  const { isAuthenticated } = useAuthStore();
  const id = params.id as string;
  const isNew = searchParams.get("new") === "true";

  const [showBanner, setShowBanner] = useState(false);
  const [bill, setBill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew && !isLoading && bill) {
      setShowBanner(true);
      
      // Trigger Confetti Celebration
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: ReturnType<typeof setInterval> = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#7c3aed", "#a78bfa", "#ddd6fe"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#7c3aed", "#a78bfa", "#ddd6fe"],
        });
      }, 250);
    }
  }, [isNew, isLoading, bill]);

  useEffect(() => {
    const loadBill = async () => {
      // 1. Try to find in store first (already loaded from list)
      const storeBill = savedBills.find((b) => b.id === id);
      if (storeBill) {
        setBill(storeBill);
        setIsLoading(false);
        return;
      }

      // 2. Fetch from API if not in store (direct link/refresh case)
      try {
        setIsLoading(true);
        const { splitBillApi, mapBackendToFrontend } = await import("@/lib/api/split-bills");
        const response = await splitBillApi.getById(id);
        // API may wrap record under response.data.record or response.record
        const record = response.data?.record || response.record;
        if (response.success && record) {
          const mappedBill = mapBackendToFrontend(record);
          setBill(mappedBill);
        } else {
          setError("Split bill tidak ditemukan");
        }
      } catch (err) {
        console.error("Failed to fetch bill detail:", err);
        setError("Gagal memuat detail split bill");
      } finally {
        setIsLoading(false);
      }
    };

    loadBill();
  }, [id, savedBills]);

  useEffect(() => {
    if (bill && !isAuthenticated) {
      trackPublic.openBill(id);
    }
  }, [bill, isAuthenticated, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ReceiptText className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-xl font-black text-foreground tracking-tight">
            Memuat Detail Split Bill...
          </h2>
          <p className="text-sm text-muted-foreground font-medium max-w-[250px] mx-auto leading-relaxed">
            Sabar ya, lagi siapin rincian patungan kamu biar makin rapi! ✨
          </p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold">{error || "Split bill tidak ditemukan"}</h1>
        <Button
          onClick={() => router.push(isAuthenticated ? "/history" : "/")}
          className="mt-4"
          variant="outline"
        >
          {isAuthenticated ? "Kembali ke Riwayat" : "Ke Beranda"}
        </Button>
      </div>
    );
  }

  // A bill is "public" if the user is not logged in
  const isPublic = !isAuthenticated;

  return <SplitBillDetailView bill={bill} isPublic={isPublic} showBanner={showBanner} setShowBanner={setShowBanner} isAuthenticated={isAuthenticated} router={router} />;
}

// Separated so hooks (useBillCalculations) always run unconditionally
function SplitBillDetailView({
  bill,
  isPublic,
  showBanner,
  setShowBanner,
  isAuthenticated,
  router,
}: {
  bill: any;
  isPublic: boolean;
  showBanner: boolean;
  setShowBanner: (v: boolean) => void;
  isAuthenticated: boolean;
  router: any;
}) {
  const billSummaryRef = useRef<BillSummaryHandle>(null);
  const { paymentMethods: storePaymentMethods } = useWalletStore();

  const { balances, totalSpent, settlementInstructions, badges } = useBillCalculations({
    people: bill.people,
    expenses: bill.expenses,
    additionalExpenses: bill.additionalExpenses,
  });

  const effectivePaymentMethods = bill.paymentMethodSnapshots?.length
    ? bill.paymentMethodSnapshots
    : storePaymentMethods;

  const selectedMethods = effectivePaymentMethods.filter((m: any) =>
    (bill.selectedPaymentMethodIds || []).includes(m.id)
  );

  const [isSharingFromPreview, setIsSharingFromPreview] = useState(false);

  const handlePreviewShare = () => {
    setIsSharingFromPreview(true);
    billSummaryRef.current?.triggerShare();
    // Reset after a short window
    setTimeout(() => setIsSharingFromPreview(false), 4000);
  };

  const handleCopyLink = () => {
    billSummaryRef.current?.triggerShareText();
  };

  return (
    <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
      <Header
        title="Detail Split Bill"
        showBackButton
        onBack={() => router.push(isAuthenticated ? "/history?tab=split-bill" : "/")}
      />

      {/* Primary hero zone — flows seamlessly from the header */}
      <div className="bg-gradient-to-b from-primary via-primary/50 to-transparent p-4 relative">
        <SocialReceiptPreviewBanner
          activityName={bill.activityName}
          people={bill.people}
          totalSpent={totalSpent}
          settlementInstructions={settlementInstructions}
          balances={balances}
          badges={badges}
          selectedMethods={selectedMethods}
          expenses={bill.expenses}
          additionalExpenses={bill.additionalExpenses}
          onShareClick={handlePreviewShare}
          onCopyLink={handleCopyLink}
          isSharing={isSharingFromPreview}
        />
      </div>

      {/* Content section — default background */}
      <main className="flex-1 px-4 pt-4 pb-10 space-y-6">
        <BillSummary ref={billSummaryRef} billData={bill} isPublic={isPublic} hideShareActions />

        {/* "Split Bill Lagi?" CTA banner — after Monitor Status Bayar */}
        <div
          onClick={() => {
            trackSplitBill.reEntry();
            router.push("/split-bill");
          }}
          className="relative rounded-2xl p-5 text-white active:scale-[0.98] transition-all group cursor-pointer bg-brand-reversed"
        >
          <div className="absolute -top-1 right-4 p-1 opacity-100 transition-transform group-hover:scale-110 group-hover:rotate-6 z-20">
            <img
              src="/img/feature-splitbill-scan.png"
              alt="Split Bill Icon"
              className="w-24 h-24 object-contain drop-shadow-sm"
            />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Split Bill Lagi?</h3>
              <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-white/80 font-medium max-w-[280px]">
              Banyak patungan belum beres? Yuk, bagi tagihan sekarang biar gak
              ribet!
            </p>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showBanner && <ReviewBanner onClose={() => setShowBanner(false)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function SplitBillDetailPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <SplitBillDetailContent />
      </Suspense>
    </div>
  );
}
