"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SharedGoalsTab } from "@/components/wallet/SharedGoalsTab";
import { FeatureBanner } from "@/components/ui/FeatureBanner";
import { useRouter } from "next/navigation";

export default function SharedGoalsPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Purple background behind header and top banner */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[150px] bg-primary z-0 rounded-b-[20px]" />

      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative z-10">
        <Header
          title="Shared Goals"
          showBackButton
          onBack={() => router.push("/")}
        />

        {/* Content */}
        <div className="flex-1 p-4 pb-20 space-y-6">
          <FeatureBanner
            title="Raih Impian Bareng! 🎯"
            description={
              <>
                Nabung bareng buat liburan! <br />
                <span className="font-bold text-primary">
                  Pantau progress & capai targetmu!
                </span>
              </>
            }
            ctaText="Buat Goal Baru"
            ctaHref="#"
            illustration="/img/feature-shared-goals.png"
            variant="secondary"
            onCtaClick={(e) => {
              e.preventDefault();
              setIsFormOpen(true);
            }}
          />

          <SharedGoalsTab
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
            selectedGoalId={selectedGoalId}
            setSelectedGoalId={setSelectedGoalId}
            editGoalId={editGoalId}
            setEditGoalId={setEditGoalId}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
