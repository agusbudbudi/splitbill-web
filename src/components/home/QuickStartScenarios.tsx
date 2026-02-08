"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useRouter } from "next/navigation";
import {
  Utensils,
  Plane,
  Gift,
  Home,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const scenarios = [
  {
    id: "dining",
    title: "Makan Bareng",
    description: "Resto, Cafe, Warung",
    icon: Utensils,
    color: "from-orange-500 to-amber-500",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-100",
    textColor: "text-orange-600",
    activityName: "🍱 Makan Bareng",
    badge: "Populer",
  },
  {
    id: "travel",
    title: "Liburan Bareng",
    description: "Tiket, Hotel, Wisata",
    icon: Plane,
    color: "from-blue-500 to-cyan-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-100",
    textColor: "text-blue-600",
    activityName: "✈️ Liburan Bareng",
  },
  {
    id: "gift",
    title: "Patungan Kado",
    description: "Ultah, Nikahan, Farewell",
    icon: Gift,
    color: "from-purple-500 to-pink-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-100",
    textColor: "text-purple-600",
    activityName: "🎁 Patungan Kado",
  },
  {
    id: "rent",
    title: "Bayar Tagihan",
    description: "Kos, Listrik, WiFi",
    icon: Home,
    color: "from-emerald-500 to-teal-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-600",
    activityName: "🏠 Bayar Tagihan",
  },
];

export const QuickStartScenarios = () => {
  const router = useRouter();
  const setActivityName = useSplitBillStore((state) => state.setActivityName);

  const handleScenarioClick = (activityName: string) => {
    setActivityName(activityName);
    router.push("/split-bill?step=1");
  };

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary" fill="currentColor" />
          </div>
          <h2 className="text-sm font-bold text-foreground/80 tracking-tight">
            Mulai Cepat
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario.activityName)}
            className={cn(
              "group relative overflow-hidden border-0 transition-all duration-500 active:scale-95 cursor-pointer bg-white shadow-soft hover:shadow-xl hover:shadow-primary/5 rounded-[1.2rem]",
            )}
          >
            {/* Background Gradient Detail */}
            <div
              className={cn(
                "absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20",
                scenario.lightColor,
              )}
            />

            <CardContent className="p-3 flex items-center gap-2.5 relative z-10">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xs shrink-0",
                  scenario.lightColor,
                )}
              >
                <scenario.icon
                  className={cn("w-4.5 h-4.5", scenario.textColor)}
                />
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-[11px] font-black text-foreground tracking-tight truncate">
                    {scenario.title}
                  </h3>
                  {scenario.badge && (
                    <span className="text-[7px] font-black bg-primary/10 text-primary px-1 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                      {scenario.badge}
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-muted-foreground font-medium leading-tight truncate">
                  {scenario.description}
                </p>
              </div>

              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-2 h-2 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
