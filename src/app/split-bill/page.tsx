"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PeopleList } from "@/components/splitbill/PeopleList";
import { ManualInputForm } from "@/components/splitbill/ManualInputForm";
import { AIScanForm } from "@/components/splitbill/AIScanForm";
import { ExpenseList } from "@/components/splitbill/ExpenseList";
import { AdditionalExpenses } from "@/components/splitbill/AdditionalExpenses";
import { BillSummary } from "@/components/splitbill/BillSummary";
import { ClearDataButton } from "@/components/splitbill/ClearDataButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useBillCalculations } from "@/hooks/useBillCalculations";
import { WalletSelectionCard } from "@/components/wallet/WalletSelectionCard";
import { AddPaymentMethodBottomSheet } from "@/components/wallet/AddPaymentMethodBottomSheet";
import {
  Users,
  ReceiptText,
  PenLine,
  CheckSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ClipboardList,
  Rocket,
  Download,
  CheckCircle2,
  FileCheck,
  Home,
  History as HistoryIcon,
} from "lucide-react";
import { SuccessSection } from "@/components/ui/SuccessSection";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import confetti from "canvas-confetti";
import { suggestEmoji } from "@/lib/emojiUtils";

const SplitBillContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1");
  const {
    people,
    expenses,
    additionalExpenses,
    activityName,
    setActivityName,
    selectedPaymentMethodIds,
    setSelectedPaymentMethodIds,
    togglePaymentMethodSelection,
    resetStore,
    clearDraftAfterFinalize,
  } = useSplitBillStore();
  const { paymentMethods, saveBill } = useWalletStore();
  const { totalSpent } = useBillCalculations();

  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize from search params to handle back navigation
  const [isSaved, setIsSaved] = useState(searchParams.get("saved") === "true");
  const [lastSavedId, setLastSavedId] = useState<string | null>(
    searchParams.get("id"),
  );

  const handleFinalize = () => {
    const id =
      (saveBill({
        activityName: activityName || "Aktivitas Split Bill",
        totalAmount: totalSpent,
        people,
        expenses,
        additionalExpenses,
        selectedPaymentMethodIds,
      }) as unknown as string) || "";
    setLastSavedId(id);
    setIsSaved(true);
    clearDraftAfterFinalize();
    setShowFinalizeModal(false);

    // Update current URL to include saved=true so back navigation shows the success card
    router.replace(`/split-bill?step=4&saved=true&id=${id}`);

    // Navigate to detail page
    router.push(`/history/split-bill/${id}`);

    // Celeberation Effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#7c3aed", "#a78bfa", "#ddd6fe"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#7c3aed", "#a78bfa", "#ddd6fe"],
      });
    }, 250);
  };

  const nextStep = () => {
    if (step === 2) {
      const unassignedItems = expenses.filter(
        (e) => e.who.length === 0 || !e.paidBy,
      );
      if (unassignedItems.length > 0) {
        setValidationError(
          "Beberapa item belum di-assign 'Split dengan' atau 'Dibayar oleh'. Tolong lengkapi dulu ya!",
        );
        return;
      }
    }
    setValidationError(null);
    router.push(`/split-bill?step=${step + 1}`);
  };

  const prevStep = () => {
    if (step > 1) {
      router.push(`/split-bill?step=${step - 1}`);
    } else {
      router.push("/");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Siapa aja nih? 👥</h2>
              <p className="text-muted-foreground text-sm">
                Tambahkan teman-teman yang ikut patungan.
              </p>
            </div>
            <PeopleList />
            <ClearDataButton />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Input Pengeluaran 📊</h2>
              <p className="text-muted-foreground text-sm">
                Scan struk pake AI atau input manual satu-satu.
              </p>
            </div>

            <Card className="border-primary/20 shadow-md">
              <CardContent className="p-1 sm:p-2">
                <SegmentedControl
                  options={[
                    {
                      id: "ai",
                      label: "Scan AI",
                      icon: Sparkles,
                      badge: "New",
                    },
                    { id: "manual", label: "Manual", icon: ClipboardList },
                  ]}
                  activeId={activeTab}
                  onChange={(id) => setActiveTab(id as any)}
                  className="mb-4"
                />

                <div className="px-4 pb-4">
                  {activeTab === "manual" ? (
                    <ManualInputForm />
                  ) : (
                    <AIScanForm />
                  )}
                </div>
              </CardContent>
            </Card>

            <ExpenseList />
            <AdditionalExpenses />
            <ClearDataButton />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Detail Aktivitas ✈️</h2>
              <p className="text-muted-foreground text-sm">
                Nama kegiatannya apa & mau dibayar kemana?
              </p>
            </div>

            <Card className="border-primary/20 shadow-md">
              <CardContent className="p-4 space-y-2">
                <label className="text-sm font-bold flex items-center gap-1.5 px-1">
                  BTW habis jalan kemana nih? ✈️
                </label>
                <Input
                  placeholder="Contoh: Makan Ramen, Liburan Bali"
                  value={activityName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const emoji = suggestEmoji(newValue);

                    if (emoji && !newValue.includes(emoji)) {
                      // Check if it already starts with another emoji from our map
                      const hasEmoji = /^\p{Emoji}/u.test(newValue);
                      if (!hasEmoji) {
                        setActivityName(`${emoji} ${newValue}`);
                        return;
                      }
                    }
                    setActivityName(newValue);
                  }}
                  className="bg-white border-primary/10 h-12"
                />
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-md">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-bold flex items-center gap-2">
                    Metode Pembayaran 📥
                  </label>
                  {selectedPaymentMethodIds.length > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {selectedPaymentMethodIds.length} Terpilih
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                  <Card
                    onClick={() => setIsAddWalletOpen(true)}
                    className="shrink-0 w-20 h-20 rounded-lg border-1 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 text-primary/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95 cursor-pointer bg-white"
                  >
                    <Plus className="w-5 h-5" />
                  </Card>

                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method: any) => (
                      <WalletSelectionCard
                        key={method.id}
                        method={method}
                        isSelected={selectedPaymentMethodIds.includes(
                          method.id,
                        )}
                        onClick={() => togglePaymentMethodSelection(method.id)}
                      />
                    ))
                  ) : (
                    <Card className="flex-1 flex items-center justify-center h-20 rounded-lg bg-muted/5 border border-dashed border-muted-foreground/10 px-4 text-center">
                      <p className="text-[9px] text-muted-foreground leading-tight">
                        Belum ada dompet tersimpan. Klik + buat tambah.
                      </p>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            <AddPaymentMethodBottomSheet
              isOpen={isAddWalletOpen}
              onClose={() => setIsAddWalletOpen(false)}
              onMethodAdded={(id: string) => {
                if (!selectedPaymentMethodIds.includes(id)) {
                  setSelectedPaymentMethodIds([
                    ...selectedPaymentMethodIds,
                    id,
                  ]);
                }
              }}
            />
          </div>
        );
      case 4:
        if (isSaved) {
          return (
            <SuccessSection
              title="Split Bill Berhasil Disimpan! 🎉"
              subtitle="Data split bill kamu sudah aman tersimpan di riwayat."
              icon={FileCheck}
              actions={[
                {
                  label: "Lihat History",
                  onClick: () =>
                    router.push(`/history/split-bill/${lastSavedId}`),
                  variant: "outline",
                  icon: HistoryIcon,
                },
                {
                  label: "Kembali ke Beranda",
                  onClick: () => router.push("/"),
                  variant: "default",
                  icon: Home,
                },
              ]}
            />
          );
        }
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Beres! 💸</h2>
              <p className="text-muted-foreground text-sm">
                Ini rincian siapa bayar ke siapa.
              </p>
            </div>
            <BillSummary showDownload={false} />
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full h-14 font-bold rounded-2xl border-primary/20 text-primary shadow-none hover:shadow-none hover:bg-primary/5 transition-all"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const steps = [
    { id: 1, label: "Teman", icon: Users },
    { id: 2, label: "Bil", icon: ReceiptText },
    { id: 3, label: "Detail", icon: PenLine },
    { id: 4, label: "Hasil", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <Header
        title="Split Bill"
        showBackButton
        onBack={prevStep}
        className="pb-10 rounded-b-xl shadow-lg shadow-primary/20"
      >
        {/* Stepper Inside Header */}
        <div className="flex justify-between items-center px-8 relative">
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-white/20 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-12 right-12 h-0.5 -translate-y-1/2 z-0 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "relative z-10 w-8 h-8 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2",
                step === s.id
                  ? "bg-white border-white scale-110 shadow-lg shadow-black/10"
                  : step > s.id
                    ? "bg-white border-white"
                    : "bg-primary border-white/40 text-white/40",
              )}
            >
              <s.icon
                className={cn(
                  "w-4 h-4 font-bold transition-colors duration-500",
                  step >= s.id ? "text-primary" : "text-white/40",
                )}
              />

              <span
                className={cn(
                  "absolute -bottom-5 text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap transition-colors duration-500",
                  step === s.id
                    ? "text-white opacity-100"
                    : "text-white/40 opacity-50",
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Header>

      <main className="w-full max-w-[480px] px-4 pt-10 pb-40 space-y-8 relative z-10">
        {renderStep()}
      </main>

      {/* Sticky CTA Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div className="w-full max-w-[480px] relative pointer-events-auto flex flex-col">
          {/* Solid background area for the actions */}
          <div className="bg-background px-4 pb-10 flex flex-col gap-3">
            {step === 1 && (
              <>
                {people.length < 2 && (
                  <InfoBanner
                    message="Tambahkan minimal 2 orang dulu ya untuk lanjut."
                    variant="blue"
                  />
                )}
                <Button
                  onClick={nextStep}
                  disabled={people.length < 2}
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 bg-primary text-white !disabled:opacity-100 disabled:bg-[#ede9fe] disabled:text-primary/40 disabled:shadow-none transition-all duration-300"
                >
                  Lanjutkan <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                {validationError && (
                  <InfoBanner message={validationError} variant="blue" />
                )}
                {expenses.length === 0 && (
                  <InfoBanner
                    message="Isi detail transaksinya dulu ya kak!"
                    variant="blue"
                  />
                )}
                <Button
                  onClick={nextStep}
                  disabled={expenses.length === 0}
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 bg-primary text-white !disabled:opacity-100 disabled:bg-[#ede9fe] disabled:text-primary/40 disabled:shadow-none transition-all duration-300"
                >
                  Lanjutkan <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </>
            )}

            {step === 3 && (
              <Button
                onClick={nextStep}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-all"
              >
                <Rocket className="mr-2 w-5 h-5" /> Hitung Split Bill
              </Button>
            )}

            {step === 4 && !isSaved && (
              <Button
                onClick={() => setShowFinalizeModal(true)}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-all"
              >
                <CheckCircle2 className="mr-2 w-5 h-5" /> Selesaikan & Simpan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Finalize Modal */}
      <ConfirmationModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleFinalize}
        title="Simpan ke Riwayat"
        description="Kamu yakin ingin menyelesaikan split bill ini? Data yang disimpan akan muncul di riwayat transaksi kamu."
        icon={CheckCircle2}
        confirmText="Ya, Simpan"
        cancelText="Batal"
      />
    </div>
  );
};

export default function SplitBillPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SplitBillContent />
    </Suspense>
  );
}
