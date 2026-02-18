"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useWalletStore } from "@/store/useWalletStore";
import { Button } from "@/components/ui/Button";
import { BillSummary } from "@/components/splitbill/BillSummary";
import { ReceiptText, ChevronRight } from "lucide-react";
import { ReviewBanner } from "@/components/splitbill/ReviewBanner";
import { AnimatePresence } from "framer-motion";

export default function SplitBillDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { savedBills } = useWalletStore();
  const id = params.id as string;
  const isNew = searchParams.get("new") === "true";

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isNew) {
      setShowBanner(true);
    }
  }, [isNew]);

  const bill = savedBills.find((b) => b.id === id);

  if (!bill) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold">Split bill tidak ditemukan</h1>
        <Button
          onClick={() => router.push("/history")}
          className="mt-4"
          variant="outline"
        >
          Kembali ke Riwayat
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
        <Header
          title="Detail Split Bill"
          showBackButton
          onBack={() => router.push("/history?tab=split-bill")}
        />

        <main className="flex-1 p-4 pb-10 space-y-6">
          <div
            onClick={() => router.push("/split-bill")}
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
          <BillSummary billData={bill} />
        </main>

        <AnimatePresence>
          {showBanner && <ReviewBanner onClose={() => setShowBanner(false)} />}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
