"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCollectMoneyStore } from "@/store/useCollectMoneyStore";
import { useWalletStore } from "@/store/useWalletStore";
import { trackSplitBill } from "@/lib/gtag";
import { SettlementInstruction } from "@/hooks/useBillCalculations";

interface MonitorStatusButtonProps {
  billId?: string;
  activityName?: string;
  settlementInstructions: SettlementInstruction[];
  selectedPaymentMethodIds: string[];
  disabled?: boolean;
  className?: string;
}

export const MonitorStatusButton: React.FC<MonitorStatusButtonProps> = ({
  billId,
  activityName,
  settlementInstructions,
  selectedPaymentMethodIds,
  disabled = false,
  className,
}) => {
  const router = useRouter();
  const { paymentMethods: storePaymentMethods } = useWalletStore();

  const handleClick = () => {
    if (disabled) return;
    trackSplitBill.monitorStatus(billId);
    const collections = useCollectMoneyStore.getState().collections;

    // 1. If we have a billId, check if it already has a collection
    if (billId) {
      const existingCollection = collections.find((c) => c.sourceId === billId);
      if (existingCollection) {
        useCollectMoneyStore.getState().setActiveCollection(existingCollection.id);
        router.push("/collect-money?autoOpen=true");
        toast.success("Membuka monitor status bayar...");
        return;
      }
    }

    // 2. If no existing collection or no billId (unsaved draft), create new
    if (settlementInstructions.length === 0) {
      toast.success("Semua orang sudah lunas/impas! 🎉");
      return;
    }

    const payers = settlementInstructions.map((inst) => ({
      name: inst.from,
      amount: inst.amount,
      transferTo: inst.to,
    }));

    const finalPaymentMethodIds =
      selectedPaymentMethodIds.length > 0
        ? selectedPaymentMethodIds
        : storePaymentMethods.map((m) => m.id);

    useCollectMoneyStore
      .getState()
      .createCollection(activityName || "Split Bill", payers, finalPaymentMethodIds, billId);

    router.push("/collect-money?autoOpen=true");
    toast.success("Monitoring Patungan dibuat!");
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full h-12 rounded-sm font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-white border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center group cursor-pointer",
        disabled && "opacity-50 blur-[0.5px] pointer-events-none",
        className,
      )}
    >
      <PiggyBank className="w-4 h-4 group-hover:scale-110 transition-transform" />
      Monitor Status Bayar
    </button>
  );
};
