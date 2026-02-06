"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { SharedGoal } from "@/store/useSharedGoalsStore";
import { cn } from "@/lib/utils";
import { Target, Users, TrendingUp, Calendar } from "lucide-react";

interface GoalCardProps {
  goal: SharedGoal;
  onClick: () => void;
}

const AVATAR_BASE_URL =
  "https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64&scale=100&seed=";

export const GoalCard = ({ goal, onClick }: GoalCardProps) => {
  const progress = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const daysLeft = goal.deadline
    ? Math.ceil(
        (new Date(goal.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const getProgressEmoji = (pct: number) => {
    if (pct >= 100) return "🥳";
    if (pct >= 75) return "💸";
    if (pct >= 50) return "✈️";
    if (pct >= 25) return "🔥";
    return "💪🏻";
  };

  return (
    <Card
      onClick={onClick}
      className="rounded-[1.2rem] bg-white/80 backdrop-blur-xs text-card-foreground border-none shadow-soft hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
    >
      {/* Background decoration */
      /* <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" /> */}

      <div className="p-4 space-y-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground leading-tight">
              {goal.name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center">
                <div className="flex -space-x-1.5 mr-1.5">
                  {goal.members.slice(0, 3).map((member, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white overflow-hidden bg-white shadow-sm"
                    >
                      <img
                        src={`${AVATAR_BASE_URL}${encodeURIComponent(member)}`}
                        alt={member}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {goal.members.length > 3 && (
                    <div className="w-5 h-5 rounded-full border border-white bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground shadow-sm">
                      +{goal.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-sm">
                  <Users className="w-3 h-3" />
                  {goal.members.length}
                </span>
              </div>
              {daysLeft !== null && (
                <span
                  className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded-sm",
                    daysLeft < 0
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600",
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  {daysLeft < 0 ? "Overdue" : `${daysLeft} Days left`}
                </span>
              )}
            </div>
          </div>
          <div className="bg-primary/5 p-2 rounded-xl text-xl w-10 h-10 flex items-center justify-center border border-primary/5 shadow-inner">
            {getProgressEmoji(progress)}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-end text-xs">
            <span className="font-medium text-muted-foreground">Progress</span>
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
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-muted-foreground">
              Target: {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
