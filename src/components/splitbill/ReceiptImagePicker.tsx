"use client";

import React, { useRef } from "react";
import { Camera, ImagePlus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ReceiptImagePickerProps {
  /** Preview URL to display (data URL or object URL) */
  image: string | null;
  onFileSelect: (file: File, source: "camera" | "gallery") => void;
  onRemove: () => void;
  infoText?: string;
  /** Optional content rendered below the preview once an image is selected */
  footerNote?: React.ReactNode;
  accept?: string;
  /** Shows a busy state instead of the picker (e.g. while an upload is in flight) */
  isLoading?: boolean;
  loadingText?: string;
}

export const ReceiptImagePicker = ({
  image,
  onFileSelect,
  onRemove,
  infoText = "💡 Pastikan struk terlihat jelas, terang, dan tidak terpotong",
  footerNote,
  accept = "image/*",
  isLoading = false,
  loadingText = "Mengupload struk...",
}: ReceiptImagePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (source: "camera" | "gallery") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file, source);
      e.target.value = "";
    };

  if (!image) {
    return (
      <>
        {/* Camera capture area — tap to open camera directly */}
        <div
          onClick={() => !isLoading && cameraInputRef.current?.click()}
          className={cn(
            "border-1 border-dashed border-primary/20 rounded-sm pt-8 flex flex-col items-center justify-center gap-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group overflow-hidden",
            isLoading && "opacity-60 pointer-events-none",
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 pb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary animate-bounce" />
              </div>
              <p className="text-sm font-bold text-primary">{loadingText}</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <div className="text-center px-4">
                <p className="font-bold text-sm text-foreground">Foto Struk Sekarang</p>
                <p className="text-[10px] text-muted-foreground mt-1">Tap untuk buka kamera</p>
              </div>

              <div className="w-full p-2.5 border-t border-dashed border-primary/20 px-4 text-center bg-primary/5">
                <p className="text-[11px] font-bold text-foreground/80 flex items-center justify-center gap-1">
                  <span>{infoText}</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action buttons row: Upload dari Galeri & Foto Struk */}
        {!isLoading && (
          <div className="flex gap-2 w-full mb-0">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1 h-12 border-primary/15 text-muted-foreground font-semibold text-xs"
            >
              <ImagePlus className="w-4 h-4 mr-2 text-muted-foreground" />
              Upload dari Galeri
            </Button>
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 h-12 shadow-md shadow-primary/10 text-xs"
            >
              <Camera className="w-4 h-4 mr-2 text-white" />
              Foto Struk
            </Button>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange("gallery")}
          accept={accept}
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleChange("camera")}
          accept={accept}
          capture="environment"
          className="hidden"
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-primary/20 rounded-sm bg-white overflow-hidden flex flex-col group">
        <div className="relative bg-muted w-full flex items-center justify-center overflow-hidden min-h-[80px]">
          <img
            src={image}
            alt="Receipt Preview"
            className="max-w-full max-h-[360px] w-auto h-auto object-contain"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {footerNote && (
          <div className="w-full p-2.5 border-t border-dashed border-primary/20 px-4 text-center bg-primary/5">
            {footerNote}
          </div>
        )}
      </div>
    </div>
  );
};
