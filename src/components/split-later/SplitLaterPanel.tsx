"use client";

import { useRouter } from "next/navigation";
import { useSplitLaterStore } from "@/store/useSplitLaterStore";
import { BucketCard } from "@/components/split-later/BucketCard";
import { FeatureBanner } from "@/components/ui/FeatureBanner";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { IllustratedEmptyState } from "@/components/ui/IllustratedEmptyState";
import { Plus } from "lucide-react";

export function SplitLaterPanel() {
  const router = useRouter();
  const { buckets, getBucketStats } = useSplitLaterStore();

  const goToPublicCreate = () => router.push("/split-later?step=1");

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-6">
      {/* Feature Banner */}
      <FeatureBanner
        title="Split Later Easy"
        description={
          <>
            Kumpulin semua struk dulu, <br />
            <span className="font-bold text-primary">
              split belakangan pas udah santai!
            </span>
          </>
        }
        ctaText="Buat Split Later"
        ctaHref="#"
        illustration="/img/feature-split-later.png"
        illustrationAlt="Ilustrasi Split Later — Kumpulkan foto struk dan split belakangan"
        variant="secondary"
        onCtaClick={(e) => {
          e.preventDefault();
          goToPublicCreate();
        }}
      />

      {/* Bucket list */}
      {buckets.length === 0 ? (
        <IllustratedEmptyState
          illustration="/img/empty-state/empty-transaction-image.png"
          title="Belum Ada Split Later"
          description="Yuk buat Split Later pertamamu!"
          ctaText="Buat Split Later"
          onCtaClick={(e) => {
            e.preventDefault();
            goToPublicCreate();
          }}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-foreground/70">
              Split Later Kamu ({buckets.length})
            </h2>
            <button
              onClick={goToPublicCreate}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Buat Baru
            </button>
          </div>
          {buckets.map((bucket) => (
            <BucketCard
              key={bucket.id}
              bucket={bucket}
              stats={getBucketStats(bucket.id)}
              onClick={() => router.push(`/member/split-later/${bucket.id}`)}
            />
          ))}
        </div>
      )}

      {/* Fokus Healing Dulu Banner */}
      <PromoBanner
        isCompact
        href="/split-later?step=1"
        image="/img/promoBanner-split-later-new.jpg"
        titleText="Udah kumpul struknya?"
        titleHighlight="Yuk mulai split-nya! 🧾"
        description="Semua struk yang udah kekumpul siap dihitung dan dibagi rata."
        compactDescription="Struk siap? Yuk split sekarang."
        ctaText="Buat Split Later Baru"
      />
    </div>
  );
}
