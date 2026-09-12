"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Zap, ChevronDown } from "lucide-react";
import { cn, getAvatarUrl, isNativeAppWebView } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "@/lib/stores/authStore";
import { usePWA } from "@/hooks/usePWA";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Pakai", href: "#cara-pakai" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Member", href: "/subscription", badge: "VIP" },
];

// Shortcuts shown in the "Fitur" tray — mirrors FeaturesSection so the header doubles as quick nav
const FEATURE_SHORTCUTS = [
  { imageSrc: "/img/menu-split-bill.png", title: "Split Bill", href: "/split-bill", bgLight: "bg-blue-100/90", badge: "Populer" },
  { imageSrc: "/img/menu-split-later.png", title: "Split Later", href: "/split-later", bgLight: "bg-purple-100/90", badge: "NEW" },
  { imageSrc: "/img/menu-shared-goal.png", title: "Shared Goals", href: "/shared-goals", bgLight: "bg-emerald-100/90" },
  { imageSrc: "/img/menu-collect-money.png", title: "Collect Money", href: "/collect-money", bgLight: "bg-amber-100/90" },
  { imageSrc: "/img/menu-invoice.png", title: "Invoice", href: "/invoice", bgLight: "bg-rose-100/90" },
  { imageSrc: "/img/menu-wallet.png", title: "Wallet", href: "/wallet", bgLight: "bg-violet-100/90" },
];

interface HomepageNavbarProps {
  /** Nav links shown in desktop bar + mobile drawer. Defaults to the homepage's full link set. */
  navLinks?: NavLink[];
  /** Href for the "Mulai Gratis" CTA (desktop + mobile). Defaults to /split-bill. */
  ctaHref?: string;
  /** Path on which "#anchor" links should scroll-in-place instead of navigating there first. Defaults to "/" (homepage). */
  scrollPath?: string;
}

