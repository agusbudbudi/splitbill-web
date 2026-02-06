import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon: Icon,
  confirmText = "Ya, Simpan",
  cancelText = "Batal",
  confirmButtonClassName,
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 animate-in fade-in duration-200">
      <div className="max-w-sm w-full bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg font-bold cursor-pointer"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={cn(
                "flex-1 h-12 rounded-lg font-bold shadow-lg cursor-pointer",
                confirmButtonClassName ||
                  "bg-primary text-white shadow-primary/20",
              )}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
