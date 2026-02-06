"use client";

import React from "react";
import { Button, ButtonProps } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddButtonProps extends ButtonProps {
  label: string;
}

export function AddButton({
  label,
  className,
  variant = "default",
  ...props
}: AddButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        "w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-2xl",
        className,
      )}
      {...props}
    >
      <Plus className="w-5 h-5 mr-2" /> {label}
    </Button>
  );
}
