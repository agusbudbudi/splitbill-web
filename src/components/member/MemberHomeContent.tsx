"use client";

import React from "react";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { OngoingSplitBillCard } from "@/components/home/OngoingSplitBillCard";
import { SplitBillHeroCard } from "@/components/home/SplitBillHeroCard";
import { NavigationMenu } from "@/components/home/NavigationMenu";
import { VisualFlowPreview } from "@/components/home/VisualFlowPreview";
import { LatestBlogSlider } from "@/components/blog/LatestBlogSlider";
import { MemberGettingStarted } from "@/components/member/MemberGettingStarted";
import { ReviewRewardBanner } from "@/components/home/ReviewRewardBanner";
import { FAQCard } from "@/components/home/FAQCard";
import { AIScanEncourageBanner } from "@/components/home/AIScanEncourageBanner";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useUIStore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils";

interface MemberHomeContentProps {
  singleColumn?: boolean;
}

export function MemberHomeContent({ singleColumn = false }: MemberHomeContentProps) {
  const showPwaBanner = useUIStore((state) => state.isPWABannerVisible);
  const savedBills = useWalletStore((state) => state.savedBills);
  const expenses = useSplitBillStore((state) => state.expenses);
  const activityName = useSplitBillStore((state) => state.activityName);
  const people = useSplitBillStore((state) => state.people);

  const hasHistory = Array.isArray(savedBills) && savedBills.length >= 1;
  const hasActiveBill =
    (activityName && activityName.trim().length > 0) ||
    expenses.length > 0 ||
    people.length > 0;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start",
        singleColumn ? "gap-0" : "lg:grid-cols-12 lg:gap-14",
      )}
    >
      {/* Left Side: Activity Content (Activity Pane) */}
      <div className={cn("space-y-6", singleColumn ? "" : "lg:col-span-7 lg:space-y-10")}>
        {hasHistory ? (
          <section className="space-y-4">
            <FeatureHighlights />
          </section>
        ) : (
          <div
            className={`w-[calc(100%+2rem)] -mx-4 -mt-4 bg-gradient-to-b from-primary via-primary/50 to-transparent sm:w-full sm:mx-0 sm:mt-0 sm:pt-0 sm:pb-0 sm:bg-none ${showPwaBanner ? "pt-4" : "pt-0"
              }`}
          >
            <section className="space-y-4 mx-4 sm:mx-0">
              <SplitBillHeroCard />
            </section>
          </div>
        )}

        {hasActiveBill ? (
          <section className="space-y-4 -mt-3 sm:mt-0">
            <div className="hidden sm:flex flex-col items-start px-1">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                  Tagihan On-Going 🔥
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Lanjutin split bill kemarin biar sirkel tetep aman no-drama.
                </p>
              </div>
            </div>
            <OngoingSplitBillCard />
          </section>
        ) : (
          <section className="space-y-4 -mt-3 sm:mt-0">
            <AIScanEncourageBanner />
          </section>
        )}

        <section className="space-y-4">
          <ReviewRewardBanner />
        </section>
      </div>

      {/* Right Side: System Content (System Pane) */}
      <div className={cn("space-y-6", singleColumn ? "" : "lg:col-span-5 lg:space-y-10")}>
        <section className="space-y-4">
          <div className="flex flex-col items-start px-1 hidden lg:block">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Menu Fitur
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Akses cepat ke berbagai fitur utama SplitBill Online.
              </p>
            </div>
          </div>
          <div className="w-full">
            <NavigationMenu variant="grid" />
          </div>
        </section>

        {!hasHistory && (
          <section className="space-y-4">
            <VisualFlowPreview />
          </section>
        )}

        <section className="space-y-4">
          <div className="flex flex-col items-start px-1">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Mulai Sat Set ⚡
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Biar nongkrong tetap no-drama, semua ada di sini
              </p>
            </div>
          </div>
          <MemberGettingStarted />
        </section>

        <section className="space-y-4">
          <PromoBanner isCompact image="/img/promoBanner-split-later.jpg" />
        </section>

        <section className="space-y-4">
          <LatestBlogSlider />
        </section>

        <section className="space-y-2">
          <FAQCard compact />
        </section>
      </div>
    </div>
  );
}
