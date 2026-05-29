"use client";

import React, { useRef, useCallback } from "react";
import { Home, ReceiptText, Camera, History } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { toast } from "sonner";

export const MemberSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { setPendingCapturedImage } = useSplitBillStore();
  const { isAuthenticated } = useAuthStore();

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
      e.target.value = "";
    },
    [setPendingCapturedImage, router],
  );

  const menuItems = [
    { icon: Home, label: "Home", href: "/member" },
    { icon: ReceiptText, label: "Split Bill", href: "/split-bill" },
    { icon: Camera, label: "Scan Bill", onClick: handleCameraCapture },
    {
      icon: History,
      label: "Aktivitas",
      href: isAuthenticated ? "/history" : "/login",
      activeHref: "/history"
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center py-2 w-14 fixed left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-soft z-50 gap-3">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const targetHref = "activeHref" in item ? item.activeHref : item.href;
        const isActive = targetHref
          ? (targetHref === "/member" ? (pathname === "/member" || pathname === "/") : pathname.startsWith(targetHref))
          : false;

        const content = (
          <div
            key={item.label}
            className={cn(
              "group relative flex flex-col items-center cursor-pointer transition-all duration-300",
              isActive ? "scale-105" : "hover:scale-105"
            )}
            onClick={item.onClick}
          >
            <div className={cn(
              "p-2.5 rounded-full transition-all duration-300",
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-400 hover:text-primary hover:bg-primary/5"
            )}>
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
            </div>

            {/* Custom Tooltip - instant appearance on hover */}
            <div className="absolute left-[130%] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-lg pointer-events-none opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-75 origin-left whitespace-nowrap z-50">
              {item.label}
              {/* Tooltip Arrow */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-slate-900 ml-[-4px]"></div>
            </div>
          </div>
        );

        return item.href ? (
          <Link key={item.label} href={item.href} className="w-full flex justify-center">
            {content}
          </Link>
        ) : content;
      })}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </aside>
  );
};
