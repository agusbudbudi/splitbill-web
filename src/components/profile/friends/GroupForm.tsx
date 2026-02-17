"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFriendStore, Friend } from "@/lib/stores/friendStore";
import { ArrowLeft, Save, Plus, X, Search, Check, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/Card";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmptyState } from "@/components/ui/EmptyState";

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  editGroupId?: string | null;
}

export const GroupForm = ({
  isOpen,
  onClose,
  editGroupId,
}: GroupFormProps) => {
  const { addGroup, updateGroup, groups, friends } = useFriendStore();

  const [name, setName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (editGroupId && isOpen) {
      const group = groups.find((g) => g.id === editGroupId);
      if (group) {
        setName(group.name);
        setSelectedMemberIds(group.memberIds);
      }
    } else if (!editGroupId && isOpen) {
      setName("");
      setSelectedMemberIds([]);
      setSearchQuery("");
    }
  }, [editGroupId, isOpen, groups]);

  const toggleMember = (friendId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Nama grup tidak boleh kosong");
      return;
    }

    if (selectedMemberIds.length < 2) {
      toast.error("Waduh, isi minimal 2 member ya biar seru! 👥");
      return;
    }

    if (editGroupId) {
      updateGroup(editGroupId, name, selectedMemberIds);
      toast.success("Grup berhasil diperbarui!");
    } else {
      addGroup(name, selectedMemberIds);
      toast.success("Grup baru berhasil dibuat!");
    }

    onClose();
  };

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={editGroupId ? "Edit Grup" : "Buat Grup Baru"}
      maxHeight="90vh"
      footer={
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-lg"
        >
          {editGroupId ? (
            <>
              <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
            </>
          ) : (
            <>
              <Users2 className="w-5 h-5 mr-2" /> Buat Grup
            </>
          )}
        </Button>
      }
    >
      <div className="flex flex-col h-full -mx-6 -my-6">
        <div className="p-6 pb-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground px-1">
              Nama Grup
            </label>
            <Input
              placeholder="Ex: Teman Kantor, Keluarga"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-white h-12 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-semibold text-foreground">
                Pilih Anggota
              </label>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                {selectedMemberIds.length} Terpilih
              </span>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Cari teman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white h-10 pl-9 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 mt-2">
          <div className="grid gap-2">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                 <div 
                    key={friend.id}
                    onClick={() => toggleMember(friend.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                      selectedMemberIds.includes(friend.id) 
                        ? "bg-primary/5 border-primary/20 shadow-xs" 
                        : "bg-white border-border/40 hover:bg-accent/5"
                    )}
                 >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-primary/10 overflow-hidden bg-primary/5 shrink-0">
                         <img 
                            src={`https://api.dicebear.com/9.x/personas/svg?seed=${friend.id}`} 
                            className="w-full h-full object-cover" 
                         />
                      </div>
                      <span className={cn(
                        "text-xs font-bold transition-colors",
                        selectedMemberIds.includes(friend.id) ? "text-primary" : "text-foreground/80"
                      )}>
                        {friend.name}
                      </span>
                   </div>
                   <div className={cn(
                     "w-5 h-5 rounded-full border transition-all flex items-center justify-center",
                     selectedMemberIds.includes(friend.id)
                      ? "bg-primary border-primary text-white scale-110"
                      : "border-border/60 bg-white"
                   )}>
                     {selectedMemberIds.includes(friend.id) && <Check className="w-3 h-3 stroke-[3]" />}
                   </div>
                 </div>
              ))
            ) : (
              <EmptyState 
                message="Belum ada teman"
                subtitle="Ayo tambah teman kamu dulu biar bisa dimasukin ke grup!"
                icon={Users2}
                className="bg-transparent border-0"
              />
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

