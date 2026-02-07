import React, { useState, useEffect } from "react";
import { ThumbsUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ReviewBannerProps {
  onClose?: () => void;
}

export const ReviewBanner: React.FC<ReviewBannerProps> = ({ onClose }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide logic can be added here if needed, but for now we keep it persistent until closed
  // or user navigates away.

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleDismis = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 z-50 max-w-[448px] mx-auto"
    >
      <div
        onClick={() => router.push("/review")}
        className="bg-primary text-primary-foreground rounded-2xl p-4 shadow-xl flex items-center justify-between cursor-pointer relative overflow-hidden group"
      >
        {/* Background elements for visual interest */}
        <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
        <div className="absolute bottom-0 left-0 p-6 bg-black/10 rounded-full -ml-4 -mb-4 blur-xl"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
            <ThumbsUp className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-sm">Suka aplikasinya?</h4>
            <p className="text-xs text-primary-foreground/80">
              Bantu kami kasih rating bintang 5 ya! ⭐
            </p>
          </div>
        </div>

        <div
          onClick={handleDismis}
          className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
