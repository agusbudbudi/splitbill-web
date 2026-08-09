"use client";

import { useRouter } from "next/navigation";
import { useSplitLaterStore } from "@/store/useSplitLaterStore";
import { BucketCard } from "@/components/split-later/BucketCard";
import { FeatureBanner } from "@/components/ui/FeatureBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { FolderOpen, Plus } from "lucide-react";

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
        <EmptyState
          icon={FolderOpen}
          message="Belum Ada Split Later"
          subtitle="Buat Split Later baru buat ngumpulin struk-struk trip atau acara kamu!"
          action={
            <Button
              onClick={goToPublicCreate}
              className="h-12 px-8 font-bold rounded-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Split Later Pertama
            </Button>
          }
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
    </div>
  );
}
