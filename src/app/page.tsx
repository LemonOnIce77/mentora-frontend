
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationPicker from '@/components/LocationPicker';

import {
  Users,
  MessageSquare,
  Award,
  ArrowRight,
  Play,
  Check,
  Sparkles,
  Compass,
} from 'lucide-react';

export default function LandingPage() {
  const [userLocation, setUserLocation] = useState<{
    kota?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      {/* ======================================
          HERO SECTION
      ====================================== */}
      <section className="relative isolate overflow-hidden bg-[#FAFAFB] min-h-[700px] lg:min-h-[720px] flex items-center">

        {/* BACKGROUND FOTO */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[75%] z-0 pointer-events-none">

          <Image
            src="/images/mentora-hero.jpg"
            alt="Mahasiswa belajar bersama"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover object-center"
          />

          {/* Transparansi foto */}
          <div className="absolute inset-0 bg-white/25" />

          {/* Gradasi sisi kiri agar menyatu dengan teks */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  to right,
                  #FAFAFB 0%,
                  rgba(250,250,251,0.98) 22%,
                  rgba(250,250,251,0.82) 38%,
                  rgba(250,250,251,0.35) 60%,
                  rgba(250,250,251,0.05) 100%
                )
              `,
            }}
          />

          {/* Gradasi bagian bawah */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#FAFAFB]" />

        </div>

        {/* KONTEN HERO */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

            {/* BAGIAN KIRI */}
            <div className="max-w-[680px]">

              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-50/95 border border-blue-100 text-[#2563EB] text-xs font-bold tracking-wider uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                <span>TEMUKAN BELAJAR, TUMBUH BERSAMA</span>
              </div>

              {/* Judul */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Belajar bareng
                <br />
                mahasiswa lain,
                <br />
                <span className="text-[#2563EB]">
                  berkembang lewat skill.
                </span>
              </h1>

              {/* Deskripsi */}
              <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed mt-6">
                Mentora adalah platform untuk mahasiswa belajar dari teman sejawat,
                bertukar skill, dan berkembang lewat sesi belajar yang fleksibel.
              </p>

              {/* Tombol */}
              <div className="flex flex-wrap items-center gap-4 mt-8">

                <Link
                  href="/auth?tab=daftar"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#cara-kerja"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/90 backdrop-blur-sm border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm shadow-sm transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Lihat Cara Kerja</span>
                </a>

              </div>

              {/* LOCATION PICKER */}
              <div className="pt-8 max-w-lg">
                <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">

                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-slate-800">
                      Cari Teman Belajar di Sekitarmu
                    </span>
                  </div>

                  <LocationPicker
                    onLocationDetected={(data) => {
                      setUserLocation({
                        kota: data.kota,
                        latitude: data.latitude,
                        longitude: data.longitude,
                      });
                    }}
                  />

                  {userLocation && (
                    <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Siap mencocokkan mentor di sekitar:
                        {' '}
                        <strong className="text-slate-800">
                          {userLocation.kota}
                        </strong>
                      </span>

                      <Link
                        href={`/dashboard?lat=${userLocation.latitude}&lng=${userLocation.longitude}`}
                        className="font-bold text-[#2563EB] hover:underline"
                      >
                        Lihat Partner →
                      </Link>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* BAGIAN KANAN - TETAP DI DEPAN FOTO */}
            <div className="relative z-20 flex flex-col items-end justify-center gap-4 lg:pr-2">

              {/* MORE SKILLS BRIGHTER FRIENDS */}
              <div className="font-handwriting text-slate-900 text-3xl md:text-4xl font-bold leading-tight text-right mb-1 drop-shadow-sm">
                More Skills
                <br />
                Brighter
                <br />
                Friends ✨
              </div>

              {/* KARTU BIRU */}
              <div className="w-full max-w-[390px] rounded-[26px] bg-[#2563EB]/95 px-7 py-6 text-white shadow-xl -rotate-1">

                <p className="text-base md:text-lg font-bold leading-snug">
                  Skill baru ini
                  <br />
                  bisa jadi peluang
                  <br />
                  besar nanti! ✨
                </p>

              </div>

              {/* KARTU KUNING */}
              <div className="w-full max-w-[400px] rounded-[24px] bg-yellow-200/95 px-7 py-6 shadow-lg rotate-1">

                <ul className="space-y-3 text-sm md:text-base font-semibold text-slate-900">

                  {[
                    'Skill baru',
                    'Teman baru',
                    'Peluang baru',
                    'Versi terbaik dirimu',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>

                      {item}

                    </li>
                  ))}

                </ul>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ======================================
          FEATURE CARDS SECTION
      ====================================== */}
      <section
        id="fitur"
        className="pt-8 pb-16 scroll-mt-28 bg-[#FAFAFB]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* FEATURE 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">

              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Pencocokan Skill <br />
                  yang Tepat
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  Temukan partner belajar sesuai minat, skill, dan tujuanmu
                  dengan rekomendasi Mentora.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/auth?tab=daftar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] group-hover:gap-2.5 transition-all"
                >
                  <span>Cari partner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>


            {/* FEATURE 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">

              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Chat & Booking <br />
                  Sesi dengan Mudah
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  Diskusi lewat chat, atur jadwal fleksibel, lalu mulai sesi
                  secara online atau offline.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/auth?tab=daftar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:gap-2.5 transition-all"
                >
                  <span>Atur sesi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>


            {/* FEATURE 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">

              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  EduPoints <br />
                  dan E-Certificate
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  Kumpulkan poin dari sesi yang kamu bantu. Tukar menjadi
                  e-certificate resmi untuk portofolio.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/auth?tab=daftar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:gap-2.5 transition-all"
                >
                  <span>Lihat EduPoints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ======================================
          CARA KERJA MENTORA
      ====================================== */}
      <section
        id="cara-kerja"
        className="py-16 lg:py-24 scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12">

            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              LANGKAH MUDAH
            </span>

            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Cara Kerja Mentora
            </h2>

            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              Mulai perjalanan belajarmu dalam 3 langkah sederhana.
              Temukan teman belajar, kembangkan skill, dan wujudkan versi
              terbaikmu.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* STEP 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 relative">

              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-sm mb-6">
                1
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Buat Profil
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Ceritakan minat, skill, dan tujuan belajar pada proses
                onboarding yang interaktif.
              </p>

            </div>


            {/* STEP 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 relative">

              <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-sm mb-6">
                2
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Cari Partner
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Temukan mahasiswa dengan skill yang sesuai, baik daring
                maupun luring di sekitar kampusmu.
              </p>

            </div>


            {/* STEP 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 relative">

              <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm mb-6">
                3
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Mulai Sesi
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Diskusi, belajar, dan berkembang bersama, lalu kumpulkan
                EduPoints untuk ditukar sertifikat.
              </p>

            </div>

          </div>


          {/* CTA BANNER */}
          <div className="mt-14 bg-gradient-to-r from-blue-600 via-[#2563EB] to-indigo-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">

            <div>

              <h3 className="text-2xl md:text-3xl font-extrabold">
                Siap upgrade skill dan teman belajarmu?
              </h3>

              <p className="text-blue-100 text-sm mt-2 max-w-xl">
                Bergabunglah dengan ratusan mahasiswa lainnya yang telah
                berkolaborasi di Mentora.
              </p>

            </div>

            <Link
              href="/auth?tab=daftar"
              className="px-8 py-4 rounded-full bg-white text-[#2563EB] font-bold text-sm shadow-md hover:bg-blue-50 transition whitespace-nowrap"
            >
              Daftar Gratis Sekarang
            </Link>

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <Footer />

    </div>
  );
}
