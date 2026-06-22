"use client";

import { Check, Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn, formatToIDR } from "@/lib/utils";
import type { SubscriptionPackage } from "@/lib/types/subscription";

interface SubscriptionCardProps {
  pkg: SubscriptionPackage;
  isBestValue?: boolean;
  onBuy?: (packageId: string) => void;
  isProcessing?: boolean;
}

export function SubscriptionCard({
  pkg,
  isBestValue,
  onBuy,
  isProcessing,
}: SubscriptionCardProps) {
  const hasDiscount = pkg.discountValue > 0;
  const discountLabel =
    pkg.discountType === "percentage"
      ? `Hemat ${pkg.discountValue}%`
      : `Hemat ${formatToIDR(pkg.discountValue)}`;

  const durationLabel =
    pkg.durationMonths === 1
      ? "1 Bulan"
      : pkg.durationMonths === 12
        ? "1 Tahun"
        : `${pkg.durationMonths} Bulan`;

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all",
        isBestValue
          ? "border-primary shadow-primary/10 shadow-md"
          : "border-border/50",
      )}
    >
      {isBestValue && (
        <div className="bg-primary px-4 py-1.5 text-center">
          <span className="text-[11px] font-bold text-primary-foreground tracking-wider uppercase">
            Pilihan Terbaik
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground leading-tight">
              {pkg.name}
            </h3>
            {pkg.description && (
              <p className="text-[13px] text-muted-foreground leading-snug">
                {pkg.description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold",
              isBestValue
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Clock className="w-3 h-3" />
            {durationLabel}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatToIDR(pkg.price)}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-white bg-emerald-500 px-2.5 py-1 rounded-full">
                <Tag className="w-2.5 h-2.5" />
                {discountLabel}
              </span>
            </div>
          )}
          <p
            className={cn(
              "font-extrabold tracking-tight",
              isBestValue
                ? "text-2xl text-primary"
                : "text-2xl text-foreground",
            )}
          >
            {formatToIDR(pkg.finalPrice)}
            <span className="text-sm font-medium text-muted-foreground ml-1">
              / {durationLabel.toLowerCase()}
            </span>
          </p>
        </div>

        {/* Benefits */}
        {pkg.benefits.length > 0 && (
          <ul className="space-y-2">
            {pkg.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px]">
                <span
                  className={cn(
                    "mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                    isBestValue
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span className="text-muted-foreground leading-snug">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          <Button
            className="w-full border-1 border-primary/50"
            variant={isBestValue ? "default" : "outline"}
            onClick={() => onBuy?.(pkg._id)}
            disabled={isProcessing}
          >
            {isProcessing ? "Memproses..." : "Upgrade Sekarang"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
