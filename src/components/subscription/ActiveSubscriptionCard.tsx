"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { User } from "@/lib/api/auth";

interface ActiveSubscriptionCardProps {
  user: User;
}

export function ActiveSubscriptionCard({ user }: ActiveSubscriptionCardProps) {
  if (user.subscriptionStatus !== "active") return null;

  return (
    <div className="relative overflow-hidden rounded-md bg-white shadow-soft">
      {/* Header: Blue Gradient Section */}
      <div className="relative bg-gradient-brand p-5 text-white overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/img/icon-vip.png"
                alt="VIP"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mb-2 leading-none">
                Status Langganan
              </h3>
              <p className="text-xl font-black tracking-tight leading-tight">
                {user.subscriptionPlan}
              </p>
            </div>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Body: Details with White Background */}
      <div className="p-5 bg-white relative">
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Tgl Pembelian
              </p>
            </div>
            <p className="text-sm font-bold text-foreground pl-5">
              {formatDate(user.order?.paidAt || user.createdAt || "")}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Berlaku Sampai
              </p>
            </div>
            <p className="text-sm font-bold text-primary pl-5">
              {formatDate(user.subscriptionExpiry || "")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
