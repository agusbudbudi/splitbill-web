"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InvoiceProgressProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { number: 1, label: "Details" },
  { number: 2, label: "Billed" },
  { number: 3, label: "Items" },
  { number: 4, label: "Payment" },
  { number: 5, label: "TnC" },
  { number: 6, label: "Preview" },
];

export function InvoiceProgress({
  currentStep,
  totalSteps = 6,
  onStepClick,
}: InvoiceProgressProps) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xs rounded-[1.2rem] p-4 shadow-soft">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div
              className={cn(
                "flex flex-col items-center gap-1.5 cursor-pointer transition-all",
                onStepClick && "hover:opacity-70",
              )}
              onClick={() => onStepClick?.(step.number)}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  currentStep === step.number &&
                    "bg-primary text-white scale-110 shadow-sm",
                  currentStep > step.number && "bg-primary/10 text-primary",
                  currentStep < step.number && "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold transition-all tracking-tight",
                  currentStep === step.number && "text-primary",
                  currentStep > step.number && "text-primary/60",
                  currentStep < step.number && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-1.5 transition-all rounded-full",
                  currentStep > step.number ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
