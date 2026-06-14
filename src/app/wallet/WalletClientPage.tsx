"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PaymentMethodsTab } from "@/components/wallet/PaymentMethodsTab";
import { WalletSummaryHero } from "@/components/wallet/WalletSummaryHero";
import { useWalletStore } from "@/store/useWalletStore";

export default function WalletClientPage() {
  const { paymentMethods } = useWalletStore();

  const bankMethods = paymentMethods.filter((m) => m.type === "bank");
  const ewalletMethods = paymentMethods.filter((m) => m.type === "ewallet");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative bg-background">
        <Header title="Digital Wallet" showBackButton />

        <WalletSummaryHero
          bankCount={bankMethods.length}
          ewalletCount={ewalletMethods.length}
        />

        {/* Content */}
        <main className="flex-1 w-full flex flex-col p-4 relative -mt-16">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
            <PaymentMethodsTab />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
