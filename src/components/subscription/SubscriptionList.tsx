"use client";

import { PackageOpen } from "lucide-react";
import { SubscriptionCard } from "./SubscriptionCard";
import type { SubscriptionPackage } from "../../lib/types/subscription";

interface SubscriptionListProps {
  packages: SubscriptionPackage[];
  isLoading: boolean;
  onBuy?: (packageId: string) => void;
  processingId?: string | null;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden animate-pulse">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded-md w-2/3" />
            <div className="h-3 bg-muted rounded-md w-full" />
            <div className="h-3 bg-muted rounded-md w-4/5" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full shrink-0" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-muted rounded-md w-1/3" />
          <div className="h-7 bg-muted rounded-md w-1/2" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded-full shrink-0" />
              <div className="h-3 bg-muted rounded-md flex-1" />
            </div>
          ))}
        </div>
        <div className="h-11 bg-muted rounded-2xl w-full" />
      </div>
    </div>
  );
}

export function SubscriptionList({
  packages,
  isLoading,
  onBuy,
  processingId,
}: SubscriptionListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <PackageOpen className="w-7 h-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Belum Ada Paket</p>
          <p className="text-sm text-muted-foreground">
            Paket langganan sedang dalam persiapan. Nantikan segera!
          </p>
        </div>
      </div>
    );
  }

  const bestValueId = packages.reduce((prev, curr) => {
    const prevDiscount = prev.price - prev.finalPrice;
    const currDiscount = curr.price - curr.finalPrice;
    return currDiscount > prevDiscount ? curr : prev;
  }, packages[0])._id;

  return (
    <div className="grid grid-cols-1 gap-4">
      {packages.map((pkg) => (
        <SubscriptionCard
          key={pkg._id}
          pkg={pkg}
          isBestValue={pkg._id === bestValueId && packages.length > 1}
          onBuy={onBuy}
          isProcessing={processingId === pkg._id}
        />
      ))}
    </div>
  );
}
