"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
  showBackButton?: boolean;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxHeight = "90vh",
  showBackButton = true,
}: BottomSheetProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center pointer-events-auto">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          "absolute bottom-0 w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col transition-all",
          "animate-in slide-in-from-bottom-full duration-300 ease-out"
        )}
        style={{ maxHeight }}
      >
        {/* Handle */}
        <div
          className="w-full flex justify-center pt-2 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted/40" />
        </div>

        {/* Header */}
        {(title || showBackButton) && (
          <div className="flex items-center justify-between px-6 py-2 border-b border-primary/5">
            <div className="flex items-center gap-2">
              {showBackButton && (
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              {title && <h2 className="text-lg font-bold">{title}</h2>}
            </div>
            {!showBackButton && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-primary/5 bg-background">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
