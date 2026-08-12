"use client";

import React from "react";
import { BucketReceipt, SplitLaterBucket } from "@/store/useSplitLaterStore";
import { useWalletStore } from "@/store/useWalletStore";
import { Card, CardContent } from "@/components/ui/Card";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";
import { formatToIDR } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HowToReadSummary } from "@/components/splitbill/HowToReadSummary";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";
import { SocialSplitLaterReceipt } from "./SocialSplitLaterReceipt";
import Image from "next/image";

interface BucketSettlementProps {
  receipts: BucketReceipt[];
  participants: string[];
  bucket: SplitLaterBucket;
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
  bucket,
}: BucketSettlementProps) => {
  const { savedBills, paymentMethods, fetchBills } = useWalletStore();
  const [expandedPeople, setExpandedPeople] = React.useState<
    Record<string, boolean>
  >({});
  const [isSharing, setIsSharing] = React.useState(false);
  const socialReceiptRef = React.useRef<HTMLDivElement>(null);

  // savedBills is only ever populated by fetchBills() (called elsewhere, e.g.
  // member sidebar mount) — a bill finalized via the split-later "Proses Struk"
  // flow never touches this store directly, so refresh it whenever this tab
  // is actually viewed instead of relying on a stale earlier fetch.
  React.useEffect(() => {
    fetchBills().catch((err) =>
      console.error("Failed to refresh saved bills:", err),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const badges = React.useMemo<Record<string, string[]>>(() => {
    const badgeMap: Record<string, string[]> = {};
    participants.forEach((name) => {
      badgeMap[name] = [];
    });

    if (balances.length >= 2) {
      const activeSpenders = balances
        .filter((b) => b.totalOwed > 0.1)
        .sort((a, b) => b.totalOwed - a.totalOwed);

      if (activeSpenders.length > 0) {
        // 1. Si Paling Traktir (Paid the most overall)
        const topPayer = [...activeSpenders].sort((a, b) => b.totalPaid - a.totalPaid)[0];
        if (topPayer && topPayer.totalPaid > 0.01) {
          badgeMap[topPayer.name] = ["Si Paling Traktir"];
        }

        // 2. Si Paling Sultan (Spent the most overall)
        const topSpender = activeSpenders[0];
        if (topSpender) {
          if (!badgeMap[topSpender.name]) {
            badgeMap[topSpender.name] = [];
          }
          if (badgeMap[topSpender.name].length === 0) {
            badgeMap[topSpender.name].push("Si Paling Sultan");
          }
        }

        // 3. Si Paling Hemat (Spent the least overall but active)
        const potentialLowestSpenders = [...activeSpenders].reverse();
        const lowestSpenderCandidate = potentialLowestSpenders.find(
          (s) => s.name !== topSpender?.name && (!badgeMap[s.name] || badgeMap[s.name].length === 0)
        );

        if (lowestSpenderCandidate && activeSpenders.length >= 2) {
          if (!badgeMap[lowestSpenderCandidate.name]) {
            badgeMap[lowestSpenderCandidate.name] = [];
          }
          badgeMap[lowestSpenderCandidate.name].push("Si Paling Hemat");
        }
      }
    }

    return badgeMap;
  }, [balances, participants]);

  const handleShareSocial = async () => {
    if (!socialReceiptRef.current) return;

    setIsSharing(true);
    const toastId = toast.loading("Menyiapkan gambar keren buat sosmed...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataUrl = await htmlToImage.toPng(socialReceiptRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const fileName = `SplitLater-${bucket.title?.replace(/\s+/g, "-") || "Summary"}-${Date.now()}.png`;
      const caption = `💸 Settlement Rangkuman untuk "${bucket.emoji || "✈️"} ${bucket.title || "Trip Kami"}"!\n\nTotal pengeluaran trip ini ${formatToIDR(totalSpend)}.\n\nPowered by www.splitbill.my.id`;

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare
      ) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], fileName, { type: "image/png" });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: bucket.title || "Split Later Settlement",
              text: caption,
            });
            toast.success("Berhasil dibagikan! 📸✨", { id: toastId });
            return;
          }
        } catch (shareErr) {
          console.warn(
            "Native share failed, falling back to download:",
            shareErr,
          );
        }
      }

      // Fallback: Download behavior
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      toast.success("Gambar berhasil dibuat! Tinggal share deh. 📸✨", {
        id: toastId,
      });
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.error("Gagal membagikan gambar.", { id: toastId });
    } finally {
      setIsSharing(false);
    }
  };

  if (completedReceipts.length === 0) {
    return (
      <IllustratedEmptyState
        illustration="/img/empty-state/empty-transaction-image.png"
        title="Belum Ada Struk yang Diproses"
        description="Proses struk di tab Struk dulu ya!"
      />
    );
  }

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Si Paling Traktir":
        return "💳";
      case "Si Paling Sultan":
        return "👑";
      case "Si Paling Hemat":
        return "🍃";
      default:
        return "✨";
    }
  };

  const getRibbonColor = (badge: string) => {
    switch (badge) {
      case "Si Paling Traktir":
        return "bg-emerald-100 text-emerald-700";
      case "Si Paling Sultan":
        return "bg-amber-100 text-amber-700";
      case "Si Paling Hemat":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Encourage to Share Card (SaveBillNudge style) */}
      <Card className="p-3 shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
        <CardContent className="p-2 space-y-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm relative overflow-hidden shrink-0">
              <Image
                src="/img/save-bill-icon.png"
                alt="Save Bill Icon"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Bagikan Settlement Trip! 📸
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>{completedReceipts.length} struk</strong> kelar di-split share gambar settlement ke grup sekarang! 😉
              </p>
            </div>
          </div>

          <button
            onClick={handleShareSocial}
            disabled={isSharing}
            className={cn(
              "w-full h-12 rounded-sm font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center group cursor-pointer",
              isSharing && "opacity-70 cursor-not-allowed",
            )}
          >
            <Share2
              className={cn(
                "w-4 h-4 group-hover:rotate-12 transition-transform",
                isSharing && "animate-pulse",
              )}
            />
            {isSharing ? "Menyiapkan Gambar..." : "Bagikan Rangkuman"}
          </button>
        </CardContent>
      </Card>

      {/* Settlement instructions */}
      {settlements.length > 0 ? (
        <Card className="p-3 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="p-3 bg-primary rounded-sm space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-black text-white tracking-tight">
                  Siapa Bayar ke Siapa
                </p>
              </div>
              <div className="grid gap-2">
                {settlements.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-primary/10 rounded-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={`${AVATAR_BASE_URL}${encodeURIComponent(s.from)}`}
                        className="w-7 h-7 rounded-full bg-white border border-primary/20"
                        alt={s.from}
                      />
                      <p className="text-xs font-medium text-muted-foreground">
                        <span className="text-destructive font-bold">
                          {s.from}
                        </span>{" "}
                        Transfer ke{" "}
                        <span className="text-emerald-600 font-bold">
                          {s.to}
                        </span>
                      </p>
                    </div>
                    <span className="text-sm font-black text-primary">
                      {formatToIDR(s.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-3 shadow-md overflow-hidden relative bg-emerald-50">
          <CardContent className="p-2 flex items-center gap-3">
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
      <Card className="p-3 shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
            Rincian Per Orang
          </h3>
          <div className="grid gap-3">
            {balances.map((person, i) => {
              const isExpanded = !!expandedPeople[person.name];
              const badge = badges[person.name]?.[0];

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
                <div
                  key={i}
                  className="overflow-hidden rounded-sm border border-primary/10 bg-muted/5 transition-all hover:border-primary/20"
                >
                  {/* Person Header */}
                  <div className="bg-primary/5 border-b border-primary/10 hover:bg-primary/10 transition-colors">
                    {badge && (
                      <div
                        className={cn(
                          "w-fit rounded-br-sm px-2 py-1 text-[8px] font-black flex items-center gap-0.5",
                          getRibbonColor(badge),
                        )}
                      >
                        <span>{getBadgeIcon(badge)}</span>
                        {badge}
                      </div>
                    )}
                    <div
                      onClick={() => togglePerson(person.name)}
                      className="px-3 py-2.5 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full border border-primary/10 overflow-hidden bg-white">
                          <img
                            src={`${AVATAR_BASE_URL}${encodeURIComponent(person.name)}`}
                            alt={person.name}
                            className="w-full h-full"
                          />
                        </div>
                        <h4 className="font-bold text-sm tracking-tight text-foreground">
                          {person.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div
                            className={cn(
                              "text-[8px] font-black tracking-tight px-2 py-0.5 rounded-full inline-block whitespace-nowrap",
                              person.balance > 0.01
                                ? "bg-emerald-500/10 text-emerald-600"
                                : person.balance < -0.01
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-muted text-muted-foreground",
                            )}
                          >
                            {person.balance > 0.01
                              ? "Akan Menerima"
                              : person.balance < -0.01
                                ? "Harus Bayar"
                                : "Lunas"}
                          </div>
                          <p
                            className={cn(
                              "text-xs font-black mt-0.5",
                              person.balance > 0.01
                                ? "text-emerald-600"
                                : person.balance < -0.01
                                  ? "text-destructive"
                                  : "text-muted-foreground",
                            )}
                          >
                            {formatToIDR(Math.abs(person.balance))}
                          </p>
                        </div>
                        {person.items.length > 0 && (
                          <div className="text-muted-foreground">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  {person.items.length > 0 && isExpanded && (
                    <div className="bg-white/20 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-1 divide-y divide-dashed divide-primary/10">
                        {Object.entries(groupedItems).map(
                          ([receiptName, items], idx) => {
                            const receiptSubtotal = items.reduce(
                              (sum, item) => sum + item.share,
                              0,
                            );
                            return (
                              <div key={idx} className="py-2.5">
                                {/* Receipt Header */}
                                <div className="flex items-center justify-between mb-1.5">
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
                                      className="flex justify-between items-start text-[11px]"
                                    >
                                      <span className="text-muted-foreground font-medium truncate max-w-[65%] flex items-center gap-1">
                                        {item.itemName}
                                        {item.isAdditional && (
                                          <span className="text-[8px] font-black uppercase px-1 rounded bg-primary/10 text-primary shrink-0 scale-90">
                                            {item.method === "prop"
                                              ? "Proporsional"
                                              : "Biaya Tambahan"}
                                          </span>
                                        )}
                                      </span>
                                      <span className="font-bold text-foreground/80 shrink-0">
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
                    </div>
                  )}

                  {/* Summary Row */}
                  <div className="grid grid-cols-2 divide-x divide-primary/5 border-t border-primary/5 bg-white/40">
                    <div className="px-3 py-1.5">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">
                        Sudah Dibayar
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        {formatToIDR(person.totalPaid)}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 text-right">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">
                        Tagihan Kamu
                      </p>
                      <p className="text-xs font-bold text-primary">
                        {formatToIDR(person.totalOwed)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* How to Read Section */}
      <HowToReadSummary />

      {/* Hidden Social Receipt for Capture */}
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <SocialSplitLaterReceipt
          ref={socialReceiptRef}
          bucket={bucket}
          receipts={receipts}
          balances={balances}
          settlements={settlements}
          badges={badges}
          paymentMethods={paymentMethods}
        />
      </div>
    </div>
  );
};
