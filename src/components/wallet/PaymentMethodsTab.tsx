"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { AddPaymentMethodBottomSheet } from "./AddPaymentMethodBottomSheet";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Wallet,
  ShieldCheck,
  Share2,
  WifiOff,
  LayoutGrid,
} from "lucide-react";

export const PaymentMethodsTab = () => {
  const { paymentMethods, removePaymentMethod } = useWalletStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const bankMethods = paymentMethods.filter((m) => m.type === "bank");
  const ewalletMethods = paymentMethods.filter((m) => m.type === "ewallet");

  return (
    <div className="space-y-6 pb-20">
      {/* Empty State / Intro */}
      {paymentMethods.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 px-6 animate-in fade-in zoom-in duration-500 rounded-2xl bg-gradient-to-br from-white to-primary/5">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-foreground mb-2 text-center">
            Dompet Kamu Masih Kosong
          </h3>
          <p className="text-xs text-muted-foreground text-center max-w-[240px] mb-8 leading-relaxed">
            Mulai simpan akun bank & e-wallet kamu di sini. Lebih praktis buat
            share ke teman!
          </p>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg px-10 shadow-lg shadow-primary/20 w-full sm:w-auto font-bold h-12"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Digital Wallet
          </Button>
        </div>
      )}

      {/* Initialize state if needed */}

      {/* Bank Accounts Section */}
      {bankMethods.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider ml-1">
            Bank Accounts
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {bankMethods.map((method) => (
              <div key={method.id} className="snap-center shrink-0">
                <PaymentMethodCard
                  method={method}
                  onDelete={removePaymentMethod}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E-Wallets Section */}
      {ewalletMethods.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider ml-1">
            E-Wallets
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {ewalletMethods.map((method) => (
              <div key={method.id} className="snap-center shrink-0">
                <PaymentMethodCard
                  method={method}
                  onDelete={removePaymentMethod}
                />
              </div>
            ))}
          </div>
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
                Gabungkan info {paymentMethods.length} akun bank & e-wallet kamu
                jadi satu pesan teks.
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
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Aman & Privat
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Data tersimpan lokal di HP kamu, bukan di server.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <Share2 className="w-5 h-5 text-blue-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Sat Set Share
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Salin & bagikan info rekening dalam sekali klik.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <WifiOff className="w-5 h-5 text-slate-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Mode Offline
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Akses semua data kapan saja tanpa perlu internet.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-primary/5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <LayoutGrid className="w-5 h-5 text-purple-500 mb-1" />
          <h4 className="font-bold text-xs sm:text-sm text-foreground">
            Rapi & Praktis
          </h4>
          <p className="text-[10px] leading-tight text-muted-foreground">
            Semua akun bank & e-wallet jadi satu tempat.
          </p>
        </div>
      </div>

      {/* Floating Action Button for Add (if list not empty) */}
      {paymentMethods.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 pointer-events-none z-40 flex justify-end">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center p-0 pointer-events-auto active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}

      <AddPaymentMethodBottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
};
