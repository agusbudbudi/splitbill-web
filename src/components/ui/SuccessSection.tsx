"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCheckmark } from "./AnimatedCheckmark";

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
  icon?: LucideIcon;
  illustration?: string;
  illustrationAlt?: string;
  actions: SuccessAction[];
  className?: string;
  stackActions?: boolean;
}

export function SuccessSection({
  title,
  subtitle,
  illustration,
  illustrationAlt,
  actions,
  className,
  stackActions,
  children,
}: SuccessSectionProps & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700",
        className,
      )}
    >
      <div className="space-y-6 w-full flex flex-col items-center">
        <div className="space-y-6 w-full">
          {illustration ? (
            <img
              src={illustration}
              alt={illustrationAlt || title}
              className="w-32 h-32 mx-auto object-contain mb-6"
            />
          ) : (
            <AnimatedCheckmark className="mb-6" />
          )}

          <div className="space-y-2">
            <h3 className="font-bold text-xl text-foreground tracking-tight sm:text-2xl">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium max-w-[360px] mx-auto text-base">
              {subtitle}
            </p>
          </div>
        </div>

        {children}

        {actions.length > 0 && (
          <div
            className={cn(
              "flex flex-col w-full gap-3 mx-auto justify-center",
              !stackActions && "sm:flex-row",
            )}
          >
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  onClick={action.onClick}
                  className={cn(
                    "flex-1 rounded-sm font-bold transition-all active:scale-95 whitespace-nowrap",
                    action.variant === "default" && "shadow-lg shadow-primary/20",
                    action.className,
                  )}
                >
                  {ActionIcon && <ActionIcon className="w-5 h-5 mr-2" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