export const HomepageNavbar = ({
  navLinks = DEFAULT_NAV_LINKS,
  ctaHref = "/split-bill",
  scrollPath = "/",
}: HomepageNavbarProps = {}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fiturHover, setFiturHover] = useState(false);
  const [fiturPinned, setFiturPinned] = useState(false);
  const fiturOpen = fiturHover || fiturPinned;
  const [mobileFiturOpen, setMobileFiturOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const headerRef = useRef<HTMLElement>(null);
  const fiturTrayRef = useRef<HTMLDivElement>(null);
  const fiturCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { isInstallable, isStandalone, isIOS, installPWA } = usePWA();
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setIsNativeApp(isNativeAppWebView());
  }, []);

  // Check if we should show the install PWA banner
  useEffect(() => {
    // Check if dismissed previously in this session
    const isDismissed = sessionStorage.getItem("pwa_dismissed") === "true";

    // Rely strictly on browser's native install readiness or iOS device flags
    if (isAuthenticated && !isStandalone && (isInstallable || isIOS) && !isDismissed) {
      setShowPwaBanner(true);
    } else {
      setShowPwaBanner(false);
    }
  }, [isInstallable, isStandalone, isIOS, isAuthenticated]);

  const handlePwaInstall = async () => {
    if (isIOS) {
      alert(
        "Untuk menginstall aplikasi di iOS:\n1. Tap tombol Share ⎋ di browser Anda\n2. Pilih 'Add to Home Screen' (Tambah ke Layar Utama) ⊞"
      );
    } else if (isInstallable) {
      const outcome = await installPWA();
      if (outcome === "accepted") {
        setShowPwaBanner(false);
      }
    } else {
      // Fallback for Desktop browser simulation / Localhost / Production where beforeinstallprompt hasn't fired yet
      alert(
        "Untuk menginstall aplikasi di Desktop / Android:\n1. Klik ikon Install ⊕ / Titik Tiga ⋮ di bagian kanan atas address bar browser Anda\n2. Pilih 'Install SplitBill' / 'Tambahkan ke Layar Utama'"
      );
    }
  };

  const handleDismissPwa = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem("pwa_dismissed", "true");
    setShowPwaBanner(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the "Fitur" tray on outside click / Escape / route change
  useEffect(() => {
    if (!fiturOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (fiturTrayRef.current && !fiturTrayRef.current.contains(e.target as Node)) {
        setFiturHover(false);
        setFiturPinned(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFiturHover(false);
        setFiturPinned(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [fiturOpen]);

  useEffect(() => {
    setFiturHover(false);
    setFiturPinned(false);
    setMobileFiturOpen(false);
    if (fiturCloseTimeout.current) clearTimeout(fiturCloseTimeout.current);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) setMobileFiturOpen(false);
  }, [menuOpen]);

  const handleFiturMouseEnter = () => {
    if (fiturCloseTimeout.current) {
      clearTimeout(fiturCloseTimeout.current);
      fiturCloseTimeout.current = null;
    }
    setFiturHover(true);
  };

  const handleFiturMouseLeave = () => {
    if (fiturCloseTimeout.current) clearTimeout(fiturCloseTimeout.current);
    fiturCloseTimeout.current = setTimeout(() => setFiturHover(false), 150);
  };

  const handleFiturClick = () => {
    setFiturPinned((v) => !v);
  };

  const closeFiturTray = () => {
    setFiturHover(false);
    setFiturPinned(false);
  };

  // Track exact header height to keep mobile drawer flush below it
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    ro.observe(el);
    setHeaderHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (pathname === scrollPath) {
        const targetId = href.slice(1);
        const el = document.getElementById(targetId);
        if (el) {
          // 1. Calculate and scroll immediately (this will trigger scrolled=true and start rendering the banner)
          const header = headerRef.current;
          let headerHeight = header ? header.offsetHeight : 64;
          let elementPosition = el.getBoundingClientRect().top;
          let offsetPosition = elementPosition + window.scrollY - headerHeight - 2;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // 2. Perform a secondary micro-adjustment after 200ms once the Framer Motion height animation of the banner completes
          setTimeout(() => {
            const updatedHeader = headerRef.current;
            const updatedHeaderHeight = updatedHeader ? updatedHeader.offsetHeight : 64;
            const updatedElementPosition = el.getBoundingClientRect().top;
            const updatedOffset = updatedElementPosition + window.scrollY - updatedHeaderHeight - 2;

            window.scrollTo({
              top: updatedOffset,
              behavior: "smooth",
            });
          }, 260); // 260ms matches Framer Motion's default height transition delay perfectly
        }
      } else {
        router.push(`${scrollPath}${href}`);
      }
      setMenuOpen(false);
    }
  };

  const AuthCTA = ({ className }: { className?: string }) => (
    <>
      {isInitialized && isAuthenticated ? (
        <Link
          href="/member"
          className={cn(
            "group relative flex items-center justify-center rounded-full transition-all duration-300 w-9 h-9 border-2 border-slate-200 hover:border-primary bg-slate-50 backdrop-blur-sm",
            user?.subscriptionStatus === "active" && "p-[2px] bg-gradient-gold shadow-[0_0_10px_rgba(246,226,122,0.4)]",
            className
          )}
          aria-label="Ke Dashboard Member"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
            <img
              src={getAvatarUrl(user)}
              alt="Avatar Profil"
              className="w-full h-full object-cover"
            />
          </div>
          {user?.subscriptionStatus === "active" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 z-10 p-[1px]">
              <Image
                src="/img/icon-vip.png"
                alt="VIP"
                width={14}
                height={14}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </Link>
      ) : (
        <Link
          href="/login"
          className={cn(
            "px-4 py-2 rounded-sm text-sm font-bold text-primary hover:bg-slate-100 transition-all duration-200",
            className
          )}
        >
          Masuk
        </Link>
      )}
    </>
  );

  // Native shell provides its own header + PWA is irrelevant inside it.
  if (isNativeApp) return null;

  return (
    <>
      <header ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="SplitBill Home"
            >
              <Image
                src="/img/logo-splitbill-black.png"
                alt="SplitBill"
                width={130}
                height={36}
                className="h-7 lg:h-8 w-auto transition-all duration-300"
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.href === "#fitur" ? (
                  <div
                    key={link.href}
                    ref={fiturTrayRef}
                    className="relative"
                    onMouseEnter={handleFiturMouseEnter}
                    onMouseLeave={handleFiturMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={handleFiturClick}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-200 cursor-pointer",
                        fiturOpen ? "text-primary bg-slate-100" : "text-slate-700 hover:text-primary hover:bg-slate-100"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", fiturOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {fiturOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[420px] bg-white rounded-md border border-slate-100 shadow-2xl shadow-slate-900/10 p-4 z-50"
                        >
                          <div className="grid grid-cols-2 gap-1">
                            {FEATURE_SHORTCUTS.map((feat) => (
                              <Link
                                key={feat.href}
                                href={feat.href}
                                onClick={closeFiturTray}
                                className="group flex items-center gap-3 p-2.5 rounded-sm hover:bg-slate-50 transition-colors duration-150"
                              >
                                <div className={`w-10 h-10 shrink-0 ${feat.bgLight} rounded-sm flex items-center justify-center p-1.5`}>
                                  <Image
                                    src={feat.imageSrc}
                                    alt={feat.title}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                                    {feat.title}
                                  </p>
                                  {feat.badge && (
                                    <span
                                      className={cn(
                                        "text-[9px] font-black uppercase tracking-wider",
                                        feat.badge === "NEW" ? "text-emerald-600" : "text-amber-600"
                                      )}
                                    >
                                      {feat.badge}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="h-px bg-slate-100 my-3" />

                          <Link
                            href="/all-feature"
                            onClick={closeFiturTray}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                          >
                            Lihat semua fitur <ArrowRight className="w-3 h-3" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : link.href.startsWith("/") ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 px-1.5 py-0.5 rounded-full tracking-wider shadow-sm shadow-amber-500/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={pathname === scrollPath ? link.href : `${scrollPath}${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-2 rounded-sm text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Mobile/Desktop Auth + Hamburger Wrapper */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4">
                <AuthCTA />

                {/* Desktop CTA (Mulai Gratis) */}
                <Link
                  href={ctaHref}
                  className="hidden lg:flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  Mulai Gratis
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Sticky Banner Encourage to Login or Install PWA */}
        <AnimatePresence>
          {/* Scenario 1: Not Authenticated -> Encourage Login (Only on scroll) */}
          {scrolled && isInitialized && !isAuthenticated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-white border-t border-slate-100 text-slate-700"
            >
              <Link href="/login" className="block w-full py-2 px-4 text-center hover:bg-slate-50/50 transition-colors">
                <span className="text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 tracking-wide">
                  ⚡ <span className="sm:hidden">Login & simpan catatan patunganmu!</span><span className="hidden sm:inline">Yuk login biar catatan patunganmu tersimpan otomatis!</span> <span className="font-black text-primary inline-flex items-center gap-1">Masuk Sekarang <ArrowRight className="w-3.5 h-3.5" /></span>
                </span>
              </Link>
            </motion.div>
          )}

          {/* Scenario 2: Authenticated -> Encourage Install PWA (only once user starts scrolling) */}
          {scrolled && isAuthenticated && showPwaBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-white border-t border-slate-100 text-slate-700"
            >
              <div className="w-full py-2 px-8 flex items-center justify-between max-w-7xl mx-auto">
                <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5 tracking-wide">
                  📱 <span className="sm:hidden">Install SplitBill di Home Screen!</span><span className="hidden sm:inline">Install SplitBill App untuk akses lebih cepat langsung dari Home Screen!</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePwaInstall}
                    className="cursor-pointer font-black text-primary text-xs flex items-center gap-1 hover:underline"
                  >
                    ⚡ {isIOS ? "Cara Install" : "Install"}
                  </button>
                  <button
                    onClick={handleDismissPwa}
                    className="cursor-pointer text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Tutup banner"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ top: headerHeight }}
            className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-xl lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.href === "#fitur" ? (
                  <div key={link.href}>
                    <button
                      type="button"
                      onClick={() => setMobileFiturOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", mobileFiturOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {mobileFiturOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-1 px-2 pb-2 pt-1">
                            {FEATURE_SHORTCUTS.map((feat) => (
                              <Link
                                key={feat.href}
                                href={feat.href}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-primary/5 transition-colors duration-150"
                              >
                                <div className={`w-9 h-9 shrink-0 ${feat.bgLight} rounded-md flex items-center justify-center p-1.5`}>
                                  <Image
                                    src={feat.imageSrc}
                                    alt={feat.title}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className="text-sm font-bold text-slate-700 truncate">{feat.title}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : link.href.startsWith("/") ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 px-1.5 py-0.5 rounded-full tracking-wider shadow-sm shadow-amber-500/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={pathname === scrollPath ? link.href : `${scrollPath}${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="h-px bg-slate-100 my-2" />
              {isInitialized && isAuthenticated ? (
                <Link
                  href="/member"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className={cn(
                    "relative w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200",
                    user?.subscriptionStatus === "active" && "border-amber-400"
                  )}>
                    <img
                      src={getAvatarUrl(user)}
                      alt="Avatar Profil"
                      className="w-full h-full object-cover"
                    />
                    {user?.subscriptionStatus === "active" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100 z-10 p-[0.5px]">
                        <Image
                          src="/img/icon-vip.png"
                          alt="VIP"
                          width={8}
                          height={8}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-3 rounded-lg text-base font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Masuk
                </Link>
              )}
              <Link
                href={ctaHref}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-200 mt-1"
                onClick={() => setMenuOpen(false)}
              >
                <Zap className="w-4 h-4 fill-white" />
                Mulai Gratis - Sekarang!
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
