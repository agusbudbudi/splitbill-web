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
    <footer className={cn("bg-primary text-white pt-10 pb-10 px-6 mt-12 -mb-12", className)}>
      <div className="flex flex-col space-y-8 max-w-[600px] mx-auto">
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
            <span className="text-xl font-bold tracking-tighter">SplitBill <span className="text-white/70 italic text-sm">Online</span></span>
          </div>
          <p className="text-[13px] text-white/80 leading-relaxed">
            Aplikasi bagi tagihan online gratis paling praktis untuk patungan & kelola keuangan bareng teman. 100% Cepat & Akurat.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Layanan</h4>
            <ul className="space-y-2.5">
              <li><Link href="/split-bill" className="text-sm font-medium hover:text-white/70 transition-colors">Coba Split Bill Scan</Link></li>
              <li><Link href="/invoice" className="text-sm font-medium hover:text-white/70 transition-colors">Buat Invoice Digital</Link></li>
              <li><Link href="/shared-goals" className="text-sm font-medium hover:text-white/70 transition-colors">Kelola Shared Goals</Link></li>
              <li><Link href="/collect-money" className="text-sm font-medium hover:text-white/70 transition-colors">Fitur Collect Money</Link></li>
              <li><Link href="/wallet" className="text-sm font-medium hover:text-white/70 transition-colors">Buka Wallet Saya</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Lainnya</h4>
            <ul className="space-y-2.5">
              <li><Link href="/donate" className="text-sm font-medium hover:text-white/70 transition-colors">Donasi Geng Kamu</Link></li>
              <li><Link href="/faq" className="text-sm font-medium hover:text-white/70 transition-colors">Pusat Bantuan & FAQ</Link></li>
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
        <div className="flex flex-col items-center gap-4 pt-2 pb-8">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/50">
            Made with <Heart className="w-3 h-3 text-white fill-white animate-pulse" /> by SplitBill Team
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
