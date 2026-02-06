"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSharedGoalsStore } from "@/store/useSharedGoalsStore";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { CurrencyInput } from "@/components/ui/CurrencyInput";

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

interface GoalFormBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editGoalId?: string | null;
  onDone?: () => void;
}

export const GoalFormBottomSheet = ({
  isOpen,
  onClose,
  editGoalId,
  onDone,
}: GoalFormBottomSheetProps) => {
  const { addGoal, updateGoal, goals } = useSharedGoalsStore();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [membersError, setMembersError] = useState<string | null>(null);

  React.useEffect(() => {
    if (editGoalId && isOpen) {
      const goal = goals.find((g) => g.id === editGoalId);
      if (goal) {
        setName(goal.name);
        setTargetAmount(goal.targetAmount);
        setDeadline(goal.deadline ? goal.deadline.split("T")[0] : "");
        setMembers(goal.members);
      }
    } else if (!editGoalId && isOpen) {
      resetForm();
    }
  }, [editGoalId, isOpen, goals]);

  const handleAddMember = () => {
    setMembersError(null);
    if (newMember.trim()) {
      const inputNames = newMember
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n !== "");

      const alreadyAdded = inputNames.filter((n) => members.includes(n));
      const duplicatesInInput = inputNames.filter(
        (n, index) => inputNames.indexOf(n) !== index,
      );

      if (alreadyAdded.length > 0 || duplicatesInInput.length > 0) {
        setMembersError("Ada nama yang sudah ditambahkan atau duplikat.");
      }

      const namesToAdd = Array.from(new Set(inputNames)).filter(
        (n) => !members.includes(n),
      );

      if (namesToAdd.length > 0) {
        setMembers([...members, ...namesToAdd]);
        setNewMember("");
      }
    }
  };

  const handleRemoveMember = (member: string) => {
    setMembers(members.filter((m) => m !== member));
  };

  const handleSave = () => {
    if (!name || targetAmount <= 0) {
      toast.error("Mohon isi nama goal dan target nominal");
      return;
    }

    if (members.length === 0) {
      toast.error("Minimal ada 1 member (biasanya kamu sendiri)");
      return;
    }

    const goalData = {
      name,
      targetAmount,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      members,
    };

    if (editGoalId) {
      updateGoal(editGoalId, goalData);
      toast.success("Shared Goal berhasil diupdate! 🎯");
    } else {
      addGoal(goalData);
      toast.success("Shared Goal berhasil dibuat! 🎯");
    }

    if (onDone) onDone();
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setTargetAmount(0);
    setDeadline("");
    setMembers([]);
    setNewMember("");
    setMembersError(null);
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
          "absolute bottom-0 w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
          "animate-in slide-in-from-bottom-full duration-300 ease-out",
        )}
      >
        <div
          className="w-full flex justify-center pt-2 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        <div className="flex items-center justify-between px-6 py-2 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">
              {editGoalId ? "Edit Shared Goal" : "New Shared Goal"}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground px-1">
                Nama Goal
              </label>
              <Input
                placeholder="Ex: Liburan Bali, Kado Ultah Budi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground px-1">
                Target Nominal
              </label>
              <CurrencyInput
                value={targetAmount}
                onChange={(val) => setTargetAmount(val || 0)}
                placeholder="Rp 0"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground px-1">
                Deadline (Opsional)
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground px-1">
                Members
              </label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ketik nama, pisahkan dengan koma..."
                  value={newMember}
                  onChange={(e) => {
                    setNewMember(e.target.value);
                    if (membersError) setMembersError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  className="flex-1 bg-white"
                />
                <Button
                  onClick={handleAddMember}
                  disabled={!newMember.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {membersError && (
                <p className="text-[10px] text-destructive px-1 animate-in slide-in-from-top-1">
                  {membersError}
                </p>
              )}

              {members.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted/30 px-2 py-1.5 rounded-full border border-primary/5 group animate-in zoom-in-95"
                    >
                      <div className="w-6 h-6 rounded-full border border-white shadow-sm overflow-hidden bg-white shrink-0">
                        <img
                          src={`${AVATAR_BASE_URL}${encodeURIComponent(member)}`}
                          alt={member}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {member}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-primary/5 bg-background">
          <Button
            onClick={handleSave}
            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
          >
            {editGoalId ? (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" /> Create Goal
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
