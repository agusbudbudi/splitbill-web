"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { 
  Users, 
  Plus, 
  Search,
  UserPlus,
  Users2,
  MoreVertical,
  ChevronRight,
  User,
  Trash2,
  Pencil,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useFriendStore, Friend, Group } from "@/lib/stores/friendStore";
import { FriendForm } from "@/components/profile/friends/FriendForm";
import { GroupForm } from "@/components/profile/friends/GroupForm";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { EmptyState } from "@/components/ui/EmptyState";
import { X as CloseIcon } from "lucide-react";

type TabType = "friends" | "groups";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form States
  const [isFriendFormOpen, setIsFriendFormOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { friends, groups, removeFriend, removeGroup } = useFriendStore();

  const filteredFriends = [...friends].reverse().filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.whatsapp?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = [...groups].reverse().filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "friends", label: "Semua Teman", icon: User },
    { id: "groups", label: "Grup", icon: Users2 },
  ] as const;

  const handleAddClick = () => {
    setEditingId(null);
    if (activeTab === "friends") {
      setIsFriendFormOpen(true);
    } else {
      setIsGroupFormOpen(true);
    }
  };

  const handleEditFriend = (id: string) => {
    setEditingId(id);
    setIsFriendFormOpen(true);
  };

  const handleEditGroup = (id: string) => {
    setEditingId(id);
    setIsGroupFormOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    
    if (activeTab === "friends") {
      removeFriend(deleteId);
      toast.success("Teman berhasil dihapus");
    } else {
      removeGroup(deleteId);
      toast.success("Grup berhasil dihapus");
    }
    
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col items-center">
        <Header title="Teman Saya" showBackButton />

        <main className="w-full max-w-[480px] p-4 space-y-4 pb-24">
          {/* Tab Switcher - Using Reusable SegmentedControl */}
          <SegmentedControl
            options={tabs}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as TabType)}
          />

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder={activeTab === "friends" ? "Cari nama atau WhatsApp..." : "Cari nama grup..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Content Lists */}
          <div className="space-y-3">
            {activeTab === "friends" ? (
              <>
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <FriendCard 
                      key={friend.id} 
                      friend={friend} 
                      onEdit={() => handleEditFriend(friend.id)}
                      onDelete={() => confirmDelete(friend.id)}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={searchQuery ? Search : UserPlus} 
                    message={searchQuery ? "Teman tidak ditemukan" : "Cari teman kamu"} 
                    subtitle={searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada teman yang ditambahkan"}
                    action={searchQuery ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSearchQuery("")}
                        className="rounded-lg"
                      >
                        <CloseIcon className="w-4 h-4 mr-2" /> Hapus Pencarian
                      </Button>
                    ) : undefined}
                  />
                )}
              </>
            ) : (
              <>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <GroupCard 
                      key={group.id} 
                      group={group} 
                      onEdit={() => handleEditGroup(group.id)}
                      onDelete={() => confirmDelete(group.id)}
                    />
                  ))
                ) : (
                  <EmptyState 
                    icon={searchQuery ? Search : Users2} 
                    message={searchQuery ? "Grup tidak ditemukan" : "Buat grup pertemanan"} 
                    subtitle={searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Kelompokkan teman-teman kamu biar makin gampang split bill!"}
                    action={searchQuery ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSearchQuery("")}
                        className="rounded-lg"
                      >
                        <CloseIcon className="w-4 h-4 mr-2" /> Hapus Pencarian
                      </Button>
                    ) : undefined}
                  />
                )}
              </>
            )}
          </div>

          {/* FAB - Floating Action Button for Add */}
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 pointer-events-none z-40 flex justify-end">
            <Button 
              className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center p-0 pointer-events-auto active:scale-95 transition-transform"
              onClick={handleAddClick}
            >
              <Plus className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* Forms */}
          <FriendForm 
            isOpen={isFriendFormOpen}
            onClose={() => setIsFriendFormOpen(false)}
            editFriendId={editingId}
          />
          <GroupForm 
            isOpen={isGroupFormOpen}
            onClose={() => setIsGroupFormOpen(false)}
            editGroupId={editingId}
          />

          {/* Delete Confirmation */}
          <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title={activeTab === "friends" ? "Hapus Teman" : "Hapus Grup"}
            description={`Apakah kamu yakin ingin menghapus ${activeTab === "friends" ? "teman" : "grup"} ini?`}
            confirmText="Ya, Hapus"
            cancelText="Batal"
            icon={AlertCircle}
            confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20"
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}

// --- Internal Components ---

const FriendCard = ({ 
  friend, 
  onEdit, 
  onDelete 
}: { 
  friend: Friend, 
  onEdit: () => void,
  onDelete: () => void
}) => {
  const avatarUrl = `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4&scale=100&seed=${encodeURIComponent(
    friend.name,
  )}`;

  return (
    <Card 
      onClick={onEdit}
      className="hover:bg-accent/5 transition-colors group active:scale-[0.99] border-0 bg-white cursor-pointer"
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-primary/10 overflow-hidden bg-primary/5 shadow-xs transition-transform group-hover:scale-105">
            <img src={avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground leading-none">{friend.name}</h4>
            {friend.whatsapp && (
              <p className="text-[10px] text-muted-foreground/80 font-medium">{friend.whatsapp}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }} 
            className="p-1.5 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} 
            className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

const GroupCard = ({ 
  group, 
  onEdit, 
  onDelete 
}: { 
  group: Group,
  onEdit: () => void,
  onDelete: () => void
}) => {
  const { friends } = useFriendStore();
  const members = friends.filter(f => group.memberIds.includes(f.id));

  return (
    <Card 
      onClick={onEdit}
      className="hover:bg-accent/5 transition-colors group active:scale-[0.99] border-0 bg-white cursor-pointer"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-soft relative overflow-hidden">
             <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <Users2 className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground tracking-tight leading-none">{group.name}</h4>
            <div className="flex items-center gap-1.5">
               <div className="flex -space-x-2">
                 {members.slice(0, 3).map((m) => (
                   <div key={m.id} className="w-5 h-5 rounded-full border-2 border-white bg-muted overflow-hidden">
                     <img 
                       src={`https://api.dicebear.com/9.x/personas/svg?seed=${m.name}`} 
                       className="w-full h-full" 
                     />
                   </div>
                 ))}
                 {members.length > 3 && (
                   <div className="w-5 h-5 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center">
                     <span className="text-[6px] font-black text-primary">+{members.length - 3}</span>
                   </div>
                 )}
               </div>
               <p className="text-[10px] text-muted-foreground/60">
                 {members.length} Teman
               </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { // Added e.stopPropagation()
              e.stopPropagation();
              onEdit();
            }} 
            className="p-1.5 text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} 
            className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
};

