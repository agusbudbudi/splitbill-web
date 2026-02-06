import React from "react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-[10px] text-destructive font-medium animate-in slide-in-from-top-1 mt-1",
        className,
      )}
    >
      {message}
    </p>
  );
}
