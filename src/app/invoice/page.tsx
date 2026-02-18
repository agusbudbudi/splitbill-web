"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InvoiceLanding } from "./components/InvoiceLanding";
import { useRouter } from "next/navigation";

export default function InvoiceHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Purple background behind header and top banner */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[150px] bg-primary z-0 rounded-b-[20px]" />

      <Header title="Invoice" showBackButton onBack={() => router.push("/")} />

      <main className="flex-1 w-full max-w-[600px] px-4 pt-4 pb-10 space-y-8 relative z-10 flex flex-col">
        <InvoiceLanding />
      </main>

      <Footer />
    </div>
  );
}
