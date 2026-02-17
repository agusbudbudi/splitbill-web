"use client";

import React, { useState } from "react";
import { Plus, X, Users, UserPlus, ChevronDown, ChevronUp, Users2, Check, Info } from "lucide-react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useFriendStore, Friend } from "@/lib/stores/friendStore";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const PeopleList = () => {
  const { people, addPerson, removePerson } = useSplitBillStore();
  const { friends, groups, addFriend, useFriend, getFriendsInGroup } = useFriendStore();
  const [newName, setNewName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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
        }
        
        // Auto-save to friend store if doesn't exist by name
        const existingFriend = friends.find(f => f.name.toLowerCase() === name.toLowerCase());
        if (!existingFriend) {
          addFriend({ name });
        } else {
          // If already exists, track usage
          useFriend(existingFriend.id);
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
      useFriend(friend.id);
    }
  };

  const toggleGroupMembers = (groupId: string) => {
    const groupFriends = getFriendsInGroup(groupId);
    const allMembersAdded = groupFriends.length > 0 && groupFriends.every(m => people.includes(m.name));

    if (allMembersAdded) {
      // Logic: If all are there, remove all
      groupFriends.forEach(friend => {
        removePerson(friend.name);
      });
    } else {
      // Logic: If not all are there, add missing ones
      groupFriends.forEach(friend => {
        if (!people.includes(friend.name)) {
          addPerson(friend.name);
        }
        useFriend(friend.id);
      });
    }
  };

  // Smart Sorting: Frequency first, then recency
  const sortedFriends = [...friends].sort((a, b) => {
    // 1. Frequency (useCount)
    const countA = a.useCount ?? 0;
    const countB = b.useCount ?? 0;
    if (countB !== countA) {
      return countB - countA;
    }
    // 2. Recency (lastUsedAt)
    const dateA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
    const dateB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
    return dateB - dateA;
  });

  const displayedFriends = isExpanded ? sortedFriends : sortedFriends.slice(0, 5);
  const groupsWithMembers = groups.filter(g => getFriendsInGroup(g.id).length > 0);
  const hasSavedItems = friends.length > 0 || groupsWithMembers.length > 0;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      {hasSavedItems && (
        <Card className="border-primary/20 shadow-md">
          <CardContent className="p-4 space-y-6">
            {/* Saved Groups Selector */}
            {groupsWithMembers.length > 0 && (
              <div className="space-y-3 mb-0">
                <div className="flex items-center gap-2 px-1">
                  <label className="text-sm font-bold text-foreground">
                    Circle Gua 🤝
                  </label>
                  <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {groupsWithMembers.length} Grup
                  </span>
                </div>
                <div className="flex items-stretch gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-1 px-1">
                  {groupsWithMembers.map((group) => {
                    const members = getFriendsInGroup(group.id);
                    const allMembersAdded = members.length > 0 && members.every(m => people.includes(m.name));
                    
                    return (
                      <div key={group.id} className="relative shrink-0">
                        <button
                          onClick={() => toggleGroupMembers(group.id)}
                          className={cn(
                            "flex flex-col p-3 rounded-lg border-1 transition-all active:scale-95 cursor-pointer w-[140px] text-left gap-2 h-full",
                            allMembersAdded 
                              ? "bg-primary/5 border-primary shadow-soft" 
                              : "bg-white border-primary/5 hover:border-primary/20"
                          )}
                        >
                          <div className="space-y-3">
                            <p className={cn(
                              "text-[12px] font-bold truncate leading-none",
                              allMembersAdded ? "text-primary" : "text-foreground"
                            )}>
                              {group.name}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mt-1">
                              {members.slice(0, 3).map((m) => (
                                <div 
                                  key={m.id} 
                                  className={cn(
                                    "flex items-center gap-1 rounded-full pl-0.5 pr-1.5 py-0.5 border transition-colors max-w-[60px]",
                                    allMembersAdded 
                                      ? "bg-primary/10 border-primary/20" 
                                      : "bg-primary/5 border-primary/5"
                                  )}
                                >
                                  <img
                                    src={`${AVATAR_BASE_URL}${encodeURIComponent(m.name)}`}
                                    alt={m.name}
                                    className="w-3.5 h-3.5 rounded-full"
                                  />
                                  <span className={cn(
                                    "text-[8px] font-bold truncate",
                                    allMembersAdded ? "text-primary" : "text-primary/60"
                                  )}>
                                    {m.name.split(' ')[0]}
                                  </span>
                                </div>
                              ))}
                              {members.length > 3 && (
                                <div className={cn(
                                  "flex items-center justify-center rounded-full px-1.5 py-0.5 border",
                                  allMembersAdded 
                                    ? "bg-primary/10 border-primary/20 text-primary" 
                                    : "bg-primary/5 border-primary/5 text-primary/60"
                                )}>
                                  <span className="text-[8px] font-bold">
                                    +{members.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                        {allMembersAdded && (
                          <div className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full p-1 border-2 border-white shadow-soft animate-in zoom-in-50 duration-200">
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Saved Friends Selector */}
            {friends.length > 0 && (
              <div className="space-y-3 pb-2 mb-0">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-foreground">
                      Besties Gua ✨
                    </label>
                    <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {friends.length} Teman
                    </span>
                  </div>
                  {friends.length > 5 && (
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-0.5 text-[9px] font-black text-primary hover:bg-primary/5 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Sembunyikan <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Lihat Semua <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  )}
                </div>
                <div className={cn(
                   "flex items-center gap-3 -mx-1 px-1",
                   isExpanded ? "flex-wrap" : "overflow-x-auto scrollbar-hide pb-2"
                )}>
                  {displayedFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => toggleFriendFromSaved(friend)}
                      className="group flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer min-w-[56px] max-w-[64px]"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all p-0.5 relative",
                        people.includes(friend.name)
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-primary/5 opacity-40 grayscale-[50%]"
                      )}>
                        <img
                          src={`${AVATAR_BASE_URL}${encodeURIComponent(friend.name)}`}
                          alt={friend.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                        {people.includes(friend.name) && (
                          <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
                            <Plus className="w-2.5 h-2.5 rotate-45" />
                          </div>
                        )}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold truncate w-full text-center transition-colors",
                        people.includes(friend.name) ? "text-primary" : "text-muted-foreground/50"
                      )}>
                        {friend.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 p-3 bg-primary/5 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-1 duration-300 mt-2">
              <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] leading-normal text-primary/80 font-bold">
                Klik <span className="text-primary font-black">Circle Gua</span> atau <span className="text-primary font-black">Besties Gua</span> buat langsung ajak mereka Split Bill! 🏎️💨
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-4 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground px-1">
              Tambah Teman 👥
            </label>
            <form onSubmit={handleAddPerson} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Ketik nama, pisahkan dengan koma..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!newName.trim()}
                size="icon"
                className="shrink-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </form>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                Terpilih untuk Bill ini
              </label>
              <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {people.length} Orang
              </span>
            </div>
            {people.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-y-6 gap-x-2 animate-in fade-in slide-in-from-bottom-2">
                {people.map((name) => (
                  <div
                    key={name}
                    className="relative flex flex-col items-center gap-2"
                  >
                    <button
                      onClick={() => removePerson(name)}
                      className="absolute -top-1 -right-1 z-10 bg-destructive text-white rounded-full p-1 hover:scale-110 active:scale-90 transition-all border-2 !border-white cursor-pointer"
                      title={`Remove ${name}`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-soft overflow-hidden bg-white transition-all transform animate-in zoom-in-75 ring-2 ring-primary/5">
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
            ) : (
              <EmptyState
                message="Belum ada teman"
                subtitle="Tambah teman biar bisa split bill!"
                icon={Users}
                className="py-10 bg-transparent border-0"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
