"use client";

import React from "react";
import { useSharedGoalsStore } from "@/store/useSharedGoalsStore";
import { GoalCard } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { GoalDetailView } from "@/components/goals/GoalDetailView";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";

interface SharedGoalsTabProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;
  editGoalId: string | null;
  setEditGoalId: (id: string | null) => void;
}

export const SharedGoalsTab = ({
  setIsFormOpen,
  selectedGoalId,
  setSelectedGoalId,
  setEditGoalId,
}: SharedGoalsTabProps) => {
  const { goals } = useSharedGoalsStore();

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <IllustratedEmptyState
          title="Belum ada Shared Goal"
          description="Yuk buat tabungan bersama pertamamu!"
          ctaText="Buat Goal Baru"
          onCtaClick={(e) => {
            e.preventDefault();
            setIsFormOpen(true);
          }}
        />
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
