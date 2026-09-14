"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ReceiptText, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatToIDR } from "@/lib/utils";
import { SavedBill } from "@/store/useWalletStore";
import { resolveImageUrl } from "@/components/splitbill/UploadedStrukSection";

interface SplitBillListCardProps {
  bill: SavedBill;
  /** Defaults to the member history detail route. */
  href?: string;
}

// Single "recent split bill" row — thumbnail (or icon fallback once the
// backend-hosted receipt image expires/is deleted) + activity info + amount.
// Reused across the member history list, the homepage split-bill widget,
// and the member home "Split Bill Terbaru" section.
export function SplitBillListCard({ bill, href }: SplitBillListCardProps) {
  const [isThumbnailBroken, setIsThumbnailBroken] = React.useState(false);
  const thumbnailUrl = bill.receiptImages?.[0]?.url;

  return (
    <Link href={href ?? `/member/history/split-bill/${bill.id}`} className="block">
      <Card className="shadow-md overflow-hidden relative hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
        <CardContent className="p-4 flex items-stretch justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xs bg-primary/5 flex items-center justify-center overflow-hidden shrink-0 border border-primary/5">
              {thumbnailUrl && !isThumbnailBroken ? (
                <img
                  src={resolveImageUrl(thumbnailUrl)}
                  alt={bill.activityName || "Struk Split Bill"}
                  className="w-full h-full object-cover"
                  onError={() => setIsThumbnailBroken(true)}
                />
              ) : (
                <ReceiptText className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground line-clamp-1">
                {bill.activityName || "Aktivitas Split Bill"}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {(bill?.people || []).length} Orang • {(bill?.expenses || []).length} Item
              </p>
              <div className="flex items-center gap-1 mt-0.5 opacity-60">
                <Clock className="w-2.5 h-2.5" />
                <p className="text-[9px] font-medium">
                  {new Date(bill?.date || "").toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end justify-between py-0.5">
            <p className="text-xs font-black text-foreground">
              {formatToIDR(bill?.totalAmount || 0)}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-primary">Lihat Detail</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
