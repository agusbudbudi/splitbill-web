"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { useWalletStore } from "@/store/useWalletStore";
import { Check, CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod as InvoicePaymentMethod } from "@/lib/types/invoice";
import { AddPaymentMethodBottomSheet } from "@/components/wallet/AddPaymentMethodBottomSheet";
import { AddButton } from "@/components/ui/AddButton";
import { FormError } from "@/components/ui/FormError";
import { TextButton } from "@/components/ui/TextButton";

// Icon Mapping (Copied from PaymentMethodCard.tsx)
const BANK_LOGOS: Record<string, { color: string; image: string }> = {
  BCA: { color: "#0066cc", image: "/img/logo-bca.png" },
  Mandiri: { color: "#ffcc00", image: "/img/logo-mandiri.png" },
  BNI: { color: "#ff6600", image: "/img/logo-bni.png" },
  BRI: { color: "#003d7a", image: "/img/logo-bri.png" },
  "CIMB Niaga": { color: "#dc143c", image: "/img/logo.png" },
  Danamon: { color: "#4169e1", image: "/img/logo-danamon.png" },
  Permata: { color: "#228b22", image: "/img/logo-permata.png" },
  BTN: { color: "#ff4500", image: "/img/logo-btn.png" },
  BSI: { color: "#00a39d", image: "/img/logo-bsi.png" },
  BankTransfer: { color: "#666", image: "/img/logo.png" },
};

const EWALLET_LOGOS: Record<string, { color: string; image: string }> = {
  GoPay: { color: "#00aa13", image: "/img/logo-gopay.png" },
  OVO: { color: "#4c2c92", image: "/img/logo-ovo.png" },
  DANA: { color: "#118eea", image: "/img/logo-dana.png" },
  ShopeePay: { color: "#ee4d2d", image: "/img/logo-shopeepay.png" },
  LinkAja: { color: "#e31e24", image: "/img/logo-linkaja.png" },
  Jenius: { color: "#00d4ff", image: "/img/logo-jenius.png" },
};

export function Step4Payment() {
  const { currentInvoice, togglePaymentMethod } = useInvoiceStore();
  const { paymentMethods } = useWalletStore();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const selectedMethods = currentInvoice.paymentMethods || [];

  // Helper to check if a wallet method is selected
  const isSelected = (walletId: string) => {
    return selectedMethods.some((m) => m.id === walletId);
  };

  // Helper to get logo info for display
  const getLogoInfo = (method: any) => {
    const isBank = method.type === "bank";
    return isBank
      ? BANK_LOGOS[method.providerName] || BANK_LOGOS["BankTransfer"]
      : EWALLET_LOGOS[method.providerName] || {
          color: "#666",
          image: "/img/wallet-icon.png",
        };
  };

  // Handle toggle with mapping
  const handleToggle = (walletMethod: any) => {
    const logoInfo = getLogoInfo(walletMethod);

    // Map Wallet PaymentMethod to Invoice PaymentMethod
    const invoiceMethod: InvoicePaymentMethod = {
      id: walletMethod.id,
      name: walletMethod.accountName,
      type: walletMethod.type,
      bankName: walletMethod.providerName,
      accountNumber: walletMethod.accountNumber,
      phone: walletMethod.phoneNumber,
      logo: logoInfo.image, // Store logo URL
    };
    togglePaymentMethod(invoiceMethod);
  };

  const handleMethodAdded = (id: string) => {
    const newMethod = useWalletStore
      .getState()
      .paymentMethods.find((m) => m.id === id);

    if (newMethod) {
      handleToggle(newMethod);
    }
  };

  return (
    <>
      <Card className="p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Select Payment Methods
            </h3>
            <TextButton
              label="Add Wallet"
              icon={Plus}
              onClick={() => setIsAddOpen(true)}
            />
          </div>

          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => {
                const selected = isSelected(method.id);
                const logoInfo = getLogoInfo(method);

                return (
                  <div
                    key={method.id}
                    className={cn(
                      "relative p-3 rounded-lg border transition-all cursor-pointer group",
                      selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-primary/10 bg-white hover:border-primary/30 hover:shadow-sm",
                    )}
                    onClick={() => handleToggle(method)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-sm flex items-center justify-center p-1.5 transition-colors overflow-hidden",
                            selected ? "bg-white" : "bg-muted/30",
                          )}
                        >
                          <img
                            src={logoInfo.image}
                            alt={method.providerName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="text-[10px] font-bold text-muted-foreground hidden group-has-[img[style*='display: none']]:block">
                            {method.providerName.substring(0, 3)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {method.providerName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                            {method.accountName} •{" "}
                            {method.type === "bank"
                              ? method.accountNumber
                              : method.phoneNumber}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center animate-in zoom-in-50">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <EmptyState
                message="Belum ada metode pembayaran tersimpan"
                subtitle="Tambahkan akun bank atau e-wallet agar bisa dipilih."
                icon={CreditCard}
              />
            </div>
          )}

          {paymentMethods.length > 0 && (
            <div className="pt-2 border-t border-dashed border-primary/10">
              <p className="text-[10px] text-muted-foreground text-center italic">
                *Metode pembayaran yang dipilih akan ditampilkan di footer
                invoice.
              </p>
            </div>
          )}
        </div>
      </Card>

      <AddPaymentMethodBottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onMethodAdded={handleMethodAdded}
      />
    </>
  );
}
