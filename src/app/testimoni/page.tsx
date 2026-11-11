'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Quote, 
  Sparkles, 
  ArrowRight,
  Filter
} from 'lucide-react';
import Footer from '@/components/Footer';

interface Testimonial {
  id: string;
  nama: string;
  peran: 'Mentee' | 'Mentor';
  kampus: string;
  prodi: string;
  keahlian: string;
  rating: number;
  ulasan: string;
  hasil: string;
  avatarBg: string;
}

export default function TestimoniPage() {
  const [filter, setFilter] = useState<'ALL' | 'Mentee' | 'Mentor'>('ALL');

  const dataTestimoni: Testimonial[] = [
    {
      id: '1',
      nama: 'Fajar Nugraha',
      peran: 'Mentee',
      kampus: 'Telkom University Surabaya',
      prodi: 'Sistem Informasi',
      keahlian: 'Next.js & REST API',
      rating: 5,
      ulasan: 'Sempat bingung waktu ngerjain tugas besar Integrasi Sistem. Ketemu mentor sebaya di Mentora yang jelasin cara konsumsi Sanctum API dengan santai tanpa ribet. Proyek selesai tepat waktu!',
      hasil: 'Mendapat nilai A pada Tugas Besar Pemrograman Web',
      avatarBg: 'bg-blue-600',
    },
    {
      id: '2',
      nama: 'Siti Rahmawati',
      peran: 'Mentor',
      kampus: 'Universitas Indonesia',
      prodi: 'Ilmu Komputer',
      keahlian: 'UI/UX & Design System',
      rating: 5,
      ulasan: 'Menjadi mentor di Mentora bikin portofolio kepemimpinan dan kemampuan mentoring saya diakui saat daftar magang. Mahasiswa yang saya bimbing juga sangat antusias belajar.',
      hasil: 'Membimbing 14 mentee & lolos UI/UX Designer Intern',
      avatarBg: 'bg-emerald-600',
    },
    {
      id: '3',
      nama: 'Kevin Ananda',
      peran: 'Mentee',
      kampus: 'Institut Teknologi Sepuluh Nopember',
      prodi: 'Teknik Informatika',
      keahlian: 'Data Science & Python',
      rating: 4,
      ulasan: 'Materi eksplorasi data dan machine learning-nya sangat daging. Sesi 1-on-1 terasa padat dan solutif, cuma perlu sedikit penyesuaian di jadwal sesi agar tidak bentrok dengan praktikum kampus.',
      hasil: 'Finalis Lomba Data Mining Mahasiswa 2026',
      avatarBg: 'bg-purple-600',
    },
    {
      id: '4',
      nama: 'Alya Sabrina',
      peran: 'Mentee',
      kampus: 'Telkom University Bandung',
      prodi: 'Sistem Informasi',
      keahlian: 'Business Analysis & UML',
      rating: 5,
      ulasan: 'Belajar analisis proses bisnis bareng mentor yang seangkatan jauh lebih terbuka untuk tanya hal-hal dasar tanpa takut dihakimi. Penjelasannya to-the-point dan aplikatif.',
      hasil: 'Sukses presentasi Capstone Project tingkat 3',
      avatarBg: 'bg-rose-600',
    },
    {
      id: '5',
      nama: 'Rian Hidayat',
      peran: 'Mentor',
      kampus: 'Universitas Brawijaya',
      prodi: 'Teknologi Informasi',
      keahlian: 'Laravel & Database Relasional',
      rating: 4,
      ulasan: 'Ekosistem belajarnya interaktif dan menteenya aktif berdiskusi tugas query SQL. Ke depannya bakal makin mantap kalau ada fitur whiteboard interaktif langsung di dalam ruang sesi.',
      hasil: 'Mentor Terverifikasi dengan total rating 4.80',
      avatarBg: 'bg-amber-600',
    },
    {
      id: '6',
      nama: 'Dina Kusuma',
      peran: 'Mentee',
      kampus: 'UPN Veteran Jawa Timur',
      prodi: 'Sistem Informasi',
      keahlian: 'Cloud Computing & Docker',
      rating: 5,
      ulasan: 'Sangat terbantu memahami deployment pipeline Docker dan CI/CD. Mentornya langsung praktek live code lewat sesi 1-on-1.',
      hasil: 'Berhasil deploy tugas cloud ke server staging',
      avatarBg: 'bg-indigo-600',
    },
  ];

  const filteredData = dataTestimoni.filter(
    (item) => filter === 'ALL' || item.peran === filter
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="flex-1">
        {/* Header Section */}
        <section className="py-16 sm:py-20 border-b border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent dark:from-blue-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cerita & Pengalaman Mahasiswa</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Apa Kata Mereka Tentang <span className="text-[#2563EB] dark:text-blue-400">Mentora</span>?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Dengarkan langsung cerita pengalaman para mahasiswa dan mentor sebaya yang saling berkembang melalui pertukaran keterampilan.
            </p>

            {/* Filter Pill */}
            <div className="pt-4 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 mr-1" />
              {(
                [
                  { id: 'ALL', label: 'Semua Cerita' },
                  { id: 'Mentee', label: 'Pengalaman Mentee' },
                  { id: 'Mentor', label: 'Cerita Mentor' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    filter === tab.id
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid Kartu Testimoni */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="space-y-4">
                    {/* Header Card: Rating 5 Skala & Badge Peran */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1.5">
                          {item.rating}.0
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.peran === 'Mentor'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {item.peran === 'Mentor' ? '⭐ Mentor Resmi' : '🎓 Mentee'}
                      </span>
                    </div>

                    {/* Ulasan */}
                    <div className="relative">
                      <Quote className="w-8 h-8 text-slate-200 dark:text-slate-800 absolute -top-3 -left-2 -z-0 opacity-80" />
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 italic">
                        "{item.ulasan}"
                      </p>
                    </div>

                    {/* Capaian / Hasil */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      🎯 <strong className="text-slate-800 dark:text-slate-100">Dampak:</strong> {item.hasil}
                    </div>
                  </div>

                  {/* Profil Mahasiswa */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div
                      className={`w-10 h-10 rounded-2xl ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                    >
                      {item.nama.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.nama}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.prodi} • {item.kampus}
                      </p>
                      <p className="text-[10px] font-medium text-[#2563EB] dark:text-blue-400 truncate mt-0.5">
                        Fokus: {item.keahlian}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner Ajakan Bergabung */}
        <section className="py-14 text-center bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Punya Pengalaman Menarik Selama Belajar di Mentora?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Bagikan kisah belajarmu dan bantu rekan mahasiswa lainnya menemukan mentor yang tepat.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                <span>Tulis Ulasan Sesi Mentoring</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}