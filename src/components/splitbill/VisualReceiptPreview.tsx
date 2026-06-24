"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSplitBillStore } from "@/store/useSplitBillStore";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const VisualReceiptPreview = () => {
  const { scannedReceiptImages } = useSplitBillStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Zoom and Pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when image changes or modal opens
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  if (!scannedReceiptImages || scannedReceiptImages.length === 0) return null;

  const activeImage = scannedReceiptImages[currentIndex];

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return; // Only drag when zoomed in
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale === 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;
    setPosition({ x: newX, y: newY });
  };

  // Carousel controls
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : scannedReceiptImages.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < scannedReceiptImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-4 z-40 md:left-[calc(50vw-300px+16px)]">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/95 hover:to-violet-600/95 text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group focus:outline-hidden cursor-pointer"
        >
          <div className="relative">
            <ReceiptText className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-white shadow-sm">
              {scannedReceiptImages.length}
            </span>
          </div>
          <span className="text-xs tracking-tight">Lihat Struk</span>
          <span className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-25 pointer-events-none" />
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                  <ReceiptText className="w-4 h-4 text-primary" />
                  Struk Belanja
                </h3>
                {scannedReceiptImages.length > 1 && (
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Struk {currentIndex + 1} dari {scannedReceiptImages.length}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slider Content & Zoom Area */}
            <div className="relative flex-1 bg-gray-950 overflow-hidden flex items-center justify-center min-h-[300px]">
              {/* Zoomable Image Container */}
              <div
                ref={imageRef}
                className={cn(
                  "w-full h-full flex items-center justify-center overflow-hidden select-none",
                  scale > 1 ? "cursor-grab active:cursor-grabbing" : ""
                )}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUpOrLeave}
              >
                <img
                  src={activeImage}
                  alt={`Scanned Receipt ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-100 ease-out"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>

              {/* Slider Arrows (Only if more than 1 image) */}
              {scannedReceiptImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                    title="Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Bottom Info Tip */}
              {scale === 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white/80 pointer-events-none text-center whitespace-nowrap">
                  💡 Zoom & geser untuk detail menu/harga
                </div>
              )}
            </div>

            {/* Zoom Controls Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-100 shrink-0">
              {/* Zoom Buttons */}
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={handleZoomOut}
                  disabled={scale <= 1}
                  variant="outline"
                  className="w-9 h-9 p-0 rounded-lg flex items-center justify-center"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-[11px] font-bold text-gray-500 min-w-[36px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  disabled={scale >= 4}
                  variant="outline"
                  className="w-9 h-9 p-0 rounded-lg flex items-center justify-center"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Reset Zoom */}
              {(scale > 1 || position.x !== 0 || position.y !== 0) && (
                <Button
                  onClick={handleResetZoom}
                  variant="ghost"
                  className="text-xs font-bold text-primary hover:bg-primary/5 px-3 h-9 rounded-lg"
                >
                  <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                  Reset Zoom
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
