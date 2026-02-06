"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  useCollectMoneyStore,
  CollectionSession,
} from "@/store/useCollectMoneyStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import {
  ArrowLeft,
  Plus,
  Share2,
  Trash2,
  Edit2,
  Loader2,
  Wallet,
  CheckCircle2,
  Circle,
  Users,
  Trophy,
  Copy,
  MessageCircle,
  Check,
  MoreVertical,
} from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { useRouter } from "next/navigation";
import { formatToIDR, cn, formatRelativeTime } from "@/lib/utils";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import confetti from "canvas-confetti";
import { ShareCollectionReceipt } from "./ShareCollectionReceipt";
import { ProviderLogo } from "@/components/ui/ProviderLogo";
import { CollectionMoreBottomSheet } from "./CollectionMoreBottomSheet";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface CollectionDashboardProps {
  collection: CollectionSession;
  onBack?: () => void;
}

export const CollectionDashboard = ({
  collection,
  onBack,
}: CollectionDashboardProps) => {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(collection.title);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { paymentMethods } = useWalletStore();
  const {
    togglePayerStatus,
    addPayer,
    removePayer,
    deleteCollection,
    updateCollectionTitle,
    markAllAsPaid,
    toggleArchiveCollection,
  } = useCollectMoneyStore();
  const hasCelebrated = useRef(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  const paidTotal = collection.payers
    .filter((p) => p.isPaid)
    .reduce((acc, p) => acc + p.amount, 0);

  const progress =
    collection.totalAmount > 0
      ? Math.min(Math.round((paidTotal / collection.totalAmount) * 100), 100)
      : 0;

  const unpaidCount = collection.payers.filter((p) => !p.isPaid).length;
  const lastPaidPayer = [...collection.payers]
    .filter((p) => p.isPaid && p.paidAt)
    .sort(
      (a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime(),
    )[0];

  // Celebration Effect
  useEffect(() => {
    if (progress < 100 || hasCelebrated.current) return;

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 200,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    hasCelebrated.current = true;
    toast.success("SELAMAT! Patungan terkumpul semua! 🥳🎉", {
      duration: 5000,
      icon: "✨",
    });
  }, [progress]);

  const handleAddPayer = () => {
    if (!newName || !newAmount || newAmount <= 0) return;

    addPayer(collection.id, newName, newAmount);
    setNewName("");
    setNewAmount(0);
    setIsAdding(false);
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;
    setIsGenerating(true);
    const toastId = toast.loading("Menyiapkan gambar...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for render
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Status-Patungan-${collection.title}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Gambar berhasil disimpan! 🎉", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat gambar", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = () => {
    deleteCollection(collection.id);
    if (onBack) onBack();
    else router.push("/collect-money");
    toast.success("Koleksi dihapus");
  };

  const handleTitleUpdate = () => {
    if (titleInput.trim()) {
      updateCollectionTitle(collection.id, titleInput);
      setIsEditingTitle(false);
    }
  };

  const linkedMethods = paymentMethods.filter((m) =>
    collection.paymentMethodIds?.includes(m.id),
  );

  const handleCopyList = () => {
    setIsCopying(true);
    const unpaid = collection.payers.filter((p) => !p.isPaid);
    const paid = collection.payers.filter((p) => p.isPaid);

    let text = `📦 *Status Patungan: ${collection.title}*\n`;
    text += `Total: *${formatToIDR(collection.totalAmount)}*\n`;
    text += `--------------------------\n\n`;

    if (unpaid.length > 0) {
      text += `⏰ *Belum Bayar:*\n`;
      unpaid.forEach((p, i) => {
        text += `${i + 1}. ${p.name}: *${formatToIDR(p.amount)}*${p.transferTo ? ` (Transfer ke ${p.transferTo})` : ""}\n`;
      });
      text += `\n`;
    }

    if (paid.length > 0) {
      text += `✅ *Sudah Bayar:*\n`;
      paid.forEach((p) => {
        text += `~${p.name}: ${formatToIDR(p.amount)}~\n`;
      });
      text += `\n`;
    }

    if (linkedMethods.length > 0) {
      text += `--------------------------\n`;
      text += `📥 *Transfer ke:*\n`;
      linkedMethods.forEach((m) => {
        text += `*${m.providerName}*\n`;
        text += `No: ${m.accountNumber || m.phoneNumber}\n`;
        text += `a.n ${m.accountName}\n\n`;
      });
    }

    text += `_Update via SplitBill_`;

    navigator.clipboard.writeText(text);
    toast.success("List berhasil disalin! 📋");
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleNudge = (name: string, amount: number) => {
    const text = `Halo ${name}, mau ingetin buat patungan *${collection.title}* sebesar *${formatToIDR(amount)}*. Makasih ya! 🙏`;
    // Using api.whatsapp.com/send for better cross-platform compatibility
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const sortedPayers = [...collection.payers].sort((a, b) => {
    if (a.isPaid === b.isPaid) return a.name.localeCompare(b.name);
    return a.isPaid ? 1 : -1;
  });

  const paidCount = collection.payers.filter((p) => p.isPaid).length;
  const totalCount = collection.payers.length;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-background overflow-y-auto">
      <div className="w-full max-w-[480px] min-h-full flex flex-col relative bg-background">
        {/* Primary Header Background - Now constrained to parent width */}
        <div className="absolute top-0 left-0 w-full h-[250px] bg-primary z-0 rounded-b-[20px]" />

        <div className="relative z-10 flex-1 flex flex-col pb-20 w-full">
          {/* Header */}
          <Header
            title="Detail Patungan"
            showBackButton={true}
            alignTitle="left"
            onBack={onBack ? onBack : () => router.push("/collect-money")}
            rightContent={
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyList}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
                  title="Salin List Teks"
                >
                  {isCopying ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  disabled={isGenerating}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                  title="Bagikan Gambar"
                >
                  <Share2
                    className={cn("w-5 h-5", isGenerating && "animate-pulse")}
                  />
                </button>
                <button
                  onClick={() => setIsMoreOpen(true)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
                  title="Opsi Lainnya"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            }
          />

          <div className="px-4 mt-4">
            {/* Hero Section */}
            <div className="text-center text-white mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isEditingTitle ? (
                  <div className="flex gap-2 items-center justify-center bg-white/10 p-1 rounded-lg backdrop-blur-sm">
                    <Input
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="text-center font-bold text-lg h-8 w-[200px] bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/50"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={handleTitleUpdate}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p
                      className="font-bold text-white text-lg leading-none cursor-pointer hover:opacity-80"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      {collection.title}
                    </p>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <h1 className="text-4xl font-black tracking-tighter mb-4">
                {formatToIDR(collection.totalAmount)}
              </h1>

              <div className="flex flex-col items-center gap-3">
                {/* Stats Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {collection.payers.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-white/80" />
                      <span className="text-[11px] font-bold text-white/80">
                        Belum ada pembayar
                      </span>
                    </div>
                  ) : unpaidCount > 0 ? (
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-white/80" />
                      <span className="text-[11px] font-bold">
                        Kurang {unpaidCount} orang lagi
                      </span>
                    </div>
                  ) : (
                    <div className="bg-emerald-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
                      <Trophy className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] font-bold text-white">
                        Semua Lunas! 🎉
                      </span>
                    </div>
                  )}

                  {lastPaidPayer && (
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 ">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-medium text-white/90">
                        Terakhir:{" "}
                        <span className="font-bold">{lastPaidPayer.name}</span>{" "}
                        <span className="text-white/60 text-[10px]">
                          (
                          {formatRelativeTime(
                            lastPaidPayer.paidAt,
                          ).toLowerCase()}
                          )
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Celebration Card */}
            {progress >= 100 && (
              <div className="mb-6 animate-in zoom-in-95 fade-in duration-500 cursor-default">
                <div className="relative rounded-2xl p-6 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-50/60 border border-emerald-100/50 shadow-2xl shadow-emerald-600/5 backdrop-blur-md group">
                  <div className="absolute -top-3 right-4 p-1 opacity-100 transition-transform group-hover:scale-110 group-hover:rotate-6 z-20">
                    <img
                      alt="Koleksi Selesai"
                      className="w-28 h-28 object-contain"
                      src="/img/feature-collect-money.png"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-primary tracking-tight">
                        Koleksi Selesai!
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold max-w-[220px] leading-relaxed">
                      Kerja bagus! Semua orang sudah bayar patungannya.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Progress Card */}
            <Card className="border-none shadow-md shadow-primary/10 bg-white relative overflow-hidden mb-6">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      Terkumpul
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {formatToIDR(paidTotal)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-primary">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted/40 h-2.5 rounded-full relative overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out relative z-10",
                      progress >= 100
                        ? "bg-gradient-to-r from-emerald-400 to-green-400"
                        : "bg-primary",
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payers List Section */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Daftar Patungan
                  </h3>
                  <div className="flex gap-2">
                    {progress < 100 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAllAsPaid(collection.id)}
                        className="h-8 text-[11px] px-2 text-primary hover:bg-primary/5 font-bold cursor-pointer"
                      >
                        Tandai Semua Lunas
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAdding(!isAdding)}
                      className="h-8 text-[11px] gap-1 px-3 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Tambah
                    </Button>
                  </div>
                </div>
              </div>

              {isAdding && (
                <div className="bg-white border border-primary/20 p-4 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 mb-4">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/70 ml-1">
                        Nama
                      </label>
                      <Input
                        placeholder="Contoh: Udin"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/70 ml-1">
                        Nominal Tagihan
                      </label>
                      <CurrencyInput
                        placeholder="Rp 0"
                        value={newAmount}
                        onChange={(val) => setNewAmount(val || 0)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="ghost"
                      className="flex-1 h-11 text-sm font-bold text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                      onClick={() => setIsAdding(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      className="flex-1 h-11 text-sm font-bold shadow-md shadow-primary/20"
                      onClick={handleAddPayer}
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              )}

              {/* List Items */}
              <div className="space-y-2">
                {collection.payers.length === 0 ? (
                  <Card className="border-none shadow-soft overflow-hidden">
                    <CardContent className="p-4">
                      <EmptyState
                        message="Belum ada orang di list ini"
                        subtitle="Yuk tambah orang untuk mulai patungan!"
                        icon={Users}
                        className="bg-primary/5"
                      />
                    </CardContent>
                  </Card>
                ) : (
                  sortedPayers.map((payer, i) => (
                    <Card
                      key={payer.id}
                      className={cn(
                        "border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden",
                        payer.isPaid ? "bg-emerald-50/30" : "bg-white",
                      )}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full border-2 overflow-hidden shrink-0",
                              payer.isPaid
                                ? "border-emerald-200 ring-2 ring-emerald-100"
                                : "border-white shadow-sm",
                            )}
                          >
                            <img
                              src={`${AVATAR_BASE_URL}${encodeURIComponent(payer.name)}`}
                              alt={payer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-sm font-bold",
                                payer.isPaid
                                  ? "text-emerald-700"
                                  : "text-foreground",
                              )}
                            >
                              {payer.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">
                              Tagihan:{" "}
                              <span className="text-primary">
                                {formatToIDR(payer.amount)}
                              </span>
                            </p>
                            {payer.isPaid && payer.paidAt && (
                              <p className="text-[10px] text-emerald-600 font-bold mt-0.5 animate-in fade-in slide-in-from-left-1">
                                Lunas: {formatRelativeTime(payer.paidAt)}
                              </p>
                            )}
                            {payer.transferTo && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                  Transfer ke {payer.transferTo}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!payer.isPaid && (
                            <button
                              onClick={() =>
                                handleNudge(payer.name, payer.amount)
                              }
                              className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Tagih via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              togglePayerStatus(collection.id, payer.id)
                            }
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer",
                              payer.isPaid
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600"
                                : "bg-muted text-muted-foreground hover:bg-muted-foreground/20",
                            )}
                          >
                            {payer.isPaid ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => removePayer(collection.id, payer.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Linked Payment Methods Section */}
              {linkedMethods.length > 0 && (
                <div className="mt-8 space-y-3 pb-8">
                  <h3 className="text-sm font-bold text-foreground/70 flex items-center gap-2 px-1">
                    <Wallet className="w-4 h-4" /> Informasi Transfer
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {linkedMethods.map((method) => (
                      <div
                        key={method.id}
                        className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4"
                      >
                        <ProviderLogo name={method.providerName} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase font-black text-primary/60 leading-none mb-1 tracking-tight">
                            {method.providerName}
                          </p>
                          <p className="font-bold text-sm text-foreground mb-0.5">
                            {method.accountNumber || method.phoneNumber}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            a.n {method.accountName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              method.accountNumber || method.phoneNumber || "",
                            );
                            toast.success("Nomor rekening disalin!");
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Card for Screenshot */}
      <div className="absolute top-0 left-[-9999px]">
        <ShareCollectionReceipt
          ref={receiptRef}
          collection={collection}
          progress={progress}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Patungan Ini?"
        description="Data yang dihapus tidak bisa dikembalikan."
        confirmText="Hapus"
        icon={Trash2}
        confirmButtonClassName="bg-destructive"
      />

      <CollectionMoreBottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        onArchive={() => {
          toggleArchiveCollection(collection.id);
          toast.success(
            collection.isArchived
              ? "Berhasil dipindahkan ke daftar aktif"
              : "Patungan berhasil diarsipkan! 📦",
          );
        }}
        onDelete={() => setDeleteConfirmOpen(true)}
        isArchived={!!collection.isArchived}
      />
    </div>
  );
};
