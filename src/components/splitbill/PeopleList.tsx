"use client";

import React, { useState } from "react";
import { Plus, X, Users } from "lucide-react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { InfoBanner } from "@/components/ui/InfoBanner";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const PeopleList = () => {
  const { people, addPerson, removePerson } = useSplitBillStore();
  const [newName, setNewName] = useState("");

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      const names = newName
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      names.forEach((name) => addPerson(name));
      setNewName("");
    }
  };

  return (
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
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-soft overflow-hidden bg-white transition-all transform animate-in zoom-in-75">
                  <img
                    src={`${AVATAR_BASE_URL}${encodeURIComponent(name)}`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground truncate w-full text-center px-1">
                  {name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <InfoBanner
            message="Belum ada teman"
            subtitle="Tambah teman biar bisa split bill!"
            variant="primary"
            layout="vertical"
            icon={Users}
          />
        )}
      </CardContent>
    </Card>
  );
};
