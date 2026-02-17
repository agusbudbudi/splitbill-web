"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Upload, X, Camera } from "lucide-react";
import Image from "next/image";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { generateInvoiceNumber } from "@/lib/utils/invoice";
import { FormError } from "@/components/ui/FormError";

export function Step1Details() {
  const { currentInvoice, updateInvoice } = useInvoiceStore();
  const [prefix, setPrefix] = useState("INV-");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrefixChange = (newPrefix: string) => {
    setPrefix(newPrefix);
    const newInvoiceNo = generateInvoiceNumber(newPrefix);
    updateInvoice({ invoiceNo: newInvoiceNo });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvoice({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateInvoice({ logo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Sync prefix from currentInvoice.invoiceNo on mount or change
  React.useEffect(() => {
    if (currentInvoice.invoiceNo && currentInvoice.invoiceNo.length > 11) {
      const extractedPrefix = currentInvoice.invoiceNo.slice(
        0,
        currentInvoice.invoiceNo.length - 11,
      );
      setPrefix(extractedPrefix);
    } else if (!currentInvoice.invoiceNo) {
      // Generate if not exists
      const newInvoiceNo = generateInvoiceNumber(prefix);
      updateInvoice({ invoiceNo: newInvoiceNo });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInvoice.invoiceNo]);

  const logoPreview = currentInvoice.logo;

  return (
    <Card className="p-5">
      <div className="space-y-5">
        {/* Invoice Number */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 tracking-tight">
            Invoice No
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="Prefix (e.g. INV-)"
              value={prefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
            />
            <Input
              type="text"
              value={currentInvoice.invoiceNo || ""}
              readOnly
              className="bg-muted/50"
            />
          </div>
        </div>

        {/* Invoice Date & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/70 tracking-tight">
              Invoice Date
            </label>
            <Input
              type="date"
              value={currentInvoice.invoiceDate || ""}
              onChange={(e) => updateInvoice({ invoiceDate: e.target.value })}
              className={!currentInvoice.invoiceDate ? "border-amber-200" : ""}
            />
            {!currentInvoice.invoiceDate && (
              <FormError message="Tanggal invoice harus diisi" />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/70 tracking-tight">
              Due Date
            </label>
            <Input
              type="date"
              value={currentInvoice.dueDate || ""}
              onChange={(e) => updateInvoice({ dueDate: e.target.value })}
              className={
                !currentInvoice.dueDate ||
                (currentInvoice.invoiceDate &&
                  currentInvoice.dueDate &&
                  new Date(currentInvoice.dueDate) <
                    new Date(currentInvoice.invoiceDate))
                  ? "border-destructive/30"
                  : ""
              }
            />
            {!currentInvoice.dueDate ? (
              <FormError message="Jatuh tempo harus diisi" />
            ) : currentInvoice.invoiceDate &&
              new Date(currentInvoice.dueDate) <
                new Date(currentInvoice.invoiceDate) ? (
              <FormError message="Jatuh tempo tidak boleh sebelum tanggal invoice" />
            ) : null}
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/70 tracking-tight">
            Upload Logo (Optional)
          </label>

          {!logoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/20 rounded-2xl py-4 flex flex-col items-center justify-center gap-3 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xs text-foreground">Upload Logo</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mt-0.5">
                  Klik untuk pilih file
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative aspect-[2/0.63] rounded-2xl overflow-hidden border border-primary/20 bg-muted">
              <Image
                src={logoPreview}
                alt="Logo preview"
                fill
                className="object-contain"
                unoptimized={logoPreview.startsWith("data:")}
              />
              <button
                onClick={removeLogo}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
