'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  UserCheck, 
  MessageSquareShare,
  ArrowRight
} from 'lucide-react';
import Footer from '@/components/Footer';

interface FaqItem {
  kategori: string;
  pertanyaan: string;
  jawaban: string;
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKategori, setActiveKategori] = useState<string>('SEMUA');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const daftarFaq: FaqItem[] = [
    {
      kategori: 'UMUM',
      pertanyaan: 'Apa itu Mentora dan bagaimana cara kerjanya?',
      jawaban: 'Mentora adalah platform pertukaran keahlian (peer-to-peer skill exchange) antarmahasiswa. Kamu dapat belajar keahlian baru dari mahasiswa lain yang sudah menguasainya, atau mendaftarkan diri sebagai mentor untuk membagikan keterampilan yang kamu miliki.',
    },
    {
      kategori: 'UMUM',
      pertanyaan: 'Apakah layanan di Mentora berbayar?',
      jawaban: 'Mentora mengedepankan model pembelajaran kolaboratif dan sistem pertukaran nilai (poin keaktifan/skill barter), sehingga mahasiswa dapat saling belajar tanpa biaya kursus konvensional yang mahal.',
    },
    {
      kategori: 'MENTOR',
      pertanyaan: 'Bagaimana cara mendaftar menjadi Mentor di Mentora?',
      jawaban: 'Kamu dapat mengajukan diri menjadi mentor melalui halaman Dashboard. Kamu akan diminta melengkapi form kualifikasi, memilih bidang keahlian, serta melampirkan berkas pendukung seperti CV, Transkrip/KHS, atau Sertifikat pendukung.',
    },
    {
      kategori: 'MENTOR',
      pertanyaan: 'Bagaimana proses verifikasi kualifikasi mentor (FR-06)?',
      jawaban: 'Setiap pengajuan diperiksa langsung oleh Administrator Mentora. Admin akan memvalidasi keabsahan dokumen portofolio dan prestasi akademikmu sebelum mengubah status akunmu menjadi Mentor Terverifikasi (Verified Mentor).',
    },
    {
      kategori: 'MENTOR',
      pertanyaan: 'Apa yang harus dilakukan jika pengajuan mentor saya ditolak?',
      jawaban: 'Admin selalu menyertakan alasan penolakan secara spesifik (misalnya dokumen tidak terbaca atau portofolio kurang lengkap). Kamu dapat memperbarui berkas yang diminta dan mengajukan verifikasi ulang melalui Dashboard.',
    },
    {
      kategori: 'SESI',
      pertanyaan: 'Bagaimana format pelaksanaan sesi mentoring?',
      jawaban: 'Sesi mentoring dilakukan secara 1-on-1 atau kelompok kecil secara daring menggunakan Google Meet, Zoom, atau platform kolaborasi kode (seperti VS Code Live Share) sesuai kesepakatan jadwal antara mentor dan mentee.',
    },
    {
      kategori: 'SESI',
      pertanyaan: 'Apa yang terjadi jika mentor tidak hadir pada jadwal yang ditentukan?',
      jawaban: 'Mentee dapat melaporkan ketidakhadiran melalui riwayat sesi di Dashboard. Sistem akan mengembalikan poin sesi dan memberikan catatan evaluasi pada profil mentor bersangkutan.',
    },
    {
      kategori: 'AKUN',
      pertanyaan: 'Apakah saya bisa menjadi Mentee sekaligus Mentor?',
      jawaban: 'Bisa! Inilah keunggulan utama Mentora. Kamu bisa belajar bidang baru (misalnya Machine Learning) sebagai Mentee, sembari tetap membuka sesi pengajaran untuk bidang yang kamu kuasai (misalnya Desain UI/UX).',
    },
  ];

  const kategoriList = ['SEMUA', 'UMUM', 'MENTOR', 'SESI', 'AKUN'];

  const filteredFaq = daftarFaq.filter((item) => {
    const matchKategori = activeKategori === 'SEMUA' || item.kategori === activeKategori;
    const matchSearch =
      item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="flex-1">
        {/* Header Section */}
        <section className="py-16 sm:py-20 border-b border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent dark:from-blue-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pusat Bantuan & Tanya Jawab</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Temukan jawaban cepat seputar cara kerja platform, mekanisme verifikasi mentor, pelaksanaan sesi, dan keamanan akun Mentora.
            </p>

            {/* Pencarian FAQ */}
            <div className="pt-4 max-w-xl mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan (misal: verifikasi mentor, biaya, sesi)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        </section>

        {/* Tab Kategori & Accordion List */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Navigasi Kategori */}
            <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2">
              {kategoriList.map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setActiveKategori(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeKategori === kat
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {kat === 'SEMUA' ? 'Semua Topik' : kat}
                </button>
              ))}
            </div>

            {/* Accordion FAQ */}
            {filteredFaq.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Pertanyaan tidak ditemukan
                </p>
                <p className="text-xs text-slate-400">
                  Coba gunakan kata kunci pencarian lain atau pilih kategori topik di atas.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredFaq.map((item, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400">
                            {item.kategori}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {item.pertanyaan}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180 text-[#2563EB]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-150">
                          {item.jawaban}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Kontak Bantuan Langsung */}
            <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Masih memiliki pertanyaan lain yang belum terjawab?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tim bantuan mahasiswa Mentora siap membantu kendala teknis dan sesi belajarmu.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shrink-0"
              >
                <MessageSquareShare className="w-4 h-4" />
                <span>Pusat Bantuan Dashboard</span>
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}