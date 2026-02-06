"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import type { BilledEntity } from "@/lib/types/invoice";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAvatarUrl } from "@/lib/utils/invoice";

interface BilledCardProps {
  entity: BilledEntity;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  type: "by" | "to";
}

export function BilledCard({
  entity,
  isSelected,
  onSelect,
  onRemove,
  type,
}: BilledCardProps) {
  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border transition-all cursor-pointer group",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-primary/10 bg-white hover:border-primary/30 hover:shadow-sm",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5">
        <img
          src={entity.avatar || generateAvatarUrl(entity.name)}
          alt={entity.name}
          className="w-10 h-10 rounded-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-sm text-foreground truncate tracking-tight">
              {entity.name}
            </p>
            {/* Selection Indicator */}
            {isSelected && (
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {entity.phone}
          </p>
          {entity.email && (
            <p className="text-xs text-muted-foreground font-medium truncate">
              {entity.email}
            </p>
          )}
          {entity.address && (
            <p className="text-xs text-muted-foreground font-medium truncate">
              {entity.address}
            </p>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute bottom-2 right-2 p-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
