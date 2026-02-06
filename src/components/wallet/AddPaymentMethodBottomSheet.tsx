"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWalletStore } from "@/store/useWalletStore";
import { X, Save, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createPortal } from "react-dom";

interface AddPaymentMethodBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodAdded?: (id: string) => void;
}

const PROVIDERS = [
  { value: "BankTransfer", label: "Bank Transfer", type: "bank" },
  { value: "GoPay", label: "GoPay", type: "ewallet" },
  { value: "OVO", label: "OVO", type: "ewallet" },
  { value: "DANA", label: "DANA", type: "ewallet" },
  { value: "ShopeePay", label: "ShopeePay", type: "ewallet" },
  { value: "LinkAja", label: "LinkAja", type: "ewallet" },
  { value: "Jenius", label: "Jenius", type: "ewallet" },
];

export const AddPaymentMethodBottomSheet = ({
  isOpen,
  onClose,
  onMethodAdded,
}: AddPaymentMethodBottomSheetProps) => {
  const { addPaymentMethod } = useWalletStore();

  const [provider, setProvider] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState(""); // Account Number or Phone Number
  const [bankName, setBankName] = useState(""); // Specific for Bank Transfer

  const handleSave = () => {
    if (!provider || !name || !details) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    const selectedProvider = PROVIDERS.find((p) => p.value === provider);
    if (!selectedProvider) return;

    if (selectedProvider.value === "BankTransfer" && !bankName) {
      toast.error("Mohon isi nama Bank");
      return;
    }

    const finalProviderName =
      selectedProvider.value === "BankTransfer"
        ? bankName
        : selectedProvider.label;

    const id = addPaymentMethod({
      type: selectedProvider.type as "bank" | "ewallet",
      providerName: finalProviderName,
      accountName: name,
      accountNumber: selectedProvider.type === "bank" ? details : undefined,
      phoneNumber: selectedProvider.type === "ewallet" ? details : undefined,
    });

    if (onMethodAdded) {
      onMethodAdded(id);
    }

    toast.success("Metode pembayaran berhasil ditambahkan! 🎉");
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setProvider("");
    setName("");
    setDetails("");
    setBankName("");
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          "absolute bottom-0 w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
          "animate-in slide-in-from-bottom-full duration-300 ease-out",
        )}
      >
        {/* Drag handle */}
        <div
          className="w-full flex justify-center pt-2 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">Tambah Digital Wallet</h2>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Jenis Metode</label>
              <select
                className="w-full h-12 px-3 rounded-lg border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="" disabled>
                  Pilih Metode
                </option>
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {provider === "BankTransfer" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <label className="text-sm font-semibold">Nama Bank</label>
                <Input
                  placeholder="Contoh: BCA, Mandiri, BRI"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
            )}

            {provider && (
              <>
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <label className="text-sm font-semibold">
                    {provider === "BankTransfer"
                      ? "Nama Pemilik Rekening"
                      : "Nama Pemilik Akun"}
                  </label>
                  <Input
                    placeholder="Nama lengkap sesuai akun"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <label className="text-sm font-semibold">
                    {provider === "BankTransfer"
                      ? "Nomor Rekening"
                      : "Nomor HP"}
                  </label>
                  <Input
                    placeholder={
                      provider === "BankTransfer"
                        ? "Contoh: 1234567890"
                        : "Contoh: 08123456789"
                    }
                    type="number"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-primary/5 bg-background">
          <Button
            onClick={handleSave}
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-5 h-5 mr-2" /> Simpan Data
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
