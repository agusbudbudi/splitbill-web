import * as React from "react";
import { cn } from "@/lib/utils/index";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-md bg-muted/60",
      "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:animate-shimmer",
      className,
    )}
    {...props}
  />
));

Skeleton.displayName = "Skeleton";

export { Skeleton };
