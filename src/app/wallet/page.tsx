"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PaymentMethodsTab } from "@/components/wallet/PaymentMethodsTab";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative bg-background">
        <Header title="Digital Wallet" showBackButton />

        {/* Content */}
        <div className="flex-1 p-4 pb-20 space-y-6">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PaymentMethodsTab />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
