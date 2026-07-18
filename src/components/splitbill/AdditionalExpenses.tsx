"use client";

import React, { useState } from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Trash2,
  Percent,
  Calculator,
  ReceiptText,
  Utensils,
  Tag,
} from "lucide-react";
import { formatToIDR, cn } from "@/lib/utils";
import { PersonSelector } from "./PersonSelector";
import { EditAdditionalExpenseBottomSheet } from "./EditAdditionalExpenseBottomSheet";
import { Edit2 } from "lucide-react";
import { SplitBadge } from "./SplitBadge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { PersonChip } from "./PersonChip";
import { SplitTypeToggle } from "./SplitTypeToggle";

const PREDEFINED_TYPES = [
  { id: "tax", label: "Pajak (Tax)", icon: ReceiptText, defaultRate: 10 },
  { id: "service", label: "Service", icon: Utensils, defaultRate: 5 },
  { id: "discount", label: "Diskon", icon: Tag, defaultRate: 0 }, // Discount logic might need negative values
  { id: "other", label: "Lainnya", icon: Calculator, defaultRate: 0 },
];

export const AdditionalExpenses = () => {
  const {
    expenses,
    additionalExpenses,
    addAdditionalExpense,
    removeAdditionalExpense,
    people,
  } = useSplitBillStore();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState(PREDEFINED_TYPES[0]);
  const [name, setName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [isPercentage, setIsPercentage] = useState(true);
  const [percentageStr, setPercentageStr] = useState("");
  const [selectedWho, setSelectedWho] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equally" | "proportionally">(
    "proportionally",
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate subtotal from main expenses
  const subtotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const isInputNegative = () => {
    if (isPercentage) {
      return (parseFloat(percentageStr) || 0) < 0;
    } else {
      return amountStr.includes("-");
    }
  };

  const handleToggleWho = (name: string) => {
    setSelectedWho((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleAdd = () => {
    let finalName = name;
    let finalAmount = 0;

    if (selectedType.id !== "other") {
      finalName = selectedType.label;
    }

    if (isPercentage && subtotal > 0) {
      const pct = parseFloat(percentageStr) || 0;
      finalAmount = (subtotal * pct) / 100;
      finalName = `${finalName} (${pct}%)`;
    } else {
      // Allow for potential minus sign in digits
      const cleaned = amountStr.replace(/[^-0-9]/g, "");
      finalAmount = parseFloat(cleaned) || 0;
    }

    if (finalAmount === 0) return;

    const isNegative = finalAmount < 0;
    const finalPaidBy = isNegative ? "merchant" : paidBy;

    if (selectedWho.length === 0 || (!finalPaidBy && !isNegative)) return;

    addAdditionalExpense({
      name: finalName,
      amount: finalAmount,
      who: selectedWho,
      paidBy: finalPaidBy,
      splitType: splitType,
    });

    // Reset
    setIsAdding(false);
    setName("");
    setAmountStr("");
    setPercentageStr("");
    setSelectedWho([]);
    setPaidBy("");
    setSplitType("proportionally");
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      removeAdditionalExpense(deletingId);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const quickAdd = (type: typeof selectedType) => {
    setSelectedType(type);
    setName(type.id === "other" ? "" : type.label);
    if (type.defaultRate > 0) {
      setIsPercentage(true);
      setPercentageStr(type.defaultRate.toString());
    } else {
      setIsPercentage(false);
      setPercentageStr("");
    }
    setSelectedWho([...people]); // Default to everyone
    setSplitType(
      type.id === "tax" || type.id === "service" ? "proportionally" : "equally",
    );
    setIsAdding(true);
  };

  if (!expenses.length && !additionalExpenses.length) return null;

  return (
    <Card className="border-primary/20 shadow-md">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-bold flex items-center gap-2">
            Biaya Tambahan
            <Badge
              variant="secondary"
              className="text-[10px] font-bold px-2 h-5"
            >
              Tax / Service
            </Badge>
          </label>
        </div>

        {/* Highlighted Banner */}
        <div className="bg-success/5 border border-success/10 rounded-sm p-3 flex items-start gap-2.5 animate-in fade-in duration-300">
          <span className="text-base leading-none">💡</span>
          <p className="text-[11px] text-success font-medium leading-relaxed">
            <span className="font-bold text-success">Diskon / Cashback?</span> Input aja nominalnya pake tanda <span className="font-black underline decoration-success/30 decoration-2 text-success">minus (–)</span> (contoh: <span className="font-mono font-bold bg-success/10 px-1 py-0.5 rounded text-[10px] text-success">-Rp5.000</span> atau <span className="font-mono font-bold bg-success/10 px-1 py-0.5 rounded text-[10px] text-success">-10%</span>), otomatis ngurangin tagihan semua yang terlibat. Ez! 🎉
          </p>
        </div>

        {/* List of Additional Expenses */}
        <div className="space-y-2">
          {additionalExpenses.map((adx) => (
            <div
              key={adx.id}
              className="flex flex-col bg-muted/20 p-3 rounded-sm border border-dashed border-primary/20 gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                    <ReceiptText className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold leading-tight">
                        {adx.name}
                      </span>
                      <SplitBadge type={adx.splitType} />
                    </div>
                    <span className={cn(
                      "text-sm font-bold block leading-tight",
                      adx.amount < 0 ? "text-success" : "text-primary"
                    )}>
                      {formatToIDR(adx.amount)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => setEditingId(adx.id)}
                    className="text-muted-foreground/50 hover:text-primary transition-colors p-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(adx.id)}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-primary/10">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-tight">
                    Dibayar oleh
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {adx.amount < 0 ? (
                      <div className="flex items-center gap-1.5 bg-success/10 rounded-full px-2.5 py-1 border border-success/20 text-success">
                        <span className="text-[10px] font-bold">
                          🏷️ Merchant (Potongan Toko)
                        </span>
                      </div>
                    ) : (
                      people.map((name) => (
                        <PersonChip
                          key={name}
                          name={name}
                          variant="payer"
                          selected={adx.paidBy === name}
                          onClick={(clicked) =>
                            useSplitBillStore.getState().updateAdditionalExpense(adx.id, {
                              paidBy: adx.paidBy === clicked ? "" : clicked,
                            })
                          }
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-tight">
                    Split dengan
                  </span>
                  {people.length > 0 && (
                    <button
                      onClick={() => {
                        const isAllSelected = adx.who.length === people.length;
                        useSplitBillStore.getState().updateAdditionalExpense(adx.id, {
                          who: isAllSelected ? [] : [...people],
                        });
                      }}
                      className="text-[9px] font-black text-primary hover:underline cursor-pointer bg-primary/5 px-2 py-0.5 rounded-full"
                    >
                      {adx.who.length === people.length ? "Reset" : "Bagi Rata (Semua)"}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {people.map((name) => {
                    const isSelected = adx.who.includes(name);
                    return (
                      <PersonChip
                        key={name}
                        name={name}
                        variant="who"
                        selected={isSelected}
                        onClick={() => {
                          const newWho = isSelected
                            ? adx.who.filter((w) => w !== name)
                            : [...adx.who, name];
                          useSplitBillStore.getState().updateAdditionalExpense(adx.id, { who: newWho });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Actions */}
        {!isAdding ? (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {PREDEFINED_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => quickAdd(type)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                <type.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-sm border border-primary/10 space-y-4 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-bold flex items-center gap-2 text-primary">
                <selectedType.icon className="w-4 h-4" />
                {selectedType.label}
              </span>
              <button
                onClick={() => setIsAdding(false)}
                className="text-[10px] font-bold text-muted-foreground hover:text-primary cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="flex gap-2">
              {selectedType.id === "other" && (
                <div className="flex-1">
                  <Input
                    placeholder="Nama Biaya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              )}

              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  {isPercentage ? (
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="10"
                        value={percentageStr}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (val > 100) {
                            setPercentageStr("100");
                          } else {
                            setPercentageStr(e.target.value);
                          }
                        }}
                        className="h-9 text-xs pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                        %
                      </span>
                    </div>
                  ) : (
                    <Input
                      placeholder="Rp 0"
                      value={amountStr}
                      onChange={(e) => {
                        const input = e.target.value;
                        // Allow hyphen at start
                        const isNegative = input.includes("-");
                        const val = input.replace(/[^-0-9]/g, "");
                        const numericVal = parseInt(val.replace(/-/g, ""));

                        if (isNaN(numericVal)) {
                          setAmountStr(isNegative ? "-" : "");
                        } else {
                          setAmountStr(
                            (isNegative ? "-" : "") + formatToIDR(numericVal),
                          );
                        }
                      }}
                      className="h-9 text-xs"
                    />
                  )}
                </div>

                <button
                  onClick={() => setIsPercentage(!isPercentage)}
                  className={cn(
                    "h-9 px-3 rounded-full border border-primary/10 text-xs font-bold transition-all cursor-pointer",
                    isPercentage
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted-foreground hover:text-primary hover:border-primary/50",
                  )}
                >
                  %
                </button>
              </div>
            </div>

            {isPercentage && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {(selectedType.id === "discount"
                    ? [-5, -10, -11]
                    : [5, 10, 11]
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPercentageStr(p.toString())}
                      className={cn(
                        "flex-1 py-1 rounded-sm text-[10px] font-black border transition-all cursor-pointer",
                        percentageStr === p.toString()
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white border-primary/10 text-muted-foreground hover:border-primary/30",
                      )}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground px-1">
                  {percentageStr || "0"}% dari subtotal {formatToIDR(subtotal)}{" "}
                  ={" "}
                  <span className="font-bold text-primary">
                    {formatToIDR(
                      (subtotal * (parseFloat(percentageStr) || 0)) / 100,
                    )}
                  </span>
                </p>
              </div>
            )}

            {/* Split Type Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold px-1">
                Metode Bagi (Split)
              </label>
              <SplitTypeToggle value={splitType} onChange={setSplitType} />
              <p className="text-[10px] text-muted-foreground/60 italic px-1 leading-tight">
                {splitType === "proportionally"
                  ? "*Tagihan dibagi berdasarkan jumlah belanja masing-masing orang."
                  : "*Tagihan dibagi sama rata ke semua orang yang terpilih."}
              </p>
            </div>

            {/* Paid By Section */}
            {isInputNegative() ? (
              <div className="space-y-3 border-t border-primary/10 pt-4 px-1">
                <label className="text-sm font-bold text-foreground">Dibayar oleh</label>
                <div className="p-3 bg-success/5 rounded-sm border border-success/10 text-success flex items-center gap-2">
                  <span className="text-[11px] font-semibold leading-relaxed">
                    🏷️ Diskon dari <strong>Merchant</strong> - otomatis ngurangin tagihan tiap orang yang terlibat. No worries! 🙌
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 border-t border-primary/10 pt-4">
                <label className="text-sm font-bold px-1">Dibayar oleh</label>
                <div className="flex flex-wrap gap-4">
                  {people.map((name) => (
                    <PersonSelector
                      key={name}
                      name={name}
                      isSelected={paidBy === name}
                      onClick={setPaidBy}
                      size="md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Split With Section */}
            <div className="space-y-3 border-t border-primary/10 pt-4">
              <label className="text-sm font-bold px-1">
                Split dengan Siapa
              </label>
              <div className="flex flex-wrap gap-4">
                {people.map((name) => (
                  <PersonSelector
                    key={name}
                    name={name}
                    isSelected={selectedWho.includes(name)}
                    onClick={handleToggleWho}
                    size="md"
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleAdd}
              className="w-full h-9 text-xs"
              size="sm"
              variant="default"
              disabled={(!paidBy && !isInputNegative()) || selectedWho.length === 0}
            >
              Tambah {selectedType.label}
            </Button>
          </div>
        )}
        <EditAdditionalExpenseBottomSheet
          isOpen={!!editingId}
          onClose={() => setEditingId(null)}
          expenseId={editingId}
        />

        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Hapus Biaya Tambahan?"
          description="Biaya tambahan ini akan dihapus permanen. Kamu yakin?"
          icon={Trash2}
          confirmText="Ya, Hapus"
          confirmButtonClassName="bg-destructive text-white shadow-destructive/20"
        />
      </CardContent>
    </Card>
  );
};
