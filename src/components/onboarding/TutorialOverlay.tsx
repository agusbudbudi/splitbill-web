"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export interface TutorialStep {
  id: string;
  targetId: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "center";
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onStepChange?: (index: number) => void;
}

export const TutorialOverlay = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  onStepChange,
}: TutorialOverlayProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const currentStep = steps[currentStepIndex];

  const updateSpotlight = useCallback(() => {
    if (!isOpen || !currentStep) return;

    const findAndSetSpotlight = (retryCount = 0) => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setSpotlightRect({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        });
        
        // Scroll to element if not in view
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (retryCount < 5) {
        // Retry if element not found yet (e.g., during page transition)
        setTimeout(() => findAndSetSpotlight(retryCount + 1), 100);
      } else {
        // If element still not found, show in center
        setSpotlightRect(null);
      }
    };

    findAndSetSpotlight();
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (isOpen) {
      updateSpotlight();
      window.addEventListener("resize", updateSpotlight);
      window.addEventListener("scroll", updateSpotlight);
    }
    return () => {
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight);
    };
  }, [isOpen, updateSpotlight]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange?.(prevIndex);
    }
  };

  const hasSeenTutorial = useOnboardingStore((state) => state.hasSeenTutorial);

  if (!isOpen || hasSeenTutorial) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Dimmed Overlay with Spotlight Hole */}
      <div className={cn(
        "absolute inset-0 pointer-events-auto transition-colors duration-500",
        !spotlightRect ? "bg-black/60" : "bg-transparent"
      )}>
        {spotlightRect && (
          <div
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-2xl transition-all duration-500 ease-in-out"
            style={{
              top: spotlightRect.top,
              left: spotlightRect.left,
              width: spotlightRect.width,
              height: spotlightRect.height,
            }}
          />
        )}
      </div>

      {/* Content Container */}
      <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep?.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={cn(
              "absolute pointer-events-auto w-full max-w-[280px] bg-white rounded-2xl p-4 shadow-2xl flex flex-col gap-2 border border-white/20",
              !spotlightRect && "static",
              spotlightRect && currentStep.position === "bottom" && "top-[calc(var(--top)+var(--height)+20px)]",
              spotlightRect && currentStep.position === "top" && "bottom-[calc(100%-var(--top)+20px)]"
            )}
            style={spotlightRect ? {
              position: 'absolute',
              top: currentStep.position === "bottom" ? spotlightRect.top + spotlightRect.height + 8 : undefined,
              bottom: currentStep.position === "top" ? (window.innerHeight - spotlightRect.top) + 8 : undefined,
              left: Math.max(16, Math.min(spotlightRect.left, window.innerWidth - 296)), // 280px width + padding
              '--top': `${spotlightRect.top}px`,
              '--height': `${spotlightRect.height}px`
            } as any : undefined}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-sm text-base">{currentStep?.title}</h3>
            </div>

            <p className="text-[12px] text-muted-foreground leading-relaxed pr-2">
              {currentStep?.content}
            </p>

            {/* Dots removed for compactness */}

            <div className="flex items-center gap-2 mt-2">
              {currentStepIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 rounded-md h-10 text-xs"
                >
                  <ChevronLeft className="w-3 h-3 mr-1" /> Balik
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-2 rounded-md h-10 font-bold text-xs"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>Mulai! <Rocket className="w-3 h-3 ml-1" /></>
                ) : (
                  <div className="flex items-center justify-between w-full px-1">
                    <span>Lanjut</span>
                    <div className="flex items-center gap-1.5 opacity-60">
                      <span className="text-[9px] font-black">{currentStepIndex + 1}/{steps.length}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </Button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
