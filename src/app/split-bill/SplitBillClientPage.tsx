"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PeopleList } from "@/components/splitbill/PeopleList";
import { ManualInputForm } from "@/components/splitbill/ManualInputForm";
import { AIScanForm } from "@/components/splitbill/AIScanForm";
import { AIScanPromoBanner } from "@/components/splitbill/AIScanPromoBanner";
import { ExpenseList } from "@/components/splitbill/ExpenseList";
import { AdditionalExpenses } from "@/components/splitbill/AdditionalExpenses";
import { BillSummary } from "@/components/splitbill/BillSummary";
import { SaveBillNudge } from "@/components/splitbill/SaveBillNudge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useSplitLaterStore } from "@/store/useSplitLaterStore";
import { useWalletStore, type PaymentMethod } from "@/store/useWalletStore";
import { useBillCalculations } from "@/hooks/useBillCalculations";
import { WalletSelectionCard } from "@/components/wallet/WalletSelectionCard";
import { AddPaymentMethodBottomSheet } from "@/components/wallet/AddPaymentMethodBottomSheet";
import { draftApi, splitBillApi, mapFrontendToBackend } from "@/lib/api/split-bills";
import {
  Users,
  ReceiptText,
  PenLine,
  CheckSquare,
  Plus,
  ChevronRight,
  Sparkles,
  ClipboardList,
  Rocket,
  CheckCircle2,
  FileCheck,
  Home,
  History as HistoryIcon,
  RotateCcw,
} from "lucide-react";
import { SuccessSection } from "@/components/ui/SuccessSection";
import { cn, formatToIDR } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import confetti from "canvas-confetti";
import { suggestEmoji } from "@/lib/emojiUtils";
import { toast } from "sonner";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import {
  TutorialOverlay,
  TutorialStep,
} from "@/components/onboarding/TutorialOverlay";
import { useAuthStore } from "@/lib/stores/authStore";
import { trackSplitBill, trackSocial, trackWallet, trackAuth } from "@/lib/gtag";
import { AuthModal } from "@/components/auth/AuthModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useUIStore } from "@/lib/stores/uiStore";

