"use client";

import React from "react";
import { BucketReceipt, SplitLaterBucket } from "@/store/useSplitLaterStore";
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
  Share2,
  Image as ImageIcon,
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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&seed=";

export const BucketSettlement = ({
  receipts,
  participants,
  bucket,
}: BucketSettlementProps) => {
  const { savedBills, paymentMethods } = useWalletStore();
  const [expandedPeople, setExpandedPeople] = React.useState<
    Record<string, boolean>
  >({});
  const [isSharing, setIsSharing] = React.useState(false);
  const socialReceiptRef = React.useRef<HTMLDivElement>(null);

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
      const caption = `💸 Settlement Rangkuman untuk "${bucket.emoji || "✈️"} ${bucket.title || "Trip Kami"}"!\n\nTotal pengeluaran trip ini ${formatToIDR(totalSpend)}.\n\nPowered by splitbill.my.id`;

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
      {/* Encourage to Share Card (SaveBillNudge style) */}
      <Card className="border border-primary/20 shadow-soft bg-primary/5 overflow-hidden rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl relative overflow-hidden shrink-0">
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

          <div className="flex items-center gap-4 px-1">
            <div className="flex -space-x-2">
              {[TrendingUp, ImageIcon, WhatsAppIcon].map((Icon, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shadow-sm relative border-2 border-white",
                    i === 0
                      ? "z-0 bg-amber-50 text-amber-500"
                      : i === 1
                        ? "z-10 bg-blue-50 text-blue-500"
                        : "z-20 bg-emerald-50 text-emerald-500",
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", i === 2 && "w-3 h-3")} />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">
              Auto-download gambar & langsung share ke sosmed! 📸
            </p>
          </div>

          <button
            onClick={handleShareSocial}
            disabled={isSharing}
            className={cn(
              "w-full h-11 rounded-lg font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-primary text-white shadow-md shadow-primary/10 flex items-center justify-center group cursor-pointer",
              isSharing && "opacity-75 cursor-not-allowed",
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
