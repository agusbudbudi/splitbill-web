"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Ignored when fullScreen is true. */
  maxHeight?: string;
  showBackButton?: boolean;
  /** Optional custom control on the header's right side (e.g. a delete button), shown alongside the back button. */
  headerAction?: React.ReactNode;
  /**
   * Edge-to-edge, no rounded corners, no drag handle — for flows that need
   * the full viewport on mobile (e.g. multi-field forms, image pickers).
   * Desktop still renders as a capped-height centered modal either way.
   */
  fullScreen?: boolean;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxHeight = "90vh",
  showBackButton = true,
  headerAction,
  fullScreen = false,
}: BottomSheetProps) => {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!mounted) return null;

  const panelMotion = isDesktop
    ? {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 12 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      }
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { duration: 0.3, ease: "easeOut" as const },
      };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-end lg:items-center pointer-events-auto">
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet / Modal Content */}
          <motion.div
            key="panel"
            {...panelMotion}
            className={cn(
              "relative w-full max-w-[600px] lg:max-w-lg bg-white shadow-2xl overflow-hidden flex flex-col",
              fullScreen
                ? "h-[100dvh] lg:h-auto lg:max-h-[85vh] lg:rounded-md lg:my-8"
                : "rounded-t-sm lg:rounded-md lg:my-8",
            )}
            style={fullScreen ? undefined : { maxHeight }}
          >
            {/* Handle */}
            {!fullScreen && (
              <div
                className="w-full flex justify-center pt-2 pb-1 cursor-pointer lg:hidden"
                onClick={onClose}
              >
                <div className="w-12 h-1.5 rounded-full bg-muted/40" />
              </div>
            )}

            {/* Header */}
            {(title || showBackButton || headerAction) && (
              <div className="flex items-center justify-between px-6 py-2 border-b border-primary/5 shrink-0">
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
                {headerAction
                  ? headerAction
                  : !showBackButton && (
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
              <div className="p-4 border-t border-primary/5 bg-background shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
