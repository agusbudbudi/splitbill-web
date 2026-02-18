"use client";

import React, { useState } from "react";
import { useSharedGoalsStore } from "@/store/useSharedGoalsStore";
import { GoalCard } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/Button";
import { Plus, Target } from "lucide-react";
import { GoalFormBottomSheet } from "@/components/goals/GoalFormBottomSheet";
import { GoalDetailView } from "@/components/goals/GoalDetailView";

interface SharedGoalsTabProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;
  editGoalId: string | null;
  setEditGoalId: (id: string | null) => void;
}

export const SharedGoalsTab = ({
  isFormOpen,
  setIsFormOpen,
  selectedGoalId,
  setSelectedGoalId,
  editGoalId,
  setEditGoalId,
}: SharedGoalsTabProps) => {
  const { goals } = useSharedGoalsStore();

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-muted/40 rounded-2xl bg-muted/5">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Belum ada Shared Goal
          </h3>
          <p className="text-sm text-muted-foreground max-w-[300px] mb-6">
            Buat tabungan bersama untuk liburan, kado, atau acara bareng teman!
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Buat Goal Baru
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onClick={() => setSelectedGoalId(goal.id)}
            />
          ))}

          <Button
            variant="outline"
            className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Goal Lain
          </Button>
        </div>
      )}

      {/* Modals */}
      <GoalFormBottomSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditGoalId(null);
        }}
        editGoalId={editGoalId}
      />

      <GoalDetailView
        goalId={selectedGoalId}
        onClose={() => setSelectedGoalId(null)}
        onEdit={(id) => {
          setEditGoalId(id);
          setIsFormOpen(true);
        }}
      />
    </div>
  );
};
