"use client";

import React from "react";
import { Instagram, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HomepageFooter = () => {
  return (
    <footer className="w-full bg-primary text-white/90 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="space-y-4 lg:max-w-xs">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-md shadow-sm">
                <Image
                  src="/img/footer-icon.png"
                  alt="SplitBill"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                SplitBill{" "}
                <span className="text-sky-200 italic text-md font-semibold">Online</span>
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Aplikasi bagi tagihan online gratis paling praktis untuk patungan &
              kelola keuangan bareng teman. 100% Cepat & Akurat.
            </p>
          </div>

          {/* Links Grid - 4 Columns on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Section 1: Layanan */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Layanan
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/split-bill"
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Split Bill Scan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/invoice"
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Invoice Digital
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shared-goals"
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Shared Goals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wallet"
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Dompet Saya
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
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Blog & Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="text-sm font-medium hover:text-white transition-colors"
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
                    className="text-sm font-medium hover:text-white transition-colors"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm font-medium hover:text-white transition-colors"
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
                    className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" /> Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/10 my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-white/40 uppercase">
              © 2026 Split Bill Online • Smart Way to Split Expenses
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
