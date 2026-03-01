"use client";

import React from "react";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, ShieldCheck, Mail, Lock, Eye, FileText, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Kebijakan Privasi
            </h1>
            <p className="text-muted-foreground font-medium">
              Terakhir diperbarui: {lastUpdated}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kebijakan Privasi ini disusun berdasarkan <span className="font-bold text-foreground underline decoration-primary/30">Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi ("UU PDP")</span> dan peraturan terkait lainnya di Republik Indonesia.
            </p>
          </header>

          {/* Intro */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Eye className="w-6 h-6" />
              <h2 className="text-2xl font-bold">1. Komitmen Kami</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Kami di <span className="font-bold text-foreground">SplitBill Online</span> memahami bahwa data pribadi Anda bersifat sangat rahasia. Kami berkomitmen untuk melindungi informasi yang Anda percayakan kepada kami selama menggunakan fitur <span className="font-bold text-foreground">Split Bill (AI OCR)</span>, <span className="font-bold text-foreground">Invoice</span>, <span className="font-bold text-foreground">Shared Goals</span>, <span className="font-bold text-foreground">Collect Money</span>, dan <span className="font-bold text-foreground">Digital Wallet</span>.
            </p>
          </section>

          {/* Data Collection */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Database className="w-6 h-6" />
              <h2 className="text-2xl font-bold">2. Data yang Kami Kumpulkan</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">A. Data Identitas & Akun</h3>
                <p className="text-muted-foreground">Nama, alamat email, dan foto profil yang Anda berikan saat melakukan registrasi atau melalui layanan pihak ketiga (seperti Google Auth).</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">B. Data Transaksi & Konten</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Informasi tagihan, nominatif struk, daftar teman, detail target tabungan (Shared Goals), serta catatan pemasukan/pengeluaran pada Digital Wallet.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">C. Pemrosesan Gambar (OCR)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Saat Anda menggunakan fitur <span className="font-bold text-foreground">AI OCR</span>, kami memproses gambar struk yang Anda unggah. Gambar ini dianalisis menggunakan teknologi <span className="font-bold text-foreground">Google Generative AI</span> untuk mengekstrak teks nominal dan item belanja secara otomatis.
                </p>
              </div>
            </div>
          </section>

          {/* Usage */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <FileText className="w-6 h-6" />
              <h2 className="text-2xl font-bold">3. Tujuan Pemrosesan Data</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Menjalankan fungsi otomatisasi hitung tagihan (Split Bill).",
                "Mengelola dashboard keuangan pribadi (Wallet).",
                "Memfasilitasi kolaborasi target keuangan (Shared Goals).",
                "Meningkatkan akurasi model AI dalam membaca struk.",
                "Memenuhi kewajiban hukum dan regulasi di Indonesia."
              ].map((item, i) => (
                <li key={i} className="bg-muted/50 p-4 rounded-md text-sm font-medium text-muted-foreground flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Lock className="w-6 h-6" />
              <h2 className="text-2xl font-bold">4. Perlindungan & Keamanan</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Sesuai Pasal 35 UU PDP, kami menerapkan standar keamanan teknis menggunakan enkripsi data dan kontrol akses yang ketat. Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit dari Anda.
            </p>
          </section>

          {/* User Rights */}
          <section className="space-y-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h2 className="text-xl font-bold text-primary">5. Hak Anda sebagai Subjek Data</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Berdasarkan UU PDP, Anda memiliki hak untuk:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Mengakses dan mendapatkan salinan data pribadi Anda.</li>
              <li>Melengkapi, memperbarui, atau memperbaiki kesalahan data.</li>
              <li>Mengakhiri pemrosesan, menghapus, atau memusnahkan data pribadi Anda.</li>
              <li>Menarik kembali persetujuan pemrosesan data pribadi.</li>
            </ul>
          </section>

          {/* Retention */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">6. Masa Retensi Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami akan menyimpan data pribadi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan. Jika akun dihapus, kami akan melakukan penghapusan atau anonimisasi data sesuai dengan ketentuan hukum yang berlaku.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-6 pt-6 border-t border-border/40">
            <div className="flex items-center gap-3 text-primary">
              <Mail className="w-6 h-6" />
              <h2 className="text-2xl font-bold">7. Hubungi Kami</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Jika Anda memiliki pertanyaan tentang kebijakan ini atau ingin menggunakan hak subjek data Anda, silakan hubungi tim legal kami:
            </p>
            <div className="bg-muted p-6 rounded-2xl inline-block">
              <p className="font-bold text-foreground text-lg">SplitBill Online Legal Team</p>
              <a href="mailto:legal@splitbill.my.id" className="text-primary font-bold hover:underline">legal@splitbill.my.id</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
