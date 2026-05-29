"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSplitLaterStore, BucketType } from "@/store/useSplitLaterStore";
import { useFriendStore } from "@/lib/stores/friendStore";
import { BucketCard } from "@/components/split-later/BucketCard";
import { BucketFormBottomSheet } from "@/components/split-later/BucketFormBottomSheet";
import { FeatureBanner } from "@/components/ui/FeatureBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FolderOpen,
  Plus,
  ArrowLeft,
  X,
  Camera,
  Upload,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  CheckCircle2,
  Trash2,
  PenLine,
  Briefcase,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SavedBestiesSelection } from "@/components/splitbill/SavedBestiesSelection";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

const BUCKET_TYPE_OPTIONS: {
  value: BucketType;
  label: string;
  emoji: string;
}[] = [
    { value: "trip", label: "Liburan / Traveling", emoji: "✈️" },
    { value: "hangout", label: "Makan / Nongkrong", emoji: "🍜" },
    { value: "event", label: "Pesta / Konser / Event", emoji: "🎉" },
    { value: "office", label: "Kantor / Work Trip", emoji: "💼" },
    { value: "household", label: "Belanja / Sembako", emoji: "🏠" },
    { value: "event", label: "Arisan / Gathering", emoji: "🎈" },
    { value: "other", label: "Olahraga / Workout", emoji: "⚽" },
    { value: "other", label: "Kado / Ulang Tahun", emoji: "🎁" },
    { value: "other", label: "Lainnya", emoji: "📦" },
  ];

const EMOJI_OPTIONS = [
  "✈️",
  "🏖️",
  "🏔️",
  "🍜",
  "🎉",
  "💼",
  "🏠",
  "🌴",
  "🎈",
  "⚽",
  "🎁",
  "📦",
];

