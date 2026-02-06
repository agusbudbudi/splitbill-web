import React from "react";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { LucideIcon, Info } from "lucide-react";

interface EmptyStateProps {
  message: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  message,
  subtitle,
  icon = Info,
  className,
}: EmptyStateProps) {
  return (
    <InfoBanner
      message={message}
      subtitle={subtitle}
      icon={icon}
      variant="primary"
      layout="vertical"
      className={className}
    />
  );
}
