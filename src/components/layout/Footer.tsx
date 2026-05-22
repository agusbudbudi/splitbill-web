"use client";

import React, { useRef, useCallback } from "react";
import { ReceiptText, ScrollText, History, Home, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { toast } from "sonner";

export const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { setPendingCapturedImage } = useSplitBillStore();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const leftMenuItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/split-bill",
      label: "Split Bill",
      icon: ReceiptText,
    },
  ];

  const rightMenuItems = [
    {
      path: "/invoice",
      label: "Invoice",
      icon: ScrollText,
    },
    {
      path: "/history",
      label: "Aktivitas",
      icon: History,
    },
  ];

  const handleCameraCapture = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPendingCapturedImage(base64);
        toast.success("Foto tersimpan! 📸", {
          description: "Tambahkan teman dulu, lalu lanjut ke scan AI.",
          duration: 3000,
        });
        router.push("/split-bill?step=1");
      };
      reader.readAsDataURL(file);

      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [setPendingCapturedImage, router],
  );

  const NavItem = ({
    path,
    label,
    icon: Icon,
  }: {
    path: string;
    label: string;
    icon: React.ElementType;
  }) => {
    const active = isActive(path);
    return (
      <Link
        href={path}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer min-w-[64px]",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-primary/70",
        )}
      >
        {/* Active Indicator Pill */}
        {active && (
          <span className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)] animate-in fade-in slide-in-from-top-1 duration-500" />
        )}

        <div
          className={cn(
            "p-1.5 rounded-sm transition-all duration-300",
            active ? "bg-primary/5" : "hover:bg-accent/40",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-all duration-300",
              active ? "text-primary scale-105" : "text-muted-foreground/60",
            )}
            strokeWidth={active ? 2.2 : 1.8}
          />
        </div>

        <span
          className={cn(
            "text-[10px] font-medium transition-all duration-300 tracking-tight",
            active
              ? "text-primary font-semibold"
              : "text-muted-foreground/60",
          )}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="sticky bottom-0 w-full max-w-[600px] mx-auto bg-background/60 backdrop-blur-xl border-t border-primary/5 py-3 px-6 flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-40 pb-safe mt-auto lg:hidden">
      {/* Left items */}
      {leftMenuItems.map((item) => (
        <NavItem key={item.path} {...item} />
      ))}

      {/* Center: Camera Scan FAB */}
      <div className="relative flex flex-col items-center justify-center -mt-7">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md scale-110 animate-pulse pointer-events-none" />

        <button
          onClick={handleCameraCapture}
          aria-label="Scan Bill"
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-primary via-primary to-violet-600",
            "shadow-lg shadow-primary/40",
            "border-[4px] border-background",
            "transition-all duration-200 active:scale-95 hover:scale-105 hover:shadow-primary/60 cursor-pointer",
            // "ring-2 ring-primary/30 ring-offset-1 ring-offset-background",
          )}
        >
          <Camera className="w-6 h-6 text-white" strokeWidth={2} />
        </button>

        <span className="mt-1.5 text-[10px] font-medium text-muted-foreground/60 tracking-tight">
          Scan
        </span>

        {/* Hidden camera input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Right items */}
      {rightMenuItems.map((item) => (
        <NavItem key={item.path} {...item} />
      ))}
    </div>
  );
};
