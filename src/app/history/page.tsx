"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { HistoryTab } from "@/components/wallet/HistoryTab";

export default function HistoryPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
        <Header
          title="Riwayat Transaksi"
          showBackButton
          onBack={() => router.push("/")}
        />

        {/* Content */}
        <div className="flex-1 p-4 pb-20">
          <React.Suspense
            fallback={
              <div className="h-40 flex items-center justify-center">
                Loading...
              </div>
            }
          >
            <HistoryTab />
          </React.Suspense>
        </div>

        <Footer />
      </div>
    </div>
  );
}
