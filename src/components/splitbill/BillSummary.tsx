"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SplitBadge } from "./SplitBadge";
import { HowToReadSummary } from "./HowToReadSummary";
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
import { trackSplitBill, trackWallet } from "@/lib/gtag";

interface BillSummaryProps {
  billData?: SplitBillData & {
    id: string;
    activityName: string;
    date: string;
    selectedPaymentMethodIds?: string[];
    paymentMethodSnapshots?: any[];
  };
  showDownload?: boolean;
  isPublic?: boolean;
}

export const BillSummary = ({
  billData,
  showDownload = true,
  isPublic = false,
}: BillSummaryProps) => {
  const store = useSplitBillStore();
  const { paymentMethods: storePaymentMethods } = useWalletStore();

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

  // Use snapshots if available (for public view), otherwise fallback to store
  const effectivePaymentMethods = billData?.paymentMethodSnapshots?.length
    ? billData.paymentMethodSnapshots
    : storePaymentMethods;

  const selectedMethods = effectivePaymentMethods.filter((m: any) =>
    selectedPaymentMethodIds.includes(m.id),
  );

  // Manage expanded state per person for details
  const [expandedPeople, setExpandedPeople] = React.useState<
    Record<string, boolean>
  >({});

  const togglePerson = (name: string) => {
    const isNowOpen = !expandedPeople[name];
    setExpandedPeople((prev) => ({
      ...prev,
      [name]: isNowOpen,
    }));
    trackSplitBill.toggleDetails(name, isNowOpen);
  };

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
      const currentUrl =
        typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
      const caption = `💸 Habis seru-seruan bareng di "${activityName || "Makan-makan"}"!\n\nTotal tagihannya ${formatToIDR(totalSpent)}. Biar pertemanan makin asik, yuk lunasin tagihannya ya! 😉✨\n\nCek rinciannya di sini:\n🔗 ${currentUrl}\n\nPowered by splitbill.my.id`;

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
            trackSplitBill.share("share_api", billData?.id || "");
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

      trackSplitBill.share("download_image", billData?.id || "");

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

  const handleCopy = (text: string, label: string, provider?: string) => {
    navigator.clipboard.writeText(text);
    if (label === "Nomor rekening" && provider) {
      trackWallet.copyAccount(provider);
    }
    toast.success(`${label} berhasil disalin! 📋`, {
      description: text,
      duration: 2000,
    });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href.split("?")[0]; // Clean URL
    navigator.clipboard.writeText(url);
    trackSplitBill.share("copy_link", billData?.id || "");
    toast.success("Link berhasil disalin! 🔗", {
      description: "Bagikan link ini ke teman-temanmu.",
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
      case "Si Paling Hemat":
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
      case "Si Paling Hemat":
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
                    new URLSearchParams(window.location.search).get("new") ===
                    "true" && (
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
                      <div
                        onClick={() => togglePerson(name)}
                        className="bg-primary/5 px-3 py-2.5 flex items-center justify-between border-b border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full border border-primary/10 overflow-hidden bg-white">
                            <img
                              src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                              alt={name}
                              className="w-full h-full"
                            />
                          </div>
                          <h4 className="font-bold text-sm tracking-tight text-foreground">
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
                        <div className="flex items-center gap-3">
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
                              {diff === 0
                                ? "Lunas"
                                : isOwed
                                  ? "Terima"
                                  : "Bayar"}
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
                          {b.items.length > 0 && (
                            <div className="text-muted-foreground">
                              {expandedPeople[name] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          )}
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
                      <AnimatePresence>
                        {b.items.length > 0 && expandedPeople[name] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-white/20"
                          >
                            <div className="px-3 py-2 space-y-1.5">
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
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                          method.providerName,
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
          <HowToReadSummary />
        </div>
      </Card>

      {/* Action Buttons (Share/Download/Monitor) */}
      <div className="space-y-3 mt-4 mb-0 relative group/actions">
        {/* If not showing download (Locked State), show a teaser/overlay */}
        {!showDownload && !isPublic && (
          <div className="absolute inset-x-0 bottom-0 h-24 z-20 flex flex-col items-center justify-end pb-2 mb-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
            <div className="bg-white border border-primary/10 px-3 py-1.5 rounded-full shadow-lg shadow-primary/5 flex items-center gap-1.5 animate-bounce-subtle">
              <span className="text-[10px] font-bold text-primary">
                Simpan dulu yuk! Biar bisa di share bill Aesthetic kamu 📸
              </span>
            </div>
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-2 gap-2 transition-all duration-500",
            !showDownload && "pointer-events-none",
          )}
        >
          <button
            onClick={() => {
              trackSplitBill.share("share_button", billData?.id || "");
              handleShareSocial();
            }}
            disabled={isSharing || !showDownload}
            className={cn(
              "h-12 rounded-lg font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center group cursor-pointer",
              (isSharing || !showDownload) && "opacity-70 cursor-not-allowed",
            )}
          >
            <Share2
              className={cn(
                "w-4 h-4 group-hover:rotate-12 transition-transform",
                isSharing && "animate-pulse",
              )}
            />
            {isSharing ? "..." : "Bagikan"}
          </button>

          <button
            onClick={handleCopyLink}
            disabled={!showDownload}
            className={cn(
              "h-12 rounded-lg font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-white border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center group cursor-pointer",
              !showDownload && "opacity-70 cursor-not-allowed",
            )}
          >
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Salin Link
          </button>
        </div>

        {!isPublic && (
          <button
            onClick={() => {
              if (!showDownload) return;
              trackSplitBill.monitorStatus(billData?.id);
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
            disabled={!showDownload}
            className={cn(
              "w-full h-12 rounded-lg font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-white border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center group cursor-pointer",
              !showDownload && "opacity-50 blur-[0.5px] pointer-events-none",
            )}
          >
            <PiggyBank className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Monitor Status Bayar
          </button>
        )}
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
