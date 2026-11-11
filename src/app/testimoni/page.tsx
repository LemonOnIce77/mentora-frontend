
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  Star,
  Quote,
  Sparkles,
  ArrowRight,
  Filter,
  MessageSquareText,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
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

const dataTestimoni: Testimonial[] = [
  {
    id: '1',
    nama: 'Fajar Nugraha',
    peran: 'Mentee',
    kampus: 'Telkom University Surabaya',
    prodi: 'Sistem Informasi',
    keahlian: 'Next.js & REST API',
    rating: 5,
    ulasan:
      'Sempat bingung waktu ngerjain tugas besar Integrasi Sistem. Ketemu mentor sebaya di Mentora yang jelasin cara konsumsi Sanctum API dengan santai tanpa ribet. Proyek selesai tepat waktu!',
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
    ulasan:
      'Menjadi mentor di Mentora bikin portofolio kepemimpinan dan kemampuan mentoring saya diakui saat daftar magang. Mahasiswa yang saya bimbing juga sangat antusias belajar.',
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
    ulasan:
      'Materi eksplorasi data dan machine learning-nya sangat daging. Sesi 1-on-1 terasa padat dan solutif, cuma perlu sedikit penyesuaian di jadwal sesi agar tidak bentrok dengan praktikum kampus.',
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
    ulasan:
      'Belajar analisis proses bisnis bareng mentor yang seangkatan jauh lebih terbuka untuk tanya hal-hal dasar tanpa takut dihakimi. Penjelasannya to-the-point dan aplikatif.',
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
    ulasan:
      'Ekosistem belajarnya interaktif dan menteenya aktif berdiskusi tugas query SQL. Ke depannya bakal makin mantap kalau ada fitur whiteboard interaktif langsung di dalam ruang sesi.',
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
    ulasan:
      'Sangat terbantu memahami deployment pipeline Docker dan CI/CD. Mentornya langsung praktek live code lewat sesi 1-on-1.',
    hasil: 'Berhasil deploy tugas cloud ke server staging',
    avatarBg: 'bg-indigo-600',
  },
];

type FilterType = 'ALL' | 'Mentee' | 'Mentor';

export default function TestimoniPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredData = dataTestimoni.filter(
    (item) => filter === 'ALL' || item.peran === filter
  );

  const filterOptions: {
    id: FilterType;
    label: string;
  }[] = [
    { id: 'ALL', label: 'Semua Cerita' },
    { id: 'Mentee', label: 'Pengalaman Mentee' },
    { id: 'Mentor', label: 'Cerita Mentor' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-slate-800">

      <Navbar />

      <main className="flex-1">

        {/* HEADER */}
        <section className="py-16 sm:py-20 border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-[#FAFAFB] to-[#FAFAFB]">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-bold uppercase tracking-wider">

              <Sparkles className="w-4 h-4" />

              Cerita & Pengalaman Mahasiswa

            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">

              Apa Kata Mereka Tentang{' '}

              <span className="text-[#2563EB]">
                Mentora
              </span>
              ?

            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Dengarkan langsung cerita pengalaman para mahasiswa dan
              mentor sebaya yang saling berkembang melalui pertukaran
              keterampilan.
            </p>

            {/* FILTER */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">

              <Filter className="w-4 h-4 text-slate-400 mr-1" />

              {filterOptions.map((tab) => (

                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={filter === tab.id}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    filter === tab.id
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#2563EB]'
                  }`}
                >
                  {tab.label}
                </button>

              ))}

            </div>

          </div>
        </section>

        {/* KARTU TESTIMONI */}
        <section className="py-14 sm:py-20">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center justify-between mb-8">

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Cerita Komunitas Mentora
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {filteredData.length} cerita ditampilkan
                </p>
              </div>

            </div>

            {filteredData.length > 0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredData.map((item) => (

                  <div
                    key={item.id}
                    className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >

                    <div className="space-y-5">

                      {/* RATING DAN PERAN */}
                      <div className="flex items-center justify-between gap-2">

                        <div className="flex items-center gap-1">

                          {[1, 2, 3, 4, 5].map((star) => (

                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-100 text-slate-300'
                              }`}
                            />

                          ))}

                          <span className="text-xs font-bold text-slate-700 ml-1">
                            {item.rating}.0
                          </span>

                        </div>

                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                            item.peran === 'Mentor'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-blue-50 text-[#2563EB] border border-blue-100'
                          }`}
                        >
                          {item.peran === 'Mentor'
                            ? '⭐ Mentor Resmi'
                            : '🎓 Mentee'}
                        </span>

                      </div>

                      {/* ULASAN */}
                      <div className="relative">

                        <Quote className="w-8 h-8 text-blue-100 mb-2" />

                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{item.ulasan}"
                        </p>

                      </div>

                      {/* DAMPAK */}
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">

                        <p className="text-[11px] font-bold text-[#2563EB] mb-1">
                          🎯 Dampak
                        </p>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {item.hasil}
                        </p>

                      </div>

                    </div>

                    {/* PROFIL */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">

                      <div
                        className={`w-11 h-11 rounded-2xl ${item.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}
                      >
                        {item.nama.charAt(0)}
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-slate-900 truncate">
                          {item.nama}
                        </p>

                        <p className="text-[11px] text-slate-400 truncate">
                          {item.prodi} • {item.kampus}
                        </p>

                        <p className="text-[11px] font-medium text-[#2563EB] truncate mt-1">
                          Fokus: {item.keahlian}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">

                <MessageSquareText className="w-10 h-10 text-slate-300 mx-auto mb-4" />

                <p className="font-bold text-slate-800">
                  Belum ada cerita untuk kategori ini.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Coba pilih kategori lainnya.
                </p>

              </div>

            )}

          </div>
        </section>

        {/* AJAKAN MENULIS ULASAN */}
        <section className="py-16 bg-white border-t border-slate-200">

          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">

              <MessageSquareText className="w-7 h-7" />

            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Punya Pengalaman Menarik Selama Belajar di Mentora?
            </h2>

            <p className="text-sm text-slate-500">
              Bagikan pengalamanmu dan bantu mahasiswa lainnya menemukan
              pengalaman belajar yang lebih baik.
            </p>

            <Link
              href="/testimoni/tulis"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm"
            >
              Tulis Ulasan Sesi Mentoring

              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
}
