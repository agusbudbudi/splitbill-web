"use client";

import React, { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AddPaymentMethodBottomSheet } from "@/components/wallet/AddPaymentMethodBottomSheet";
import { DynamicFinLogo } from "@/components/wallet/DynamicFinLogo";
import { getProviderLogoInfo } from "@/lib/providerLogos";
import { trackChatBill } from "@/lib/gtag";

interface PaymentPickerCardProps {
  isCompleted: boolean;
  selectedPaymentMethodIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  onSkip: () => void;
}

export function PaymentPickerCard({
  isCompleted,
  selectedPaymentMethodIds,
  onConfirm,
  onSkip,
}: PaymentPickerCardProps) {
  const { paymentMethods } = useWalletStore();
  const [selected, setSelected] = useState<string[]>(selectedPaymentMethodIds || []);
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isCompleted) {
    const selectedMethods = paymentMethods.filter((m) =>
      selectedPaymentMethodIds.includes(m.id)
    );

    return (
      <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-bold text-emerald-700">Metode Pembayaran</p>
        </div>
        <div className="px-4 py-3 space-y-1">
          {selectedMethods.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Dilewati (diatur nanti)</p>
          ) : (
            selectedMethods.map((m) => (
              <p key={m.id} className="text-xs font-bold text-foreground">
                💰 {m.providerName} - {m.accountName}
              </p>
            ))
          )}
        </div>
      </div>
    );
  }

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedMethods = paymentMethods.filter((m) => selected.includes(m.id));
    trackChatBill.paymentSaved({
      method_count: selected.length,
      method_names: selectedMethods.map((m) => m.providerName).join(","),
    });
    onConfirm(selected);
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-violet-500/5 border-b border-primary/10 flex items-center justify-between">
        <p className="text-xs font-bold text-primary uppercase tracking-wide">
          Pilih Metode Pembayaran
        </p>
        <button
          type="button"
          onClick={() => {
            trackChatBill.paymentAddClicked();
            setIsAddOpen(true);
          }}
          className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Plus className="w-3 h-3" /> Tambah
        </button>
      </div>

      <div className="p-4 space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-2 space-y-1">
            <p className="text-xs text-muted-foreground">
              Belum ada dompet pembayaran tersimpan.
            </p>
            <p className="text-[10px] text-muted-foreground/80">
              Yuk pilih atau tambahkan metode pembayaran sekarang biar teman-teman tinggal sekali klik untuk transfer! 🚀
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-1">
            {paymentMethods.map((method) => {
              const isSel = selected.includes(method.id);
              const isBank = method.type === "bank";
              const logoInfo = getProviderLogoInfo(method.providerName, isBank ? "bank" : "ewallet");

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleToggle(method.id)}
                  className={cn(
                    "w-full p-3 rounded-sm border text-left flex items-center justify-between transition-all cursor-pointer",
                    isSel
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Logo wrapper */}
                    <div className="h-6 w-14 flex items-center justify-center px-1 shrink-0">
                      {logoInfo.slug ? (
                        <DynamicFinLogo
                          slug={logoInfo.slug}
                          alt={method.providerName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={logoInfo.image}
                          alt={method.providerName}
                          className="h-full w-auto object-contain"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {method.providerName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {method.accountName} {method.accountNumber || method.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {isSel && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              trackChatBill.paymentSkipped();
              onSkip();
            }}
            className="flex-1 h-10 rounded-sm border border-border text-xs font-semibold text-muted-foreground hover:bg-muted/30 transition active:scale-[0.98] cursor-pointer"
          >
            Lewati
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={paymentMethods.length === 0}
            className="flex-1 h-10 rounded-sm bg-primary text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
          >
            Simpan <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AddPaymentMethodBottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onMethodAdded={(id: string) => {
          setSelected((prev) => [...prev, id]);
        }}
      />
    </div>
  );
}
