"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { AdCampaign } from "@/lib/ads/adsConfig";
import { Button } from "@/components/ui/Button";

interface InterstitialAdModalProps {
  isOpen: boolean;
  ad: AdCampaign | null;
  onClose: () => void;
}

// ─── Platform detection helpers ──────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string | null {
  // Handles:
  //   https://www.youtube.com/watch?v=VIDEO_ID
  //   https://youtu.be/VIDEO_ID
  //   https://www.youtube.com/embed/VIDEO_ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=1&rel=0&modestbranding=1`;
    }
  }
  return null;
}

function getTikTokEmbedUrl(url: string): string | null {
  // Handles: https://www.tiktok.com/@user/video/VIDEO_ID
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (match) {
    return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  return null;
}

type VideoRenderMode = "youtube" | "tiktok" | "direct";

function detectVideoMode(url: string): { mode: VideoRenderMode; embedUrl: string } {
  const yt = getYouTubeEmbedUrl(url);
  if (yt) return { mode: "youtube", embedUrl: yt };

  const tt = getTikTokEmbedUrl(url);
  if (tt) return { mode: "tiktok", embedUrl: tt };

  return { mode: "direct", embedUrl: url };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InterstitialAdModal = ({
  isOpen,
  ad,
  onClose,
}: InterstitialAdModalProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && ad) {
      setTimeLeft(ad.durationSeconds);
      setIsMuted(true);
    }
  }, [isOpen, ad]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = parseFloat((prev - 0.1).toFixed(1));
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Sync isMuted state → video DOM element (React's `muted` prop is not reactive after mount)
  // Must be before early return to satisfy Rules of Hooks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!isOpen || !ad) return null;

  const isFinished = timeLeft <= 0;
  const progressPercent = ((ad.durationSeconds - timeLeft) / ad.durationSeconds) * 100;

  const handleToggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  // Determine how to render the video
  const videoInfo = ad.mediaType === "video" ? detectVideoMode(ad.mediaUrl) : null;
  const isEmbedVideo = videoInfo && videoInfo.mode !== "direct";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full max-w-[600px] bg-slate-950 flex flex-col justify-between text-white"
        >
          {/* ── Header: sponsor info + countdown / close arrow ── */}
          <div className="absolute top-0 inset-x-0 p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/60 backdrop-blur-xs z-30">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-primary/20 text-primary-foreground px-2.5 py-1 rounded-full tracking-wider">
                Sponsor
              </span>
              <span className="text-xs font-black text-slate-200 tracking-tight">
                {ad.sponsorName}
              </span>
            </div>

            {/* Countdown spinner OR blue chevron to close */}
            {!isFinished ? (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 border-t-white animate-spin" />
                <span>{Math.ceil(timeLeft)}s</span>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center justify-center p-1.5 rounded-full text-blue-400 bg-blue-950/70 hover:bg-blue-900/80 active:scale-95 transition-all cursor-pointer shadow-md"
                aria-label="Tutup iklan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ── Progress bar ── */}
          <div className="absolute top-[60px] inset-x-0 h-1 bg-white/10 z-30">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-primary"
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* ── Ad Media ── */}
          <div className="absolute inset-0 w-full h-full bg-slate-950 z-10 overflow-hidden flex items-center justify-center opacity-100">
            {ad.mediaType === "video" && videoInfo ? (
              isEmbedVideo ? (
                /* ── iframe for YouTube / TikTok ── */
                <div className="relative w-full h-full">
                  <iframe
                    src={videoInfo.embedUrl}
                    title={ad.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                    style={{ aspectRatio: "unset" }}
                  />
                </div>
              ) : (
                /* ── Native <video> for direct URLs ── */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={videoInfo.embedUrl}
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="w-full h-auto object-contain"
                  />
                </div>
              )
            ) : (
              /* ── Image ── */
              <img
                src={ad.mediaUrl}
                alt={ad.title}
                className="w-full h-auto object-contain"
              />
            )}


          </div>

          {/* Mute / unmute button — outside media container so it's above all layers */}
          {ad.mediaType === "video" && videoInfo && !isEmbedVideo && (
            <button
              onClick={handleToggleMute}
              className="absolute top-20 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer z-40"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* Spacer */}
          <div className="flex-grow z-10" />

          {/* ── Bottom panel ── */}
          <div className="relative z-20 w-full bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-18 px-6 pb-6 flex flex-col gap-2">
            {/* Title & description — only shown if provided */}
            {(ad.title || ad.description) && (
              <div className="space-y-2 text-left">
                {ad.title && (
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                    {ad.title}
                  </h3>
                )}
                {ad.description && (
                  <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
                    {ad.description}
                  </p>
                )}
              </div>
            )}

            {/* CTA button — only shown if both ctaUrl and ctaText are provided */}
            {ad.ctaUrl && ad.ctaText && (
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-sm text-sm font-black bg-white hover:bg-slate-100 text-slate-950 border-none transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}

            {/* Close button — appears only when countdown finishes */}
            {isFinished && (
              <div className="mt-2 flex justify-center items-center">
                <Button
                  onClick={onClose}
                  className="w-full h-14 rounded-sm bg-blue-600 hover:bg-blue-500 text-white text-sm font-black shadow-lg shadow-blue-600/20 hover:scale-101 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Lanjut
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
