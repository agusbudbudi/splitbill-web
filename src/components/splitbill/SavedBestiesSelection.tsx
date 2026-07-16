"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Info, Check, Search, Plus } from "lucide-react";
import { useFriendStore } from "@/lib/stores/friendStore";
import { cn } from "@/lib/utils";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface SavedBestiesSelectionProps {
  selectedNames: string[];
  onToggleFriend: (friendName: string, friendId?: string) => void;
  onToggleGroup: (groupId: string) => void;
}

export const SavedBestiesSelection = ({
  selectedNames,
  onToggleFriend,
  onToggleGroup,
}: SavedBestiesSelectionProps) => {
  const { friends, groups, getFriendsInGroup } = useFriendStore();

  const [isSavedExpanded, setIsSavedExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const itemsToShow = 6;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setContentHeight(el.scrollHeight);
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  const sortedFriends = [...friends].sort((a, b) => {
    const countA = a.useCount ?? 0;
    const countB = b.useCount ?? 0;
    if (countB !== countA) return countB - countA;
    const dateA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
    const dateB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
    return dateB - dateA;
  });

  const searchedFriends = search.trim()
    ? sortedFriends.filter((f) =>
        f.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : sortedFriends;

  const displayedFriends = isExpanded
    ? searchedFriends
    : searchedFriends.slice(0, itemsToShow);

  const groupsWithMembers = groups.filter(
    (g) => getFriendsInGroup(g.id).length > 0,
  );

  const hasSavedItems = friends.length > 0 || groupsWithMembers.length > 0;

  if (!hasSavedItems) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-white transition-all overflow-hidden",
        isSavedExpanded ? "border-primary/20" : "border-primary/10",
      )}
    >
      <button
        type="button"
        onClick={() => setIsSavedExpanded(!isSavedExpanded)}
        className="w-full flex items-center justify-between p-4 transition-all active:scale-[0.99] cursor-pointer hover:bg-primary/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <img
              src="/img/icon-besties.png"
              alt="Add Bestie"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold">Teman Tersimpan</p>
            <p className="text-[10px] text-muted-foreground">
              {friends.length} Teman & {groupsWithMembers.length} Circle
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isSavedExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary/40" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isSavedExpanded ? contentHeight : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          <div className="space-y-6 p-4 border-t border-primary/10">
              <div className="bg-white/50 border border-primary/10 rounded-sm p-2.5 flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                </div>
                <p className="text-[10px] font-bold leading-tight text-foreground/70">
                  Klik <span className="text-primary">Circle Gua</span> atau tombol{" "}
                  <span className="text-primary">Tambah</span> buat langsung
                  ajak mereka!
                </p>
              </div>

              {/* Circle Section */}
              {groupsWithMembers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block">
                      Circle Gua 🤝
                    </label>
                  </div>
                  <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {groupsWithMembers.map((group) => {
                      const members = getFriendsInGroup(group.id);
                      const allMembersAdded =
                        members.length > 0 &&
                        members.every((m) => selectedNames.includes(m.name));
                      return (
                        <div key={group.id} className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => onToggleGroup(group.id)}
                            className={cn(
                              "flex flex-col p-3 rounded-lg border transition-all active:scale-95 w-[130px] text-left gap-2 h-full cursor-pointer",
                              allMembersAdded
                                ? "bg-primary/10 border-primary shadow-soft"
                                : "bg-white border-primary/5 shadow-soft",
                            )}
                          >
                            <p
                              className={cn(
                                "text-xs font-bold truncate",
                                allMembersAdded ? "text-primary" : "text-foreground",
                              )}
                            >
                              {group.name}
                            </p>
                            <div className="flex -space-x-2">
                              {members.slice(0, 3).map((m) => (
                                <img
                                  key={m.id}
                                  src={`${AVATAR_BASE_URL}${encodeURIComponent(m.name)}`}
                                  alt={m.name}
                                  className="w-6 h-6 rounded-full border-2 border-white bg-white"
                                />
                              ))}
                              {members.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[8px] font-bold text-primary">
                                  +{members.length - 3}
                                </div>
                              )}
                            </div>
                          </button>
                          {allMembersAdded && (
                            <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white shadow-soft animate-in zoom-in-50 duration-200">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Teman Tersimpan Section */}
              {friends.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider block px-1">
                    Teman Tersimpan ✨
                  </label>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari teman tersimpan..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-primary/10 bg-white text-xs font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                    />
                  </div>

                  <div className="divide-y divide-primary/5 rounded-lg border border-primary/5 overflow-hidden">
                    {displayedFriends.length === 0 ? (
                      <p className="px-3 py-3 text-xs text-muted-foreground text-center">
                        Tidak ada teman ditemukan.
                      </p>
                    ) : (
                      displayedFriends.map((friend) => {
                        const isSelected = selectedNames.includes(friend.name);
                        return (
                          <button
                            key={friend.id}
                            type="button"
                            onClick={() => onToggleFriend(friend.name, friend.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-primary/5 transition-all cursor-pointer"
                          >
                            <img
                              src={`${AVATAR_BASE_URL}${encodeURIComponent(friend.name)}`}
                              alt={friend.name}
                              className="w-9 h-9 rounded-full bg-white shrink-0"
                            />
                            <span className="flex-1 text-left text-xs font-bold text-foreground truncate">
                              {friend.name}
                            </span>
                            <span
                              className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all",
                                isSelected
                                  ? "bg-primary/10 text-primary"
                                  : "bg-primary text-white",
                              )}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[3]" /> Ditambahkan
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 stroke-[3]" /> Tambah
                                </>
                              )}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {searchedFriends.length > itemsToShow && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1 text-[10px] font-bold text-primary cursor-pointer hover:underline underline-offset-2 transition-all px-1"
                    >
                      {isExpanded ? (
                        <>
                          Sembunyikan <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          Lihat Semua <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
      </motion.div>
    </div>
  );
};


