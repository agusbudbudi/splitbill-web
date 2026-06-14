"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { AddPaymentMethodBottomSheet } from "./AddPaymentMethodBottomSheet";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  ShieldCheck,
  Share2,
  WifiOff,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import { trackWallet } from "@/lib/gtag";

export const PaymentMethodsTab = () => {
  const { paymentMethods, removePaymentMethod } = useWalletStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeBankIdx, setActiveBankIdx] = useState(0);
  const [activeEwalletIdx, setActiveEwalletIdx] = useState(0);

  const bankMethods = paymentMethods.filter((m) => m.type === "bank");
  const ewalletMethods = paymentMethods.filter((m) => m.type === "ewallet");

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>,
    setIdx: (idx: number) => void
  ) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const idx = Math.round(scrollLeft / (width * 0.85));
    setIdx(idx);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-4">
      {/* Empty State / Intro */}
      {paymentMethods.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 px-6 animate-in fade-in zoom-in duration-500 rounded-2xl bg-white border border-primary/10 shadow-soft">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-primary/5">
            <img
              src="/img/menu-wallet.png"
              alt="Wallet"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h3 className="font-extrabold text-xl text-foreground mb-2 text-center">
            Dompet Kamu Masih Kosong
          </h3>
          <p className="text-xs text-muted-foreground text-center max-w-xl mb-8 leading-relaxed">
            Simpan rekening sekali, bagikan ke teman kapan saja.
          </p>

          {/* 3 Step Benefits */}
          <div className="w-full max-w-[320px] space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Anti Salah Input No. Rekening</h4>
                <p className="text-[10px] text-muted-foreground">Tinggal salin atau bagikan info akurat tanpa ketik ulang.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Gabung Banyak Metode</h4>
                <p className="text-[10px] text-muted-foreground">Teman bebas pilih bayar via Bank Transfer, GoPay, OVO, dll.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Aman & Privat Secara Lokal</h4>
                <p className="text-[10px] text-muted-foreground">Data disimpan di handphonemu, tidak dikirim ke server backend.</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="rounded-md px-10 shadow-lg shadow-primary/20 w-full sm:w-auto font-bold h-12"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Rekening Pertama
          </Button>
        </div>
      )}

      {/* Bank Accounts Section */}
      {bankMethods.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center gap-2">
              Bank Accounts
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-black tabular-nums">
                {bankMethods.length}
              </span>
            </h3>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-xs font-bold text-primary hover:underline bg-background/50 px-3 py-2 rounded-sm cursor-pointer"
            >
              + Tambah Bank
            </button>
          </div>

          <div
            className="flex overflow-x-auto gap-3 pb-3 mb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
            onScroll={(e) => handleScroll(e, setActiveBankIdx)}
          >
            {bankMethods.map((method) => (
              <div key={method.id} className="snap-center shrink-0">
                <PaymentMethodCard
                  method={method}
                  onDelete={removePaymentMethod}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {bankMethods.length > 1 && (
            <div className="flex justify-center gap-1.5 pt-1">
              {bankMethods.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeBankIdx ? "w-4 bg-primary" : "w-1.5 bg-primary/25"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* E-Wallets Section */}
      {ewalletMethods.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center gap-2">
              E-Wallets
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-black tabular-nums">
                {ewalletMethods.length}
              </span>
            </h3>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-xs font-bold text-primary hover:underline bg-background/50 px-3 py-2 rounded-sm cursor-pointer"
            >
              + Tambah E-Wallet
            </button>
          </div>

          <div
            className="flex overflow-x-auto gap-3 pb-3 mb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
            onScroll={(e) => handleScroll(e, setActiveEwalletIdx)}
          >
            {ewalletMethods.map((method) => (
              <div key={method.id} className="snap-center shrink-0">
                <PaymentMethodCard
                  method={method}
                  onDelete={removePaymentMethod}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {ewalletMethods.length > 1 && (
            <div className="flex justify-center gap-1.5 pt-1">
              {ewalletMethods.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeEwalletIdx ? "w-4 bg-primary" : "w-1.5 bg-primary/25"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share All Card (Premium Box) */}
      {paymentMethods.length > 0 && (
        <div className="px-1 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group cursor-pointer hover:shadow-soft transition-all active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Share2 className="w-20 h-20 text-primary" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Share2 className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  Bagiin Semua Rekening
                </h4>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed max-w-[200px]">
                Gabungkan info {paymentMethods.length} akun bank & e-wallet kamu jadi satu pesan teks.
              </p>
              <Button
                onClick={() => {
                  const text = paymentMethods
                    .map((m) => {
                      const typeLabel = m.type === "bank" ? "Bank" : "E-Wallet";
                      const details = m.accountNumber || m.phoneNumber;
                      return `📌 *${typeLabel}: ${m.providerName}*\n👤 ${m.accountName}\n💳 ${details}\n`;
                    })
                    .join("\n");

                  const fullMessage = `Halo! Ini rincian akun pembayaran saya:\n\n${text}\nDibagikan via SplitBill App 🚀`;

                  trackWallet.copyAccount("all_methods");
                  if (navigator.share) {
                    navigator.share({
                      title: "My Payment Methods",
                      text: fullMessage,
                    });
                  } else {
                    navigator.clipboard.writeText(fullMessage);
                    import("sonner").then(({ toast }) =>
                      toast.success("Semua rekening disalin ke clipboard! 📋"),
                    );
                  }
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-lg shadow-md shadow-primary/20 active:scale-95 transition-all cursor-pointer"
                size="sm"
              >
                Salin & Bagikan Semua
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights (Premium Soft Grid) */}
      <div className="grid grid-cols-2 gap-3 px-1 animate-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="p-4 rounded-2xl bg-white border border-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-soft">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Aman & Privat
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Data tersimpan lokal di HP kamu, bukan di server.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-soft">
          <Share2 className="w-5 h-5 text-blue-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Sat Set Share
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Salin & bagikan info rekening dalam sekali klik.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-soft">
          <WifiOff className="w-5 h-5 text-slate-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Mode Offline
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Akses semua data kapan saja tanpa perlu internet.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-soft">
          <LayoutGrid className="w-5 h-5 text-purple-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Rapi & Praktis
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Semua akun bank & e-wallet jadi satu tempat.
          </p>
        </div>
      </div>

      {/* Floating Action Button for Add (always available to encourage usage) */}
      <div className="sticky bottom-16 mt-auto w-full pointer-events-none z-40 flex justify-end pr-2 pb-6">
        <Button
          onClick={() => setIsAddOpen(true)}
          className="w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 flex items-center justify-center p-0 pointer-events-auto active:scale-95 transition-transform border-4 border-white"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      <AddPaymentMethodBottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
};
