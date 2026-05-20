"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SplitLaterBucket } from "@/store/useSplitLaterStore";
import { cn } from "@/lib/utils";
import { Camera, CheckCircle2, Clock } from "lucide-react";

interface BucketCardProps {
  bucket: SplitLaterBucket;
  stats: { total: number; pending: number; completed: number };
  onClick: () => void;
}

const BUCKET_TYPE_LABELS: Record<string, string> = {
  trip: "Trip",
  hangout: "Hangout",
  event: "Event",
  office: "Office Outing",
  household: "Household",
  other: "Lainnya",
};

export const BucketCard = ({ bucket, stats, onClick }: BucketCardProps) => {
  const completionPct =
    stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  return (
    <Card
      onClick={onClick}
      className="rounded-[1.2rem] bg-white/90 backdrop-blur-sm text-card-foreground border-none shadow-soft hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
    >
      {/* Completion bar */}
      {stats.total > 0 && (
        <div className="absolute top-0 left-0 h-1 w-full bg-muted/30 rounded-t-[1.2rem] overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      )}

      <CardContent className="p-4 space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Emoji icon */}
            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
              {bucket.emoji}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground leading-tight truncate">
                {bucket.title}
              </h3>
              <span className="text-[10px] text-muted-foreground font-medium bg-muted/50 px-1.5 py-0.5 rounded-sm">
                {BUCKET_TYPE_LABELS[bucket.bucketType] ?? "Lainnya"}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div
            className={cn(
              "shrink-0 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
              bucket.status === "done"
                ? "bg-emerald-100 text-emerald-700"
                : stats.pending > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-primary/10 text-primary",
            )}
          >
            {bucket.status === "done"
              ? "Selesai"
              : stats.pending > 0
                ? `${stats.pending} Pending`
                : "Aktif"}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1 border-t border-muted/30">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <Camera className="w-3.5 h-3.5" />
            <span>{stats.total} struk</span>
          </div>
          {stats.pending > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.pending} belum diproses</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 ml-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.completed} selesai</span>
          </div>
        </div>

        {/* Participants avatars */}
        {bucket.participants.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {bucket.participants.slice(0, 4).map((name, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-white overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/personas/png?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${encodeURIComponent(name)}&size=64`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {bucket.participants.length > 4 && (
                <div className="w-5 h-5 rounded-full border border-white bg-primary/20 flex items-center justify-center text-[7px] font-bold text-primary shadow-sm">
                  +{bucket.participants.length - 4}
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              {bucket.participants.length} orang
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
