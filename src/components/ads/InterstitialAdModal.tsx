"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { AdCampaign } from "@/lib/ads/adsConfig";
import { Button } from "@/components/ui/Button";
import { trackAds } from "@/lib/gtag";

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

  // Lock the page behind the ad. Restores the previous value rather than clearing
  // it, because this modal can open on top of chat, which holds its own lock.
  const isVisible = isOpen && !!ad;
  useEffect(() => {
    if (!isVisible) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible]);

  if (!isOpen || !ad) return null;

  const isFinished = timeLeft <= 0;
  const hasCta = Boolean(ad.ctaUrl && ad.ctaText);

  const handleCtaClick = (ctaPlacement: "button" | "icon") => {
    trackAds.ctaClick({
      adId: ad.id,
      sponsorName: ad.sponsorName,
      mediaType: ad.mediaType,
      ctaPlacement,
    });
  };
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
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-background overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full max-w-[600px] bg-background flex flex-col justify-between"
        >
          {/* ── Header: progress bar + floating chips over the media ── */}
          {/* pointer-events-none so embedded player controls under the gaps stay tappable */}
          <div
            className="absolute top-0 inset-x-0 z-30 flex flex-col pointer-events-none"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* ── Progress bar ── */}
            <div className="relative h-1 bg-black/20">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-primary"
                style={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-2 min-w-0 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
                <span className="text-[10px] font-black uppercase text-white/70 tracking-wider shrink-0">
                  Sponsor
                </span>
                <span className="text-xs font-black text-white tracking-tight truncate">
                  {ad.sponsorName}
                </span>
              </div>

              {/* Countdown spinner OR blue chevron to close */}
              {!isFinished ? (
                <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{Math.ceil(timeLeft)}s</span>
                </div>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center justify-center shrink-0 p-1.5 rounded-full text-blue-400 bg-blue-950/70 hover:bg-blue-900/80 active:scale-95 transition-all cursor-pointer shadow-md pointer-events-auto"
                  aria-label="Tutup iklan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── Ad Media ── */}
          <div className="absolute inset-0 w-full h-full bg-background z-10 overflow-hidden flex items-start justify-center opacity-100">
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
                <div className="relative w-full h-full flex items-start justify-center">
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

          {/* Spacer */}
          <div className="flex-grow z-10" />

          {/* ── Bottom panel ── */}
          <div
            className="relative z-20 w-full bg-card rounded-t-md shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pt-6 px-6 flex flex-col gap-3"
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          >
            {/* Mute / unmute button — anchored to the card so it stays just above
                it when the card grows as the Lanjut button appears */}
            {ad.mediaType === "video" && videoInfo && !isEmbedVideo && (
              <button
                onClick={handleToggleMute}
                className="absolute bottom-full right-4 mb-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Title & description — only shown if provided */}
            {(ad.title || ad.description || (hasCta && isFinished)) && (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2 text-left">
                  {ad.title && (
                    <h3 className="text-md sm:text-lg font-black text-foreground leading-snug tracking-tight">
                      {ad.title}
                    </h3>
                  )}
                  {ad.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                      {ad.description}
                    </p>
                  )}
                </div>

                {/* CTA shrinks to an icon once Lanjut takes the main button spot */}
                {hasCta && isFinished && (
                  <a
                    href={ad.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCtaClick("icon")}
                    aria-label={ad.ctaText}
                    title={ad.ctaText}
                    className="shrink-0 w-10 h-10 rounded-full border border-primary/30 bg-card text-primary hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Full CTA button — only until the countdown finishes */}
            {hasCta && !isFinished && (
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCtaClick("button")}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-sm text-sm font-black bg-card text-primary border-primary/30 transition-all flex items-center justify-center gap-2"
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
