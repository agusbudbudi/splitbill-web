"use client";

import React from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useFriendStore, Friend } from "@/lib/stores/friendStore";
import { trackSocial } from "@/lib/gtag";
import { toast } from "sonner";
import { SavedBestiesSelection } from "./SavedBestiesSelection";
import { ParticipantsFormCard } from "./ParticipantsFormCard";

export const PeopleList = () => {
  const { people, addPerson, removePerson } = useSplitBillStore();
  const { friends, addFriend, trackFriendUsage, getFriendsInGroup } =
    useFriendStore();

  const syncFriend = (name: string) => {
    const existingFriend = friends.find(
      (f) => f.name.toLowerCase() === name.toLowerCase(),
    );
    if (!existingFriend) {
      addFriend({ name });
    } else {
      trackFriendUsage(existingFriend.id);
    }
  };

  const handleAddName = (name: string) => {
    addPerson(name);
    syncFriend(name);
    toast.success(`${name} berhasil ditambahkan ✅`);
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
    <div className="space-y-6">
      <ParticipantsFormCard
        people={people}
        onAdd={handleAddName}
        onDuplicate={() => toast.info("Teman sudah ditambahkan.")}
        onRemove={removePerson}
      />

      {/* Saved Items (Progressive Disclosure) */}
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
