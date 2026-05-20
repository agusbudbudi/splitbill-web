"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  Users2,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useFriendStore, Friend } from "@/lib/stores/friendStore";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEffect } from "react";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { trackSocial } from "@/lib/gtag";
import { toast } from "sonner";
import { SavedBestiesSelection } from "./SavedBestiesSelection";

export const PeopleList = () => {
  const { people, addPerson, removePerson } = useSplitBillStore();
  const { friends, groups, addFriend, trackFriendUsage, getFriendsInGroup } =
    useFriendStore();
  const [newName, setNewName] = useState("");

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      const names = newName
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);

      names.forEach((name) => {
        // Add to split bill store
        if (!people.includes(name)) {
          addPerson(name);
        } else {
          toast.info(`${name} udah ada di list kamu! ✅`);
        }

        // Auto-save to friend store if doesn't exist by name
        const existingFriend = friends.find(
          (f) => f.name.toLowerCase() === name.toLowerCase(),
        );
        if (!existingFriend) {
          addFriend({ name });
        } else {
          // If already exists, track usage
          trackFriendUsage(existingFriend.id);
        }
      });
      setNewName("");
    }
  };

  const toggleFriendFromSaved = (friend: Friend) => {
    if (people.includes(friend.name)) {
      removePerson(friend.name);
    } else {
      addPerson(friend.name);
      trackFriendUsage(friend.id);
      trackSocial.useSuggestion("friend");
    }
  };

  const toggleGroupMembers = (groupId: string) => {
    const groupFriends = getFriendsInGroup(groupId);
    const allMembersAdded =
      groupFriends.length > 0 &&
      groupFriends.every((m) => people.includes(m.name));

    if (allMembersAdded) {
      // Logic: If all are there, remove all
      groupFriends.forEach((friend) => {
        removePerson(friend.name);
      });
    } else {
      // Logic: If not all are there, add missing ones
      groupFriends.forEach((friend) => {
        if (!people.includes(friend.name)) {
          addPerson(friend.name);
        }
        trackFriendUsage(friend.id);
      });
      trackSocial.useSuggestion("group");
    }
  };

  return (
    <div
      className="space-y-6 animate-in fade-in slide-in-from-bottom-2"
    >
      {/* 1. Tambah Orang (Primary Action) */}
      <Card id="onboarding-people-list" className="border-primary/20 shadow-md">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground px-1">
              Tambah Orang 👥
            </label>
            <form
              onSubmit={handleAddPerson}
              className="flex items-center gap-2"
            >
              <Input
                type="text"
                placeholder="Nama teman (bisa lebih dari 1, pisah koma)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 h-12"
              />
              <Button
                type="submit"
                disabled={!newName.trim()}
                size="icon"
                className="shrink-0 h-12 w-12"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </form>
          </div>

          {people.length < 2 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {["Gua", "Temen 1", "Temen 2"]
                .filter((name) => !people.includes(name))
                .map((suggest) => (
                  <button
                    key={suggest}
                    onClick={() => addPerson(suggest)}
                    className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary/80 hover:bg-primary/10 border border-primary/10 transition-all active:scale-95 shadow-soft-sm cursor-pointer"
                  >
                    <img
                      src={`${AVATAR_BASE_URL}${encodeURIComponent(suggest)}`}
                      alt={suggest}
                      className="w-6 h-6 rounded-full border-1 border-white bg-white shadow-sm"
                    />
                    <span>+ {suggest}</span>
                  </button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Selected People Grid (Live Feedback) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-bold text-foreground">
            Peserta Split Bill 👥
          </label>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-black transition-all",
              people.length >= 2
                ? "bg-green-100 text-green-700"
                : "bg-primary/10 text-primary",
            )}
          >
            {people.length} Teman / min. 2
          </span>
        </div>

        <div
          className={cn(
            "p-4 rounded-2xl border-1 border-dashed transition-all duration-500 min-h-[140px] flex flex-col items-center justify-center gap-4",
            people.length === 0
              ? "bg-muted/5 border-muted-foreground/10"
              : people.length === 1
                ? "bg-amber-50/30 border-amber-200"
                : "bg-primary/5 border-primary/20 shadow-soft-sm",
          )}
        >
          {people.length === 0 ? (
            <EmptyState
              icon={Users2}
              message="Belum ada orang"
              subtitle="Yuk tambah minimal 2 orang!"
              className="bg-transparent border-none py-2"
            />
          ) : (
            <>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-y-6 gap-x-2 w-full">
                {people.map((name) => (
                  <div
                    key={name}
                    className="relative flex flex-col items-center gap-2 group"
                  >
                    <button
                      onClick={() => removePerson(name)}
                      className="absolute -top-1 -right-1 z-10 bg-destructive text-white rounded-full p-1 hover:scale-110 active:scale-90 transition-all border-2 border-white shadow-sm cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    <div className="w-14 h-14 rounded-full border-2 border-white shadow-soft overflow-hidden bg-white ring-2 ring-primary/5 transition-all">
                      <img
                        src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-foreground/70 truncate w-full text-center px-1">
                      {name}
                    </span>
                  </div>
                ))}
              </div>

              {people.length === 1 ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/50 rounded-full border border-amber-200/50 animate-in fade-in slide-in-from-top-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-amber-700">
                    Tinggal 1 orang lagi nih! 🙏
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100/50 rounded-full border border-green-200/50 animate-in fade-in slide-in-from-top-1">
                  <Check className="w-3 h-3 text-green-600 stroke-[3]" />
                  <p className="text-[10px] font-bold text-green-700">
                    Siap lanjut ke tahap berikutnya! ✅
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3. Saved Items (Progressive Disclosure) */}
      <SavedBestiesSelection
        selectedNames={people}
        onToggleFriend={(friendName, friendId) => {
          const friend = friends.find(
            (f) => f.name === friendName || f.id === friendId,
          );
          if (friend) toggleFriendFromSaved(friend);
        }}
        onToggleGroup={toggleGroupMembers}
      />
    </div>
  );
};
