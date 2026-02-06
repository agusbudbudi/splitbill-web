"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAction {
  label: string;
  onClick: () => void;
  variant?: "outline" | "default" | "ghost";
  icon?: LucideIcon;
  className?: string;
}

interface SuccessSectionProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  actions: SuccessAction[];
  className?: string;
}

export function SuccessSection({
  title,
  subtitle,
  icon: Icon,
  actions,
  className,
}: SuccessSectionProps) {
  return (
    <Card
      className={cn(
        "p-6 bg-gradient-to-br from-primary/5 to-background border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500",
        className,
      )}
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5 animate-pulse">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                className={cn(
                  "flex-1 h-12 font-bold transition-all active:scale-95",
                  action.variant === "default" && "shadow-lg shadow-primary/20",
                  action.className,
                )}
              >
                {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
