"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Instagram, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SiteFooterProps {
  className?: string;
}

export const SiteFooter = ({ className }: SiteFooterProps) => {
  return (
    <footer
      className={cn(
        "w-full max-w-[600px] mx-auto bg-primary text-white pt-10 pb-10 px-6 mb-0",
        className,
      )}
    >
      <div className="flex flex-col space-y-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <Image
                src="/img/footer-icon.png"
                alt="SplitBill"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tighter">
              SplitBill{" "}
              <span className="text-white/80 italic text-md">Online</span>
            </span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            Aplikasi bagi tagihan online gratis paling praktis untuk patungan &
            kelola keuangan bareng teman. 100% Cepat & Akurat.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-y-10 gap-x-8">
          {/* Section 1: Fitur */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Layanan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/split-bill"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Split Bill Scan
                </Link>
              </li>
              <li>
                <Link
                  href="/invoice"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Invoice Digital
                </Link>
              </li>
              <li>
                <Link
                  href="/shared-goals"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Shared Goals
                </Link>
              </li>
              <li>
                <Link
                  href="/wallet"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Dompet Saya
                </Link>
              </li>
              <li>
                <Link
                  href="/collect-money"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Patungan Uang
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: Resources */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Blog & Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Donasi Tim
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Legal */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Informasi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm font-medium hover:text-white/70 transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Social */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Sosial Media
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://www.instagram.com/splitbill.app/"
                  target="_blank"
                  className="flex items-center gap-2 text-sm font-medium hover:text-white/70 transition-colors"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/50">
            Made with{" "}
            <Heart className="w-3 h-3 text-white fill-white animate-pulse" /> by
            SplitBill Team
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              © 2026 SplitBill Online • Smart Way to Split Expenses
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
