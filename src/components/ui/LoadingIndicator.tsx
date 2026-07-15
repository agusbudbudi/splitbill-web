import { cn } from "@/lib/utils";
import { LOADING_ICON_DATA_URI } from "./loadingIconDataUri";

interface LoadingIndicatorProps {
  /** Optional text shown under the spinner */
  text?: string;
  /** Icon size in pixels */
  size?: number;
  className?: string;
}

export function LoadingIndicator({
  text,
  size = 40,
  className,
}: LoadingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size * 1.5, height: size * 1.5 }}
      >
        <span className="absolute inset-0 rounded-full border-2 border-primary/10" />
        <span
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, var(--color-primary, #479fea) 100%)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          }}
        />
        <div className="relative rounded-full bg-background p-1.5 shadow-sm">
          <img
            src={LOADING_ICON_DATA_URI}
            alt="Loading"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            className="drop-shadow-md"
          />
        </div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-semibold">
          {text}
        </p>
      )}
    </div>
  );
}
