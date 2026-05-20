"use client";

import React from "react";
import { BucketReceipt } from "@/store/useSplitLaterStore";
import { useWalletStore } from "@/store/useWalletStore";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatToIDR } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HowToReadSummary } from "@/components/splitbill/HowToReadSummary";

interface BucketSettlementProps {
  receipts: BucketReceipt[];
  participants: string[];
}

interface SettlementItem {
  receiptName: string;
  itemName: string;
  share: number;
  method: "equal" | "prop";
  isAdditional: boolean;
}

interface PersonBalance {
  name: string;
  totalPaid: number; // Sum of receipts where they are payer
  totalOwed: number; // Sum of items assigned to them
  balance: number; // totalPaid - totalOwed (positive = receive, negative = pay)
  items: SettlementItem[];
}

interface SettlementInstruction {
  from: string;
  to: string;
  amount: number;
}

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&seed=";

export const BucketSettlement = ({
  receipts,
  participants,
}: BucketSettlementProps) => {
  const { savedBills } = useWalletStore();
  const [expandedPeople, setExpandedPeople] = React.useState<
    Record<string, boolean>
  >({});

  const togglePerson = (name: string) => {
    setExpandedPeople((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const completedReceipts = receipts.filter(
    (r) => r.status === "completed" && r.splitBillId,
  );

  // Aggregate balances across all completed split bills in this bucket
  const balances = React.useMemo<PersonBalance[]>(() => {
    const balanceMap: Record<string, PersonBalance> = {};

    // Init all participants
    participants.forEach((name) => {
      balanceMap[name] = {
        name,
        totalPaid: 0,
        totalOwed: 0,
        balance: 0,
        items: [],
      };
    });

    completedReceipts.forEach((receipt) => {
      const bill = savedBills.find((b) => b.id === receipt.splitBillId);
      if (!bill) return;

      const receiptName =
        receipt.merchant || receipt.notes || `Struk #${receipt.id.slice(0, 4)}`;

      // Ensure any bill participants are tracked even if not in bucket participants
      bill.people.forEach((name) => {
        if (!balanceMap[name]) {
          balanceMap[name] = {
            name,
            totalPaid: 0,
            totalOwed: 0,
            balance: 0,
            items: [],
          };
        }
      });

      // Create a temporary sub-balance map for this bill to compute proportional splits accurately
      const billBaseSpent: Record<string, number> = {};
      bill.people.forEach((name) => {
        billBaseSpent[name] = 0;
      });

      // 1. Process Main Expenses
      bill.expenses.forEach((expense) => {
        const payer = expense.paidBy;
        const shareCount = expense.who.length;
        if (shareCount === 0) return;

        // Payer paid the full amount
        if (payer && balanceMap[payer]) {
          balanceMap[payer].totalPaid += expense.amount;
        }

        // Each person in who[] owes their share
        const share = expense.amount / shareCount;
        expense.who.forEach((name) => {
          if (balanceMap[name]) {
            balanceMap[name].totalOwed += share;
            balanceMap[name].items.push({
              receiptName,
              itemName: expense.item,
              share,
              method: "equal",
              isAdditional: false,
            });
          }
          billBaseSpent[name] = (billBaseSpent[name] || 0) + share;
        });
      });

      // 2. Process Additional Expenses (Tax, Service, etc.)
      if (bill.additionalExpenses) {
        bill.additionalExpenses.forEach((adx) => {
          // Add to paid amount for the person who paid (if specified)
          if (adx.paidBy && balanceMap[adx.paidBy]) {
            balanceMap[adx.paidBy].totalPaid += adx.amount;
          }

          if (adx.splitType === "proportionally") {
            // Calculate base subtotal of people involved in this specific additional expense
            const involvedBaseSubtotal = adx.who.reduce((acc, person) => {
              return acc + (billBaseSpent[person] || 0);
            }, 0);

            // Distribute proportionally based on baseSpent
            adx.who.forEach((person) => {
              if (balanceMap[person]) {
                if (involvedBaseSubtotal > 0) {
                  const personBaseSubtotal = billBaseSpent[person] || 0;
                  const proportionalShare =
                    (personBaseSubtotal / involvedBaseSubtotal) * adx.amount;
                  balanceMap[person].totalOwed += proportionalShare;
                  balanceMap[person].items.push({
                    receiptName,
                    itemName: adx.name,
                    share: proportionalShare,
                    method: "prop",
                    isAdditional: true,
                  });
                } else {
                  // Fallback to equal
                  const share = adx.amount / (adx.who.length || 1);
                  balanceMap[person].totalOwed += share;
                  balanceMap[person].items.push({
                    receiptName,
                    itemName: adx.name,
                    share,
                    method: "equal",
                    isAdditional: true,
                  });
                }
              }
            });
          } else {
            // Distribute equally
            const share = adx.amount / (adx.who.length || 1);
            adx.who.forEach((person) => {
              if (balanceMap[person]) {
                balanceMap[person].totalOwed += share;
                balanceMap[person].items.push({
                  receiptName,
                  itemName: adx.name,
                  share,
                  method: "equal",
                  isAdditional: true,
                });
              }
            });
          }
        });
      }
    });

    // Calculate net balance
    Object.values(balanceMap).forEach((p) => {
      p.balance = p.totalPaid - p.totalOwed;
    });

    return Object.values(balanceMap);
  }, [completedReceipts, savedBills, participants]);

  // Generate minimal settlement instructions (who pays whom)
  const settlements = React.useMemo<SettlementInstruction[]>(() => {
    const debtors = balances
      .filter((p) => p.balance < -0.01)
      .map((p) => ({ name: p.name, amount: Math.abs(p.balance) }))
      .sort((a, b) => b.amount - a.amount);

    const creditors = balances
      .filter((p) => p.balance > 0.01)
      .map((p) => ({ name: p.name, amount: p.balance }))
      .sort((a, b) => b.amount - a.amount);

    const instructions: SettlementInstruction[] = [];
    const d = debtors.map((x) => ({ ...x }));
    const c = creditors.map((x) => ({ ...x }));

    let di = 0,
      ci = 0;
    while (di < d.length && ci < c.length) {
      const pay = Math.min(d[di].amount, c[ci].amount);
      if (pay > 0.01) {
        instructions.push({
          from: d[di].name,
          to: c[ci].name,
          amount: Math.round(pay),
        });
      }
      d[di].amount -= pay;
      c[ci].amount -= pay;
      if (d[di].amount < 0.01) di++;
      if (c[ci].amount < 0.01) ci++;
    }

    return instructions;
  }, [balances]);

  const totalSpend = completedReceipts.reduce(
    (sum, r) => sum + (r.totalAmount || 0),
    0,
  );

  if (completedReceipts.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        message="Belum Ada Struk yang Diproses"
        subtitle="Proses struk-struk di tab Struk dulu ya, nanti hasilnya bakal muncul di sini."
        className="bg-white/50 rounded-2xl"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <Card className="border-none shadow-soft bg-primary text-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Total Pengeluaran Trip
              </p>
              <p className="text-3xl font-black tracking-tight mt-1">
                {formatToIDR(totalSpend)}
              </p>
              <p className="text-xs text-white/70 mt-1">
                dari {completedReceipts.length} struk yang sudah diproses
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlement instructions */}
      {settlements.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2 px-1">
            <ArrowRight className="w-4 h-4" /> Siapa Bayar ke Siapa
          </h3>
          {settlements.map((s, i) => (
            <Card
              key={i}
              className="border-none shadow-soft animate-in fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                {/* From */}
                <div className="flex flex-col items-center gap-1 w-16">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-200 shadow-sm">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(s.from)}`}
                      alt={s.from}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-foreground truncate w-full text-center">
                    {s.from}
                  </p>
                </div>

                {/* Arrow + amount */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-center">
                    <div className="flex-1 h-0.5 bg-primary/20" />
                    <div className="mx-2 px-3 py-1 bg-primary/10 rounded-full">
                      <p className="text-xs font-black text-primary">
                        {formatToIDR(s.amount)}
                      </p>
                    </div>
                    <div className="flex-1 h-0.5 bg-primary/20" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>

                {/* To */}
                <div className="flex flex-col items-center gap-1 w-16">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(s.to)}`}
                      alt={s.to}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-foreground truncate w-full text-center">
                    {s.to}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-soft bg-emerald-50">
          <CardContent className="p-5 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-800">
                Semua Sudah Beres! 🎉
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Tidak ada hutang-piutang yang tersisa.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-person breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2 px-1">
          <Users className="w-4 h-4" /> Rincian Per Orang
        </h3>
        {balances.map((person, i) => {
          const isExpanded = !!expandedPeople[person.name];

          // Group items by receipt name
          const groupedItems = person.items.reduce<
            Record<string, typeof person.items>
          >((acc, item) => {
            if (!acc[item.receiptName]) {
              acc[item.receiptName] = [];
            }
            acc[item.receiptName].push(item);
            return acc;
          }, {});

          return (
            <Card
              key={i}
              className="border-none shadow-soft animate-in fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardContent className="p-4">
                {/* Header row (Clickable) */}
                <div
                  onClick={() => togglePerson(person.name)}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(person.name)}`}
                      alt={person.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate">
                        {person.name}
                      </p>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      <p className="text-[10px] text-muted-foreground">
                        Bayar:{" "}
                        <span className="font-bold text-foreground">
                          {formatToIDR(person.totalPaid)}
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Hutang:{" "}
                        <span className="font-bold text-foreground">
                          {formatToIDR(person.totalOwed)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-black",
                      person.balance > 0.01
                        ? "bg-emerald-100 text-emerald-700"
                        : person.balance < -0.01
                          ? "bg-red-100 text-red-700"
                          : "bg-muted/50 text-muted-foreground",
                    )}
                  >
                    {person.balance > 0.01
                      ? `+${formatToIDR(person.balance)}`
                      : person.balance < -0.01
                        ? formatToIDR(person.balance)
                        : "Lunas ✓"}
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dashed border-muted/80 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest px-1">
                      Rincian Belanjaan
                    </p>
                    {Object.keys(groupedItems).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(groupedItems).map(
                          ([receiptName, items], idx) => {
                            const receiptSubtotal = items.reduce(
                              (sum, item) => sum + item.share,
                              0,
                            );
                            return (
                              <div
                                key={idx}
                                className="bg-primary/5 rounded-sm p-3 border border-primary/5"
                              >
                                {/* Receipt Header */}
                                <div className="flex items-center justify-between border-b border-primary/10 pb-1.5 mb-1.5">
                                  <span className="text-sm font-extrabold text-primary truncate max-w-[70%]">
                                    {receiptName}
                                  </span>
                                  <span className="text-sm font-extrabold text-primary shrink-0">
                                    {formatToIDR(receiptSubtotal)}
                                  </span>
                                </div>
                                {/* Receipt Items */}
                                <div className="space-y-1.5">
                                  {items.map((item, itemIdx) => (
                                    <div
                                      key={itemIdx}
                                      className="flex justify-between items-center text-[11px] text-foreground/80"
                                    >
                                      <span className="truncate max-w-[65%] flex items-center gap-1">
                                        {item.itemName}
                                        {item.isAdditional && (
                                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded-full font-bold shrink-0 scale-90">
                                            {item.method === "prop"
                                              ? "Proporsional"
                                              : "Biaya Tambahan"}
                                          </span>
                                        )}
                                      </span>
                                      <span className="font-semibold text-foreground/90 shrink-0">
                                        {formatToIDR(item.share)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-xl p-4 text-center text-[10px] text-muted-foreground font-bold">
                        Tidak ada item belanja yang perlu dibayar.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How to Read Section */}
      <HowToReadSummary />
    </div>
  );
};
