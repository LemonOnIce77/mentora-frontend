'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationPicker from '@/components/LocationPicker';
import {
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeftRight,
  Check,
  Compass,
  BookOpen,
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

      {/* 1. Hero Section: Honest Value Prop & Real Product UI Card */}
      <section className="pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Platform Pertukaran Keahlian Mahasiswa</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Tukar keahlian, <br />
                belajar bareng teman, <br />
                <span className="text-blue-600">tanpa biaya tutor.</span>
              </h1>

              {/* Plain Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Platform peer-to-peer exchange mahasiswa Telkom University. Kuasai materi kuliah sulit dan tools industri dengan mengajarkan apa yang kamu kuasai ke rekan sejawat.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/auth?tab=daftar"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow transition"
                >
                  <span>Mulai Barter Keahlian</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/skills"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm transition"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>Jelajahi Katalog Keahlian</span>
                </Link>
              </div>

              {/* Campus Trust Indicator */}
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                    alt="Mahasiswa"
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                    alt="Mahasiswa"
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
                  />
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                    TEL-U
                  </div>
                </div>
                <span>Mahasiswa Informatika, DKV, Rekayasa Industri, dan Bisnis telah terhubung.</span>
              </div>

            </div>

            {/* Right Column: Real Product UI: Live Peer Barter Session Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
                
                {/* Card Header: Campus Session Status */}
                <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Sesi Barter Aktif
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Telkom University
                  </span>
                </div>

                {/* The Match Visual: Two Students Exchanging */}
                <div className="p-6 space-y-4">
                  
                  {/* Student 1 */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                        alt="Aulia"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900">Aulia Rahisa</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">DKV '24</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bimbingan: <strong className="text-slate-800">Figma UI/UX & Prototyping</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-600">★ 4.9</span>
                      <p className="text-[10px] text-slate-400">30 sesi tuntas</p>
                    </div>
                  </div>

                  {/* The Exchange Bridge Indicator */}
                  <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-slate-300"></div>
                    </div>
                    <div className="relative px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Saling Tukar 1 Jam Belajar</span>
                    </div>
                  </div>

                  {/* Student 2 */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Sulthoni"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900">Sulthoni Prima</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Informatika '23</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bimbingan: <strong className="text-slate-800">Database SQL & REST API</strong>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-600">★ 5.0</span>
                      <p className="text-[10px] text-slate-400">45 sesi tuntas</p>
                    </div>
                  </div>

                  {/* Session Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Titik Sesi Tatap Muka:</span>
                      <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Open Library Tel-U Lt. 2
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Poin Keaktifan:</span>
                      <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        +5 EduPoints Resmi
                      </span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-2">
                    <Link
                      href="/auth?tab=daftar"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <span>Ajukan Barter dengan Rekan Mahasiswa</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Campus Proximity & Study Spot Radar */}
      <section className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              RADAR TEMAN BELAJAR KAMPUS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Temukan partner belajar di sekitar kampusmu
            </h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Pilih titik belajar favorit di area kampus Telkom University atau gunakan GPS untuk mencocokkan teman terdekat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive GPS Detector */}
            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Deteksi Lokasi Terdekat (GPS)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aktifkan izin lokasi browser untuk menampilkan rekan mahasiswa yang sedang berada di radius yang sama.
              </p>
              
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
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>Lokasi: <strong className="text-slate-900">{userLocation.kota}</strong></span>
                  <Link
                    href={`/dashboard?lat=${userLocation.latitude}&lng=${userLocation.longitude}`}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Buka Hasil &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Right: Real Campus Spot Hubs */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Open Library Tel-U</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">14 Mahasiswa Aktif</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gedung Perpustakaan Pusat Lt. 2 & 3. Cocok untuk bimbingan coding dan tugas akhir dengan suasana hening.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Bandung Techno Park</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">8 Mahasiswa Aktif</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  BTP Co-Working Space. Tempat berkumpul tim proyek startup, desain antarmuka, dan kompetisi hackathon.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Open Space Gedung GKB</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">19 Mahasiswa Aktif</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Area diskusi terbuka Gedung Kuliah Bersama. Ideal untuk review resume, latihan public speaking, dan tugas kelompok.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Lab Komputer FIF</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">11 Mahasiswa Aktif</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fakultas Informatika. Titik temu untuk debugging kode praktikum, machine learning, dan struktur data.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Distinct Core Pillars (Not Identical Cards) */}
      <section className="py-20 bg-[#FAFAFB] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              PRINSIP SISTEM MENTORA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Belajar berkualitas berbasis timbal-balik yang adil
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-5">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Satu Jam Mengajar = Satu Jam Belajar
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sistem barter seimbang tanpa biaya uang kuliah tambahan. Mahasiswa yang membimbing di bidangnya berhak menerima bimbingan dari rekan yang ahli di topik lain.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 font-semibold">
                ✓ Menghilangkan hambatan biaya kursus
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-5">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Kredensial Mentor Terverifikasi
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Calon mentor wajib mengunggah transkrip nilai akademik atau portofolio riil. Dokumen ditinjau oleh tim verifikator sebelum status mentor diaktifkan.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 font-semibold">
                ✓ Transkrip dan portofolio diverifikasi
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-5">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  EduPoints & Bukti Kompetensi
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Setiap sesi yang tuntas memberi poin reputasi. Mahasiswa aktif dapat menukarkannya menjadi e-certificate resmi untuk lampiran portofolio magang dan SKPI.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500 font-semibold">
                ✓ Diakui dalam portofolio keaktifan
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Practical 3-Step Workflow */}
      <section id="cara-kerja" className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ALUR SESI BELAJAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Cara memulai barter keahlian di Mentora
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-blue-600 font-mono">1.</span>
              <h3 className="text-base font-bold text-slate-900">
                Tentukan Keahlian & Kebutuhan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pilih topik yang kamu kuasai untuk diajarkan, lalu tentukan materi kuliah atau software yang ingin kamu pelajari.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-blue-600 font-mono">2.</span>
              <h3 className="text-base font-bold text-slate-900">
                Sepakati Waktu & Titik Temu
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cari rekan dengan minat barter silang. Tentukan waktu luang dan sepakati pertemuan di area kampus atau lewat panggilan daring.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-blue-600 font-mono">3.</span>
              <h3 className="text-base font-bold text-slate-900">
                Selesaikan Sesi & Kumpulkan Poin
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Jalankan sesi belajar bersama. Setelah selesai, berikan konfirmasi dan penilaian timbal-balik untuk mengklaim EduPoints.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Clean, Confident Closing CTA (No radioactive gradients) */}
      <section className="py-16 bg-[#FAFAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Punya keahlian yang bisa dibagikan minggu ini?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bantu teman sejawat memahami materi sulit, perluas koneksi lintas fakultas di Telkom University, dan bangun portofolio kompetensimu.
              </p>
            </div>
            <div>
              <Link
                href="/auth?tab=daftar"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-sm transition whitespace-nowrap"
              >
                <span>Daftar Akun Mahasiswa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