const SplitBillContent = () => {
  const router = useRouter();
  const pathname = usePathname();
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
    clearDraftAfterFinalize,
    setPeople,
    setSource,
    clearSource,
    sourceBucketId,
    sourceReceiptId,
  } = useSplitBillStore();

  useEffect(() => {
    const source = searchParams.get("source");
    const bucketId = searchParams.get("bucketId");
    const receiptId = searchParams.get("receiptId");
    const participantsJson = searchParams.get("participants");

    if (source === "split-later" && bucketId && receiptId) {
      setSource(bucketId, receiptId);

      if (participantsJson) {
        try {
          const parsed = JSON.parse(decodeURIComponent(participantsJson));
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPeople(parsed);
          }
        } catch (e) {
          console.error("Failed to parse participants from searchParams", e);
        }
      }
    } else {
      // Clear any stale sourceBucketId from a previous split-later session
      // stored in localStorage, so back navigation goes to "/" instead of the old bucket
      clearSource();
    }
  }, [searchParams]);

  const unassignedCount = expenses.filter(
    (e) => e.who.length === 0 || !e.paidBy,
  ).length;
  const unassignedAdxCount = additionalExpenses.filter(
    (e) => e.who.length === 0 || !e.paidBy,
  ).length;

  const { paymentMethods, saveBill } = useWalletStore();
  const calculationResult = useBillCalculations();
  const { totalSpent } = calculationResult;

  const [activeTab, setActiveTab] = useState<"ai" | "manual">("manual");
  const [isAIBannerDismissed, setIsAIBannerDismissed] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAIScanAuthModal, setShowAIScanAuthModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const isFinalizingRef = useRef(false);
  const isCreatingDraftRef = useRef(false);

  const hasSeenTutorial = useOnboardingStore((state) => state.hasSeenTutorial);
  const setHasSeenTutorial = useOnboardingStore(
    (state) => state.setHasSeenTutorial,
  );
  const _hasHydrated = useOnboardingStore((state) => state._hasHydrated);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (step === 1) {
      trackSplitBill.start();
    }
    if (step === 2) {
      trackSplitBill.inputMethod(activeTab);
    }
    if (step === 3 && activityName) {
      trackSplitBill.autofillView(activityName);
    }
  }, [step]);

  useEffect(() => {
    if (
      _hasHydrated &&
      !hasSeenTutorial &&
      step === 1 &&
      !hasTriggeredRef.current
    ) {
      const timer = setTimeout(() => {
        // Triple check latest state to be absolutely sure
        if (!useOnboardingStore.getState().hasSeenTutorial) {
          setIsTutorialOpen(true);
          hasTriggeredRef.current = true;
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [_hasHydrated, hasSeenTutorial, step]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "step-people",
      targetId: "onboarding-people-list",
      title: "Tambah Teman 👥",
      content:
        "Pertama, tambahin dulu temen-temen yang mau diajak patungan. Bisa ketik manual atau pilih dari Besties Gua!",
      position: "bottom",
    },
    {
      id: "step-input",
      targetId: "onboarding-input-method",
      title: "Input Pengeluaran 📊",
      content:
        "Pake AI Scan biar nggak capek ketik satu-satu! Tinggal foto struknya, AI yang bakal beresin sisanya. ✨",
      position: "bottom",
    },
    {
      id: "step-payment",
      targetId: "onboarding-payment-methods",
      title: "Metode Pembayaran 📥",
      content:
        "Pilih kemana temen kamu harus bayar patungannya. Bisa pilih lebih dari satu lho!",
      position: "top",
    },
  ];

  const handleTutorialStepChange = (index: number) => {
    // index 0 -> step 1 (People)
    // index 1 -> step 2 (Input)
    // index 2 -> step 3 (Payment)
    const targetAppStep = index + 1;
    if (step !== targetAppStep) {
      router.push(`/split-bill?step=${targetAppStep}`);
    }
  };

  const completeTutorial = () => {
    setIsTutorialOpen(false);
    setHasSeenTutorial(true);
    trackSocial.tutorialComplete();
    // Reset back to Step 1 so user can start from the beginning
    router.push("/split-bill?step=1");
    toast.success("Keren! Sekarang kamu udah siap buat Split Bill kilat! 🚀");
  };

  // Initialize from search params to handle back navigation
  const [isSaved, setIsSaved] = useState(searchParams.get("saved") === "true");
  const [lastSavedId, setLastSavedId] = useState<string | null>(
    searchParams.get("id"),
  );

  const { isAuthenticated } = useAuthStore();
  const { isPWABannerVisible } = useUIStore();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "ai" || tabParam === "manual") {
      setActiveTab(tabParam);
    } else {
      setActiveTab(isAuthenticated ? "ai" : "manual");
    }
  }, [isAuthenticated, searchParams]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
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

  const handleFinalize = async () => {
    if (isFinalizingRef.current) return;

    if (!isAuthenticated) {
      setShowFinalizeModal(false);
      setShowAuthModal(true);
      return;
    }

    try {
      isFinalizingRef.current = true;
      setIsFinalizing(true);

      const { draftId, clearDraftId } = useSplitBillStore.getState();
      let recordId = "";

      if (draftId) {
        try {
          // If there's a draft, finalize it via backend draft finalize endpoint
          const response = await draftApi.finalize(draftId);
          recordId = response.record.id;
        } catch (finalizeErr: unknown) {
          const status =
            (finalizeErr as { status?: number })?.status ??
            (finalizeErr as { response?: { status?: number } })?.response?.status;
          const message = (finalizeErr as { message?: string })?.message ?? "";
          if (status === 403 || /tidak memiliki akses/i.test(message)) {
            // Stale draftId from a different user/session (e.g. a guest draft
            // created before login) — discard it and create a fresh record
            // directly so the user's work is not lost.
            console.warn("Finalize ownership conflict: stale draftId, falling back to direct create.");
            clearDraftId();
          } else {
            throw finalizeErr;
          }
        }
      }

      if (!recordId) {
        // Fallback: direct creation (no draft, or draft ownership conflict above)
        const payload = mapFrontendToBackend(
          {
            activityName: activityName || "Aktivitas Split Bill",
            totalAmount: totalSpent,
            people,
            expenses,
            additionalExpenses,
            selectedPaymentMethodIds,
          },
          calculationResult,
          paymentMethods
        );
        const response = await splitBillApi.create(payload);
        recordId = response.record?.id || response.data?.record?.id || "";
      }

      setLastSavedId(recordId);
      setIsSaved(true);

      const bucketIdToRedirect = sourceBucketId;
      if (bucketIdToRedirect && sourceReceiptId) {
        useSplitLaterStore.getState().markReceiptCompleted(
          sourceReceiptId,
          recordId,
          activityName || "Struk Belanja",
          totalSpent
        );
      }

      clearDraftAfterFinalize();
      trackSplitBill.save({
        total_amount: totalSpent,
        num_participants: people.length,
        num_items: expenses.length + additionalExpenses.length,
        activity_name: activityName || "Aktivitas Split Bill",
      });
      setShowFinalizeModal(false);

      // 1. Update current URL to include saved=true so back navigation shows the success card
      router.replace(`/split-bill?step=4&saved=true&id=${recordId}`);

      // 2. Navigate to detail page with new=true or back to bucket
      setTimeout(() => {
        if (bucketIdToRedirect) {
          router.push(`/split-later/${bucketIdToRedirect}`);
        } else {
          router.push(`/history/split-bill/${recordId}?new=true`);
        }
      }, 100);

      // Celeberation Effect
      triggerConfetti();
    } catch (e: any) {
      console.error("Failed to finalize split bill:", e);
      toast.error("Gagal menyimpan split bill: " + (e.message || "Terjadi kesalahan"));
    } finally {
      setIsFinalizing(false);
    }
  };

  // Auto-finalize after login
  useEffect(() => {
    const finalizeParam = searchParams.get("finalize") === "true";
    if (
      finalizeParam &&
      isAuthenticated &&
      step === 4 &&
      !isSaved &&
      !isFinalizingRef.current
    ) {
      handleFinalize();
    }
  }, [isAuthenticated, searchParams, step, isSaved]);

  const nextStep = async () => {
    if (step === 1 && people.length < 2) {
      const errorMsg =
        "Waduh, minimal harus ada 2 orang buat Split Bill nih! 👥";
      toast.error(errorMsg);
      trackSplitBill.validationError(step, errorMsg);
      return;
    }
    if (step === 2) {
      const unassignedItems = expenses.filter(
        (e) => e.who.length === 0 || !e.paidBy,
      );
      if (unassignedItems.length > 0) {
        const errorMsg =
          "Beberapa item belum di-assign 'Split dengan' atau 'Dibayar oleh'. Tolong lengkapi dulu ya!";
        setValidationError(errorMsg);
        trackSplitBill.validationError(step, errorMsg);
        return;
      }
    }

    // Save/update draft function (with 403 ownership-conflict retry)
    const saveDraft = async (isRetry = false) => {
      try {
        const { draftId, setDraftId, clearDraftId } = useSplitBillStore.getState();
        const backendParticipants = people.map(p => ({ id: p, name: p }));

        if (step === 1) {
          // Create draft if not exists, or update if exists
          if (!draftId) {
            if (isCreatingDraftRef.current) return;
            isCreatingDraftRef.current = true;
            try {
              const response = await draftApi.create({
                participants: backendParticipants,
              });
              if (response.success && response.draft?.id) {
                setDraftId(response.draft.id);
              }
            } finally {
              isCreatingDraftRef.current = false;
            }
          } else {
            await draftApi.update(draftId, {
              last_step: "STEP_1",
              participants: backendParticipants,
            });
          }
        } else if (step === 2) {
          let activeDraftId = draftId;
          if (!activeDraftId) {
            if (isCreatingDraftRef.current) return;
            isCreatingDraftRef.current = true;
            try {
              const response = await draftApi.create({
                participants: backendParticipants,
              });
              if (response.success && response.draft?.id) {
                activeDraftId = response.draft.id;
                setDraftId(activeDraftId);
              }
            } finally {
              isCreatingDraftRef.current = false;
            }
          }

          if (activeDraftId) {
            // Prepare backend format for expenses
            const backendExpenses = expenses.map(exp => ({
              id: exp.id,
              description: exp.item,
              amount: exp.amount,
              paidBy: exp.paidBy,
              participants: exp.who,
              createdAt: Date.now(),
            }));
            const backendAdditionalExpenses = additionalExpenses.map(adx => ({
              id: adx.id,
              description: adx.name,
              amount: adx.amount,
              paidBy: adx.paidBy,
              participants: adx.who,
              splitType: adx.splitType,
              createdAt: Date.now(),
            }));
            await draftApi.update(activeDraftId, {
              last_step: "STEP_2",
              expenses: backendExpenses,
              additionalExpenses: backendAdditionalExpenses,
              participants: backendParticipants,
            });
          }
        } else if (step === 3) {
          let activeDraftId = draftId;
          if (!activeDraftId) {
            if (isCreatingDraftRef.current) return;
            isCreatingDraftRef.current = true;
            try {
              const response = await draftApi.create({
                participants: backendParticipants,
              });
              if (response.success && response.draft?.id) {
                activeDraftId = response.draft.id;
                setDraftId(activeDraftId);
              }
            } finally {
              isCreatingDraftRef.current = false;
            }
          }

          if (activeDraftId) {
            // Fully serialize draft using mapFrontendToBackend mapping logic
            const payload = mapFrontendToBackend(
              {
                activityName: activityName || "Aktivitas Split Bill",
                totalAmount: totalSpent,
                people,
                expenses,
                additionalExpenses,
                selectedPaymentMethodIds,
              },
              calculationResult,
              paymentMethods
            );

            await draftApi.update(activeDraftId, {
              last_step: "STEP_3",
              activityName: payload.activityName,
              occurredAt: payload.occurredAt,
              participants: payload.participants,
              expenses: payload.expenses,
              additionalExpenses: payload.additionalExpenses,
              paymentMethodIds: payload.paymentMethodIds,
              paymentMethodSnapshots: payload.paymentMethodSnapshots,
              summary: payload.summary,
            });
          }
        }
      } catch (err: unknown) {
        // Ownership conflict: a guest draft created before login can't be
        // updated once authenticated. Match on 403 OR the backend message
        // (status code may vary), clear the stale draftId, and retry once –
        // a fresh draft is then created under the current user.
        const status = (err as { status?: number })?.status ?? (err as { response?: { status?: number } })?.response?.status;
        const message = (err as { message?: string })?.message ?? "";
        const isOwnershipConflict =
          status === 403 || /tidak memiliki akses/i.test(message);
        if (isOwnershipConflict && !isRetry) {
          console.warn("Draft ownership conflict – clearing stale draftId and retrying.");
          useSplitBillStore.getState().clearDraftId();
          return saveDraft(true);
        }
        console.error("Failed to save draft:", err);
        throw err;
      }
    };

    if (step === 3) {
      setIsCalculating(true);
      try {
        await saveDraft();
        toast.success("Split Bill Berhasil Dihitung! 💸✨", {
          description: "Yuk cek rincian pembayarannya.",
          duration: 3000,
        });
        triggerConfetti();
        trackSplitBill.calculate({
          total_amount: totalSpent,
          num_participants: people.length,
        });
        if (activityName) {
          trackSplitBill.autofillView(activityName);
        }
      } catch (err) {
        toast.error("Gagal menyimpan detail split bill. Silakan coba lagi.");
        setIsCalculating(false);
        return; // Stop execution, do not proceed to step 4
      } finally {
        setIsCalculating(false);
      }
    } else {
      // Run the background task without awaiting it for other steps
      saveDraft();
    }

    setValidationError(null);
    const nextStepNum = step + 1;
    const stepNames = ["", "Teman", "Bil", "Detail", "Hasil"];
    trackSplitBill.stepComplete(nextStepNum, stepNames[nextStepNum] || "");
    router.replace(`/split-bill?step=${nextStepNum}`);
  };

  const prevStep = () => {
    if (step > 1) {
      router.replace(`/split-bill?step=${step - 1}`);
    } else {
      if (sourceBucketId) {
        router.push(`/split-later/${sourceBucketId}`);
      } else {
        router.back();
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold">Siapa aja nih? 👥</h2>
              <p className="text-muted-foreground text-sm max-w-[360px]">
                Tambahkan minimal 2 orang untuk mulai split bill.
              </p>
            </div>

            <PeopleList />
          </div>
        );
      case 2:
        const subtotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold">Input Pengeluaran 📊</h2>
              <p className="text-muted-foreground text-sm max-w-[360px]">
                Scan struk pake AI biar cepet, atau input manual satu-satu.
              </p>
            </div>

            {people.length < 2 && (
              <Card
                onClick={prevStep}
                className="border-amber-200 bg-amber-50/50 cursor-pointer hover:bg-amber-100/50 transition-colors animate-in fade-in zoom-in-95 duration-300"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">
                      Waduh, belum ada teman nih! 👥
                    </h4>
                    <p className="text-xs text-amber-700/70 mt-0.5">
                      Tap di sini buat tambahin teman yang mau diajak patungan
                      dulu ya.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-xl bg-white backdrop-blur-xs shadow-soft text-card-foreground shadow-soft">
              <CardContent className="p-1 sm:p-2">
                <SegmentedControl
                  id="onboarding-input-method"
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
                  onChange={(id) => {
                    const method = id as "ai" | "manual";
                    setActiveTab(method);
                    if (method === "ai") {
                      setIsAIBannerDismissed(true);
                    }
                    trackSplitBill.inputMethod(method);
                  }}
                  className="mb-3"
                />

                {activeTab === "manual" && !isAuthenticated && !isAIBannerDismissed && (
                  <div className="px-4 pb-4">
                    <AIScanPromoBanner
                      onDismiss={() => setIsAIBannerDismissed(true)}
                      onLoginClick={() => setShowAIScanAuthModal(true)}
                    />
                  </div>
                )}

                <div className="px-4 pb-4">
                  {activeTab === "manual" ? (
                    <ManualInputForm />
                  ) : (
                    <AIScanForm onLoginClick={() => setShowAIScanAuthModal(true)} />
                  )}
                </div>
              </CardContent>
            </Card>

            <ExpenseList />
            <AdditionalExpenses />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Bill Quick View - Realistic Ticket Style */}
            <div className="relative group">
              <div
                className="bg-white border-x border-primary/10 p-8 pt-6 pb-14 relative"
                style={{
                  filter: "drop-shadow(0 10px 15px -3px rgba(0, 0, 0, 0.05))",
                  maskImage:
                    "linear-gradient(to bottom, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 85%, transparent 100%)",
                }}
              >
                {/* Ticket Punch Notches (Sides) */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-background border border-primary/10 rounded-full z-10 -translate-y-1/2 shadow-inner" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-background border border-primary/10 rounded-full z-10 -translate-y-1/2 shadow-inner" />

                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:12px_12px]" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest">
                      Estimasi Tagihan
                    </p>
                    <h3 className="text-3xl font-black text-primary/90 tracking-tighter">
                      {formatToIDR(totalSpent)}
                    </h3>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <p className="text-[9px] font-bold text-amber-600/80 uppercase tracking-tight">
                        Menunggu Detail Aktivitas...
                      </p>
                    </div>
                  </div>

                  <div className="flex -space-x-2 items-center">
                    {people.slice(0, 4).map((name, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white shadow-md ring-1 ring-primary/5"
                      >
                        <img
                          src={`https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${encodeURIComponent(name)}&size=120`}
                          alt={name}
                        />
                      </div>
                    ))}
                    {people.length > 4 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shadow-md ring-1 ring-primary/5">
                        +{people.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lock Indicator Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-2 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-primary/10 rounded-full shadow-lg shadow-primary/5 ">
                  <span className="text-xs font-bold text-primary">
                    Selesaikan Detail di Bawah ✨
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-1 pt-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Langkah Terakhir! 🚀
              </h2>
              <p className="text-muted-foreground text-sm">
                Nama kegiatannya apa & mau dibayar kemana?
              </p>
            </div>

            <Card className="border-primary/10 shadow-soft">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <PenLine className="w-4 h-4 text-primary" />
                  <label className="text-sm font-bold text-foreground">
                    BTW habis jalan kemana nih? ✈️
                  </label>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Contoh: Makan Ramen, Liburan Bali"
                    value={activityName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const emoji = suggestEmoji(newValue);

                      if (emoji && !newValue.includes(emoji)) {
                        const hasEmoji = /^\p{Emoji}/u.test(newValue);
                        if (!hasEmoji) {
                          setActivityName(`${emoji} ${newValue}`);
                          return;
                        }
                      }
                      setActivityName(newValue);
                    }}
                    className="bg-white border-primary/10 h-12 text-sm font-bold px-4 focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { name: "Makan Bareng", emoji: "🍱" },
                    { name: "Liburan", emoji: "✈️" },
                    { name: "Patungan Kado", emoji: "🎁" },
                    { name: "Tagihan", emoji: "🏠" },
                    { name: "Belanja", emoji: "🛒" },
                  ].map((pick) => (
                    <button
                      key={pick.name}
                      onClick={() => {
                        setActivityName(`${pick.emoji} ${pick.name}`);
                        trackSplitBill.quickPickActivity(pick.name);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 cursor-pointer",
                        activityName === `${pick.emoji} ${pick.name}`
                          ? "bg-primary text-white shadow-sm"
                          : "bg-primary/5 text-primary/70 hover:bg-primary/10 border border-primary/10",
                      )}
                    >
                      <span>{pick.emoji}</span>
                      <span>{pick.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-soft">
              <CardContent
                id="onboarding-payment-methods"
                className="p-5 space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-bold flex items-center gap-2">
                    Bayar Kemana? 📥
                  </label>
                  {selectedPaymentMethodIds.length > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {selectedPaymentMethodIds.length} Terpilih
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground px-1 -mt-2 leading-relaxed">
                  Pilih dompet kamu biar temen gampang bayarnya.
                </p>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                  <Card
                    onClick={() => {
                      setIsAddWalletOpen(true);
                      trackWallet.addMethodInitiate();
                    }}
                    className="shrink-0 w-20 h-20 rounded-lg border-1 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 text-primary/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95 cursor-pointer bg-white shadow-none"
                  >
                    <Plus className="w-5 h-5" />
                  </Card>

                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method: PaymentMethod) => (
                      <WalletSelectionCard
                        key={method.id}
                        method={method}
                        isSelected={selectedPaymentMethodIds.includes(
                          method.id,
                        )}
                        onClick={() => {
                          const isSelected = !selectedPaymentMethodIds.includes(
                            method.id,
                          );
                          togglePaymentMethodSelection(method.id);
                          trackWallet.selectPaymentMethod(
                            method.id,
                            isSelected,
                          );
                        }}
                      />
                    ))
                  ) : (
                    <Card className="flex-1 flex items-center justify-center h-20 rounded-lg bg-muted/5 border border-dashed border-muted-foreground/10 px-4 text-center shadow-none">
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Belum ada dompet tersimpan. <br />
                        <span
                          onClick={() => {
                            setIsAddWalletOpen(true);
                            trackWallet.addMethodInitiate();
                          }}
                          className="font-bold underline cursor-pointer"
                        >
                          Tambah yuk!
                        </span>
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
                    router.push(`/history/split-bill/${lastSavedId}?new=true`),
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

            {expenses.length === 0 ? (
              <EmptyState
                icon={ReceiptText}
                message="Belum Ada Item 📝"
                subtitle="Wah, item belanjanya masih kosong nih. Yuk isi dulu biar bisa di-split!"
                action={
                  <Button
                    onClick={() => router.push("/split-bill?step=1")}
                    variant="outline"
                    className="h-12 px-8 font-bold rounded-md border-primary/20 text-primary shadow-none hover:shadow-none hover:bg-primary/5 transition-all"
                  >
                    Tambah Item & Teman
                  </Button>
                }
              />
            ) : (
              <>
                {!isSaved && (
                  <SaveBillNudge
                    onSave={() => {
                      trackSplitBill.finalizeModalView();
                      setShowFinalizeModal(true);
                    }}
                    className="animate-in slide-in-from-top-4 duration-700"
                  />
                )}

                <BillSummary showDownload={false} />

                <div className="flex flex-col items-center gap-3 pt-4">
                  <Button
                    onClick={() => {
                      trackSplitBill.restart();
                      router.push("/split-bill?step=1");
                    }}
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary font-bold text-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Mulai Ulang Split Bill
                  </Button>
                </div>
              </>
            )}
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
        sticky={true}
        className="rounded-b-none shadow-none"
        rightContent={
          <button
            onClick={() => router.push(isAuthenticated ? "/member" : "/")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isAuthenticated ? "Ke Beranda Member" : "Ke Landing Page"}
          >
            <Home className="w-5 h-5 text-white" />
          </button>
        }
      />

      {/* Sticky Stepper Row */}
      {!isSaved && (
        <div className="w-full flex flex-col items-center -mt-px relative z-20">
          <div className="w-full max-w-[600px] bg-primary flex justify-between items-center px-8 pt-2 pb-8 rounded-b-2xl shadow-lg shadow-primary/20 relative">
            <div className="absolute top-[32%] left-12 right-16 h-0.5 bg-white/20 z-0" />
            <div className="absolute top-[32%] left-12 right-16 h-0.5 z-0 overflow-hidden">
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
        </div>
      )}

      <main className="w-full max-w-[600px] px-4 pt-8 pb-8 space-y-8 relative z-10">
        {renderStep()}
      </main>

      {/* Sticky CTA Footer */}
      <div className="sticky bottom-0 w-full z-50 pointer-events-none flex justify-center mt-auto">
        <div className="w-full max-w-[600px] relative pointer-events-auto flex flex-col">
          {/* Solid background area for the actions */}
          <div className="bg-background px-4 pb-4 pb-safe flex flex-col gap-3">
            {step === 1 && (
              <Button
                onClick={nextStep}
                className={cn(
                  "w-full h-14 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 active:scale-95",
                  people.length >= 2
                    ? "bg-primary text-white shadow-primary/20"
                    : "bg-primary/10 text-primary shadow-none opacity-80",
                )}
              >
                {people.length < 2
                  ? `Tambah ${2 - people.length} Orang Lagi`
                  : "Lanjut ke Input Pengeluaran"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            )}

            {step === 2 && (
              <>
                {validationError && (
                  <InfoBanner message={validationError} variant="blue" />
                )}

                <Button
                  onClick={nextStep}
                  disabled={expenses.length === 0}
                  className={cn(
                    "w-full h-14 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300",
                    expenses.length > 0 &&
                      unassignedCount === 0 &&
                      unassignedAdxCount === 0
                      ? "bg-emerald-600 text-white shadow-emerald-200"
                      : "bg-primary text-white shadow-primary/20",
                    expenses.length === 0 &&
                    "opacity-100 bg-[#ede9fe] text-primary/40 shadow-none",
                  )}
                >
                  {expenses.length > 0 &&
                    unassignedCount === 0 &&
                    unassignedAdxCount === 0
                    ? "Berhasil, Lanjutkan! ✅"
                    : "Lanjutkan"}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </>
            )}

            {step === 3 && (
              <Button
                onClick={nextStep}
                disabled={isCalculating}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-all"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Menghitung...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 w-5 h-5" /> Hitung Split Bill
                  </>
                )}
              </Button>
            )}

            {step === 4 && !isSaved && (
              <Button
                onClick={() => {
                  if (expenses.length === 0) {
                    toast.error("Belum ada item nih! 📝", {
                      description:
                        "Yuk isi dulu item belanjaan atau pengeluarannya sebelum disimpan.",
                      duration: 4000,
                    });
                    return;
                  }
                  const hasUnassigned = expenses.some(
                    (e) => e.who.length === 0 || !e.paidBy
                  );
                  const hasUnassignedAdx = additionalExpenses.some(
                    (e) => e.who.length === 0 || !e.paidBy
                  );
                  if (hasUnassigned || hasUnassignedAdx) {
                    toast.error("Ada item yang belum dilengkapi! ⚠️", {
                      description:
                        "Pastikan semua item sudah di-assign 'Split dengan' dan 'Dibayar oleh' ya.",
                      duration: 4000,
                    });
                    return;
                  }
                  trackSplitBill.finalizeModalView();
                  setShowFinalizeModal(true);
                }}
                disabled={isFinalizing}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-all !disabled:opacity-70"
              >
                {isFinalizing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 w-5 h-5" /> Simpan & Share ✨
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Finalize Modal */}
      <ConfirmationModal
        isOpen={showFinalizeModal}
        onClose={() => {
          if (isFinalizing) return;
          trackSplitBill.finalizeCancel();
          setShowFinalizeModal(false);
        }}
        onConfirm={() => {
          trackSplitBill.finalizeConfirm();
          handleFinalize();
        }}
        title="Simpan ke Riwayat"
        description="Kamu yakin ingin menyelesaikan split bill ini? Data yang disimpan akan muncul di riwayat transaksi kamu."
        icon={CheckCircle2}
        confirmText={isFinalizing ? "Menyimpan..." : "Ya, Simpan"}
        cancelText="Batal"
        isLoading={isFinalizing}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          trackAuth.splitbillFinalizeAfterGoogleLogin();
          handleFinalize();
        }}
        iconSrc="/img/feature-splitbill-scan.png"
        redirectPath={`${pathname}${searchParams.toString() ? `?${searchParams.toString()}&` : "?"}finalize=true`}
      />

      {/* Auth Modal for AI Scan Entry Points */}
      <AuthModal
        isOpen={showAIScanAuthModal}
        onClose={() => setShowAIScanAuthModal(false)}
        title="Masuk untuk Scan AI"
        description="Yuk masuk sekarang untuk menikmati fitur Scan Struk Otomatis pakai AI secara gratis! ✨"
        showRegisterLink={false}
        iconSrc="/img/feature-splitbill-scan.png"
        redirectPath={(() => {
          const currentParams = new URLSearchParams(searchParams.toString());
          currentParams.set("step", "2");
          currentParams.set("tab", "ai");
          return `${pathname}?${currentParams.toString()}`;
        })()}
      />

      <TutorialOverlay
        steps={tutorialSteps}
        isOpen={isTutorialOpen}
        onClose={() => {
          setIsTutorialOpen(false);
          setHasSeenTutorial(true);
        }}
        onComplete={completeTutorial}
        onStepChange={handleTutorialStepChange}
      />
    </div>
  );
};

export default function SplitBillClientPage() {
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
