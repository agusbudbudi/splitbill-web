"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSplitBillChatStore } from "@/store/useSplitBillChatStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useBillCalculations } from "@/hooks/useBillCalculations";
import { splitBillApi, mapFrontendToBackend } from "@/lib/api/split-bills";
import { toast } from "sonner";

export function useSaveChatBill() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const {
    participants,
    expenses,
    additionalExpenses,
    activityName,
    selectedPaymentMethodIds,
    resetChat,
    closeChat,
  } = useSplitBillChatStore();

  const { paymentMethods } = useWalletStore();
  const calculationResult = useBillCalculations({
    people: participants,
    expenses,
    additionalExpenses,
  });

  const handleSaveBill = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const bill = {
        activityName: activityName || "Aktivitas Split Bill",
        people: participants,
        expenses,
        additionalExpenses,
        selectedPaymentMethodIds,
      };

      const payload = mapFrontendToBackend(
        bill,
        calculationResult,
        paymentMethods
      );

      toast.loading("Menyimpan split bill...", { id: "save-chat-bill" });
      const response = await splitBillApi.create(payload);
      const recordId = response.record?.id || response.data?.record?.id || "";

      if (recordId) {
        toast.success("Split bill berhasil disimpan! 🎉", { id: "save-chat-bill" });
        
        // Clear chat & close
        resetChat();
        closeChat();

        // Redirect to detail page
        router.push(`/history/split-bill/${recordId}?new=true`);
      } else {
        toast.error("Gagal mendapatkan ID record dari server.", { id: "save-chat-bill" });
        setIsSaving(false);
      }
    } catch (err: any) {
      console.error("Save chat bill error:", err);
      toast.error(err?.message || "Gagal menyimpan split bill.", { id: "save-chat-bill" });
      setIsSaving(false);
    }
  }, [
    isSaving,
    activityName,
    participants,
    expenses,
    additionalExpenses,
    selectedPaymentMethodIds,
    calculationResult,
    paymentMethods,
    resetChat,
    closeChat,
    router,
  ]);

  return { handleSaveBill, isSaving };
}
