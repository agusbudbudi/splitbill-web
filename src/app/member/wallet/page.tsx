"use client";

import { PaymentMethodsTab } from "@/components/wallet/PaymentMethodsTab";
import { WalletSummaryHero } from "@/components/wallet/WalletSummaryHero";
import { useWalletStore } from "@/store/useWalletStore";

export default function MemberV2WalletPage() {
  const { paymentMethods } = useWalletStore();

  const bankMethods = paymentMethods.filter((m) => m.type === "bank");
  const ewalletMethods = paymentMethods.filter((m) => m.type === "ewallet");

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <WalletSummaryHero
        bankCount={bankMethods.length}
        ewalletCount={ewalletMethods.length}
        noGradient
      />
      <div className="flex-1 w-full flex flex-col">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
          <PaymentMethodsTab />
        </div>
      </div>
    </div>
  );
}
