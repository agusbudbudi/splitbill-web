"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowLeft,
  Scale,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
  Gavel,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsClientPage() {
  const lastUpdated = "19 Februari 2026";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header sticky showBackButton title="Syarat & Ketentuan" />

      {/* Main Content Area */}
      <main className="w-full max-w-[600px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12 text-[#4b5563] leading-relaxed text-justify"
        >
          {/* Header Section */}
          <div className="space-y-4 mb-10 flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-[#111827] tracking-tight">
              Syarat & Ketentuan Layanan
            </h1>
            <div className="text-md text-[#4b5563] space-y-1">
              <p className="font-bold">Split Bill Online</p>
              <p>https://splitbill.my.id</p>
              <p className="text-sm italic">Berlaku sejak: 16 Mei 2026</p>
            </div>
          </div>

          <div className="border-b border-border w-full" />

          {/* Ringkasan Dokumen */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151]">
              Ringkasan Dokumen
            </h2>
            <p>
              Syarat dan Ketentuan ini merupakan perjanjian elektronik yang
              mengikat secara hukum antara Anda selaku pengguna dan Split Bill
              Online selaku pengelola platform. Dokumen ini disusun sesuai
              dengan UU No. 11 Tahun 2008 tentang ITE dan perubahannya, UU No.
              27 Tahun 2022 tentang Pelindungan Data Pribadi, serta peraturan
              perundang-undangan Indonesia yang berlaku.
            </p>
          </div>

          {/* Pasal 1 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 1 -</span>
              Penerimaan dan Kekuatan Mengikat
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  1.1.
                </span>
                <p>
                  Dokumen ini merupakan Perjanjian Elektronik yang sah dan
                  mengikat sebagaimana diatur dalam Pasal 18 dan Pasal 20 UU
                  ITE, UU No. 1 Tahun 2024, serta PP PSTE.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  1.2.
                </span>
                <p>
                  Dengan mengakses, mendaftarkan akun, atau menggunakan layanan
                  Split Bill Online dengan cara apa pun, Anda menyatakan secara
                  tegas bahwa Anda telah membaca, memahami, dan menyetujui
                  seluruh ketentuan dalam dokumen ini.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  1.3.
                </span>
                <p>
                  Apabila Anda tidak menyetujui sebagian atau seluruh ketentuan
                  ini, Anda dilarang mengakses atau menggunakan layanan Kami.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  1.4.
                </span>
                <p>
                  Anda menyatakan bahwa Anda telah berusia minimal 18 tahun atau
                  berada di bawah pengawasan orang tua/wali yang sah, serta
                  memiliki kapasitas hukum untuk terikat dalam perjanjian ini.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 2 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 2 -</span>
              Identitas Pengelola
            </h2>
            <div className="space-y-4">
              <p>
                Split Bill Online (selanjutnya disebut "Pengelola", "Kami", atau
                "Milik Kami") adalah platform layanan pembagian tagihan dan
                manajemen keuangan kolaboratif daring yang dapat diakses melalui{" "}
                <Link
                  href="/"
                  className="text-primary hover:underline font-medium"
                >
                  https://splitbill.my.id
                </Link>
                . Pengelola dapat dihubungi melalui surel resmi:{" "}
                <a
                  href="mailto:legal@splitbill.my.id"
                  className="text-primary font-bold hover:underline"
                >
                  legal@splitbill.my.id
                </a>
                .
              </p>
            </div>
          </div>

          {/* Pasal 3 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 3 -</span>
              Definisi
            </h2>
            <div className="space-y-4">
              <p>
                Dalam Syarat dan Ketentuan ini, istilah-istilah berikut memiliki
                makna sebagaimana didefinisikan:
              </p>
              <div className="space-y-3">
                {[
                  {
                    k: "Platform",
                    v: "Situs web https://splitbill.my.id beserta seluruh fitur dan layanan di dalamnya.",
                  },
                  {
                    k: "Pengguna",
                    v: "Individu yang mengakses Platform, baik dengan atau tanpa akun.",
                  },
                  {
                    k: "Akun",
                    v: "Akun yang didaftarkan melalui Google OAuth 2.0 untuk akses fitur tersimpan.",
                  },
                  {
                    k: "Konten Pengguna",
                    v: "Data, teks, atau gambar yang diunggah atau dibuat oleh Anda di Platform.",
                  },
                  {
                    k: "Layanan",
                    v: "Seluruh fitur dan fungsi yang disediakan oleh Pengelola melalui Platform.",
                  },
                  {
                    k: "Data Pribadi",
                    v: "Data tentang orang perseorangan sebagaimana didefinisikan dalam UU PDP.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[#9ca3af] font-medium shrink-0">
                      {String.fromCharCode(97 + i)}.
                    </span>
                    <p>
                      <strong className="text-[#111827]">"{item.k}"</strong>{" "}
                      berarti {item.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pasal 4 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 4 -</span>
              Ruang Lingkup Layanan
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  4.1 Split Bill dan Pemindaian Struk
                </h3>
                <p>
                  Fitur pembagian tagihan yang mengintegrasikan teknologi AI OCR
                  (Optical Character Recognition) untuk mengekstraksi data
                  nominal secara otomatis dari gambar struk fisik maupun
                  digital.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  4.2 Invoice Digital
                </h3>
                <p>
                  Fitur pembuatan tagihan digital sebagai sarana pencatatan dan
                  dokumentasi pengeluaran bersama.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  4.3 Tujuan Bersama (Shared Goals)
                </h3>
                <p>
                  Fitur pelacakan target keuangan bersama untuk memantau progres
                  pencapaian tujuan kolektif.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  4.4 Pengumpulan Iuran (Collect Money)
                </h3>
                <p>
                  Fitur manajemen iuran kelompok sebagai alat pembukuan digital
                  untuk kebutuhan patungan atau kas bersama.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  4.5 Dompet Digital (Wallet)
                </h3>
                <p>
                  Fitur pencatatan saldo pribadi yang berfungsi semata-mata
                  sebagai alat pembukuan digital dan bukan dompet elektronik
                  berizin Bank Indonesia.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 5 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 5 -</span>
              Sifat dan Batasan Layanan
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.1 Bukan Lembaga Keuangan
                </h3>
                <p>
                  Split Bill Online secara tegas bukan merupakan bank, lembaga
                  keuangan, atau penyelenggara jasa pembayaran. Kami tidak
                  menyimpan atau mengelola dana Pengguna secara aktual.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.2 Akurasi Kecerdasan Buatan
                </h3>
                <p>
                  Fitur AI dikembangkan oleh pihak ketiga. Kami tidak menjamin
                  akurasi 100% dan Pengguna wajib memverifikasi kembali seluruh
                  data sebelum finalisasi. Pengelola tidak bertanggung jawab
                  atas kesalahan ekstraksi sistem AI.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.3 Tanggung Jawab Pembayaran
                </h3>
                <p>
                  Transaksi keuangan yang dicatat merupakan tanggung jawab
                  pribadi antar Pengguna. Pengelola tidak bertanggung jawab atas
                  gagal bayar atau sengketa antar Pengguna.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.4 Ketersediaan Layanan
                </h3>
                <p>
                  Kami berupaya menyediakan layanan kontinu namun tidak menjamin
                  kebebasan mutlak dari gangguan teknis atau pemeliharaan sistem
                  sewaktu-waktu.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.5 Batasan Tanggung Jawab
                </h3>
                <p>
                  Pengelola tidak bertanggung jawab atas kerugian tidak
                  langsung, insidental, atau konsekuensial yang timbul dari
                  penggunaan Platform.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 6 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 6 -</span>
              Pendaftaran dan Keamanan Akun
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  6.1.
                </span>
                <p>
                  Fitur dasar dapat digunakan tanpa akun, di mana data disimpan
                  secara lokal di perangkat Anda (local storage browser).
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  6.2.
                </span>
                <p>
                  Sinkronisasi data lintas perangkat memerlukan pendaftaran akun
                  melalui Google OAuth 2.0.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  6.3.
                </span>
                <p>
                  Pengguna bertanggung jawab penuh atas keamanan akses akun dan
                  wajib melapor jika terjadi indikasi akses tidak sah.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] font-medium shrink-0">
                  6.4.
                </span>
                <p>
                  Satu Pengguna hanya diperbolehkan memiliki satu akun aktif.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 7 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 7 -</span>
              Ketentuan Penggunaan yang Diizinkan
            </h2>
            <div className="space-y-4">
              <p>Pengguna diizinkan menggunakan Platform untuk:</p>
              <div className="space-y-2">
                {[
                  "Membagi tagihan sosial antar individu yang sah.",
                  "Mengelola catatan keuangan kolaboratif non-komersial.",
                  "Menggunakan AI OCR untuk membantu pencatatan nominal.",
                  "Mengakses dan mengunduh riwayat transaksi pribadi.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pasal 8 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 8 -</span>
              Larangan Penggunaan
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  8.1 Kegiatan Ilegal
                </h3>
                <p>
                  Larangan keras atas pencucian uang, pendanaan terorisme, atau
                  penipuan dalam bentuk apa pun.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  8.2 Manipulasi Data
                </h3>
                <p>
                  Dilarang mengunggah struk palsu atau memanipulasi data untuk
                  menyesatkan Pengguna lain.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  8.3 Gangguan Sistem
                </h3>
                <p>
                  Dilarang melakukan rekayasa balik (reverse engineering) atau
                  meretas infrastruktur teknis Platform.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  8.4 Konten Terlarang
                </h3>
                <p>
                  Dilarang mengunggah konten SARA, pornografi, kekerasan, atau
                  ujaran kebencian.
                </p>
              </div>
              <p className="text-sm font-medium text-destructive/80 italic">
                Pelanggaran berat dapat mengakibatkan penghapusan akun permanen
                dan tindakan hukum sesuai regulasi RI.
              </p>
            </div>
          </div>

          {/* Pasal 9 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 9 -</span>
              Hak Kekayaan Intelektual
            </h2>
            <div className="space-y-4">
              <p>
                Seluruh desain, kode program, logo, dan merek dagang merupakan
                milik eksklusif{" "}
                <strong className="text-[#111827]">Split Bill Online</strong>{" "}
                dan dilindungi UU Hak Cipta & UU Merek Republik Indonesia.
                Pengguna diberikan lisensi terbatas hanya untuk penggunaan
                pribadi non-komersial.
              </p>
            </div>
          </div>

          {/* Pasal 10 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 10 -</span>
              Perlindungan Data Pribadi
            </h2>
            <div className="space-y-4">
              <p>
                Pemrosesan data dilaksanakan sesuai UU PDP dan Kebijakan Privasi
                Kami. Kebijakan Privasi merupakan bagian tidak terpisahkan dari
                Syarat & Ketentuan ini.
              </p>
            </div>
          </div>

          {/* Pasal 11 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 11 -</span>
              Layanan Pihak Ketiga
            </h2>
            <div className="space-y-4">
              <p>
                Penggunaan integrasi Google OAuth, Cloud, dan AI tunduk pada
                ketentuan masing-masing penyedia. Kami tidak bertanggung jawab
                atas konten atau praktik layanan pihak ketiga tersebut.
              </p>
            </div>
          </div>

          {/* Pasal 12 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 12 -</span>
              Penangguhan dan Penghentian Akun
            </h2>
            <div className="space-y-4">
              <p>
                Kami berhak menghapus akun yang melanggar ketentuan. Pengguna
                juga dapat meminta penghapusan akun kapan saja melalui surel
                legal, dengan proses penyelesaian maksimal 30 hari kalender.
              </p>
            </div>
          </div>

          {/* Pasal 13 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 13 -</span>
              Pembaruan Syarat dan Ketentuan
            </h2>
            <div className="space-y-4">
              <p>
                Pembaruan dilakukan sewaktu-waktu. Perubahan material akan
                diberitahukan 14 hari sebelumnya. Penggunaan berlanjut dianggap
                sebagai persetujuan atas versi terbaru.
              </p>
            </div>
          </div>

          {/* Pasal 14 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 14 -</span>
              Ganti Rugi (Indemnifikasi)
            </h2>
            <div className="space-y-4">
              <p>
                Pengguna setuju untuk membebaskan Pengelola dari segala klaim
                atau tuntutan hukum yang timbul akibat penyalahgunaan Platform
                atau pelanggaran hak pihak ketiga oleh Pengguna.
              </p>
            </div>
          </div>

          {/* Pasal 15 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 15 -</span>
              Hukum dan Penyelesaian Sengketa
            </h2>
            <div className="space-y-4">
              <p>
                Tunduk pada hukum Republik Indonesia. Sengketa diselesaikan
                secara musyawarah (30 hari), mediasi, dan terakhir melalui
                litigasi di Pengadilan Negeri Jakarta Pusat.
              </p>
            </div>
          </div>

          {/* Pasal 16 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 16 -</span>
              Ketentuan Lain-Lain
            </h2>
            <div className="space-y-4">
              <p>
                Mencakup ketentuan mengenai keterpisahan (severability), tidak
                adanya pengesampingan hak, keseluruhan perjanjian, pengalihan
                hak, dan keadaan kahar (force majeure).
              </p>
            </div>
          </div>

          {/* Pasal 17 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 17 -</span>
              Informasi Kontak
            </h2>
            <div className="space-y-4 text-left">
              <p>
                <strong className="text-[#111827]">Pengelola:</strong> Split
                Bill Online
                <br />
                <strong className="text-[#111827]">Situs Web:</strong>{" "}
                https://splitbill.my.id
                <br />
                <strong className="text-[#111827]">Surel:</strong>{" "}
                <a
                  href="mailto:legal@splitbill.my.id"
                  className="text-primary font-bold hover:underline"
                >
                  legal@splitbill.my.id
                </a>
              </p>
              <div className="pt-4 space-y-1">
                <p className="text-sm font-bold text-[#111827]">
                  Syarat dan Ketentuan ini berlaku sejak 16 Mei 2026
                </p>
                <p className="text-xs">
                  © 2026 Split Bill Online - splitbill.my.id
                </p>
                <p className="text-[10px] italic">
                  Dokumen ini disusun sesuai dengan UU ITE, UU PDP, UU
                  Perlindungan Konsumen, dan regulasi RI yang berlaku.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-10 border-t border-border flex flex-col items-start gap-12 text-left cursor-pointer">
            <Link href="/">
              <button className="flex items-center gap-2 text-primary font-bold text-sm hover:opacity-70 transition-opacity ">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Dengan menggunakan SplitBill Online, Anda dianggap telah membaca
              dan menyetujui Syarat & Ketentuan ini. Kami menyarankan Anda untuk
              meninjau halaman ini secara berkala.
            </p>
          </div>
        </motion.div>
      </main>

      <SiteFooter />
      <Footer />
    </div>
  );
}
