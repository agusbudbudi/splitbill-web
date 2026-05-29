"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  Eye,
  Database,
  FileText,
  Lock,
  Mail,
  Calendar,
  Scale,
  ArrowLeft,
  UserCheck,
  Globe,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function PrivacyClientPage() {
  const lastUpdated = "16 Mei 2026";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header sticky showBackButton title="Kebijakan Privasi" />

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
              Kebijakan Privasi
            </h1>
            <div className="text-md text-[#4b5563] space-y-1">
              <p className="font-bold">Split Bill Online</p>
              <p>https://splitbill.my.id</p>
              <p className="text-sm italic">Berlaku sejak: 16 Mei 2026</p>
            </div>
          </div>

          <div className="border-b border-border w-full" />

          {/* Ringkasan Kebijakan */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151]">
              Ringkasan Kebijakan
            </h2>
            <p>
              Kebijakan Privasi ini disusun sesuai dengan Undang-Undang Nomor 27
              Tahun 2022 tentang Pelindungan Data Pribadi (“UU PDP”) dan
              peraturan perundang-undangan yang berlaku di Republik Indonesia.
              Dokumen ini menjelaskan secara transparan cara Split Bill Online
              mengumpulkan, memproses, menyimpan, dan melindungi data pribadi
              Anda.
            </p>
          </div>

          {/* Pasal 1 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 1 -</span>
              Pendahuluan
            </h2>
            <div className="space-y-4">
              <p>
                Split Bill Online (selanjutnya disebut "Pengelola", "Kami", atau
                "Milik Kami") adalah platform layanan pembagian tagihan daring
                yang dapat diakses melalui{" "}
                <Link
                  href="/"
                  className="text-primary hover:underline font-medium"
                >
                  https://splitbill.my.id
                </Link>
                . Pengelola berkomitmen untuk melindungi privasi dan keamanan
                data pribadi setiap pengguna layanan ini.
              </p>
              <p>
                Kebijakan Privasi ini merupakan dokumen hukum yang mengikat
                secara hukum antara Pengelola dan pengguna layanan (selanjutnya
                disebut "Anda" atau "Subjek Data"). Kebijakan ini menjelaskan:
              </p>
              <div className="space-y-2">
                {[
                  "jenis data pribadi yang Kami kumpulkan;",
                  "dasar hukum, tujuan, dan cara penggunaan data pribadi;",
                  "pihak ketiga yang dapat menerima data pribadi Anda;",
                  "jangka waktu penyimpanan data pribadi;",
                  "langkah-langkah keamanan yang Kami terapkan; serta",
                  "hak-hak Anda sebagai Subjek Data dan cara menggunakannya.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <p>
                Dengan mengakses atau menggunakan layanan Kami, Anda menyatakan
                telah membaca, memahami, dan menyetujui seluruh ketentuan dalam
                Kebijakan Privasi ini. Apabila Anda tidak menyetujui kebijakan
                ini, Anda dimohon untuk tidak menggunakan layanan Kami.
              </p>
            </div>
          </div>

          {/* Pasal 2 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 2 -</span>
              Dasar Hukum Pemrosesan Data Pribadi
            </h2>
            <div className="space-y-4">
              <p>
                Pemrosesan data pribadi oleh Pengelola dilaksanakan berdasarkan
                ketentuan peraturan perundang-undangan berikut:
              </p>
              <div className="space-y-2">
                {[
                  'Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi ("UU PDP");',
                  'Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik sebagaimana diubah dengan Undang-Undang Nomor 19 Tahun 2016 ("UU ITE");',
                  'Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik ("PP PSTE");',
                  "Peraturan Menteri Komunikasi dan Informatika Nomor 20 Tahun 2016 tentang Perlindungan Data Pribadi dalam Sistem Elektronik; serta",
                  "peraturan perundang-undangan lain yang berlaku dan berkaitan dengan penyelenggaraan sistem elektronik di wilayah hukum Republik Indonesia.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <p>
                Pemrosesan data pribadi dilakukan atas dasar persetujuan
                eksplisit Anda selaku Subjek Data, sebagaimana dimaksud dalam
                Pasal 20 UU PDP. Persetujuan tersebut diberikan pada saat Anda
                mendaftarkan akun dan/atau menggunakan layanan Kami untuk
                pertama kalinya.
              </p>
              <p>
                Dalam hal tertentu, pemrosesan data pribadi juga dapat dilakukan
                untuk memenuhi kewajiban hukum Pengelola, melindungi kepentingan
                vital Anda, atau untuk kepentingan yang sah berdasarkan
                keseimbangan kepentingan (legitimate interest) yang tidak
                mengabaikan hak-hak dasar Anda.
              </p>
            </div>
          </div>

          {/* Pasal 3 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 3 -</span>
              Data Pribadi yang Kami Kumpulkan
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  3.1 Data Identitas dan Akun
                </h3>
                <p>
                  Ketika Anda mendaftarkan akun melalui mekanisme Google OAuth
                  2.0, Kami mengumpulkan data sebagai berikut:
                </p>
                <div className="space-y-2">
                  {[
                    "Nama lengkap, sebagaimana terdaftar pada akun Google Anda;",
                    "Alamat surat elektronik (surel) yang aktif;",
                    "Foto profil akun Google Anda (jika tersedia dan telah disetel sebagai publik oleh Anda).",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 pl-4">
                      <span className="text-[#9ca3af] shrink-0">•</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <p>
                  Data tersebut digunakan semata-mata untuk keperluan
                  autentikasi, identifikasi akun, dan personalisasi tampilan
                  layanan. Kami tidak memiliki akses terhadap kata sandi
                  (password) akun Google Anda.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  3.2 Data Transaksi dan Konten
                </h3>
                <p>
                  Dalam rangka penyediaan fitur utama layanan Kami, Kami
                  mengumpulkan:
                </p>
                <div className="space-y-2">
                  {[
                    "Gambar struk, nota, atau bukti pembayaran yang Anda unggah secara sukarela untuk diproses melalui fitur OCR (Optical Character Recognition) berbasis kecerdasan buatan;",
                    "Rincian tagihan dan pengeluaran yang Anda masukkan secara manual, termasuk nominal, deskripsi, dan kategori transaksi;",
                    "Daftar kontak atau nama teman yang Anda tambahkan dalam sesi pembagian tagihan;",
                    "Catatan pengeluaran yang disimpan dalam fitur Dompet (Wallet);",
                    "Target tabungan bersama yang dibuat dalam fitur Tujuan Bersama (Shared Goals).",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 pl-4">
                      <span className="text-[#9ca3af] shrink-0">•</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  3.3 Data Teknis yang Dikumpulkan Secara Otomatis
                </h3>
                <p>
                  Secara otomatis, Kami mengumpulkan data teknis berikut ketika
                  Anda mengakses Situs:
                </p>
                <div className="space-y-2">
                  {[
                    "Alamat protokol internet (IP address);",
                    "Jenis dan versi peramban (browser) yang digunakan;",
                    "Sistem operasi dan jenis perangkat;",
                    "Halaman yang dikunjungi dan durasi kunjungan;",
                    "Data yang dikumpulkan melalui kuki (cookies) dan teknologi serupa.",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 pl-4">
                      <span className="text-[#9ca3af] shrink-0">•</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                <p>
                  Data teknis tersebut digunakan untuk keperluan analisis
                  kinerja sistem, peningkatan pengalaman pengguna, serta
                  pendeteksian dan pencegahan aktivitas yang mencurigakan atau
                  tidak sah.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 4 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 4 -</span>
              Tujuan dan Dasar Penggunaan Data Pribadi
            </h2>
            <div className="space-y-4">
              <p>
                Kami memproses data pribadi Anda hanya untuk tujuan yang telah
                ditetapkan sebelumnya dan berdasarkan persetujuan yang sah.
                Tujuan pemrosesan meliputi:
              </p>
              <div className="space-y-2">
                {[
                  "Autentikasi dan pengelolaan akun pengguna, termasuk pemberian akses ke fitur-fitur layanan;",
                  "Pemrosesan gambar struk secara otomatis menggunakan teknologi Google Generative AI untuk mengekstraksi informasi nominal dan data transaksi;",
                  "Pengelolaan dasbor keuangan pribadi, penerbitan faktur digital, dan fasilitasi kolaborasi antar pengguna;",
                  "Pemeliharaan dan peningkatan akurasi sistem kecerdasan buatan serta pengoptimalan antarmuka pengguna Situs;",
                  "Komunikasi dengan Anda, termasuk penyampaian pemberitahuan layanan, pembaruan fitur, dan tanggapan atas pertanyaan atau keluhan;",
                  "Pendeteksian dan pencegahan penipuan, penyalahgunaan layanan, atau pelanggaran terhadap Syarat dan Ketentuan Layanan;",
                  "Pemenuhan kewajiban hukum, termasuk pemenuhan perintah pengadilan atau instruksi otoritas berwenang berdasarkan ketentuan peraturan perundang-undangan yang berlaku.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <p>
                Kami tidak akan memproses data pribadi Anda untuk tujuan selain
                yang tercantum di atas tanpa terlebih dahulu memperoleh
                persetujuan baru dari Anda, kecuali diwajibkan oleh peraturan
                perundang-undangan.
              </p>
            </div>
          </div>

          {/* Pasal 5 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 5 -</span>
              Pengungkapan Data kepada Pihak Ketiga
            </h2>
            <div className="space-y-6">
              <p>
                Kami menegaskan bahwa Kami tidak menjual, menyewakan, atau
                memperdagangkan data pribadi Anda kepada pihak ketiga untuk
                kepentingan komersial. Pengungkapan data pribadi hanya dilakukan
                dalam kondisi-kondisi berikut:
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.1 Penyedia Layanan Teknis (Prosesor Data)
                </h3>
                <div className="space-y-3 pl-4">
                  <p>
                    <strong className="text-[#111827]">
                      a. Google Cloud Platform
                    </strong>{" "}
                    - Digunakan untuk penyimpanan data terenkripsi dan
                    infrastruktur komputasi awan yang mendukung operasional
                    Situs.
                  </p>
                  <p>
                    <strong className="text-[#111827]">
                      b. Google Generative AI (Gemini API)
                    </strong>{" "}
                    - Digunakan untuk pemrosesan gambar struk dan ekstraksi teks
                    menggunakan teknologi kecerdasan buatan. Data yang dikirim
                    ke layanan ini diproses sesuai dengan kebijakan privasi dan
                    ketentuan layanan Google.
                  </p>
                </div>
                <p>
                  Seluruh penyedia layanan pihak ketiga yang bekerja sama dengan
                  Kami diwajibkan mematuhi standar keamanan data yang setara
                  atau lebih tinggi daripada yang Kami terapkan, serta tunduk
                  pada perjanjian kerahasiaan dan pemrosesan data yang sah.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#374151]">
                  5.2 Pengungkapan Berdasarkan Kewajiban Hukum
                </h3>
                <p>
                  Kami dapat mengungkapkan data pribadi Anda kepada pihak yang
                  berwenang apabila diwajibkan oleh hukum yang berlaku, termasuk
                  berdasarkan perintah pengadilan, putusan arbitrase, atau
                  permintaan resmi dari instansi pemerintah yang berwenang.
                  Dalam situasi demikian, Kami akan berupaya memberitahu Anda
                  terlebih dahulu sepanjang ketentuan hukum mengizinkan hal
                  tersebut.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 6 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 6 -</span>
              Penyimpanan dan Retensi Data Pribadi
            </h2>
            <div className="space-y-4">
              <p>
                Data pribadi Anda disimpan di server yang berlokasi di wilayah
                yang dikelola oleh Google Cloud Platform dengan standar keamanan
                internasional. Kami menerapkan kebijakan retensi data sebagai
                berikut:
              </p>
              <div className="space-y-2">
                {[
                  "Data akun aktif disimpan selama akun Anda aktif digunakan atau diperlukan untuk penyediaan layanan;",
                  "Setelah akun dihapus atas permintaan Anda, data pribadi akan dihapus secara permanen dalam jangka waktu paling lama 30 (tiga puluh) hari kalender sejak permintaan diterima dan diverifikasi;",
                  "Data yang diwajibkan untuk disimpan berdasarkan ketentuan peraturan perundang-undangan yang berlaku akan tetap disimpan sesuai jangka waktu yang ditetapkan oleh regulasi terkait;",
                  "Log teknis dan data anonim dapat disimpan lebih lama untuk keperluan keamanan sistem dan analisis performa.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pasal 7 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 7 -</span>
              Keamanan Data Pribadi
            </h2>
            <div className="space-y-4">
              <p>
                Kami menerapkan langkah-langkah teknis dan organisasional yang
                layak untuk melindungi data pribadi Anda dari akses yang tidak
                sah, pengungkapan, perubahan, atau pemusnahan. Langkah-langkah
                tersebut meliputi:
              </p>
              <div className="space-y-2">
                {[
                  "Enkripsi data selama transmisi menggunakan protokol SSL/TLS (Secure Socket Layer/Transport Layer Security) dengan standar minimum TLS 1.2;",
                  "Enkripsi data saat penyimpanan (at rest encryption) pada infrastruktur Google Cloud Platform;",
                  "Pembatasan akses ke data pribadi hanya kepada personel yang membutuhkan akses tersebut untuk menjalankan tugasnya (prinsip need-to-know);",
                  "Pemantauan sistem secara berkala untuk mendeteksi potensi kerentanan keamanan;",
                  "Penggunaan mekanisme autentikasi dua faktor melalui layanan Google OAuth 2.0.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <p>
                Meskipun Kami berupaya semaksimal mungkin untuk melindungi data
                pribadi Anda, tidak ada sistem keamanan yang dapat menjamin
                perlindungan mutlak. Anda juga bertanggung jawab untuk menjaga
                kerahasiaan akses ke akun Anda.
              </p>
            </div>
          </div>

          {/* Pasal 8 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 8 -</span>
              Hak-Hak Anda sebagai Subjek Data
            </h2>
            <div className="space-y-6">
              <p>
                Sesuai dengan ketentuan Undang-Undang Nomor 27 Tahun 2022
                tentang Pelindungan Data Pribadi, Anda memiliki hak-hak berikut
                yang dapat Anda gunakan kapan saja:
              </p>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Informasi (Pasal 8 UU PDP)
                </h4>
                <p>
                  Anda berhak mendapatkan informasi yang jelas dan transparan
                  mengenai identitas Pengelola, tujuan pemrosesan data pribadi,
                  periode retensi, serta hak-hak Anda.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Akses (Pasal 9 UU PDP)
                </h4>
                <p>
                  Anda berhak memperoleh salinan data pribadi yang Kami miliki
                  tentang Anda, beserta informasi mengenai cara data tersebut
                  diproses.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Perbaikan (Pasal 10 UU PDP)
                </h4>
                <p>
                  Anda berhak meminta perbaikan atas data pribadi yang tidak
                  akurat, tidak lengkap, atau yang sudah tidak relevan.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Penghapusan (Pasal 11 UU PDP)
                </h4>
                <p>
                  Anda berhak meminta penghapusan data pribadi Anda ("hak untuk
                  dilupakan") dalam kondisi-kondisi tertentu sebagaimana diatur
                  dalam UU PDP.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Pembatasan Pemrosesan (Pasal 12 UU PDP)
                </h4>
                <p>
                  Anda berhak meminta pembatasan atas pemrosesan data pribadi
                  Anda dalam kondisi tertentu, misalnya selama sengketa mengenai
                  keakuratan data sedang diselesaikan.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Portabilitas Data (Pasal 13 UU PDP)
                </h4>
                <p>
                  Anda berhak menerima data pribadi Anda dalam format yang
                  terstruktur, umum digunakan, dan dapat dibaca oleh mesin,
                  serta berhak untuk mentransfer data tersebut kepada pengendali
                  data lain.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak Penarikan Persetujuan (Pasal 20 UU PDP)
                </h4>
                <p>
                  Anda berhak menarik kembali persetujuan yang telah Anda
                  berikan kapan saja, tanpa mengurangi keabsahan pemrosesan yang
                  telah dilakukan berdasarkan persetujuan sebelum penarikan.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#374151]">
                  Hak untuk Mengajukan Keberatan (Pasal 14 UU PDP)
                </h4>
                <p>
                  Anda berhak mengajukan keberatan atas pemrosesan data pribadi
                  Anda, termasuk pemrosesan untuk kepentingan pemasaran langsung
                  atau pengambilan keputusan otomatis yang berdampak signifikan
                  terhadap Anda.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[#374151]">
                  Cara Menggunakan Hak Anda
                </h4>
                <p>
                  Untuk menggunakan hak-hak tersebut di atas, Anda dapat
                  mengajukan permintaan tertulis kepada Kami melalui surel ke{" "}
                  <a
                    href="mailto:legal@splitbill.my.id"
                    className="text-primary font-bold hover:underline"
                  >
                    legal@splitbill.my.id
                  </a>
                  . Kami akan merespons permintaan Anda dalam jangka waktu
                  paling lama 14 (empat belas) hari kerja sejak permintaan
                  diterima. Untuk keperluan penghapusan akun, Kami akan
                  menyelesaikan proses tersebut dalam jangka waktu paling lama
                  30 (tiga puluh) hari kalender. Kami dapat meminta verifikasi
                  identitas Anda sebelum memproses permintaan guna memastikan
                  keamanan data Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Pasal 9 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 9 -</span>
              Penggunaan Kuki (Cookies)
            </h2>
            <div className="space-y-4">
              <p>
                Situs Kami menggunakan kuki dan teknologi pelacakan serupa untuk
                meningkatkan fungsionalitas dan pengalaman pengguna. Jenis-jenis
                kuki yang Kami gunakan adalah sebagai berikut:
              </p>
              <div className="space-y-3 pl-4">
                <p>
                  <strong className="text-[#111827]">Kuki Esensial:</strong>{" "}
                  Kuki yang mutlak diperlukan untuk fungsi dasar Situs, seperti
                  pemeliharaan sesi autentikasi. Kuki ini tidak dapat
                  dinonaktifkan.
                </p>
                <p>
                  <strong className="text-[#111827]">Kuki Fungsional:</strong>{" "}
                  Kuki yang digunakan untuk menyimpan preferensi pengguna,
                  seperti pilihan bahasa dan pengaturan tampilan.
                </p>
                <p>
                  <strong className="text-[#111827]">Kuki Analitik:</strong>{" "}
                  Kuki yang digunakan untuk mengumpulkan data anonim mengenai
                  penggunaan Situs guna membantu Kami memahami pola penggunaan
                  dan meningkatkan layanan.
                </p>
              </div>
              <p>
                Anda dapat mengatur preferensi kuki melalui pengaturan peramban
                Anda. Namun, menonaktifkan kuki tertentu dapat memengaruhi
                fungsi dan pengalaman penggunaan Situs.
              </p>
            </div>
          </div>

          {/* Pasal 10 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 10 -</span>
              Transfer Data Lintas Batas Negara
            </h2>
            <div className="space-y-4">
              <p>
                Dalam rangka penggunaan layanan Google Cloud Platform dan Google
                Generative AI, data pribadi Anda dapat ditransfer dan diproses
                di server yang berlokasi di luar wilayah Republik Indonesia.
                Transfer data tersebut dilakukan sesuai dengan ketentuan Pasal
                56 UU PDP dan peraturan pelaksanaannya. Kami memastikan bahwa
                setiap transfer data lintas batas negara dilakukan dengan
                perlindungan yang memadai, termasuk melalui perjanjian yang
                mengharuskan penerima data untuk memberikan tingkat perlindungan
                yang setara dengan yang ditetapkan dalam UU PDP. Anda menyetujui
                transfer data tersebut dengan menggunakan layanan Kami.
              </p>
            </div>
          </div>

          {/* Pasal 11 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 11 -</span>
              Tautan dan Layanan Pihak Ketiga
            </h2>
            <div className="space-y-4">
              <p>
                Situs Kami dapat memuat tautan menuju situs web atau layanan
                pihak ketiga. Kebijakan Privasi ini tidak berlaku terhadap situs
                web atau layanan pihak ketiga tersebut. Kami tidak bertanggung
                jawab atas praktik privasi atau konten dari situs web atau
                layanan pihak ketiga tersebut. Kami mendorong Anda untuk membaca
                dan memahami kebijakan privasi dari setiap situs web atau
                layanan pihak ketiga yang Anda kunjungi atau gunakan.
              </p>
            </div>
          </div>

          {/* Pasal 12 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 12 -</span>
              Pembaruan Kebijakan Privasi
            </h2>
            <div className="space-y-4">
              <p>
                Kami berhak memperbarui atau mengubah Kebijakan Privasi ini
                sewaktu-waktu untuk mencerminkan perubahan pada praktik
                pemrosesan data, fitur layanan, atau peraturan
                perundang-undangan yang berlaku. Setiap perubahan yang bersifat
                material akan diberitahukan kepada Anda melalui surel yang
                terdaftar atau melalui pemberitahuan yang ditampilkan secara
                mencolok di Situs, sekurang-kurangnya 14 (empat belas) hari
                sebelum perubahan tersebut berlaku. Tanggal pembaruan terakhir
                akan selalu dicantumkan pada bagian bawah kebijakan ini.
                Penggunaan layanan Kami yang berlanjut setelah tanggal
                berlakunya perubahan akan dianggap sebagai penerimaan Anda
                terhadap Kebijakan Privasi yang telah diperbarui.
              </p>
            </div>
          </div>

          {/* Pasal 13 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 13 -</span>
              Penyelesaian Sengketa
            </h2>
            <div className="space-y-4">
              <p>
                Apabila Anda merasa bahwa Kami telah melanggar hak-hak Anda
                terkait data pribadi, Anda dapat:
              </p>
              <div className="space-y-2">
                {[
                  "Mengajukan pengaduan secara tertulis kepada Kami melalui surel legal@splitbill.my.id. Kami akan menangani setiap pengaduan dengan serius dan merespons dalam jangka waktu paling lama 14 (empat belas) hari kerja;",
                  "Mengajukan pengaduan kepada Komisi Informasi Publik atau lembaga pengawas pelindungan data pribadi yang berwenang berdasarkan ketentuan UU PDP apabila Anda tidak puas dengan tanggapan Kami;",
                  "Menempuh jalur hukum yang tersedia berdasarkan peraturan perundang-undangan yang berlaku di Republik Indonesia.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 pl-4">
                    <span className="text-[#9ca3af] shrink-0">•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pasal 14 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#374151] flex gap-2">
              <span className="text-[#9ca3af] font-medium">Pasal 14 -</span>
              Informasi Kontak
            </h2>
            <div className="space-y-4 text-left">
              <p>
                Apabila Anda memiliki pertanyaan, kekhawatiran, atau ingin
                menggunakan hak-hak Anda sebagaimana diuraikan dalam Kebijakan
                Privasi ini, silakan menghubungi Kami melalui:
              </p>
              <p>
                <strong className="text-[#111827]">Pengelola Data:</strong>{" "}
                Split Bill Online
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
              <p>
                Kami berkomitmen untuk merespons setiap pertanyaan atau
                permintaan Anda dalam jangka waktu yang wajar.
              </p>
              <div className="pt-4 space-y-1">
                <p className="text-sm font-bold text-[#111827]">
                  Kebijakan Privasi ini berlaku sejak 16 Mei 2026
                </p>
                <p className="text-xs">
                  © 2026 Split Bill Online - splitbill.my.id
                </p>
                <p className="text-[10px] italic">
                  Dokumen ini disusun sesuai dengan UU No. 27 Tahun 2022 tentang
                  Pelindungan Data Pribadi
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-10 border-t border-border flex flex-col items-start gap-12 text-left cursor-pointer">
            <Link href="/">
              <button className="flex items-center gap-2 text-primary font-bold text-sm hover:opacity-70 transition-opacity">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Dengan menggunakan SplitBill Online, Anda dianggap telah membaca
              dan menyetujui Kebijakan Privasi ini. Kami menyarankan Anda untuk
              meninjau halaman ini secara berkala.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
