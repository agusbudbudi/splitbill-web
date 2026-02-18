"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { validateInvoiceStep } from "@/lib/utils/invoice";
import {
  ChevronRight,
  FileText,
  Users,
  ShoppingCart,
  CreditCard,
  FileCheck,
  Eye,
} from "lucide-react";
import { InvoiceProgress } from "../components/InvoiceProgress";
import { Step1Details } from "../components/Step1Details";
import { Step2Billed } from "../components/Step2Billed";
import { Step3Items } from "../components/Step3Items";
import { Step4Payment } from "../components/Step4Payment";
import { Step5TnC } from "../components/Step5TnC";
import { Step6Preview } from "../components/Step6Preview";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function InvoicePage() {
  const router = useRouter();
  const {
    currentStep,
    currentInvoice,
    nextStep,
    prevStep,
    finalizeInvoice,
    resetInvoice,
  } = useInvoiceStore();
  const [showFinalizeModal, setShowFinalizeModal] = React.useState(false);

  // Check if invoice is finalized
  const isFinalized = currentInvoice.status !== "draft";

  const handleNext = () => {
    // Validate current step before proceeding
    const validation = validateInvoiceStep(currentStep, currentInvoice);

    if (!validation.valid) {
      alert(validation.errors.join("\n"));
      return;
    }

    if (currentStep === 6) {
      // Show Finalize Modal
      setShowFinalizeModal(true);
    } else {
      nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalize = () => {
    const finalized = finalizeInvoice();
    setShowFinalizeModal(false);
    // Redirect to invoice detail page
    router.push(`/history/invoice/${finalized.id}`);
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/invoice");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Details />;
      case 2:
        return <Step2Billed />;
      case 3:
        return <Step3Items />;
      case 4:
        return <Step4Payment />;
      case 5:
        return <Step5TnC />;
      case 6:
        return <Step6Preview />;
      default:
        return <Step1Details />;
    }
  };

  const steps = [
    { id: 1, label: "Details", icon: FileText },
    { id: 2, label: "Billed", icon: Users },
    { id: 3, label: "Items", icon: ShoppingCart },
    { id: 4, label: "Payment", icon: CreditCard },
    { id: 5, label: "TnC", icon: FileCheck },
    { id: 6, label: "Preview", icon: Eye },
  ];

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Invoice Details 📄";
      case 2:
        return "Billed By/To 👥";
      case 3:
        return "Invoice Items 🛒";
      case 4:
        return "Payment Methods 💳";
      case 5:
        return "Terms & Conditions 📋";
      case 6:
        return "Preview & Finalize ✅";
      default:
        return "Invoice";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Isi detail invoice kamu";
      case 2:
        return "Siapa yang tagih & ditagih?";
      case 3:
        return "Tambahkan item invoice";
      case 4:
        return "Pilih metode pembayaran";
      case 5:
        return "Tambahkan T&C (opsional)";
      case 6:
        return "Cek & finalisasi invoice";
      default:
        return "";
    }
  };

  const canProceed = () => {
    const validation = validateInvoiceStep(currentStep, currentInvoice);
    return validation.valid;
  };

  const getValidationMessage = () => {
    const validation = validateInvoiceStep(currentStep, currentInvoice);
    if (validation.valid) return null;
    return validation.errors[0];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      <Header
        title="Invoice"
        showBackButton
        onBack={handlePrev}
        className="pb-10 rounded-b-xl shadow-lg shadow-primary/20"
      >
        {/* Stepper Inside Header */}
        <div className="flex justify-between items-center px-8 relative">
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-white/20 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-12 right-12 h-0.5 -translate-y-1/2 z-0 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "relative z-10 w-8 h-8 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2",
                currentStep === s.id
                  ? "bg-white border-white scale-110 shadow-lg shadow-black/10"
                  : currentStep > s.id
                    ? "bg-white border-white"
                    : "bg-primary border-white/40 text-white/40",
              )}
            >
              <s.icon
                className={cn(
                  "w-4 h-4 font-bold transition-colors duration-500",
                  currentStep >= s.id ? "text-primary" : "text-white/40",
                )}
              />

              <span
                className={cn(
                  "absolute -bottom-5 text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap transition-colors duration-500",
                  currentStep === s.id
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

      <main className="flex-1 w-full max-w-[600px] px-4 pt-10 pb-10 space-y-6 relative z-10 flex flex-col">
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-bold">{getStepTitle()}</h2>
          <p className="text-muted-foreground text-sm">{getStepSubtitle()}</p>
        </div>

        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          {renderStep()}
        </div>
      </main>

      {/* Sticky CTA Footer - Show for all steps less than 6 OR (step 6 IF not finalized) */}
      {(currentStep < 6 || (currentStep === 6 && !isFinalized)) && (
        <div className="sticky bottom-0 w-full z-50 pointer-events-none flex justify-center mt-auto">
          <div className="w-full max-w-[600px] relative pointer-events-auto flex flex-col">
            <div className="bg-background px-4 pb-4 flex flex-col gap-3">
              {!canProceed() && getValidationMessage() && (
                <InfoBanner message={getValidationMessage()!} variant="blue" />
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 text-white !disabled:opacity-100 disabled:bg-[#ede9fe] disabled:text-primary/40 disabled:shadow-none transition-all duration-300",
                  currentStep === 6
                    ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                    : "bg-primary hover:bg-primary/90",
                )}
              >
                {currentStep === 6 ? (
                  <>
                    <FileCheck className="w-5 h-5 mr-2" /> Finalize Invoice
                  </>
                ) : currentStep === 5 ? (
                  <>
                    Lihat Preview <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Lanjutkan <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Finalize Modal */}
      <ConfirmationModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleFinalize}
        title="Finalize Invoice"
        description="Kamu yakin ingin menyelesaikan invoice ini? Invoice yang sudah di-finalize akan tersimpan ke history dan tidak dapat diubah lagi."
        icon={FileCheck}
        confirmText="Ya, Finalize"
        cancelText="Batal"
        confirmButtonClassName="bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
      />
    </div>
  );
}
