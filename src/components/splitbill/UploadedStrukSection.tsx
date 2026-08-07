"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Eye,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { cn, formatRelativeTime } from "@/lib/utils";
import { BackendReceiptImage } from "@/lib/api/split-bills";
import { API_BASE_URL } from "@/lib/constants";

interface UploadedStrukSectionProps {
  images: BackendReceiptImage[];
}

/** Backend may return a path relative to its own origin (e.g. "/api/split-bills/.../images/...");
 *  resolve it against the API host instead of letting the browser default to the frontend origin. */
const resolveImageUrl = (url: string) =>
  url.startsWith("/") ? `${API_BASE_URL}${url}` : url;

const getFileName = (url: string, mimeType: string, idx: number) => {
  try {
    const path = new URL(url, API_BASE_URL).pathname;
    const base = path.substring(path.lastIndexOf("/") + 1);
    if (base) return decodeURIComponent(base);
  } catch {
    // malformed URL, fall through to generated name
  }
  const ext = mimeType?.split("/")[1] || "jpg";
  return `Struk-${idx + 1}.${ext}`;
};

export const UploadedStrukSection: React.FC<UploadedStrukSectionProps> = ({
  images,
}) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());

  if (!images || images.length === 0) return null;

  const markBroken = (key: string) =>
    setBrokenIds((prev) => new Set(prev).add(key));

  return (
    <>
      <div className="space-y-1">
        <h3 className="font-bold text-xs text-foreground/70 uppercase px-1">
          Struk Diunggah 🧾
        </h3>
        <p className="text-[10px] text-muted-foreground font-medium px-1">
          Struk hanya tersedia selama 7 hari sejak diunggah.
        </p>
      </div>
      <div className="divide-y divide-dashed divide-primary/10 px-1 mt-2">
        {images.map((img, idx) => {
          const key = img.id || String(idx);
          const isDeleted = brokenIds.has(key);

          return (
            <div key={key} className="py-2.5 flex items-center gap-3">
              {isDeleted ? (
                <div className="w-12 h-12 rounded-xs bg-muted/30 border border-dashed border-muted-foreground/30 shrink-0 flex items-center justify-center">
                  <ImageOff className="w-5 h-5 text-muted-foreground" />
                </div>
              ) : (
                <button
                  onClick={() => setViewerIndex(idx)}
                  className="w-12 h-12 rounded-xs overflow-hidden bg-white border border-primary/10 shrink-0 cursor-pointer"
                >
                  <img
                    src={resolveImageUrl(img.url)}
                    alt={`Struk ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => markBroken(key)}
                  />
                </button>
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-xs font-bold truncate",
                    isDeleted
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  )}
                >
                  {getFileName(img.url, img.mimeType, idx)}
                </p>
                <p
                  className={cn(
                    "text-[10px] font-medium",
                    isDeleted ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {isDeleted
                    ? "Struk sudah dihapus"
                    : formatRelativeTime(img.uploadedAt)}
                </p>
              </div>
              {!isDeleted && (
                <button
                  onClick={() => setViewerIndex(idx)}
                  title="Lihat Struk"
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ReceiptFullscreenViewer
        images={images}
        initialIndex={viewerIndex}
        onClose={() => setViewerIndex(null)}
      />
    </>
  );
};

interface ReceiptFullscreenViewerProps {
  images: BackendReceiptImage[];
  initialIndex: number | null;
  onClose: () => void;
}

const ReceiptFullscreenViewer: React.FC<ReceiptFullscreenViewerProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const isOpen = initialIndex !== null;
  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [brokenIndexes, setBrokenIndexes] = useState<Set<number>>(new Set());
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (initialIndex !== null) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [initialIndex]);

  const goToIndex = (idx: number) => {
    setCurrentIndex(idx);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const activeImage = images[currentIndex];

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale === 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({ x: touch.clientX - dragStart.current.x, y: touch.clientY - dragStart.current.y });
  };

  const handlePrev = () =>
    goToIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  const handleNext = () =>
    goToIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      fullScreen
      title={
        images.length > 1
          ? `Struk Diunggah (${currentIndex + 1}/${images.length})`
          : "Struk Diunggah"
      }
      footer={
        <div className="flex items-center justify-between">
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
            <span className="text-[11px] font-bold text-muted-foreground min-w-[36px] text-center">
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
      }
    >
      {/* Zoomable Image Area — full-bleed, cancels the sheet's default p-6 */}
      <div className="relative -m-6 h-[calc(100%+3rem)] bg-gray-950 overflow-hidden flex items-center justify-center">
        <div
          className={cn(
            "w-full h-full flex items-center justify-center overflow-hidden select-none",
            scale > 1 ? "cursor-grab active:cursor-grabbing" : "",
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        >
          {brokenIndexes.has(currentIndex) ? (
            <div className="flex flex-col items-center gap-2 text-white/70 px-6 text-center">
              <ImageOff className="w-10 h-10" />
              <p className="text-sm font-bold">Struk sudah dihapus</p>
              <p className="text-xs text-white/50">
                Struk hanya tersimpan selama 7 hari sejak diunggah.
              </p>
            </div>
          ) : (
            <img
              src={resolveImageUrl(activeImage.url)}
              alt={`Struk ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
              onError={() =>
                setBrokenIndexes((prev) => new Set(prev).add(currentIndex))
              }
            />
          )}
        </div>

        {images.length > 1 && (
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
      </div>
    </BottomSheet>
  );
};
