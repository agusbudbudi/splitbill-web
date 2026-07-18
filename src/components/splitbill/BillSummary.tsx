"use client";

import React, { useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { Card, CardContent } from "@/components/ui/Card";
import { formatToIDR, cn, getFriendAvatarUrl } from "@/lib/utils";
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
  Calendar,
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
import { toast } from "sonner";
import { DynamicFinLogo } from "@/components/wallet/DynamicFinLogo";
import { getProviderLogoInfo } from "@/lib/providerLogos";
import { Sparkles, Share2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { SocialSplitBillReceipt } from "./SocialSplitBillReceipt";
import { MonitorStatusButton } from "./MonitorStatusButton";
import { trackSplitBill, trackWallet } from "@/lib/gtag";
import { useAuthStore } from "@/lib/stores/authStore";
import { AuthModal } from "@/components/auth/AuthModal";
import { SecureDraftBanner } from "./SecureDraftBanner";

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
  /** Hide the Monitor Status Bayar button (used when the parent renders it elsewhere on the page) */
  hideMonitorButton?: boolean;
  /** Reuse the parent's own save/login flow (e.g. the "Simpan & Share" CTA's auth popup)
   *  instead of showing a separate local auth modal. If omitted, falls back to a
   *  self-contained AuthModal. */
  onLoginClick?: () => void;
}

export const BillSummary = React.forwardRef<BillSummaryHandle, BillSummaryProps>(
  function BillSummaryInner({
    billData,
    showDownload = true,
    isPublic = false,
    hideShareActions = false,
    hideMonitorButton = false,
    onLoginClick,
  }: BillSummaryProps, ref) {
    const store = useSplitBillStore();
    const { paymentMethods: storePaymentMethods } = useWalletStore();
    const { isAuthenticated } = useAuthStore();
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Use props if provided, otherwise fall back to store
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
        <Card className="border-primary/20 shadow-md overflow-hidden relative">
          {!isAuthenticated && !isPublic && !billData && (
            <SecureDraftBanner
              onLoginClick={onLoginClick ?? (() => setShowAuthModal(true))}
            />
          )}

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

          <div className="p-4 space-y-4 relative z-10">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <h2 className="text-xl font-black text-foreground truncate">
                    {activityName || "Aktivitas Tanpa Nama"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-primary/60" />
                    Dibuat pada {currentDate}
                    {typeof window !== "undefined" &&
                      new URLSearchParams(window.location.search).get(
                        "new"
                      ) === "true" && (
                        <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded-full shadow-sm shadow-primary/20">
                          BARU
                        </span>
                      )}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <img
                    src="/img/icon-splitbill.png"
                    alt="Split Bill"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>

              {/* Consolidated Stats Display */}
              <div className="flex flex-row items-center justify-between border-t border-primary/10 pt-4">
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
              <div className="p-3 bg-primary rounded-sm space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-black text-white tracking-tight">
                    Instruksi Transfer
                  </p>
                </div>
                <div className="grid gap-2">
                  {settlementInstructions.map((inst, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white border border-primary/10 rounded-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={getFriendAvatarUrl(inst.from, 48)}
                            className="w-7 h-7 rounded-full bg-white border border-primary/20"
                            alt={inst.from}
                          />
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">
                          <span className="text-destructive font-bold">
                            {inst.from}
                          </span>{" "}
                          Transfer ke{" "}
                          <span className="text-emerald-600 font-bold">
                            {inst.to}
                          </span>
                        </p>
                      </div>
                      <span className="text-sm font-black text-primary">
                        {formatToIDR(inst.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Detailed Expenses & Costs Card */}
        <Card className="p-3 border-primary/20 shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="space-y-4 relative z-10">
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
                        className="overflow-hidden rounded-sm border border-primary/10 bg-muted/5 transition-all hover:border-primary/20"
                      >
                        {/* Person Header */}
                        <div className="bg-primary/5 border-b border-primary/10 hover:bg-primary/10 transition-colors">
                          {badges[name]?.[0] && (
                            <div
                              className={cn(
                                "w-fit rounded-br-sm px-2 py-1 text-[8px] font-black flex items-center gap-0.5",
                                getRibbonColor(badges[name][0]),
                              )}
                            >
                              <span>{getBadgeIcon(badges[name][0])}</span>
                              {badges[name][0]}
                            </div>
                          )}
                          <div
                            onClick={() => togglePerson(name)}
                            className="px-3 py-2.5 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full border border-primary/10 overflow-hidden bg-white">
                                <img
                                  src={getFriendAvatarUrl(name, 48)}
                                  alt={name}
                                  className="w-full h-full"
                                />
                              </div>
                              <h4 className="font-bold text-sm tracking-tight text-foreground">
                                {name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div
                                  className={cn(
                                    "text-[8px] font-black tracking-tight px-2 py-0.5 rounded-full inline-block whitespace-nowrap",
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
                                      ? "Akan Menerima"
                                      : "Harus Bayar"}
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

                        {/* Summary Row */}
                        <div className="grid grid-cols-2 divide-x divide-primary/5 border-t border-primary/5 bg-white/40">
                          <div className="px-3 py-1.5">
                            <p className="text-[9px] text-muted-foreground font-bold uppercase">
                              Sudah Dibayar
                            </p>
                            <p className="text-xs font-bold text-foreground">
                              {formatToIDR(b.paid)}
                            </p>
                          </div>
                          <div className="px-3 py-1.5 text-right">
                            <p className="text-[9px] text-muted-foreground font-bold uppercase">
                              Tagihan Kamu
                            </p>
                            <p className="text-xs font-bold text-primary">
                              {formatToIDR(b.spent)}
                            </p>
                          </div>
                        </div>
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
                        className="p-3 bg-primary/5 border border-primary/10 rounded-sm flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-all active:scale-[0.98] group/copy"
                      >
                        <div className="w-12 h-12 rounded-sm bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/5 p-1.5 overflow-hidden">
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

        {/* Expenses Detail Card */}
        {((expenses && expenses.length > 0) || (additionalExpenses && additionalExpenses.length > 0)) && (
          <Card className="p-3 border-primary/20 shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              {/* Item Pengeluaran */}
              {expenses && expenses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
                    Item Pengeluaran 🛍️
                  </h3>
                  <div className="divide-y divide-dashed divide-primary/10 px-1">
                    {expenses.map((expense, idx) => (
                      <div
                        key={expense.id}
                        className="py-2.5 flex flex-col gap-0.5"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-sm text-foreground break-words whitespace-normal min-w-0 flex-1 pr-2">
                            <span className="text-muted-foreground font-medium">{idx + 1}.</span> {expense.item}
                          </p>
                          <span className="text-xs font-black text-primary shrink-0">
                            {formatToIDR(expense.amount)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {expense.paidBy ? (
                            <>Dibayar oleh <strong className="text-primary">{expense.paidBy}</strong></>
                          ) : (
                            "Belum ada pembayar"
                          )}
                          {expense.who && expense.who.length > 0 && (
                            <> • Dibagi ke <strong className="text-primary">{expense.who.join(", ")}</strong></>
                          )}
                        </p>
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
                  <div className="divide-y divide-dashed divide-primary/10 px-1">
                    {additionalExpenses.map((adx, idx) => {
                      const isNegative = adx.amount < 0;
                      return (
                        <div
                          key={adx.id}
                          className="py-2.5 flex flex-col gap-0.5"
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-sm text-foreground min-w-0 flex-1 pr-2 flex items-center gap-1.5">
                              <span className="text-muted-foreground font-medium">{idx + 1}.</span>
                              {adx.name}
                              <SplitBadge type={adx.splitType} className="scale-90 origin-left" />
                            </p>
                            <span className={cn(
                              "text-xs font-black shrink-0",
                              isNegative ? "text-emerald-600" : "text-primary"
                            )}>
                              {formatToIDR(adx.amount)}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {isNegative ? (
                              "🏷️ Potongan Merchant"
                            ) : (
                              <>Dibayar oleh <strong className="text-primary">{adx.paidBy}</strong></>
                            )}
                            {" • "}
                            {adx.who.length} Orang terlibat
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

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
                  "h-12 rounded-sm font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center group cursor-pointer",
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
                  "h-12 rounded-sm font-bold gap-2 text-sm transition-all active:scale-[0.98] bg-white border border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center group cursor-pointer",
                  !showDownload && "opacity-70 cursor-not-allowed",
                )}
              >
                <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Salin Link
              </button>
            </div>
          )}

          {!isPublic && !hideMonitorButton && (
            <MonitorStatusButton
              billId={billData?.id}
              activityName={activityName}
              settlementInstructions={settlementInstructions}
              selectedPaymentMethodIds={selectedPaymentMethodIds}
              disabled={!showDownload}
            />
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

        {!onLoginClick && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    );
  }
);

BillSummary.displayName = "BillSummary";
