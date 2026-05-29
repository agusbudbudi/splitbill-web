import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global state to persist PWA status across client-side page transitions in Next.js
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
let globalIsInstallable = false;
let globalIsStandalone = false;
let globalIsIOS = false;
let hasInitializedGlobal = false;
const subscribers = new Set<() => void>();

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

if (typeof window !== "undefined" && !hasInitializedGlobal) {
  hasInitializedGlobal = true;

  const checkStandalone = () => {
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    globalIsStandalone = isStandaloneMode;
    notifySubscribers();
  };

  const checkIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    globalIsIOS = isIosDevice;
    notifySubscribers();
  };

  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    globalIsInstallable = true;
    notifySubscribers();
  };

  const handleAppInstalled = () => {
    globalDeferredPrompt = null;
    globalIsInstallable = false;
    globalIsStandalone = true;
    notifySubscribers();
  };

  checkStandalone();
  checkIOS();

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);
}

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(globalIsInstallable);
  const [isStandalone, setIsStandalone] = useState(globalIsStandalone);
  const [isIOS, setIsIOS] = useState(globalIsIOS);

  useEffect(() => {
    const handleChange = () => {
      setIsInstallable(globalIsInstallable);
      setIsStandalone(globalIsStandalone);
      setIsIOS(globalIsIOS);
    };

    subscribers.add(handleChange);
    handleChange();

    return () => {
      subscribers.delete(handleChange);
    };
  }, []);

  const installPWA = async () => {
    if (!globalDeferredPrompt) return;

    await globalDeferredPrompt.prompt();
    const { outcome } = await globalDeferredPrompt.userChoice;

    if (outcome === "accepted") {
      globalDeferredPrompt = null;
      globalIsInstallable = false;
      notifySubscribers();
    }

    return outcome;
  };

  return {
    isInstallable,
    isStandalone,
    isIOS,
    installPWA,
  };
};
