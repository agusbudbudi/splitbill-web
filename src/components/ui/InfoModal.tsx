import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Info, X } from "lucide-react";
import { createPortal } from "react-dom";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  description,
}: InfoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 animate-in fade-in duration-200">
      <div className="max-w-sm w-full bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4 pt-2">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto rotate-12">
            <Info className="w-6 h-6 text-primary -rotate-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap text-left">
              {description}
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={onClose}
              className="w-full h-11 rounded-lg font-bold bg-primary text-white shadow-lg shadow-primary/20 cursor-pointer"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
