"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFriendStore, Friend } from "@/lib/stores/friendStore";
import { ArrowLeft, Contact, Save, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { trackSocial } from "@/lib/gtag";
import { isContactPickerSupported, pickContact } from "@/lib/utils/contactPicker";

interface FriendFormProps {
  isOpen: boolean;
  onClose: () => void;
  editFriendId?: string | null;
}

export const FriendForm = ({
  isOpen,
  onClose,
  editFriendId,
}: FriendFormProps) => {
  const { addFriend, updateFriend, friends } = useFriendStore();

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [contactPickerSupported, setContactPickerSupported] = useState(false);

  useEffect(() => {
    setContactPickerSupported(isContactPickerSupported());
  }, []);

  const handlePickContact = async () => {
    const contact = await pickContact();
    if (!contact) return;
    if (contact.name) setName(contact.name);
    if (contact.tel) setWhatsapp(contact.tel);
  };

  useEffect(() => {
    if (editFriendId && isOpen) {
      const friend = friends.find((f) => f.id === editFriendId);
      if (friend) {
        setName(friend.name);
        setWhatsapp(friend.whatsapp || "");
      }
    } else if (!editFriendId && isOpen) {
      setName("");
      setWhatsapp("");
    }
  }, [editFriendId, isOpen, friends]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Nama teman tidak boleh kosong");
      return;
    }

    if (editFriendId) {
      updateFriend(editFriendId, { name, whatsapp });
      toast.success("Data teman berhasil diupdate!");
    } else {
      addFriend({ name, whatsapp });
      trackSocial.addFriend();
      toast.success("Teman berhasil ditambahkan!");
    }

    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={editFriendId ? "Edit Teman" : "Tambah Teman Baru"}
      footer={
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-lg"
        >
          {editFriendId ? (
            <>
              <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" /> Simpan Teman
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 rounded-full border-4 border-primary/10 overflow-hidden bg-primary/5 shadow-soft relative">
            <img
              src={`https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4&scale=100&seed=${encodeURIComponent(name || "placeholder")}`}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-semibold text-foreground">
              Nama Lengkap
            </label>
            {contactPickerSupported && (
              <button
                type="button"
                onClick={handlePickContact}
                className="flex items-center gap-1 text-xs font-semibold text-primary"
              >
                <Contact className="w-3.5 h-3.5" />
                Pilih dari Kontak
              </button>
            )}
          </div>
          <Input
            placeholder="Ex: Budi Santoso"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="bg-white h-12 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground px-1">
            Nomor WhatsApp (Opsional)
          </label>
          <Input
            type="tel"
            placeholder="Ex: 08123456789"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="bg-white h-12 rounded-lg"
          />
        </div>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-[11px] leading-relaxed text-slate-600">
            💡 <b>Tips:</b> Dengan menyimpan daftar teman, kamu bisa lebih cepat memilih orang saat sedang bagi tagihan.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
};

