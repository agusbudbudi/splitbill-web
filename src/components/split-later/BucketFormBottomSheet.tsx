"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSplitLaterStore, BucketType } from "@/store/useSplitLaterStore";
import { useFriendStore } from "@/lib/stores/friendStore";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createPortal } from "react-dom";
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

interface BucketFormBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editBucketId?: string | null;
  onDone?: (bucketId: string) => void;
}

export const BucketFormBottomSheet = ({
  isOpen,
  onClose,
  editBucketId,
  onDone,
}: BucketFormBottomSheetProps) => {
  const { updateBucket, buckets } = useSplitLaterStore();
  const { friends, groups, addFriend, trackFriendUsage, getFriendsInGroup } =
    useFriendStore();

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
    setNewParticipant("");
    setParticipantsError(null);
  };



  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute bottom-0 w-full max-w-[600px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]",
          "animate-in slide-in-from-bottom-full duration-300 ease-out",
        )}
      >
        {/* Drag handle */}
        <div
          className="w-full flex justify-center pt-2 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">Edit Split Later</h2>
          </div>
        </div>

        {/* Form Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Nama Split Later */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground px-1">
              Nama Acara / Trip
            </label>
            <Input
              placeholder="Contoh: Roadtrip Bandung, Liburan Bali"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white h-12"
            />
          </div>

          {/* Emoji Picker */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground px-1">
              Pilih Emoji 🎨
            </label>
            <div className="flex overflow-x-auto py-1 pb-2 scrollbar-hide gap-2 px-1">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "w-10 h-10 text-xl rounded-sm transition-all active:scale-95 cursor-pointer shrink-0",
                    emoji === e
                      ? "bg-primary/10 border-2 border-primary scale-110"
                      : "bg-muted/30 border-2 border-transparent hover:bg-primary/5",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground px-1">
              Tipe Acara
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
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer border border-primary/5 ",
                    selectedCategoryLabel === opt.label
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-center">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Peserta Form */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground px-1">
              Peserta Trip 👥{" "}
              <span className="text-muted-foreground font-normal">
                (min. 2)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ketik nama, pisahkan dengan koma..."
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
                className="flex-1 bg-white h-12"
              />
              <Button
                type="button"
                onClick={handleAddParticipant}
                disabled={!newParticipant.trim()}
                size="icon"
                className="shrink-0 h-12 w-12"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {participantsError && (
              <p className="text-[10px] text-destructive px-1">
                {participantsError}
              </p>
            )}

            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-muted/30 px-2 py-1.5 rounded-full border border-primary/5 group"
                  >
                    <div className="w-5 h-5 rounded-full border border-white shadow-sm overflow-hidden bg-white shrink-0">
                      <img
                        src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setParticipants(participants.filter((p) => p !== name))
                      }
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
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
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-primary/5 bg-background">
          <Button
            type="button"
            onClick={handleSave}
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
