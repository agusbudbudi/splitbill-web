"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { useSplitLaterStore, BucketType } from "@/store/useSplitLaterStore";
import { useFriendStore } from "@/lib/stores/friendStore";
import { Save, Briefcase, PenLine, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SavedBestiesSelection } from "@/components/splitbill/SavedBestiesSelection";
import { StepperV2 } from "@/components/splitbill/StepperV2";
import { ParticipantsFormCard } from "@/components/splitbill/ParticipantsFormCard";

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

interface BucketFormBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editBucketId?: string | null;
  onDone?: (bucketId: string) => void;
  /** Which step to land on when the sheet opens. Defaults to 1 (Kategori). */
  initialStep?: 1 | 2 | 3;
}

const FORM_STEPS = [
  { id: 1, label: "Kategori", icon: Briefcase },
  { id: 2, label: "Nama", icon: PenLine },
  { id: 3, label: "Peserta", icon: Users },
];

export const BucketFormBottomSheet = ({
  isOpen,
  onClose,
  editBucketId,
  onDone,
  initialStep = 1,
}: BucketFormBottomSheetProps) => {
  const { updateBucket, buckets } = useSplitLaterStore();
  const { friends, groups, addFriend, trackFriendUsage, getFriendsInGroup } =
    useFriendStore();

  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("✈️");
  const [bucketType, setBucketType] = useState<BucketType>("trip");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(
    "Liburan / Traveling",
  );
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantsError, setParticipantsError] = useState<string | null>(
    null,
  );



  useEffect(() => {
    if (editBucketId && isOpen) {
      const bucket = buckets.find((b) => b.id === editBucketId);
      if (bucket) {
        setTitle(bucket.title);
        setEmoji(bucket.emoji);
        setBucketType(bucket.bucketType);
        setParticipants(bucket.participants);
        const matchingOpt =
          BUCKET_TYPE_OPTIONS.find(
            (opt) =>
              opt.value === bucket.bucketType && opt.emoji === bucket.emoji,
          ) ||
          BUCKET_TYPE_OPTIONS.find((opt) => opt.value === bucket.bucketType);
        if (matchingOpt) {
          setSelectedCategoryLabel(matchingOpt.label);
        }
      }
    } else if (!editBucketId && isOpen) {
      resetForm();
    }
  }, [editBucketId, isOpen]);

  // Land on the requested step every time the sheet is (re)opened
  useEffect(() => {
    if (isOpen) setStep(initialStep);
  }, [isOpen, initialStep]);

  const syncFriendToStore = (name: string) => {
    const existingFriend = friends.find(
      (f) => f.name.toLowerCase() === name.toLowerCase(),
    );
    if (!existingFriend) {
      addFriend({ name });
    } else {
      trackFriendUsage(existingFriend.id);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Nama Split Later tidak boleh kosong!");
      return;
    }
    if (participants.length < 2) {
      toast.error("Minimal 2 orang peserta ya!");
      return;
    }

    if (editBucketId) {
      updateBucket(editBucketId, {
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

      toast.success("Split Later berhasil diupdate! ✏️");
      if (onDone) onDone(editBucketId);
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setEmoji("✈️");
    setBucketType("trip");
    setSelectedCategoryLabel("Liburan / Traveling");
    setParticipants([]);
    setParticipantsError(null);
  };



  const goNext = () => {
    if (step === 2 && !title.trim()) {
      toast.error("Isi nama Split Later/trip dulu ya!");
      return;
    }
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  };

  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));

  const footer = (
    <div className="flex gap-3">
      {step > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="flex-1 h-12 rounded-md bg-white border border-primary/20 text-primary text-sm font-bold active:scale-95 transition-all cursor-pointer"
        >
          Kembali
        </button>
      )}
      {step < 3 ? (
        <Button
          type="button"
          onClick={goNext}
          className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20"
        >
          Lanjut
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleSave}
          disabled={participants.length < 2}
          className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20"
        >
          <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
        </Button>
      )}
    </div>
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Split Later"
      fullScreen
      subHeader={<StepperV2 steps={FORM_STEPS} currentStep={step} />}
      footer={footer}
    >
      <div className="space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-start text-left gap-1 mb-3">
              <h2 className="text-lg font-bold text-foreground">Ini Acara Apaan Nih? 🍜</h2>
              <p className="text-muted-foreground text-xs max-w-[360px]">
                Pilih kategori acara/trip kamu
              </p>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <label className="text-sm font-bold text-foreground">
                    Kategori Acara
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BUCKET_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setBucketType(opt.value);
                        setSelectedCategoryLabel(opt.label);
                        setEmoji(opt.emoji);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-4 px-2 rounded-sm text-xs font-bold transition-all active:scale-95 cursor-pointer border-2",
                        selectedCategoryLabel === opt.label
                          ? "bg-primary/10 border-primary/50 text-primary"
                          : "bg-muted/30 border-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary",
                      )}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-center text-[10px] leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-start text-left gap-1 mb-3">
              <h2 className="text-lg font-bold text-foreground">
                Kasih Nama & Emoji Unik! 🏷️
              </h2>
              <p className="text-muted-foreground text-xs max-w-[360px]">
                Kasih nama & emoji biar gampang dikenali
              </p>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <PenLine className="w-4 h-4 text-primary" />
                  <label className="text-sm font-bold text-foreground">
                    Nama Acara / Trip
                  </label>
                </div>

                <Input
                  placeholder="Contoh: Roadtrip Bandung, Liburan Bali"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="bg-white border-primary/10 h-12 text-sm font-bold px-4 focus-visible:ring-primary/20"
                />

                <p className="text-[11px] text-muted-foreground px-1 -mt-2">
                  Dipakai untuk riwayat & saat dibagikan ke peserta.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-5 space-y-4">
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
                          ? "bg-primary/10 border-2 border-primary/50 scale-105"
                          : "bg-muted/30 border-2 border-transparent hover:bg-primary/5",
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-start text-left gap-1 mb-3">
              <h2 className="text-lg font-bold text-foreground">Siapa Aja yang Join? 👥</h2>
              <p className="text-muted-foreground text-xs max-w-[360px]">
                Ajak minimal 2 bestie buat mulai patungan
              </p>
            </div>

            <ParticipantsFormCard
              people={participants}
              onAdd={(name) => {
                setParticipants([...participants, name]);
                syncFriendToStore(name);
              }}
              onDuplicate={(name) =>
                setParticipantsError(`"${name}" sudah ditambahkan.`)
              }
              onRemove={(name) =>
                setParticipants(participants.filter((p) => p !== name))
              }
              addLabel="Daftar Peserta 👥"
              participantsLabel="Peserta Split Later 👥"
            />

            {participantsError && (
              <p className="text-[10px] text-destructive px-1 -mt-4">
                {participantsError}
              </p>
            )}

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
        )}
      </div>
    </BottomSheet>
  );
};
