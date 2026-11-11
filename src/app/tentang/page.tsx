'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Target, 
  Sparkles, 
  Award, 
  BookOpen, 
  ArrowRight, 
  HeartHandshake, 
  ShieldCheck, 
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function TentangPage() {
  const nilaiUtama = [
    {
      icon: Users,
      title: 'Peer-to-Peer Learning',
      desc: 'Belajar terasa lebih cair, relevan, dan minim intimidasi saat berdiskusi langsung dengan sesama mahasiswa yang baru saja melalui tantangan serupa.',
    },
    {
      icon: HeartHandshake,
      title: 'Prinsip Resiprokal (Skill Exchange)',
      desc: 'Setiap mahasiswa punya keunggulan unik. Mengajar skill yang kamu kuasai sekaligus belajar skill baru melalui ekosistem pertukaran nilai.',
    },
    {
      icon: ShieldCheck,
      title: 'Kualifikasi Terverifikasi',
      desc: 'Calon mentor melewati proses kurasi dokumen akademik dan portofolio secara ketat oleh tim verifikator sebelum dapat membuka sesi mentoring.',
    },
    {
      icon: TrendingUp,
      title: 'Portofolio Nyata',
      desc: 'Bukan sekadar teori hafalan, sesi mentoring difokuskan pada pemecahan studi kasus, tugas besar perkuliahan, dan persiapan proyek kompetisi.',
    },
  ];

  const statistik = [
    { angka: '100%', label: 'Koneksi Mahasiswa Antar Kampus' },
    { angka: '1-on-1', label: 'Mentoring Interaktif & Terarah' },
    { angka: '24/7', label: 'Akses Komunitas Belajar' },
    { angka: '0 Rp', label: 'Model Pertukaran Nilai Fair' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Tentang Inisiatif Mentora</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Menghubungkan Potensi, <br className="hidden sm:block" />
              <span className="text-[#2563EB] dark:text-blue-400">Berkembang Bersama</span> Lewat Kolaborasi.
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Mentora adalah platform *peer-to-peer skill exchange* yang dirancang khusus bagi mahasiswa untuk saling berbagi keahlian teknis, mendiskusikan tugas proyek, dan mempersiapkan jenjang karier profesional secara kolaboratif.
            </p>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="py-14 sm:py-20 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Visi Kami
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Menciptakan ekosistem pembelajaran sebaya digital nomor satu di lingkungan perguruan tinggi, di mana setiap mahasiswa memiliki akses setara untuk meningkatkan keahlian tanpa batasan biaya formalitas bimbingan belajar konvensional.
                  </p>
                </div>
                <div className="pt-2 text-xs font-semibold text-slate-400">
                  Kolaboratif • Aksesibel • Berkelanjutan
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Misi Kami
                  </h2>
                  <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#2563EB] dark:text-blue-400 font-bold">•</span>
                      <span>Menyediakan wadah terpercaya untuk pencocokan mentor dan mentee berbasis keahlian spesifik.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2563EB] dark:text-blue-400 font-bold">•</span>
                      <span>Menjamin kualitas sesi bimbingan melalui kurasi dan verifikasi dokumen portofolio secara transparan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2563EB] dark:text-blue-400 font-bold">•</span>
                      <span>Mendorong mahasiswa mengasah keterampilan *soft skill* komunikasi dan kepemimpinan melalui pengajaran.</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 text-xs font-semibold text-slate-400">
                  Transparansi • Pembelajaran Praktis
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nilai Utama / Value Proposition */}
        <section className="py-14 sm:py-20 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Mengapa Memilih Mentora?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Pilar keunggulan sistem yang kami bangun untuk mendukung akselerasi belajar mahasiswa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nilaiUtama.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistik Bar */}
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {statistik.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] dark:text-blue-400">
                    {stat.angka}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Siap Bertukar Keterampilan Hari Ini?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bergabunglah bersama ribuan rekan mahasiswa lainnya dan perluas portofolio belajarmu sekarang.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/auth?tab=daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                <span>Daftar Akun Mentora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
              >
                <span>Jelajahi Dashboard</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}