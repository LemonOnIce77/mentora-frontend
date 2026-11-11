import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Users,
  Target,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const nilaiUtama = [
  {
    icon: Users,
    title: "Peer-to-Peer Learning",
    desc: "Belajar terasa lebih cair, relevan, dan minim intimidasi saat berdiskusi langsung dengan sesama mahasiswa yang baru saja melalui tantangan serupa.",
  },
  {
    icon: HeartHandshake,
    title: "Prinsip Resiprokal (Skill Exchange)",
    desc: "Setiap mahasiswa punya keunggulan unik. Mengajar skill yang kamu kuasai sekaligus belajar skill baru melalui ekosistem pertukaran nilai.",
  },
  {
    icon: ShieldCheck,
    title: "Kualifikasi Terverifikasi",
    desc: "Calon mentor melewati proses kurasi dokumen akademik dan portofolio oleh tim verifikator sebelum dapat membuka sesi mentoring.",
  },
  {
    icon: TrendingUp,
    title: "Portofolio Nyata",
    desc: "Bukan sekadar teori hafalan, sesi mentoring difokuskan pada pemecahan studi kasus, tugas besar perkuliahan, dan persiapan proyek kompetisi.",
  },
];

const statistik = [
  {
    angka: "100%",
    label: "Koneksi Mahasiswa Antar Kampus",
  },
  {
    angka: "1-on-1",
    label: "Mentoring Interaktif & Terarah",
  },
  {
    angka: "24/7",
    label: "Akses Komunitas Belajar",
  },
  {
    angka: "0 Rp",
    label: "Model Pertukaran Nilai Fair",
  },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}

        <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-[#FAFAFB]">
          {/* Background Foto Kelompok */}
          <div className="absolute inset-0">
            <Image
              src="/images/about-team.jpg"
              alt="Tim pengembang Mentora"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Overlay putih transparan */}
            <div className="absolute inset-0 bg-white/40" />

            {/* Gradasi agar foto menyatu dengan background */}
            <div
              className="absolute inset-0 bg-gradient-to-b
      from-[#FAFAFB]/80 via-transparent to-[#FAFAFB]"
            />
          </div>

          {/* Konten */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
            <span
              className="inline-flex rounded-full border border-blue-100
      bg-white/80 px-5 py-2 text-sm font-bold text-blue-600 mb-7"
            >
              ✨ TENTANG INISIATIF MENTORA
            </span>

            <h1
              className="text-4xl md:text-6xl font-extrabold
      leading-tight tracking-tight text-slate-900"
            >
              Menghubungkan Potensi,
              <span className="block text-blue-600">
                Berkembang Bersama Lewat Kolaborasi.
              </span>
            </h1>

            <p
              className="mt-7 max-w-3xl mx-auto text-lg
      leading-relaxed text-slate-700"
            >
              Mentora adalah platform peer-to-peer skill exchange yang dirancang
              khusus bagi mahasiswa untuk saling berbagi keahlian, mendiskusikan
              tugas proyek, dan mempersiapkan jenjang karier secara kolaboratif.
            </p>
          </div>
        </section>

        {/* VISI DAN MISI */}
        <section className="py-16 sm:py-20 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* VISI */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    Visi Kami
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    Menciptakan ekosistem pembelajaran sebaya digital nomor satu
                    di lingkungan perguruan tinggi, di mana setiap mahasiswa
                    memiliki akses setara untuk meningkatkan keahlian tanpa
                    batasan biaya formalitas bimbingan belajar konvensional.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                  Kolaboratif • Aksesibel • Berkelanjutan
                </div>
              </div>

              {/* MISI */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    Misi Kami
                  </h2>

                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>
                        Menyediakan wadah terpercaya untuk pencocokan mentor dan
                        mentee berbasis keahlian spesifik.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>
                        Menjamin kualitas sesi bimbingan melalui kurasi dan
                        verifikasi dokumen portofolio secara transparan.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>
                        Mendorong mahasiswa mengasah keterampilan{" "}
                        <em>soft skill</em> komunikasi dan kepemimpinan melalui
                        pengajaran.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                  Transparansi • Pembelajaran Praktis
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NILAI UTAMA */}
        <section className="py-16 sm:py-20 bg-blue-50/30 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Mengapa Memilih Mentora?
              </h2>

              <p className="text-sm text-slate-500">
                Pilar keunggulan sistem yang kami bangun untuk mendukung
                perkembangan belajar mahasiswa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nilaiUtama.map((item, index) => {
                const IconComponent = item.icon;

                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATISTIK */}
        <section className="py-14 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {statistik.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">
                    {stat.angka}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Siap Bertukar Keterampilan Hari Ini?
            </h2>

            <p className="text-sm text-slate-600">
              Bergabunglah bersama mahasiswa lainnya dan perluas pengalaman
              belajarmu bersama Mentora.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/auth?tab=daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm"
              >
                Daftar Akun Mentora
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-bold transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
