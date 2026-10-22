'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Users,
  MessageSquare,
  Award,
  ArrowRight,
  Play,
  Check,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TEMUKAN BELAJAR, TUMBUH BERSAMA</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Belajar bareng <br />
                mahasiswa lain, <br />
                <span className="text-[#2563EB]">berkembang lewat skill.</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Mentora adalah platform untuk mahasiswa belajar dari teman sejawat, bertukar skill, dan berkembang lewat sesi belajar yang fleksibel.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/auth?tab=daftar"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#cara-kerja"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm shadow-sm transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  <span>Lihat Cara Kerja</span>
                </a>
              </div>
            </div>

            {/* Right Graphics / Visual Cards */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative w-full max-w-md space-y-4">
                
                {/* Handwritten Tag */}
                <div className="flex justify-end pr-6">
                  <div className="font-handwriting text-3xl font-bold text-slate-800 -rotate-3 tracking-wide">
                    More <br />
                    Skills <br />
                    Brighter <br />
                    Friends
                  </div>
                </div>

                {/* Blue Pill Sticky Note */}
                <div className="bg-[#2563EB] text-white p-5 rounded-3xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                  <p className="text-sm font-bold leading-snug">
                    Skill baru ini <br />
                    bisa jadi peluang <br />
                    besar nanti! ✨
                  </p>
                </div>

                {/* Yellow Sticky Note Checklist */}
                <div className="bg-[#FEF08A] text-slate-900 p-6 rounded-2xl shadow-md border border-amber-200/80 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="space-y-2.5 text-sm font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Skill baru</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Teman baru</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Peluang baru</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>Versi terbaik dirimu</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Feature Cards Section */}
      <section id="fitur" className="py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
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
                  Temukan partner belajar sesuai minat, skill, dan tujuanmu dengan rekomendasi Mentora.
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

            {/* Feature 2 */}
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
                  Diskusi lewat chat, atur jadwal fleksibel, lalu mulai sesi secara online atau offline.
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

            {/* Feature 3 */}
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
                  Kumpulkan poin dari sesi yang kamu bantu. Tukar menjadi e-certificate resmi untuk portofolio.
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

      {/* Cara Kerja Mentora Section */}
      <section id="cara-kerja" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              LANGKAH MUDAH
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Cara Kerja Mentora
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              Mulai perjalanan belajarmu dalam 3 langkah sederhana. Temukan teman belajar, kembangkan skill, dan wujudkan versi terbaikmu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 relative">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-sm mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Buat Profil</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Ceritakan minat, skill, dan tujuan belajar pada proses onboarding yang interaktif.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 relative">
              <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-sm mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cari Partner</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Temukan mahasiswa dengan skill yang sesuai, baik daring maupun luring di sekitar kampusmu.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 relative">
              <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Mulai Sesi</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Diskusi, belajar, dan berkembang bersama, lalu kumpulkan EduPoints untuk ditukar sertifikat.
              </p>
            </div>

          </div>

          {/* Banner CTA */}
          <div className="mt-14 bg-gradient-to-r from-blue-600 via-[#2563EB] to-indigo-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold">
                Siap upgrade skill dan teman belajarmu?
              </h3>
              <p className="text-blue-100 text-sm mt-2 max-w-xl">
                Bergabunglah dengan ratusan mahasiswa lainnya yang telah berkolaborasi di Mentora.
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

      <Footer />
    </div>
  );
}