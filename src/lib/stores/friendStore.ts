import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface Friend {
  id: string;
  name: string;
  whatsapp?: string;
  avatar?: string;
  useCount?: number;
  lastUsedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
}

interface FriendState {
  friends: Friend[];
  groups: Group[];

  // Friend Actions
  addFriend: (friend: Omit<Friend, "id">) => void;
  updateFriend: (id: string, friend: Partial<Friend>) => void;
  removeFriend: (id: string) => void;

  // Group Actions
  addGroup: (name: string, memberIds?: string[]) => string;
  updateGroup: (id: string, name: string, memberIds: string[]) => void;
  removeGroup: (id: string) => void;
  
  // Link Actions
  addFriendToGroup: (friendId: string, groupId: string) => void;
  removeFriendFromGroup: (friendId: string, groupId: string) => void;
  useFriend: (id: string) => void;

  // Helper
  getFriendsInGroup: (groupId: string) => Friend[];
}

export const useFriendStore = create<FriendState>()(
  persist(
    (set, get) => ({
      friends: [],
      groups: [],

      addFriend: (friend) =>
        set((state) => ({
          friends: [
            ...state.friends,
            { ...friend, id: uuidv4(), useCount: friend.useCount ?? 0 },
          ],
        })),

      updateFriend: (id, updatedFriend) =>
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === id ? { ...f, ...updatedFriend } : f
          ),
        })),

      removeFriend: (id) =>
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== id),
          groups: state.groups.map((g) => ({
            ...g,
            memberIds: g.memberIds.filter((mId) => mId !== id),
          })),
        })),

      addGroup: (name, memberIds = []) => {
        const id = uuidv4();
        set((state) => ({
          groups: [...state.groups, { id, name, memberIds }],
        }));
        return id;
      },

      updateGroup: (id, name, memberIds) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, name, memberIds } : g
          ),
        })),

      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        })),

      addFriendToGroup: (friendId, groupId) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId && !g.memberIds.includes(friendId)
              ? { ...g, memberIds: [...g.memberIds, friendId] }
              : g
          ),
        })),

      removeFriendFromGroup: (friendId, groupId) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? { ...g, memberIds: g.memberIds.filter((mId) => mId !== friendId) }
              : g
          ),
        })),

      useFriend: (id) =>
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === id
              ? {
                  ...f,
                  useCount: (f.useCount ?? 0) + 1,
                  lastUsedAt: new Date().toISOString(),
                }
              : f
          ),
        })),

      getFriendsInGroup: (groupId) => {
        const group = get().groups.find((g) => g.id === groupId);
        if (!group) return [];
        return get().friends.filter((f) => group.memberIds.includes(f.id));
      },
    }),
    {
      name: "friend-storage",
    }
  )
);
