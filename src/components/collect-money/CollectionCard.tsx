"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CollectionSession } from "@/store/useCollectMoneyStore";
import { cn, formatToIDR } from "@/lib/utils";
import { Users, CheckCircle2 } from "lucide-react";

interface CollectionCardProps {
  collection: CollectionSession;
  onClick: () => void;
}

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

export const CollectionCard = ({
  collection,
  onClick,
}: CollectionCardProps) => {
  const paidPayers = collection.payers.filter((p) => p.isPaid);
  const totalPaid = paidPayers.reduce((acc, p) => acc + p.amount, 0);

  const progress =
    collection.totalAmount > 0
      ? Math.round((totalPaid / collection.totalAmount) * 100)
      : 0;

  const getProgressEmoji = (pct: number) => {
    if (pct >= 100) return "🤑";
    if (pct >= 75) return "🔥";
    if (pct >= 50) return "👍";
    if (pct >= 25) return "🙂";
    return "😐";
  };

  return (
    <Card
      onClick={onClick}
      className="rounded-[1.2rem] bg-white/80 backdrop-blur-xs text-card-foreground border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
    >
      <div className="p-4 space-y-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1 mr-2">
            <h3 className="font-bold text-base text-foreground leading-tight truncate">
              {collection.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center">
                <div className="flex -space-x-1.5 mr-1.5">
                  {collection.payers.slice(0, 3).map((member, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white overflow-hidden bg-white shadow-sm"
                    >
                      <img
                        src={`${AVATAR_BASE_URL}${encodeURIComponent(member.name)}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {collection.payers.length > 3 && (
                    <div className="w-5 h-5 rounded-full border border-white bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground shadow-sm">
                      +{collection.payers.length - 3}
                    </div>
                  )}
                </div>
                <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-sm">
                  <Users className="w-3 h-3" />
                  {collection.payers.length}
                </span>
              </div>

              <span
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded-sm",
                  progress >= 100
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600",
                )}
              >
                {progress >= 100 ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Selesai
                  </>
                ) : (
                  <span>
                    {paidPayers.length}/{collection.payers.length} Bayar
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="bg-primary/5 p-2 rounded-xl text-xl w-10 h-10 flex items-center justify-center border border-primary/5 shadow-inner flex-shrink-0">
            {getProgressEmoji(progress)}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-end text-xs">
            <span className="font-medium text-muted-foreground">Terkumpul</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] pt-1">
            <span className="font-semibold text-foreground">
              {formatToIDR(totalPaid)}
            </span>
            <span className="text-muted-foreground">
              Target: {formatToIDR(collection.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
