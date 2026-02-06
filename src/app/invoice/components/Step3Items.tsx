"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AddButton } from "@/components/ui/AddButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Trash2, ShoppingCart, ChevronDown } from "lucide-react";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatToIDR } from "@/lib/utils/invoice";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

import { FormError } from "@/components/ui/FormError";

export function Step3Items() {
  const { currentInvoice, addItem, updateItem, removeItem, calculateTotals } =
    useInvoiceStore();

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    qty: 1,
    rate: 0,
  });

  const [discountError, setDiscountError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    qty?: string;
    rate?: string;
  }>({});

  const handleAddItem = () => {
    const errors: typeof fieldErrors = {};
    if (!newItem.name) errors.name = "Nama item harus diisi";
    if (newItem.qty <= 0) errors.qty = "Qty minimal 1";
    if (newItem.rate <= 0) errors.rate = "Rate harus diisi";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    addItem(newItem);
    setNewItem({ name: "", description: "", qty: 1, rate: 0 });
    setFieldErrors({});
  };

  const items = currentInvoice.items || [];
  const subtotal = currentInvoice.subtotal || 0;
  const discountAmount = currentInvoice.discountAmount || 0;
  const total = currentInvoice.total || 0;
  const totalInWords = currentInvoice.totalInWords || "";

  // Re-validate discount when subtotal or discount settings change
  React.useEffect(() => {
    const value = currentInvoice.discountValue || 0;
    const type = currentInvoice.discountType || "amount";

    if (type === "percent") {
      if (value > 100) {
        setDiscountError("Diskon tidak boleh lebih dari 100%");
      } else if (value < 0) {
        setDiscountError("Diskon tidak boleh negatif");
      } else {
        setDiscountError("");
      }
    } else {
      if (value > subtotal) {
        setDiscountError(
          `Diskon tidak boleh melebihi subtotal (${formatToIDR(subtotal)})`,
        );
      } else {
        setDiscountError("");
      }
    }
  }, [subtotal, currentInvoice.discountValue, currentInvoice.discountType]);

  return (
    <Card className="p-5">
      <div className="space-y-4">
        {/* Add New Item Form */}
        <div className="p-3 rounded-lg space-y-2 border border-primary/10">
          <div>
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => {
                const val = e.target.value;
                setNewItem((prev) => ({ ...prev, name: val }));
                if (fieldErrors.name)
                  setFieldErrors({ ...fieldErrors, name: undefined });
              }}
              className={
                fieldErrors.name
                  ? "border-destructive focus:ring-destructive/20"
                  : ""
              }
            />
            <FormError message={fieldErrors.name} />
          </div>
          <div className="rich-text-container">
            <RichTextEditor
              placeholder="Item Description (optional)"
              value={newItem.description}
              onChange={(value) =>
                setNewItem((prev) => ({ ...prev, description: value }))
              }
              className="min-h-[100px] mb-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 align-top">
            <div>
              <Input
                type="number"
                placeholder="Qty"
                min="1"
                value={newItem.qty}
                onChange={(e) => {
                  const val = e.target.value;
                  const intVal = val === "" ? ("" as any) : parseInt(val) || 0;
                  setNewItem((prev) => ({
                    ...prev,
                    qty: intVal,
                  }));
                  if (fieldErrors.qty)
                    setFieldErrors({ ...fieldErrors, qty: undefined });
                }}
                className={
                  fieldErrors.qty
                    ? "border-destructive focus:ring-destructive/20"
                    : ""
                }
              />
              <FormError message={fieldErrors.qty} />
            </div>
            <div>
              <CurrencyInput
                placeholder="Rate (Rp)"
                value={newItem.rate}
                onChange={(val) => {
                  setNewItem((prev) => ({ ...prev, rate: val }));
                  if (fieldErrors.rate)
                    setFieldErrors({ ...fieldErrors, rate: undefined });
                }}
                className={
                  fieldErrors.rate
                    ? "border-destructive focus:ring-destructive/20"
                    : ""
                }
              />
              <FormError message={fieldErrors.rate} />
            </div>
            <div className="flex items-center px-4 py-1 rounded-2xl border border-primary/10 bg-white text-sm font-bold text-foreground h-12 mt-0">
              {formatToIDR(newItem.qty * newItem.rate)}
            </div>
          </div>
          <AddButton onClick={handleAddItem} label="Add Item" />
        </div>

        {/* Items List */}
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-lg border border-primary/10 group hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-foreground tracking-tight">
                      {item.name}
                    </h4>
                    {item.description && (
                      <div
                        className="text-xs text-muted-foreground mt-0.5 font-medium prose prose-sm max-w-none [&>p]:mb-0.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                      <span>Qty: {item.qty}</span>
                      <span>Rate: {formatToIDR(item.rate)}</span>
                      <span className="font-bold text-primary">
                        {formatToIDR(item.amount)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="Belum ada item"
            subtitle="Tambahkan item jasa atau produk untuk invoice Anda."
            icon={ShoppingCart}
          />
        )}

        {/* Discount Section */}
        {items.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-muted">
            <label className="text-xs font-bold text-foreground/70 tracking-tight">
              Add Discount (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={currentInvoice.discountType || "amount"}
                  onChange={(e) => {
                    useInvoiceStore.getState().updateInvoice({
                      discountType: e.target.value as "amount" | "percent",
                      discountValue: 0, // Reset value on type change to avoid invalid states
                    });
                    calculateTotals();
                  }}
                  className="h-12 w-full rounded-2xl border border-primary/10 bg-white px-4 py-1 pr-8 text-sm font-medium transition-all focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                >
                  <option value="amount">Fixed (Rp)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {currentInvoice.discountType === "percent" ? (
                <Input
                  type="number"
                  placeholder="Discount %"
                  min="0"
                  max="100"
                  value={currentInvoice.discountValue || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const value = val === "" ? 0 : parseFloat(val);

                    useInvoiceStore
                      .getState()
                      .updateInvoice({ discountValue: value });
                    calculateTotals();
                  }}
                  className={
                    discountError
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
              ) : (
                <CurrencyInput
                  placeholder="Discount value"
                  value={currentInvoice.discountValue || 0}
                  onChange={(val) => {
                    useInvoiceStore
                      .getState()
                      .updateInvoice({ discountValue: val });
                    calculateTotals();
                  }}
                  className={
                    discountError
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
              )}
            </div>
            {discountError && (
              <p className="text-[10px] text-destructive font-medium animate-in slide-in-from-top-1">
                {discountError}
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        {items.length > 0 && (
          <div className="space-y-1.5 pt-3 border-t border-muted">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Sub Total:
              </span>
              <span className="font-bold text-foreground">
                {formatToIDR(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Discount:
              </span>
              <span className="font-bold text-destructive">
                - {formatToIDR(discountAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-muted">
              <span className="text-foreground">Total (IDR):</span>
              <span className="text-primary">{formatToIDR(total)}</span>
            </div>
            {totalInWords && (
              <p className="text-[10px] text-muted-foreground italic text-right font-medium">
                {totalInWords}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