export default function SplitLaterClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step") || "0");

  const { buckets, getBucketStats, createBucket, addReceipt } =
    useSplitLaterStore();
  const { friends, groups, addFriend, trackFriendUsage, getFriendsInGroup } =
    useFriendStore();

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [activeEditBucketId, setActiveEditBucketId] = useState<string | null>(
    null,
  );

  // Local creation states
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("✈️");
  const [bucketType, setBucketType] = useState<BucketType>("trip");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(
    "Liburan / Traveling",
  );
  const [newParticipant, setNewParticipant] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantsError, setParticipantsError] = useState<string | null>(
    null,
  );

  // Photo receipt state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clean form states when step parameter is cleared (goes back to main page)
  useEffect(() => {
    if (step === 0) {
      resetForm();
    }
  }, [step]);

  const resetForm = () => {
    setTitle("");
    setEmoji("✈️");
    setBucketType("trip");
    setSelectedCategoryLabel("Liburan / Traveling");
    setParticipants([]);
    setNewParticipant("");
    setParticipantsError(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    setIsUploading(false);
  };

  const handleAddParticipant = () => {
    setParticipantsError(null);
    if (!newParticipant.trim()) return;

    const names = newParticipant
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const dupes = names.filter((n) => participants.includes(n));

    if (dupes.length > 0) {
      setParticipantsError(`"${dupes[0]}" sudah ditambahkan.`);
    }

    const toAdd = [...new Set(names)].filter((n) => !participants.includes(n));
    if (toAdd.length > 0) {
      setParticipants([...participants, ...toAdd]);
      setNewParticipant("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleRemoveReceiptFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSave = async (skipPhoto: boolean = false) => {
    if (!title.trim()) {
      toast.error("Nama Split Later tidak boleh kosong!");
      return;
    }
    if (participants.length < 2) {
      toast.error("Minimal 2 orang peserta ya!");
      return;
    }

    setIsUploading(true);
    let uploadedUrl = "";

    try {
      if (!skipPhoto && receiptFile) {
        const toastId = toast.loading("Mengupload foto struk pertama...");
        try {
          const formData = new FormData();
          formData.append("file", receiptFile);

          const res = await fetch("/api/split-later/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (!data.success) throw new Error(data.error || "Upload gagal");
          uploadedUrl = data.url;
          toast.success("Struk pertama berhasil diupload! 📸", { id: toastId });
        } catch (err: any) {
          toast.error(
            err.message || "Upload gagal, membuat Split Later tanpa struk.",
            { id: toastId },
          );
        }
      }

      // Create bucket
      const bucketId = createBucket({
        title: title.trim(),
        emoji,
        bucketType,
        participants,
      });

      // Auto-save participants to Friend Store
      participants.forEach((name) => {
        const existingFriend = friends.find(
          (f) => f.name.toLowerCase() === name.toLowerCase(),
        );
        if (!existingFriend) {
          addFriend({ name });
        } else {
          trackFriendUsage(existingFriend.id);
        }
      });

      // Add receipt if successfully uploaded
      if (uploadedUrl) {
        addReceipt({
          bucketId,
          imageUrl: uploadedUrl,
          status: "pending",
        });
      }

      toast.success("Split Later baru berhasil dibuat! 🗂️");
      resetForm();
      router.push(`/split-later/${bucketId}`);
    } catch (err: any) {
      toast.error("Gagal membuat Split Later baru.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold">Ini Acara Apaan Nih? 🍜</h2>
              <p className="text-muted-foreground text-sm max-w-[360px]">
                Pilih kategori circle/trip lu. Emojinya bakal otomatis
                menyesuaikan, kece kan?
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-primary/5 shadow-soft space-y-4">
              <label className="text-sm font-bold text-foreground px-1 block">
                Kategori Acara
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BUCKET_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setBucketType(opt.value);
                      setSelectedCategoryLabel(opt.label);
                      setEmoji(opt.emoji);
                      if (
                        !title ||
                        BUCKET_TYPE_OPTIONS.some((o) => o.label === title)
                      ) {
                        setTitle(opt.label);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer border",
                      selectedCategoryLabel === opt.label
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                        : "bg-white border-primary/5 text-muted-foreground hover:bg-primary/5 hover:text-primary",
                    )}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-center text-[10px] leading-tight">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold">
                Kasih Nama & Emoji Unik! 🏷️
              </h2>
              <p className="text-muted-foreground text-sm max-w-[360px]">
                Biar ga ketuker sama Split Later sebelah. Bebas edit nama & ganti
                emoji sesuka hati lu!
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-primary/5 shadow-soft space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground px-1">
                  Nama Acara / Trip
                </label>
                <Input
                  placeholder="Contoh: Roadtrip Bandung, Liburan Bali"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="bg-white border-primary/10 h-12 text-sm px-4 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground px-1 block">
                  Pilih Emoji Utama
                </label>
                <div className="grid grid-cols-6 gap-2 w-full">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={cn(
                        "w-full aspect-square text-xl rounded-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center",
                        emoji === e
                          ? "bg-primary/10 border-2 border-primary scale-105"
                          : "bg-muted/30 border-2 border-transparent hover:bg-primary/5",
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold">Siapa Aja yang Join? 👥</h2>
              <p className="text-muted-foreground text-sm max-w-[360px]">
                Minimal ajak 2 bestie biar bisa patungan. Tambah manual atau tap
                dari Besties Gua!
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-primary/5 shadow-soft space-y-6 mb-4">
              {/* Manual input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground px-1 flex items-center justify-between">
                  <span>Daftar Peserta</span>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-black",
                      participants.length >= 2
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {participants.length} Terpilih (min. 2)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nama peserta (bisa lebih dari 1, pisah koma)"
                    value={newParticipant}
                    onChange={(e) => {
                      setNewParticipant(e.target.value);
                      if (participantsError) setParticipantsError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddParticipant();
                      }
                    }}
                    className="flex-1 bg-white border-primary/10 h-12 text-sm px-4 focus-visible:ring-primary/20"
                  />
                  <Button
                    type="button"
                    onClick={handleAddParticipant}
                    disabled={!newParticipant.trim()}
                    size="icon"
                    className="shrink-0 h-12 w-12 rounded-2xl"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                {participantsError && (
                  <p className="text-[10px] text-destructive px-1">
                    {participantsError}
                  </p>
                )}

                {/* Participant bubbles list */}
                {participants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {participants.map((name, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-muted/30 px-2 py-1.5 rounded-full border border-primary/5 group"
                      >
                        <div className="w-5 h-5 rounded-full border border-white overflow-hidden bg-white shrink-0">
                          <img
                            src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-foreground leading-none">
                          {name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setParticipants(
                              participants.filter((p) => p !== name),
                            )
                          }
                          className="hover:text-destructive transition-colors cursor-pointer text-muted-foreground p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Besties & Circle Selection */}
            <SavedBestiesSelection
              selectedNames={participants}
              onToggleFriend={(friendName, friendId) => {
                if (participants.includes(friendName)) {
                  setParticipants(participants.filter((p) => p !== friendName));
                } else {
                  setParticipants([...participants, friendName]);
                  if (friendId) {
                    trackFriendUsage(friendId);
                  }
                }
              }}
              onToggleGroup={(groupId) => {
                const groupFriends = getFriendsInGroup(groupId);
                const allMembersAdded =
                  groupFriends.length > 0 &&
                  groupFriends.every((m) => participants.includes(m.name));

                if (allMembersAdded) {
                  const namesToRemove = groupFriends.map((f) => f.name);
                  setParticipants(
                    participants.filter((p) => !namesToRemove.includes(p)),
                  );
                } else {
                  const toAdd = groupFriends
                    .map((f) => f.name)
                    .filter((name) => !participants.includes(name));
                  setParticipants([...participants, ...toAdd]);
                  groupFriends.forEach((friend) => trackFriendUsage(friend.id));
                }
              }}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold">Spill Struk Pertama Lu! 📸</h2>
              <p className="text-muted-foreground text-sm max-w-[360px]">
                Biar langsung diproses pas lu lagi santai. Selow, ini opsional,
                bisa di-skip dulu!
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-primary/5 shadow-soft space-y-6">
              {receiptPreview ? (
                <div className="space-y-3 w-full">
                  {/* Receipt preview container */}
                  <div className="relative overflow-hidden flex flex-col items-center justify-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={handleRemoveReceiptFile}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-white border-2 border-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center relative border border-primary/20 bg-muted">
                      <img
                        src={receiptPreview}
                        alt="Pratinjau Struk"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  {/* File Name Label Outside Preview Area */}
                  <div className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-muted-foreground bg-primary/5 rounded-md">
                    <div className="bg-primary/10 text-primary w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                      📄
                    </div>
                    <span className="truncate flex-1">{receiptFile?.name}</span>
                  </div>
                </div>
              ) : (
                /* Upload Drag & drop container */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer min-h-[200px]",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-primary/20 bg-primary/2 hover:border-primary/40 hover:bg-primary/5",
                    isUploading && "opacity-60 pointer-events-none",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    capture="environment"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">
                      Tap atau Tarik File Struk
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Gunakan kamera HP atau upload file JPG, PNG, WebP
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-xs font-bold cursor-pointer transition-transform">
                      <Camera className="w-3.5 h-3.5" /> Ambil Foto
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/20 text-primary rounded-full text-xs font-bold cursor-pointer transition-transform">
                      <Upload className="w-3.5 h-3.5" /> Cari File
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const steps = [
    { id: 1, label: "Kategori", icon: Briefcase },
    { id: 2, label: "Nama", icon: PenLine },
    { id: 3, label: "Peserta", icon: Users },
    { id: 4, label: "Struk", icon: Camera },
  ];

  // Render the step creation wizard
  if (step > 0 && step <= 4) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center relative">
        <Header
          title="Buat Split Later"
          showBackButton
          onBack={() => {
            if (step > 1) {
              router.replace(`/split-later?step=${step - 1}`);
            } else {
              router.replace("/split-later");
            }
          }}
          sticky={true}
          className="rounded-b-none shadow-none"
        />

        {/* Sticky Stepper Row */}
        <div className="w-full flex flex-col items-center -mt-px relative z-20">
          <div className="w-full max-w-[600px] bg-primary flex justify-between items-center px-8 pt-2 pb-8 rounded-b-2xl shadow-lg shadow-primary/20 relative">
            <div className="absolute top-[32%] left-12 right-12 h-0.5 bg-white/20 z-0" />
            <div className="absolute top-[32%] left-12 right-12 h-0.5 z-0 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "relative z-10 w-8 h-8 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2",
                  step === s.id
                    ? "bg-white border-white scale-110 shadow-lg shadow-black/10"
                    : step > s.id
                      ? "bg-white border-white"
                      : "bg-primary border-white/40 text-white/40",
                )}
              >
                <s.icon
                  className={cn(
                    "w-4 h-4 font-bold transition-colors duration-500",
                    step >= s.id ? "text-primary" : "text-white/40",
                  )}
                />

                <span
                  className={cn(
                    "absolute -bottom-5 text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap transition-colors duration-500",
                    step === s.id
                      ? "text-white opacity-100"
                      : "text-white/40 opacity-50",
                  )}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <main className="w-full max-w-[600px] px-4 pt-8 pb-32 space-y-6 relative z-10">
          {renderStepContent()}
        </main>

        {/* Sticky CTA Footer */}
        <div className="sticky bottom-0 w-full z-50 pointer-events-none flex justify-center mt-auto">
          <div className="w-full max-w-[600px] relative pointer-events-auto flex flex-col">
            {/* Solid background area for the actions */}
            <div className="bg-background px-4 pb-4 flex flex-col gap-3">
              {step === 1 && (
                <Button
                  type="button"
                  onClick={() => {
                    if (!title) {
                      setTitle(selectedCategoryLabel);
                    }
                    router.replace("/split-later?step=2");
                  }}
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 active:scale-95 bg-primary text-white shadow-primary/20"
                >
                  Lanjut Isi Detail Acara
                </Button>
              )}

              {step === 2 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.replace("/split-later?step=1")}
                    className="flex-1 h-14 rounded-2xl bg-white border border-primary/20 text-primary text-base font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    Kembali
                  </button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!title.trim()) {
                        toast.error("Isi nama Split Later/trip dulu ya!");
                        return;
                      }
                      router.replace("/split-later?step=3");
                    }}
                    className="flex-1 h-14 text-base font-bold rounded-2xl shadow-xl shadow-primary/20"
                  >
                    Lanjut Tambah Peserta
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.replace("/split-later?step=2")}
                    className="flex-1 h-14 rounded-2xl bg-white border border-primary/20 text-primary text-base font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    Kembali
                  </button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (participants.length < 2) {
                        toast.error("Minimal 2 orang peserta ya!");
                        return;
                      }
                      router.replace("/split-later?step=4");
                    }}
                    disabled={participants.length < 2}
                    className={cn(
                      "flex-1 h-14 text-base font-bold rounded-2xl shadow-xl transition-all duration-300",
                      participants.length >= 2
                        ? "bg-primary text-white shadow-primary/20"
                        : "bg-primary/10 text-primary shadow-none opacity-80",
                    )}
                  >
                    Lanjut Upload Struk
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleSave(true)}
                    className="flex-1 h-14 rounded-2xl bg-white border border-primary/20 text-primary text-base font-bold active:scale-95 transition-all hover:bg-muted/10 cursor-pointer disabled:opacity-50"
                  >
                    Lewati Dulu
                  </button>
                  <Button
                    type="button"
                    disabled={!receiptFile || isUploading}
                    onClick={() => handleSave(false)}
                    className="flex-1 h-14 text-base font-bold rounded-2xl shadow-xl shadow-primary/20"
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-1 justify-center">
                        <Upload className="w-4 h-4 animate-bounce" />{" "}
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="w-4 h-4" /> Buat Split Later
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render normal bucket list view
  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Primary color background behind header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-primary z-0 rounded-b-[20px] h-[150px]" />

      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative z-10">
        <Header
          title="Split Later"
          showBackButton
        />

        <div className="flex-1 p-4 pb-10 space-y-6">
          {/* Feature Banner */}
          <FeatureBanner
            title="Split Later 🗂️"
            description={
              <>
                Kumpulin semua struk dulu, <br />
                <span className="font-bold text-primary">
                  split belakangan pas udah santai!
                </span>
              </>
            }
            ctaText="Buat Split Later"
            ctaHref="#"
            illustration="/img/feature-split-later.png"
            illustrationAlt="Ilustrasi Split Later — Kumpulkan foto struk dan split belakangan"
            variant="secondary"
            onCtaClick={(e) => {
              e.preventDefault();
              router.push("/split-later?step=1");
            }}
          />

          {/* Bucket list */}
          {buckets.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              message="Belum Ada Split Later"
              subtitle="Buat Split Later baru buat ngumpulin struk-struk trip atau acara kamu!"
              action={
                <Button
                  onClick={() => router.push("/split-later?step=1")}
                  className="h-12 px-8 font-bold rounded-2xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Split Later Pertama
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-foreground/70">
                  Split Later Kamu ({buckets.length})
                </h2>
                <button
                  onClick={() => router.push("/split-later?step=1")}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Baru
                </button>
              </div>
              {buckets.map((bucket) => (
                <BucketCard
                  key={bucket.id}
                  bucket={bucket}
                  stats={getBucketStats(bucket.id)}
                  onClick={() => router.push(`/split-later/${bucket.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>

      <BucketFormBottomSheet
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setActiveEditBucketId(null);
        }}
        editBucketId={activeEditBucketId}
        onDone={(bucketId) => {
          router.refresh();
        }}
      />
    </div>
  );
}
