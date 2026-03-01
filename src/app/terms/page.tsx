"use client";

import React from "react";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, Gavel, AlertTriangle, Users, Wallet, Target, Scale, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const lastUpdated = "19 Februari 2026";

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center relative">
      <main className="w-full max-w-[800px] relative z-10 px-4 pt-10 pb-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border border-border/40 space-y-12">
          {/* Header */}
          <header className="space-y-4 border-b border-border/40 pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <Gavel className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Syarat & Ketentuan
            </h1>
            <p className="text-muted-foreground font-medium">
              Terakhir diperbarui: {lastUpdated}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dokumen ini merupakan Perjanjian Elektronik yang sah berdasarkan <span className="font-bold text-foreground underline decoration-primary/30">Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik ("UU ITE")</span> serta perubahannya.
            </p>
          </header>

          {/* Section 1: Acceptance */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Scale className="w-6 h-6" />
              <h2 className="text-2xl font-bold">1. Penerimaan Ketentuan</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Dengan mengakses dan menggunakan platform <span className="font-bold text-foreground">SplitBill Online</span>, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh isi Syarat dan Ketentuan ini. Jika Anda tidak setuju, mohon untuk berhenti menggunakan layanan kami segera.
            </p>
          </section>

          {/* Section 2: Services */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">2. Ruang Lingkup Layanan</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              SplitBill Online menyediakan berbagai fitur manajemen keuangan kolaboratif, termasuk namun tidak terbatas pada:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-muted/50 border border-border/20">
                <Users className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold mb-2">Split Bill & Invoice</h3>
                <p className="text-sm text-muted-foreground">Otomatisasi pembagian tagihan menggunakan teknologi AI OCR.</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/50 border border-border/20">
                <Target className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold mb-2">Shared Goals</h3>
                <p className="text-sm text-muted-foreground">Pelacakan target pencapaian keuangan bersama teman atau keluarga.</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/50 border border-border/20">
                <Wallet className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold mb-2">Wallet & Collect Money</h3>
                <p className="text-sm text-muted-foreground">Pencatatan saldo digital dan manajemen patungan kelompok.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Disclaimers */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">3. Batasan & Sanggahan (Disclaimer)</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed bg-destructive/5 p-6 rounded-2xl border border-destructive/10">
              <p>
                <span className="font-bold text-destructive">A. Akurasi AI:</span> Fitur Scan Struk menggunakan AI untuk kemudahan Anda. Kami tidak menjamin akurasi 100% dan Anda wajib memeriksa kembali setiap nominal sebelum melakukan pembayaran.
              </p>
              <p>
                <span className="font-bold text-destructive">B. Bukan Lembaga Keuangan:</span> SplitBill Online adalah aplikasi pembukuan dan alat bantu hitung. Fitur "Wallet" dan "Collect Money" hanya berfungsi sebagai alat pencatatan (tracking tool). Kami tidak menyimpan dana secara fisik, tidak memberikan bunga, dan bukan merupakan lembaga perbankan atau dompet digital berizin Bank Indonesia.
              </p>
              <p>
                <span className="font-bold text-destructive">C. Tanggung Jawab Pembayaran:</span> Hubungan utang-piutang dalam fitur patungan sepenuhnya merupakan tanggung jawab pribadi antar pengguna. Kami tidak bertanggung jawab atas gagal bayar atau sengketa antar pengguna.
              </p>
            </div>
          </section>

          {/* Section 4: User Conduct */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Larangan Penggunaan</h2>
            <p className="text-muted-foreground mb-4">Anda dilarang menggunakan layanan kami untuk:</p>
            <ul className="grid grid-cols-1 gap-3">
              {[
                "Kegiatan pencucian uang (money laundering) atau pendanaan terorisme.",
                "Mengunggah struk palsu atau memanipulasi data tagihan untuk menipu pihak lain.",
                "Melakukan reverse-engineering atau meretas sistem keamanan platform.",
                "Menyebarkan konten yang melanggar hukum, SARA, atau pornografi."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Hak Kekayaan Intelektual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seluruh desain, kode program, logo, dan konten yang ada pada platform ini adalah milik intelektual <span className="font-bold text-foreground">SplitBill Online</span>. Penggunaan tanpa izin tertulis dari kami dapat dikenakan sanksi berdasarkan UU Hak Cipta yang berlaku di Indonesia.
            </p>
          </section>

          {/* Section 6: Jurisdiction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Hukum & Penyelesaian Sengketa</h2>
            <p className="text-muted-foreground leading-relaxed">
              Syarat dan Ketentuan ini diatur sepenuhnya oleh hukum <span className="font-bold text-foreground">Republik Indonesia</span>. Segala perselisihan yang timbul akan diselesaikan terlebih dahulu secara musyawarah untuk mufakat. Jika tidak tercapai kesepakatan, maka akan diselesaikan melalui jalur hukum di Pengadilan Negeri yang ditentukan oleh pemilik layanan.
            </p>
          </section>

          {/* Footer Info */}
          <footer className="pt-12 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              Dengan menekan tombol "Daftar" atau terus menggunakan layanan ini, Anda dianggap menyetujui seluruh ketentuan di atas tanpa kecuali.
            </p>
          </footer>
        </div>
      </main>

      <Footer />
    </div>
  );
}
