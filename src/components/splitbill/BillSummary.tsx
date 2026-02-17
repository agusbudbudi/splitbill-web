"use client";

import React from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Card, CardContent } from "@/components/ui/Card";
import { formatToIDR, cn } from "@/lib/utils";
import {
  ReceiptText,
  ArrowRight,
  User,
  AlertCircle,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { SplitBadge } from "./SplitBadge";
import {
  useBillCalculations,
  SplitBillData,
  BillBalances,
  SettlementInstruction,
  BillItem,
} from "@/hooks/useBillCalculations";
import { useWalletStore } from "@/store/useWalletStore";
import { Wallet, PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCollectMoneyStore } from "@/store/useCollectMoneyStore";
import { ProviderLogo } from "@/components/ui/ProviderLogo";
import { Sparkles, Share2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { SocialSplitBillReceipt } from "./SocialSplitBillReceipt";

interface BillSummaryProps {
  billData?: SplitBillData & {
    id: string;
    activityName: string;
    date: string;
    selectedPaymentMethodIds?: string[];
  };
  showDownload?: boolean;
}

export const BillSummary = ({
  billData,
  showDownload = true,
}: BillSummaryProps) => {
  const store = useSplitBillStore();
  const { paymentMethods } = useWalletStore();

  // Use props if provided, otherwise fall back to store
  const router = useRouter();
  const dataForCalc = billData
    ? {
        people: billData.people,
        expenses: billData.expenses,
        additionalExpenses: billData.additionalExpenses,
      }
    : undefined;

  const { balances, totalSpent, settlementInstructions, badges } =
    useBillCalculations(dataForCalc);

  const people = billData ? billData.people : store.people;
  const activityName = billData ? billData.activityName : store.activityName;
  const selectedPaymentMethodIds = billData
    ? billData.selectedPaymentMethodIds || []
    : store.selectedPaymentMethodIds;

  const selectedMethods = paymentMethods.filter((m) =>
    selectedPaymentMethodIds.includes(m.id),
  );

  const [isSharing, setIsSharing] = React.useState(false);
  const socialReceiptRef = React.useRef<HTMLDivElement>(null);

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

      const fileName = `SplitBill-${activityName?.replace(/\s+/g, "-") || "Summary"}-${new Date().getTime()}.png`;
      const caption = `💸 Habis seru-seruan bareng di "${activityName || "Makan-makan"}"!\n\nTotal tagihannya ${formatToIDR(totalSpent)}. Biar pertemanan makin asik, yuk lunasin tagihannya ya! 😉✨\n\nCek rinciannya di gambar ini. Powered by splitbill.my.id`;

      // Try native share if available
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
              title: activityName || "Split Bill Summary",
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin! 📋`, {
      description: text,
      duration: 2000,
    });
  };

  if (
    people.length === 0 ||
    (!billData &&
      store.expenses.length === 0 &&
      store.additionalExpenses.length === 0)
  ) {
    return null;
  }

  const AVATAR_BASE_URL =
    "https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=48&scale=100&seed=";

  const dateToDisplay = billData ? new Date(billData.date) : new Date();
  const currentDate = dateToDisplay.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Si Paling Traktir":
        return "💳";
      case "Si Paling Sultan":
        return "👑";
      case "Si Paling Irit":
        return "🍃";
      default:
        return "✨";
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Si Paling Traktir":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Si Paling Sultan":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Si Paling Irit":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-primary/5 text-primary border-primary/10";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="p-4 border-primary/20 shadow-md overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <h2 className="text-xl font-black text-foreground">
                  {activityName || "Aktivitas Tanpa Nama"}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    Dibuat pada {currentDate}
                  </p>
                  {typeof window !== "undefined" && 
                    new URLSearchParams(window.location.search).get("new") === "true" && (
                    <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded-full shadow-sm shadow-primary/20">
                      BARU
                    </span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <ReceiptText className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Consolidated Stats Display */}
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 flex flex-row items-center justify-between transition-all hover:bg-primary/[0.07]">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase font-black text-primary/60 tracking-wider">
                  Total Tagihan
                </p>
                <p className="text-3xl font-black text-primary tracking-tighter">
                  {formatToIDR(totalSpent)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">
                  Total Orang
                </p>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    {
                      people.filter(
                        (name) =>
                          balances[name].paid > 0 || balances[name].spent > 0,
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Instructions Banner */}
          {settlementInstructions.length > 0 && (
            <div className="p-4 bg-primary/5 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground tracking-tight">
                  Instruksi Transfer
                </p>
              </div>
              <div className="grid gap-2">
                {settlementInstructions.map((inst, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white/60 border border-primary/10 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={`${AVATAR_BASE_URL}${encodeURIComponent(inst.from)}`}
                          className="w-7 h-7 rounded-full bg-white border border-primary/20"
                          alt={inst.from}
                        />
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        <span className="text-destructive font-bold">
                          {inst.from}
                        </span>{" "}
                        →{" "}
                        <span className="text-emerald-600 font-bold">
                          {inst.to}
                        </span>
                      </p>
                    </div>
                    <span className="text-xs font-black text-primary">
                      {formatToIDR(inst.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Person Breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
              Rincian Per Orang
            </h3>
            <div className="grid gap-3">
              {people
                .filter((name) => {
                  const b = balances[name];
                  return b.paid > 0 || b.spent > 0;
                })
                .map((name) => {
                  const b = balances[name];
                  const diff = b.spent - b.paid;
                  const isOwed = diff < 0;

                  return (
                    <div
                      key={name}
                      className="overflow-hidden rounded-lg border border-primary/10 bg-muted/5 transition-all hover:border-primary/20"
                    >
                      {/* Person Header */}
                      <div className="bg-primary/5 px-3 py-2.5 flex items-center justify-between border-b border-primary/10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full border border-primary/10 overflow-hidden bg-white">
                            <img
                              src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                              alt={name}
                              className="w-full h-full"
                            />
                          </div>
                          <h4 className="font-bold text-sm tracking-tight">
                            {name}
                          </h4>
                          {badges[name]?.map((badge: string) => (
                            <span
                              key={badge}
                              className={cn(
                                "text-[8px] font-black px-1.5 py-0.5 rounded-full border flex items-center gap-0.5",
                                getBadgeColor(badge),
                              )}
                            >
                              <span>{getBadgeIcon(badge)}</span>
                              {badge}
                            </span>
                          ))}
                        </div>
                        <div className="text-right">
                          <div
                            className={cn(
                              "text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full inline-block",
                              diff === 0
                                ? "bg-muted text-muted-foreground"
                                : isOwed
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-destructive/10 text-destructive",
                            )}
                          >
                            {diff === 0 ? "Lunas" : isOwed ? "Terima" : "Bayar"}
                          </div>
                          <p
                            className={cn(
                              "text-xs font-black mt-0.5",
                              diff === 0
                                ? "text-muted-foreground"
                                : isOwed
                                  ? "text-emerald-600"
                                  : "text-destructive",
                            )}
                          >
                            {formatToIDR(Math.abs(diff))}
                          </p>
                        </div>
                      </div>

                      {/* Summary Row */}
                      <div className="grid grid-cols-2 divide-x divide-primary/5 border-b border-primary/5 bg-white/40">
                        <div className="px-3 py-1.5">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase">
                            Membayar
                          </p>
                          <p className="text-xs font-bold text-foreground">
                            {formatToIDR(b.paid)}
                          </p>
                        </div>
                        <div className="px-3 py-1.5 text-right">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase">
                            Total Beban
                          </p>
                          <p className="text-xs font-bold text-primary">
                            {formatToIDR(b.spent)}
                          </p>
                        </div>
                      </div>

                      {/* Items List */}
                      {b.items.length > 0 && (
                        <div className="px-3 py-2 space-y-1.5 bg-white/20">
                          {b.items.map((item: BillItem, idx: number) => (
                            <div
                              key={idx}
                              className="flex justify-between items-start text-[11px]"
                            >
                              <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0 pr-4">
                                <span className="text-muted-foreground font-medium truncate">
                                  {item.name}
                                </span>
                                {item.share < 0 && (
                                  <span className="text-[8px] font-black uppercase px-1 rounded bg-destructive/10 text-destructive">
                                    Disc
                                  </span>
                                )}
                                {item.isAdditional && (
                                  <SplitBadge
                                    type={
                                      item.method === "prop"
                                        ? "proportionally"
                                        : "equally"
                                    }
                                    className="text-[8px] scale-90 origin-left"
                                  />
                                )}
                              </div>
                              <span className="font-bold text-foreground/80 shrink-0">
                                {formatToIDR(item.share)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Payment Methods Section */}
          {selectedMethods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
                Metode Pembayaran 📥
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedMethods.map((method) => {
                  return (
                    <div
                      key={method.id}
                      onClick={() =>
                        handleCopy(
                          method.accountNumber || method.phoneNumber || "",
                          "Nomor rekening",
                        )
                      }
                      className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-all active:scale-[0.98] group/copy"
                    >
                      <ProviderLogo name={method.providerName} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase font-black text-primary/60 leading-none mb-1 tracking-tight truncate">
                          {method.providerName}
                        </p>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="font-bold text-xs text-foreground truncate leading-none">
                            {method.accountNumber || method.phoneNumber}
                          </p>
                          <Copy className="w-2.5 h-2.5 text-primary/40 group-hover/copy:text-primary transition-colors shrink-0" />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-medium truncate mt-1">
                          a.n. {method.accountName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How to Read Section */}
          <div className="p-4 bg-muted/20 border border-primary/5 rounded-xl space-y-3 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <AlertCircle className="w-20 h-20 text-primary" />
            </div>
            <div className="flex items-center gap-2 text-primary">
              <AlertCircle className="w-4 h-4 fill-primary/10" />
              <h4 className="font-bold text-xs">Cara Baca Ringkasan</h4>
            </div>
            <div className="grid gap-2 relative z-10">
              <div className="flex items-center gap-3 text-[11px] bg-white/60 p-2 rounded-lg border border-primary/5">
                <span className="text-destructive font-black uppercase text-[9px] min-w-[50px] text-center bg-destructive/10 py-0.5 rounded">
                  Bayar
                </span>
                <span className="text-muted-foreground font-medium">
                  Uang yang harus kamu bayarkan ke teman.
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] bg-white/60 p-2 rounded-lg border border-primary/5">
                <span className="text-emerald-600 font-black uppercase text-[9px] min-w-[50px] text-center bg-emerald-500/10 py-0.5 rounded">
                  Terima
                </span>
                <span className="text-muted-foreground font-medium">
                  Uang yang bakal kamu terima dari teman.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3 mt-4">
        <button
          onClick={handleShareSocial}
          disabled={isSharing}
          className={cn(
            "w-full h-12 rounded-lg font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center group cursor-pointer",
            isSharing && "opacity-70 cursor-not-allowed",
          )}
        >
          <Share2
            className={cn(
              "w-4 h-4 group-hover:rotate-12 transition-transform",
              isSharing && "animate-pulse",
            )}
          />
          {isSharing ? "Menyiapkan..." : "Bagikan ke Media Sosial"}
        </button>

        <button
          onClick={() => {
            const collections = useCollectMoneyStore.getState().collections;
            const sourceId = billData?.id;

            // 1. If we have a sourceId, check if it already has a collection
            if (sourceId) {
              const existingCollection = collections.find(
                (c) => c.sourceId === sourceId,
              );
              if (existingCollection) {
                useCollectMoneyStore
                  .getState()
                  .setActiveCollection(existingCollection.id);
                router.push("/collect-money?autoOpen=true");
                toast.success("Membuka monitor status bayar...");
                return;
              }
            }

            // 2. If no existing collection or no sourceId (unsaved draft), create new
            if (settlementInstructions.length === 0) {
              toast.success("Semua orang sudah lunas/impas! 🎉");
              return;
            }

            const payers = settlementInstructions.map((inst) => ({
              name: inst.from,
              amount: inst.amount,
              transferTo: inst.to,
            }));

            useCollectMoneyStore.getState().createCollection(
              activityName || "Split Bill",
              payers,
              selectedPaymentMethodIds,
              sourceId, // Pass the sourceId to associate it
            );

            router.push("/collect-money?autoOpen=true");
            toast.success("Monitoring Patungan dibuat!");
          }}
          className="w-full h-12 rounded-lg font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-white border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center group cursor-pointer"
        >
          <PiggyBank className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Monitor Status Bayar
        </button>
      </div>

      {/* Hidden Social Receipt for Capture */}
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <SocialSplitBillReceipt
          ref={socialReceiptRef}
          data={{
            people,
            activityName: activityName || "Laporan Keuangan Tongkrongan",
            totalSpent,
            settlementInstructions,
            balances,
            badges,
            selectedMethods,
            expenses: [], // Not needed for the receipt
            additionalExpenses: [], // Not needed for the receipt
          }}
        />
      </div>
    </div>
  );
};
