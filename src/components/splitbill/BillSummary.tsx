"use client";

import React, { useImperativeHandle } from "react";
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
import { DynamicFinLogo } from "@/components/wallet/DynamicFinLogo";
import { getProviderLogoInfo } from "@/lib/providerLogos";
import { Sparkles, Share2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { SocialSplitBillReceipt } from "./SocialSplitBillReceipt";
import { trackSplitBill, trackWallet } from "@/lib/gtag";
import { useAuthStore } from "@/lib/stores/authStore";

export interface BillSummaryHandle {
  triggerShare: () => void;
  triggerShareText: () => void;
  isSharing: boolean;
}

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
  /** Hide the Bagikan + Salin Link buttons (used when they're shown in a parent card instead) */
  hideShareActions?: boolean;
}

export const BillSummary = React.forwardRef<BillSummaryHandle, BillSummaryProps>(
  function BillSummaryInner({
    billData,
    showDownload = true,
    isPublic = false,
    hideShareActions = false,
  }: BillSummaryProps, ref) {
    const store = useSplitBillStore();
    const { paymentMethods: storePaymentMethods } = useWalletStore();
    const { isAuthenticated } = useAuthStore();

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
    const expenses = billData ? billData.expenses : store.expenses;
    const additionalExpenses = billData
      ? billData.additionalExpenses
      : store.additionalExpenses;
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
    // Will be wired up after handleShareSocial is defined
    const handleShareSocialRef = React.useRef<(() => Promise<void>) | null>(null);

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
        const origin = typeof window !== "undefined" ? window.location.origin : "https://splitbill.my.id";
        const shareUrl = billData?.id ? `${origin}/history/split-bill/${billData.id}` : currentUrl;

        const instructionsText = settlementInstructions.length > 0
          ? "\n\nRincian Transfer:\n" + settlementInstructions.map(inst => `• ${inst.from} ➡️ ${inst.to}: ${formatToIDR(inst.amount)}`).join("\n")
          : "";

        const caption = `💸 Habis seru-seruan bareng di "${activityName || "Makan-makan"}"!\n\nTotal tagihannya ${formatToIDR(totalSpent)}. Biar pertemanan makin asik, yuk lunasin tagihannya ya! 😉✨${instructionsText}\n\nCek rincian lengkapnya di sini:\n🔗 ${shareUrl}\n\nPowered by splitbill.my.id`;

        // Pre-copy text to clipboard as many apps ignore 'text' when 'files' are shared
        try {
          await navigator.clipboard.writeText(caption);
        } catch (clipErr) {
          console.warn("Auto-copy to clipboard failed:", clipErr);
        }

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
              toast.success("Berhasil dibagikan! 📸✨ (Rincian otomatis tersalin ke clipboard)", {
                id: toastId,
                duration: 4000
              });
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

    const handleShareText = async () => {
      const currentUrl =
        typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
      const origin = typeof window !== "undefined" ? window.location.origin : "https://splitbill.my.id";
      const shareUrl = billData?.id ? `${origin}/history/split-bill/${billData.id}` : currentUrl;

      const instructionsText = settlementInstructions.length > 0
        ? "\n\nRincian Transfer:\n" + settlementInstructions.map(inst => `• ${inst.from} ➡️ ${inst.to}: ${formatToIDR(inst.amount)}`).join("\n")
        : "";

      const caption = `💸 Habis seru-seruan bareng di "${activityName || "Makan-makan"}"!\n\nTotal tagihannya ${formatToIDR(totalSpent)}. Biar pertemanan makin asik, yuk lunasin tagihannya ya! 😉✨${instructionsText}\n\nCek rincian lengkapnya di sini:\n🔗 ${shareUrl}\n\nPowered by splitbill.my.id`;

      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        try {
          await navigator.share({
            title: activityName || "Split Bill Summary",
            text: caption,
          });
          trackSplitBill.share("share_api", billData?.id || "");
          toast.success("Berhasil dibagikan! 🚀✨");
          return;
        } catch (shareErr) {
          console.warn(
            "Native share failed, falling back to copy:",
            shareErr,
          );
        }
      }

      try {
        await navigator.clipboard.writeText(caption);
        trackSplitBill.share("copy_link", billData?.id || "");
        toast.success("Rincian & Link berhasil disalin! 📋✨", {
          description: "Tinggal paste ke teman-temanmu.",
        });
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        toast.error("Gagal menyalin rincian.");
      }
    };

    // Keep ref in sync so useImperativeHandle can reference it
    handleShareSocialRef.current = handleShareSocial;
    const handleShareTextRef = React.useRef<(() => Promise<void>) | null>(null);
    handleShareTextRef.current = handleShareText;

    // Expose share trigger to parent via ref
    useImperativeHandle(ref, () => ({
      triggerShare: () => handleShareSocialRef.current?.(),
      triggerShareText: () => handleShareTextRef.current?.(),
      isSharing,
    }), [isSharing]);

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
      handleShareText();
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
            {!isPublic && !billData && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-sm flex items-start gap-2.5 text-amber-800 text-[11px] font-bold leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                <span className="text-sm shrink-0">⚠️</span>
                <p className="flex-1 m-0">
                  <strong>Rincian ini cuma numpang lewat sementara, lho!</strong> Biar gak hilang, yuk <em>secure</em> & simpan ke akun kamu!
                </p>
              </div>
            )}
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
                    const logoInfo = getProviderLogoInfo(
                      method.providerName,
                      method.type === "bank" ? "bank" : "ewallet"
                    );
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
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5 p-1.5 overflow-hidden">
                          {logoInfo.slug ? (
                            <DynamicFinLogo
                              slug={logoInfo.slug}
                              alt={method.providerName}
                              className="w-full h-full"
                            />
                          ) : (
                            <img
                              src={logoInfo.image}
                              alt={method.providerName}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
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

          </div>
        </Card>

        {/* Detailed Expenses & Costs Card */}
        <Card className="p-4 border-primary/20 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="space-y-6 relative z-10">
            {expenses && expenses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
                  Item Pengeluaran 🛍️
                </h3>
                <div className="grid gap-2">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="p-3 rounded-lg border border-primary/10 bg-white/40 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-bold text-sm text-foreground break-words whitespace-normal">
                            {expense.item}
                          </p>
                          {expense.paidBy ? (
                            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                              Dibayar oleh <strong className="text-primary">{expense.paidBy}</strong>
                            </p>
                          ) : (
                            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                              Belum ada pembayar
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-black text-primary shrink-0">
                          {formatToIDR(expense.amount)}
                        </span>
                      </div>

                      {expense.who && expense.who.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-dashed border-primary/5">
                          <span className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-wider mr-1">
                            Bagi ke:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {expense.who.map((name) => (
                              <div
                                key={name}
                                className="flex items-center gap-1 bg-primary/5 border border-primary/10 rounded-full pl-0.5 pr-2 py-0.5 text-[9px] font-bold text-primary"
                              >
                                <img
                                  src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                                  alt={name}
                                  className="w-4 h-4 rounded-full bg-white"
                                />
                                <span className="truncate max-w-[50px]">{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Expenses Info Section */}
            {additionalExpenses && additionalExpenses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
                  Biaya & Potongan Tambahan 🏷️
                </h3>
                <div className="grid gap-2">
                  {additionalExpenses.map((adx) => {
                    const isNegative = adx.amount < 0;
                    return (
                      <div
                        key={adx.id}
                        className={cn(
                          "p-3 rounded-md border flex items-center justify-between transition-all",
                          isNegative
                            ? "bg-emerald-500/5 border-emerald-500/10"
                            : "bg-primary/5 border-primary/10"
                        )}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-foreground">
                              {adx.name}
                            </span>
                            <SplitBadge type={adx.splitType} className="scale-90 origin-left" />
                          </div>
                          <p className="text-[9px] text-muted-foreground font-medium">
                            {isNegative ? (
                              <span>🏷️ Potongan Merchant</span>
                            ) : (
                              <span>Dibayar oleh <strong className="text-primary">{adx.paidBy}</strong></span>
                            )}
                            {" • "}
                            <span>{adx.who.length} Orang terlibat</span>
                          </p>
                        </div>
                        <span className={cn(
                          "text-xs font-black",
                          isNegative ? "text-emerald-600" : "text-primary"
                        )}>
                          {formatToIDR(adx.amount)}
                        </span>
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

          {!hideShareActions && (
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
          )}

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

                const finalPaymentMethodIds = selectedPaymentMethodIds.length > 0
                  ? selectedPaymentMethodIds
                  : storePaymentMethods.map(m => m.id);

                useCollectMoneyStore.getState().createCollection(
                  activityName || "Split Bill",
                  payers,
                  finalPaymentMethodIds,
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
  }
);

BillSummary.displayName = "BillSummary";
