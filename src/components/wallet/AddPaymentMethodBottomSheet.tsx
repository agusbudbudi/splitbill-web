"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWalletStore } from "@/store/useWalletStore";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { trackWallet } from "@/lib/gtag";
import { ProviderPickerGrid } from "./ProviderPickerGrid";
import { BANK_LOGOS, EWALLET_LOGOS } from "@/lib/providerLogos";

interface AddPaymentMethodBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodAdded?: (id: string) => void;
}

/** Derived from central providerLogos — automatically includes any new provider added there. */
const PROVIDERS = [
  ...Object.keys(BANK_LOGOS).map((key) => ({ value: key, label: key, type: "bank" as const })),
  ...Object.keys(EWALLET_LOGOS).map((key) => ({ value: key, label: key, type: "ewallet" as const })),
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
    trackWallet.addMethod(selectedProvider.type);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setProvider("");
    setName("");
    setDetails("");
    setBankName("");
  };

  const selectedProviderObj = PROVIDERS.find((p) => p.value === provider);
  const isBank = selectedProviderObj?.type === "bank";

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        trackWallet.dropOff();
        onClose();
      }}
      title="Tambah Digital Wallet"
      fullScreen
      footer={
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
        >
          <Save className="w-5 h-5 mr-2" /> Simpan Data
        </Button>
      }
    >
      <div className="space-y-4 pb-safe">
        <ProviderPickerGrid
          selectedProvider={provider}
          onChange={(val) => {
            setProvider(val);
            setDetails("");
            setBankName("");
          }}
        />

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
                {isBank
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
                {isBank
                  ? "Nomor Rekening"
                  : "Nomor HP"}
              </label>
              <Input
                placeholder={
                  isBank
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
    </BottomSheet>
  );
};
